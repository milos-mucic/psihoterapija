import type { APIRoute } from "astro";
import { ZodError } from "zod";
import { submissionService } from "@/features/forms/services/submission.service";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const submission = await submissionService.createSubmission(body);

    return new Response(JSON.stringify({ success: true, submission }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response(
        JSON.stringify({
          message: "Podaci nisu validni.",
          issues: error.issues,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    return new Response(JSON.stringify({ message: "Neuspesno cuvanje prijave." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
