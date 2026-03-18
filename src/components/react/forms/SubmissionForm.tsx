import { useState } from "react";

type Props = {
  locale: "sr-latn" | "sr-cyrl";
  type: "contact" | "appointment";
  submitLabel: string;
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

export function SubmissionForm({ locale, type, submitLabel, labels }: Props) {
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
      className="card stack-form"
      style={{ padding: "1.4rem" }}
      onSubmit={(event) => {
        event.preventDefault();
        void handleSubmit(event.currentTarget);
      }}
    >
      <div className="page-grid">
        <label>
          <span>{labels.name}</span>
          <input className="input-control" name="name" required />
        </label>
        <label>
          <span>{labels.email}</span>
          <input className="input-control" name="email" type="email" required />
        </label>
        <label>
          <span>{labels.phone}</span>
          <input className="input-control" name="phone" />
        </label>
        <label>
          <span>{labels.message}</span>
          <textarea className="input-control" name="message" required rows={5} />
        </label>
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
