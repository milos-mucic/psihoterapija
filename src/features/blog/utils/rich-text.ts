import sanitizeHtml from "sanitize-html";

const richTextAllowedTags = [
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "strike",
  "del",
  "span",
  "ul",
  "ol",
  "li",
  "blockquote",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "a",
  "img",
];

const inlineRichTextAllowedTags = ["br", "strong", "b", "em", "i", "u", "s", "strike", "del", "span", "a"];

// Allow the `style` attribute on text/block elements so editor-applied inline styles
// (font-size, color, font-family, text-align…) survive sanitization. The style values
// themselves are still constrained via `allowedStyles` below.
const styledTags = [
  "span",
  "p",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "blockquote",
  "li",
  "ul",
  "ol",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "strike",
  "del",
];
const styleAttrFor = (tags: string[]): sanitizeHtml.IOptions["allowedAttributes"] =>
  Object.fromEntries(tags.map((tag) => [tag, ["style"]]));

const withoutFontSize = (
  styles: sanitizeHtml.IOptions["allowedStyles"],
): sanitizeHtml.IOptions["allowedStyles"] => {
  const { "font-size": _fontSize, ...rest } = styles?.["*"] ?? {};
  return { ...styles, "*": rest };
};

const allowedAttributes: sanitizeHtml.IOptions["allowedAttributes"] = {
  ...styleAttrFor(styledTags),
  a: ["href", "target", "rel", "style"],
  img: ["src", "alt", "title", "width", "height", "loading", "class", "style", "data-layout", "data-width-pct"],
};

// CSS values that survive sanitization. Each property maps to a list of regex patterns;
// if any matches, the value is kept. Conservative allowlist prevents XSS via CSS.
const richTextAllowedStyles: sanitizeHtml.IOptions["allowedStyles"] = {
  "*": {
    "font-size": [
      /^\d+(\.\d+)?(px|em|rem|%|pt)$/,
      /^(xx-small|x-small|small|medium|large|x-large|xx-large)$/,
    ],
    "font-family": [/^[\w\s,'"\-]+$/],
    "font-weight": [/^(\d{3}|normal|bold|bolder|lighter)$/],
    "font-style": [/^(normal|italic|oblique)$/],
    color: [/^#[0-9a-fA-F]{3,8}$/, /^rgba?\([\d\s,.%]+\)$/, /^hsla?\([\d\s,.%]+\)$/, /^[a-z]+$/],
    "background-color": [/^#[0-9a-fA-F]{3,8}$/, /^rgba?\([\d\s,.%]+\)$/, /^hsla?\([\d\s,.%]+\)$/, /^[a-z]+$/, /^transparent$/],
    "text-align": [/^(left|right|center|justify|start|end)$/],
    "text-decoration": [/^(none|underline|line-through|overline)(\s+(solid|dashed|wavy))?$/],
    "line-height": [/^\d+(\.\d+)?(px|em|rem|%)?$/, /^normal$/],
    "letter-spacing": [/^-?\d+(\.\d+)?(px|em|rem)$/, /^normal$/],
  },
  img: {
    width: [/^\d+(\.\d+)?%$/],
  },
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

const convertPlainTextToInlineHtml = (input: string) => {
  const blocks = input
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  if (blocks.length === 0) {
    return "";
  }

  return blocks
    .map((block) =>
      block
        .split("\n")
        .map((line) => escapeHtml(stripMarkupPrefix(line.trim())))
        .filter(Boolean)
        .join("<br />"),
    )
    .join("<br />");
};

const hasHtmlTag = (input: string) => /<\s*[a-z][^>]*>/i.test(input);

export const sanitizeRichTextHtml = (input: string) => {
  const prepared = hasHtmlTag(input) ? input : convertPlainTextToHtml(input);

  return sanitizeHtml(prepared, {
    allowedTags: richTextAllowedTags,
    allowedAttributes,
    allowedStyles: richTextAllowedStyles,
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

export const sanitizeInlineRichTextHtml = (
  input: string,
  options?: { allowFontSize?: boolean },
) => {
  const allowFontSize = options?.allowFontSize ?? true;
  const allowedStyles = allowFontSize
    ? richTextAllowedStyles
    : withoutFontSize(richTextAllowedStyles);
  const prepared = hasHtmlTag(input) ? input : convertPlainTextToInlineHtml(input);
  const normalized = prepared
    .replace(/<\s*\/(p|h[1-6]|blockquote)\s*>\s*<\s*(p|h[1-6]|blockquote)[^>]*\s*>/gi, "<br />")
    .replace(/<\s*p[^>]*>/gi, "")
    .replace(/<\/p>/gi, "")
    .replace(/<\s*h[1-6][^>]*>/gi, "")
    .replace(/<\/h[1-6]>/gi, "")
    .replace(/<\s*blockquote[^>]*>/gi, "")
    .replace(/<\/blockquote>/gi, "")
    .replace(/<\s*li[^>]*>/gi, "")
    .replace(/<\/li>/gi, "<br />")
    .replace(/<\s*(ul|ol)[^>]*>/gi, "")
    .replace(/<\/(ul|ol)>/gi, "");

  return sanitizeHtml(normalized, {
    allowedTags: inlineRichTextAllowedTags,
    allowedAttributes,
    allowedStyles,
    allowedSchemes: ["http", "https"],
    allowedSchemesByTag: {
      a: ["http", "https", "mailto", "tel"],
    },
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", {
        target: "_blank",
        rel: "noopener noreferrer",
      }),
    },
  })
    .replace(/^(<br\s*\/?>)+/gi, "")
    .replace(/(<br\s*\/?>)+$/gi, "")
    .trim();
};

export const extractPlainTextFromHtml = (input: string) =>
  sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {},
  })
    .replace(/\s+/g, " ")
    .trim();
