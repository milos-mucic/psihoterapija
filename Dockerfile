FROM node:22-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM deps AS build
WORKDIR /app
COPY . .
ARG PUBLIC_SITE_URL=https://psihoterapija-ikar.rs
ARG ASTRO_DB_REMOTE_URL
ENV PUBLIC_SITE_URL=${PUBLIC_SITE_URL}
ENV ASTRO_DB_REMOTE_URL=${ASTRO_DB_REMOTE_URL}
RUN --mount=type=secret,id=ASTRO_DB_APP_TOKEN \
    export ASTRO_DB_APP_TOKEN="$(cat /run/secrets/ASTRO_DB_APP_TOKEN)" && npm run build:remote

FROM node:22-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/server/entry.mjs"]
