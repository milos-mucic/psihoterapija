(() => {
  if (window.__ikarPublicSubmissionFormsReady) {
    return;
  }

  window.__ikarPublicSubmissionFormsReady = true;

  const setFeedback = (container, tone, message) => {
    if (!(container instanceof HTMLElement)) {
      return;
    }

    container.textContent = "";

    if (!message) {
      return;
    }

    const messageNode = document.createElement("p");
    messageNode.className = "form-status";
    messageNode.dataset.tone = tone;
    messageNode.textContent = message;
    container.append(messageNode);
  };

  document.addEventListener("submit", async (event) => {
    const form = event.target;

    if (!(form instanceof HTMLFormElement) || form.dataset.submissionForm !== "true") {
      return;
    }

    event.preventDefault();

    const submitButton = form.querySelector("[data-submit-button]");
    const feedback = form.querySelector("[data-form-feedback]");
    const idleLabel =
      submitButton instanceof HTMLButtonElement ? submitButton.dataset.idleLabel ?? "" : "";

    if (submitButton instanceof HTMLButtonElement) {
      submitButton.disabled = true;
      submitButton.textContent = "...";
    }

    setFeedback(feedback, "", "");

    const formData = new FormData(form);
    const payload = {
      type: String(formData.get("type") ?? ""),
      locale: String(formData.get("locale") ?? ""),
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      format: String(formData.get("format") ?? ""),
      message: String(formData.get("message") ?? ""),
    };

    try {
      const response = await fetch(form.action, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setFeedback(
          feedback,
          "error",
          data?.message ?? form.dataset.errorMessage ?? "Došlo je do greške. Pokušajte ponovo.",
        );
        return;
      }

      form.reset();
      setFeedback(
        feedback,
        "success",
        form.dataset.successMessage ?? "Poruka je uspešno poslata.",
      );
    } catch {
      setFeedback(
        feedback,
        "error",
        form.dataset.errorMessage ?? "Došlo je do greške. Pokušajte ponovo.",
      );
    } finally {
      if (submitButton instanceof HTMLButtonElement) {
        submitButton.disabled = false;
        submitButton.textContent = idleLabel;
      }
    }
  });
})();
