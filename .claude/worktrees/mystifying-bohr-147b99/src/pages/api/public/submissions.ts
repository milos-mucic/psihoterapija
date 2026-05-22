import type { APIRoute } from "astro";
import { ZodError } from "zod";
import { getDictionary } from "@/features/i18n/translate";
import { submissionService } from "@/features/forms/services/submission.service";

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json().catch(() => null);
  const locale = body?.locale === "sr-cyrl" ? "sr-cyrl" : "sr-latn";
  const dictionary = getDictionary(locale);

  try {
    const submission = await submissionService.createSubmission(body);

    return new Response(JSON.stringify({ success: true, submission }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response(
        JSON.stringify({
          message: dictionary.api.invalidSubmission,
          issues: error.issues,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    return new Response(JSON.stringify({ message: dictionary.api.submissionSaveFailed }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
