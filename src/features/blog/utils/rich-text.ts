import sanitizeHtml from "sanitize-html";

const allowedTags = [
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "ul",
  "ol",
  "li",
  "blockquote",
  "h2",
  "h3",
  "h4",
  "a",
  "img",
];

const allowedAttributes: sanitizeHtml.IOptions["allowedAttributes"] = {
  a: ["href", "target", "rel"],
  img: ["src", "alt", "title", "width", "height", "loading"],
};

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const stripMarkupPrefix = (line: string) => line.replace(/^#+\s+/, "").trim();

const toParagraph = (block: string) => {
  const lines = block
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => escapeHtml(stripMarkupPrefix(line)));

  return `<p>${lines.join("<br />")}</p>`;
};

const toList = (block: string) => {
  const lines = block
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^-+\s*/, "").trim())
    .map((line) => `<li>${escapeHtml(stripMarkupPrefix(line))}</li>`)
    .join("");

  return `<ul>${lines}</ul>`;
};

const toHeading = (block: string) => {
  const headingMatch = block.match(/^(#{1,3})\s+(.*)$/);

  if (!headingMatch) {
    return undefined;
  }

  const [, levelToken, rawText] = headingMatch;
  const safeText = escapeHtml(rawText.trim());
  const level = levelToken.length === 1 ? "h2" : levelToken.length === 2 ? "h3" : "h4";

  return `<${level}>${safeText}</${level}>`;
};

const convertPlainTextToHtml = (input: string) => {
  const blocks = input
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  if (blocks.length === 0) {
    return "";
  }

  return blocks
    .map((block) => {
      const heading = toHeading(block);

      if (heading) {
        return heading;
      }

      const lines = block
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      const isList = lines.length > 0 && lines.every((line) => line.startsWith("- "));
      return isList ? toList(block) : toParagraph(block);
    })
    .join("\n");
};

const hasHtmlTag = (input: string) => /<\s*[a-z][^>]*>/i.test(input);

export const sanitizeRichTextHtml = (input: string) => {
  const prepared = hasHtmlTag(input) ? input : convertPlainTextToHtml(input);

  return sanitizeHtml(prepared, {
    allowedTags,
    allowedAttributes,
    allowedSchemes: ["http", "https", "data"],
    allowedSchemesByTag: {
      img: ["http", "https", "data"],
      a: ["http", "https", "mailto", "tel"],
    },
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", {
        target: "_blank",
        rel: "noopener noreferrer",
      }),
      img: sanitizeHtml.simpleTransform("img", {
        loading: "lazy",
      }),
    },
  }).trim();
};

export const extractPlainTextFromHtml = (input: string) =>
  sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {},
  })
    .replace(/\s+/g, " ")
    .trim();
