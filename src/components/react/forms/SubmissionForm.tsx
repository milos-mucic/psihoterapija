import { useState } from "react";

type Props = {
  locale: "sr-latn" | "sr-cyrl";
  type: "contact" | "appointment";
  submitLabel: string;
  formatLabel?: string;
  appointmentFormats?: string[];
  labels: {
    name: string;
    email: string;
    phone: string;
    message: string;
    success: string;
    error: string;
  };
};

type State = "idle" | "submitting" | "success" | "error";

export function SubmissionForm({
  locale,
  type,
  submitLabel,
  labels,
  formatLabel,
  appointmentFormats,
}: Props) {
  const [state, setState] = useState<State>("idle");
  const [errorText, setErrorText] = useState<string>("");

  async function handleSubmit(form: HTMLFormElement) {
    setState("submitting");
    setErrorText("");

    const formData = new FormData(form);
    const payload = {
      type,
      locale,
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      format: String(formData.get("format") ?? ""),
      message:
        type === "appointment"
          ? String(formData.get("message") ?? "")
          : String(formData.get("message") ?? ""),
    };

    try {
      const response = await fetch("/api/public/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setState("error");
        setErrorText(data?.message ?? labels.error);
        return;
      }

      form.reset();
      setState("success");
    } catch {
      setState("error");
      setErrorText(labels.error);
    }
  }

  return (
    <form
      className={`stack-form stack-form--${type}`}
      onSubmit={(event) => {
        event.preventDefault();
        void handleSubmit(event.currentTarget);
      }}
    >
      <div className="stack-form__grid">
        <label>
          <span>{labels.name}</span>
          <input className="input-control" name="name" required />
        </label>

        {type === "appointment" ? (
          <label>
            <span>{labels.phone}</span>
            <input className="input-control" name="phone" type="tel" required />
          </label>
        ) : null}

        <label>
          <span>{labels.email}</span>
          <input className="input-control" name="email" type="email" required />
        </label>

        {type === "appointment" ? (
          <label>
            <span>{formatLabel ?? (locale === "sr-cyrl" ? "Формат рада" : "Format rada")}</span>
            <select className="input-control" name="format" required defaultValue="">
              <option value="" disabled>
                {locale === "sr-cyrl" ? "Изаберите" : "Izaberite"}
              </option>
              {(appointmentFormats ?? []).map((format) => (
                <option key={format} value={format}>
                  {format}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <label className="stack-form__field stack-form__field--full">
            <span>{labels.message}</span>
            <textarea className="input-control input-control--textarea" name="message" required rows={5} />
          </label>
        )}

        {type === "contact" ? null : <input name="message" type="hidden" value="" readOnly />}

        <button className="button-primary" disabled={state === "submitting"} type="submit">
          {state === "submitting" ? "..." : submitLabel}
        </button>
        {state === "success" && (
          <p className="form-status" data-tone="success">
            {labels.success}
          </p>
        )}
        {state === "error" && (
          <p className="form-status" data-tone="error">
            {errorText}
          </p>
        )}
      </div>
    </form>
  );
}
