import type { SubmissionInput, SubmissionRecord } from "@/features/forms/types/submission.types";

export interface SubmissionRepository {
  list(): Promise<SubmissionRecord[]>;
  getById(id: string): Promise<SubmissionRecord | undefined>;
  create(input: SubmissionInput): Promise<SubmissionRecord>;
}
