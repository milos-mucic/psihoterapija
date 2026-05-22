FROM node:22-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM deps AS build
WORKDIR /app
COPY . .
ARG PUBLIC_SITE_URL=https://dev.psihoterapija-ikar.rs
ENV PUBLIC_SITE_URL=${PUBLIC_SITE_URL}
RUN npm run build

FROM node:22-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/dist ./dist
COPY --from=build /app/data/astro.db ./bootstrap/astro.db
EXPOSE 3000
CMD ["node", "dist/server/entry.mjs"]
