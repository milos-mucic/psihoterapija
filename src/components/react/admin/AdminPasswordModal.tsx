import { useState } from "react";

type Props = {
  returnPath: string;
};

export function AdminPasswordModal({ returnPath }: Props) {
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorText, setErrorText] = useState("");

  async function handleSubmit() {
    setStatus("submitting");
    setErrorText("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setStatus("error");
      setErrorText(data?.message ?? "Pristup nije odobren.");
      return;
    }

    window.location.href = returnPath;
  }

  return (
    <div className="card" style={{ padding: "1.5rem", maxWidth: "34rem" }}>
      <div className="page-grid">
        <div>
          <p className="eyebrow">Admin pristup</p>
          <h2 style={{ margin: "0 0 0.5rem" }}>Unesite sifru</h2>
          <p style={{ margin: 0, color: "var(--muted)" }}>
            Ovo je jednostavan, pragmatcan gate za skriveni admin segment.
          </p>
        </div>
        <form
          className="page-grid"
          onSubmit={(event) => {
            event.preventDefault();
            void handleSubmit();
          }}
        >
          <input
            className="input-control"
            name="password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Admin sifra"
            required
            type="password"
            value={password}
          />
          <button className="button-primary" disabled={status === "submitting"} type="submit">
            {status === "submitting" ? "..." : "Otvori admin"}
          </button>
          {status === "error" && (
            <p className="form-status" data-tone="error">
              {errorText}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
