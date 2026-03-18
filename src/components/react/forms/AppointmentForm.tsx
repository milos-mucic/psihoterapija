import { SubmissionForm } from "@/components/react/forms/SubmissionForm";

type Props = {
  locale: "sr-latn" | "sr-cyrl";
  formatLabel: string;
  formats: string[];
  labels: {
    name: string;
    email: string;
    phone: string;
    message: string;
    formatLabel: string;
    chooseOption: string;
    submitAppointment: string;
    success: string;
    error: string;
  };
};

export function AppointmentForm({ locale, labels, formatLabel, formats }: Props) {
  return (
    <SubmissionForm
      locale={locale}
      type="appointment"
      submitLabel={labels.submitAppointment}
      formatLabel={formatLabel}
      appointmentFormats={formats}
      labels={labels}
    />
  );
}
