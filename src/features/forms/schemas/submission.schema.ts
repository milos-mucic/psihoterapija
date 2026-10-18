import { z } from "zod";

const commonFields = {
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
    // Phone and format are optional: a first-time visitor may not know which format fits yet.
    phone: z.string().trim().min(6).max(40).optional().or(z.literal("")),
    format: z.string().trim().max(120).optional().or(z.literal("")),
    message: z.string().trim().max(4000).optional().or(z.literal("")),
  }),
]);

export type SubmissionSchemaInput = z.infer<typeof submissionSchema>;
