import type { SiteLocale } from "@/lib/config/site";

export type SubmissionType = "contact" | "appointment";
export type SubmissionStatus = "new" | "reviewed" | "archived";

export type SubmissionInput = {
  type: SubmissionType;
  locale: SiteLocale;
  name: string;
  email: string;
  phone?: string;
  format?: string;
  message?: string;
};

export type SubmissionRecord = SubmissionInput & {
  id: string;
  status: SubmissionStatus;
  createdAt: string;
};
