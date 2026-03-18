import { SubmissionForm } from "@/components/react/forms/SubmissionForm";

type Props = {
  locale: "sr-latn" | "sr-cyrl";
  labels: {
    name: string;
    email: string;
    phone: string;
    message: string;
    submitAppointment: string;
    success: string;
    error: string;
  };
};

export function AppointmentForm({ locale, labels }: Props) {
  return (
    <SubmissionForm
      locale={locale}
      type="appointment"
      submitLabel={labels.submitAppointment}
      labels={labels}
    />
  );
}
