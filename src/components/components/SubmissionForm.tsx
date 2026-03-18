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
    formatLabel: string;
    chooseOption: string;
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
      message: String(formData.get("message") ?? ""),
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
        <label className="stack-form__field">
          <span className="stack-form__label">{labels.name}</span>
          <input className="input-control" name="name" autoComplete="name" required />
        </label>

        {type === "appointment" ? (
          <label className="stack-form__field">
            <span className="stack-form__label">{labels.phone}</span>
            <input className="input-control" name="phone" type="tel" autoComplete="tel" required />
          </label>
        ) : null}

        <label className="stack-form__field">
          <span className="stack-form__label">{labels.email}</span>
          <input className="input-control" name="email" type="email" autoComplete="email" required />
        </label>

        {type === "appointment" ? (
          <label className="stack-form__field">
            <span className="stack-form__label">{formatLabel ?? labels.formatLabel}</span>
            <select className="input-control" name="format" required defaultValue="">
              <option value="" disabled>
                {labels.chooseOption}
              </option>
              {(appointmentFormats ?? []).map((format) => (
                <option key={format} value={format}>
                  {format}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <label className="stack-form__field stack-form__field--full stack-form__field--message">
            <span className="stack-form__label">{labels.message}</span>
            <textarea
              className="input-control input-control--textarea"
              name="message"
              required
              rows={5}
            />
          </label>
        )}

        {type === "contact" ? null : <input name="message" type="hidden" value="" readOnly />}
      </div>

      <div className="stack-form__actions">
        <div className="stack-form__feedback" aria-live="polite">
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

        <button className="button-primary stack-form__submit" disabled={state === "submitting"} type="submit">
          {state === "submitting" ? "..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
