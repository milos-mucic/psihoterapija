import { SubmissionForm } from "@/components/react/forms/SubmissionForm";

type Props = {
  locale: "sr-latn" | "sr-cyrl";
  labels: {
    name: string;
    email: string;
    phone: string;
    message: string;
    submitContact: string;
    success: string;
    error: string;
  };
};

export function ContactForm({ locale, labels }: Props) {
  return (
    <SubmissionForm
      locale={locale}
      type="contact"
      submitLabel={labels.submitContact}
      labels={labels}
    />
  );
}
