import { z } from "zod";

export const submissionSchema = z.object({
  type: z.enum(["contact", "appointment"]),
  locale: z.enum(["sr-latn", "sr-cyrl"]),
  name: z.string().trim().min(2).max(120),
  email: z.email(),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  message: z.string().trim().min(10).max(4000),
});

export type SubmissionSchemaInput = z.infer<typeof submissionSchema>;
