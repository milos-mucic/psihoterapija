import { z } from "zod";

const commonFields = {
  locale: z.enum(["sr-latn", "sr-cyrl"]),
  name: z.string().trim().min(2).max(120),
  email: z.email(),
};

export const submissionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("contact"),
    ...commonFields,
    phone: z.string().trim().max(40).optional().or(z.literal("")),
    format: z.string().trim().max(120).optional().or(z.literal("")),
    message: z.string().trim().min(10).max(4000),
  }),
  z.object({
    type: z.literal("appointment"),
    ...commonFields,
    phone: z.string().trim().min(6).max(40),
    format: z.string().trim().min(2).max(120),
    message: z.string().trim().max(4000).optional().or(z.literal("")),
  }),
]);

export type SubmissionSchemaInput = z.infer<typeof submissionSchema>;
