import { FileSubmissionRepository } from "@/features/forms/repositories/file-submission.repository";
import { submissionSchema } from "@/features/forms/schemas/submission.schema";

const submissionRepository = new FileSubmissionRepository();

export const submissionService = {
  listSubmissions() {
    return submissionRepository.list();
  },
  getSubmission(id: string) {
    return submissionRepository.getById(id);
  },
  async createSubmission(input: unknown) {
    const parsed = submissionSchema.parse(input);
    return submissionRepository.create({
      ...parsed,
      phone: parsed.phone || undefined,
      format: parsed.format || undefined,
      message: parsed.message || undefined,
    });
  },
};
