import { FileSubmissionRepository } from "@/features/forms/repositories/file-submission.repository";
import { SqliteSubmissionRepository } from "@/features/forms/repositories/sqlite-submission.repository";
import type { SubmissionRepository } from "@/features/forms/repositories/submission.repository";
import { submissionSchema } from "@/features/forms/schemas/submission.schema";

const createSubmissionRepository = (): SubmissionRepository => {
  if (process.env.USE_FILE_SUBMISSIONS === "true") {
    return new FileSubmissionRepository();
  }

  try {
    return new SqliteSubmissionRepository();
  } catch (error) {
    console.warn("[submissions] SQLite init failed, falling back to file repository.", error);
    return new FileSubmissionRepository();
  }
};

const submissionRepository = createSubmissionRepository();

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
