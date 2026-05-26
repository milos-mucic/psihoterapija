// Fields whose values are consumed in HTML attributes, structured tags, or technical contexts
// where rich-text markup would break rendering. These stay as plain text inputs in the admin UI.
//
// Returns true if the field name matches one of the technical patterns.
export const isTechnicalFieldName = (name: string): boolean => {
  const lower = name.toLowerCase();
  // Exact match: short well-known names
  if (["phone", "email", "url", "href", "slug", "platform"].includes(lower)) {
    return true;
  }
  // Anywhere: SEO/meta tags
  if (/(seo|meta)(title|description|keyword)/i.test(name)) {
    return true;
  }
  // Suffix patterns: things that go in HTML attributes or constrained UI elements
  if (/(url|href|slug|alt|arialabel|aria|platform|placeholder|ctalabel)$/i.test(name)) {
    return true;
  }
  // "Label" suffix unless it's part of a label like "labelText" (currently nothing like that)
  if (/label$/i.test(name)) {
    return true;
  }
  return false;
};

// Strip HTML tags to produce plain-text suitable for HTML attributes, <title>, <meta>, etc.
export const stripHtmlTags = (input: string): string => {
  if (!input) return "";
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
};
