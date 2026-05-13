export type BlockBackgroundKey =
  | "default"
  | "white"
  | "cream"
  | "sand"
  | "mint"
  | "primary";

export type BlockBackgroundOption = {
  key: BlockBackgroundKey;
  label: string;
  swatch: string;
  cssValue: string;
  textColor?: string;
};

export const blockBackgroundPalette: readonly BlockBackgroundOption[] = [
  { key: "default", label: "Bez pozadine", swatch: "transparent", cssValue: "" },
  { key: "white", label: "Bela", swatch: "#ffffff", cssValue: "#ffffff" },
  { key: "cream", label: "Krem", swatch: "#f7f4ec", cssValue: "var(--bg)" },
  { key: "sand", label: "Pesak", swatch: "#f1ece2", cssValue: "var(--bg-soft)" },
  { key: "mint", label: "Menta", swatch: "#e2eddf", cssValue: "var(--primary-light)" },
  {
    key: "primary",
    label: "Primarna",
    swatch: "#163c3d",
    cssValue: "var(--primary)",
    textColor: "var(--primary-light)",
  },
];

const VALID_KEYS = new Set<BlockBackgroundKey>(
  blockBackgroundPalette.map((entry) => entry.key),
);

export const isBlockBackgroundKey = (value: unknown): value is BlockBackgroundKey =>
  typeof value === "string" && VALID_KEYS.has(value as BlockBackgroundKey);

export const normalizeBlockBackgroundKey = (value: unknown): BlockBackgroundKey =>
  isBlockBackgroundKey(value) ? value : "default";

export const getBlockBackgroundOption = (
  key: BlockBackgroundKey | string | undefined,
): BlockBackgroundOption | undefined =>
  blockBackgroundPalette.find((entry) => entry.key === key);

export const getBlockBackgroundStyle = (
  blockBackgrounds: Record<string, string> | undefined,
  fragment: string,
): string | undefined => {
  const option = getBlockBackgroundOption(blockBackgrounds?.[fragment]);

  if (!option || option.key === "default" || !option.cssValue) {
    return undefined;
  }

  if (option.textColor) {
    return `background-color: ${option.cssValue}; color: ${option.textColor};`;
  }

  return `background-color: ${option.cssValue};`;
};
