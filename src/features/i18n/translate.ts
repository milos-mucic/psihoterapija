import srLatn from "@/features/i18n/dictionaries/sr-latn.json";

export type Dictionary = typeof srLatn;

export const getDictionary = (): Dictionary => srLatn;
