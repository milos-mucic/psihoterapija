const trackedForms = new Set<HTMLFormElement>();
const resetTimers = new WeakMap<HTMLFormElement, number>();

const dirtyNavigationMessage =
  "Imate nesačuvane izmene. Ako nastavite, izgubićete izmene koje još nisu sačuvane.";

let globalDirtyGuardsBound = false;

const serializeFormState = (form: HTMLFormElement) => {
  const params = new URLSearchParams();

  for (const [key, value] of new FormData(form).entries()) {
    if (typeof value === "string") {
      params.append(key, value);
      continue;
    }

    if (value instanceof File && value.name) {
      params.append(key, value.name);
    }
  }

  return params.toString();
};

const scheduleNavigationReset = (form: HTMLFormElement) => {
  const previousTimer = resetTimers.get(form);

  if (previousTimer) {
    window.clearTimeout(previousTimer);
  }

  const timer = window.setTimeout(() => {
    delete form.dataset.allowDirtyNavigation;
    resetTimers.delete(form);
  }, 1500);

  resetTimers.set(form, timer);
};

const allowDirtyNavigation = (form: HTMLFormElement) => {
  form.dataset.allowDirtyNavigation = "true";
  scheduleNavigationReset(form);
};

const getBlockingDirtyForms = () =>
  Array.from(trackedForms).filter((form) => {
    if (!form.isConnected) {
      trackedForms.delete(form);
      return false;
    }

    return form.dataset.isDirty === "true" && form.dataset.allowDirtyNavigation !== "true";
  });

const isSamePageHashNavigation = (url: URL) =>
  url.origin === window.location.origin &&
  url.pathname === window.location.pathname &&
  url.search === window.location.search &&
  url.hash.length > 0;

const bindGlobalDirtyGuards = () => {
  if (globalDirtyGuardsBound) {
    return;
  }

  window.addEventListener("beforeunload", (event) => {
    if (getBlockingDirtyForms().length === 0) {
      return;
    }

    event.preventDefault();
    event.returnValue = "";
  });

  document.addEventListener(
    "click",
    (event) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const link = target.closest("a[href]");

      if (!(link instanceof HTMLAnchorElement)) {
        return;
      }

      if (link.target && link.target !== "_self") {
        return;
      }

      if (link.hasAttribute("download")) {
        return;
      }

      let nextUrl: URL;

      try {
        nextUrl = new URL(link.href, window.location.href);
      } catch {
        return;
      }

      if (isSamePageHashNavigation(nextUrl)) {
        return;
      }

      const dirtyForms = getBlockingDirtyForms();

      if (dirtyForms.length === 0) {
        return;
      }

      if (!window.confirm(dirtyNavigationMessage)) {
        event.preventDefault();
        return;
      }

      dirtyForms.forEach((form) => {
        allowDirtyNavigation(form);
      });
    },
    true,
  );

  window.addEventListener("pageshow", () => {
    trackedForms.forEach((form) => {
      delete form.dataset.allowDirtyNavigation;
    });
  });

  globalDirtyGuardsBound = true;
};

export const notifyAdminFormValueChange = (form: HTMLFormElement | null | undefined) => {
  if (!(form instanceof HTMLFormElement)) {
    return;
  }

  form.dispatchEvent(new CustomEvent("admin:form-value-change"));
};

export const setupAdminFormExperience = () => {
  bindGlobalDirtyGuards();

  document.querySelectorAll("[data-admin-section-preview-root]").forEach((form) => {
    if (!(form instanceof HTMLFormElement) || form.dataset.adminFormExperienceBound === "true") {
      return;
    }

    trackedForms.add(form);

    const submitButtons = Array.from(form.querySelectorAll("[data-admin-form-submit]")).filter(
      (button) => button instanceof HTMLButtonElement,
    );
    const statusNodes = Array.from(form.querySelectorAll("[data-admin-form-submit-status]")).filter(
      (node) => node instanceof HTMLElement,
    );
    const previewEndpoint = form.dataset.adminPreviewEndpoint ?? "";
    const previewTokenField = form.querySelector("[data-admin-preview-token]");
    const previewFrameNode = form
      .closest("[data-admin-page-editor]")
      ?.querySelector("[data-admin-preview-iframe]");
    const previewLinkNode = form
      .closest("[data-admin-page-editor]")
      ?.querySelector("[data-admin-preview-open]");
    const pendingSources = new Map<string, true>();
    const observer = new MutationObserver(() => {
      window.requestAnimationFrame(syncDirtyState);
      schedulePreviewSync();
    });
    let previewSyncTimer: number | undefined;
    let autoSaveRequested = false;
    let isSubmitting = false;
    let isDirty = false;
    let initialSnapshot = serializeFormState(form);

    const syncSubmitState = () => {
      const hasPending = pendingSources.size > 0;
      const message = isSubmitting
        ? "Čuvanje u toku..."
        : autoSaveRequested && hasPending
          ? "Završavam upload pa čuvam izmenu slike."
          : autoSaveRequested
            ? "Čuvam izmenu slike..."
            : hasPending
              ? "Sačekajte da se obrada slike ili videa završi."
              : isDirty
                ? "Imate nesačuvane izmene."
                : "Sve izmene su sačuvane.";
      const tone = hasPending ? "muted" : isDirty ? "warning" : "ready";

      form.dataset.pendingUploads = hasPending ? "true" : "false";
      form.dataset.isDirty = isDirty ? "true" : "false";

      submitButtons.forEach((button) => {
        button.disabled = hasPending;
        button.setAttribute("aria-disabled", hasPending ? "true" : "false");
      });

      statusNodes.forEach((node) => {
        node.textContent = message;
        node.dataset.tone = tone;
      });
    };

    const syncDirtyState = () => {
      const nextDirty = serializeFormState(form) !== initialSnapshot;

      if (nextDirty === isDirty) {
        syncSubmitState();
        return;
      }

      isDirty = nextDirty;
      syncSubmitState();
    };

    const tryAutoSave = () => {
      if (!autoSaveRequested || isSubmitting || form.dataset.pendingUploads === "true") {
        return;
      }

      if (!form.checkValidity()) {
        autoSaveRequested = false;
        syncSubmitState();
        return;
      }

      window.requestAnimationFrame(() => form.requestSubmit());
    };

    const getActivePreviewFragment = () => {
      const activeSection = form.querySelector("[data-section-preview].is-active");

      if (!(activeSection instanceof HTMLElement)) {
        return "";
      }

      return activeSection.dataset.sectionPreviewFragment ?? "";
    };

    const updatePreviewFrame = (token: string) => {
      const baseHref = form.dataset.previewBaseHref ?? "";

      if (!baseHref || !(previewFrameNode instanceof HTMLIFrameElement)) {
        return;
      }

      const previewUrl = new URL(baseHref, window.location.origin);
      previewUrl.searchParams.set("token", token);
      previewUrl.searchParams.set("ts", String(Date.now()));

      const nextSrc = `${previewUrl.pathname}${previewUrl.search}${
        getActivePreviewFragment() ? `#${getActivePreviewFragment()}` : ""
      }`;

      previewFrameNode.src = nextSrc;

      if (previewLinkNode instanceof HTMLAnchorElement) {
        previewLinkNode.href = nextSrc;
      }
    };

    const buildSectionPreviewHref = (fragment = "", includeTimestamp = false) => {
      const baseHref = form.dataset.previewBaseHref ?? "";

      if (!baseHref) {
        return "";
      }

      const previewUrl = new URL(baseHref, window.location.origin);

      if (previewTokenField instanceof HTMLInputElement && previewTokenField.value) {
        previewUrl.searchParams.set("token", previewTokenField.value);
      }

      if (includeTimestamp) {
        previewUrl.searchParams.set("ts", String(Date.now()));
      }

      return `${previewUrl.pathname}${previewUrl.search}${fragment ? `#${fragment}` : ""}`;
    };

    const syncPreviewDraft = async () => {
      if (!previewEndpoint) {
        return;
      }

      const formData = new FormData(form);

      try {
        const response = await fetch(previewEndpoint, {
          method: "POST",
          body: formData,
          credentials: "same-origin",
        });

        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as { token?: string };

        if (!data.token || !(previewTokenField instanceof HTMLInputElement)) {
          return;
        }

        previewTokenField.value = data.token;
        updatePreviewFrame(data.token);
      } catch {
        return;
      }
    };

    const schedulePreviewSync = () => {
      if (!previewEndpoint) {
        return;
      }

      if (previewSyncTimer) {
        window.clearTimeout(previewSyncTimer);
      }

      previewSyncTimer = window.setTimeout(() => {
        void syncPreviewDraft();
      }, 450);
    };

    observer.observe(form, {
      childList: true,
      subtree: true,
    });

    form.addEventListener("input", () => {
      syncDirtyState();
      schedulePreviewSync();
    });

    form.addEventListener("change", () => {
      syncDirtyState();
      schedulePreviewSync();
    });

    form.addEventListener("admin:form-value-change", () => {
      syncDirtyState();
      schedulePreviewSync();
    });

    form.addEventListener("admin:pending-media", (event) => {
      if (!(event instanceof CustomEvent)) {
        return;
      }

      const sourceId =
        typeof event.detail?.sourceId === "string" ? event.detail.sourceId : undefined;

      if (!sourceId) {
        return;
      }

      if (event.detail?.active) {
        pendingSources.set(sourceId, true);
      } else {
        pendingSources.delete(sourceId);
      }

      syncSubmitState();
      tryAutoSave();
    });

    form.addEventListener("admin:auto-save-media", () => {
      autoSaveRequested = true;
      syncSubmitState();
      tryAutoSave();
    });

    form.addEventListener("submit", (event) => {
      if (form.dataset.pendingUploads === "true") {
        event.preventDefault();
        syncSubmitState();
        return;
      }

      if (isSubmitting) {
        event.preventDefault();
        return;
      }

      isSubmitting = true;
      allowDirtyNavigation(form);
      syncSubmitState();
    });

    syncDirtyState();

    form.dataset.adminFormExperienceBound = "true";

    const editorRoot = form.closest("[data-admin-page-editor]");
    const nav = editorRoot?.querySelector("[data-admin-section-nav]");
    const previewFrame = editorRoot?.querySelector("[data-admin-preview-iframe]");
    const previewLink = previewLinkNode;
    const sections = Array.from(form.children).filter(
      (child) => child instanceof HTMLElement && child.matches("[data-section-preview]"),
    );

    const activateSection = (nextIndex: number | null) => {
      sections.forEach((section, index) => {
        if (!(section instanceof HTMLElement)) {
          return;
        }

        const isActive = nextIndex !== null && index === nextIndex;
        section.classList.toggle("is-active", isActive);
        section.classList.toggle("is-collapsed", !isActive);

        const toggleButton = section.querySelector("[data-admin-section-toggle]");

        if (toggleButton instanceof HTMLButtonElement) {
          toggleButton.textContent = isActive ? "Zatvori sekciju" : "Otvori sekciju";
          toggleButton.setAttribute("aria-expanded", isActive ? "true" : "false");
        }

        const navButton = nav?.querySelector(`[data-admin-section-nav-index="${index}"]`);
        navButton?.classList.toggle("is-active", isActive);
        navButton?.setAttribute("aria-current", isActive ? "true" : "false");
      });

      if (nextIndex === null) {
        return;
      }

      const activeSection = sections[nextIndex];

      if (!(activeSection instanceof HTMLElement)) {
        return;
      }

      const fragment = activeSection.dataset.sectionPreviewFragment ?? "";
      const href = buildSectionPreviewHref(fragment);

      if (previewFrame instanceof HTMLIFrameElement && previewFrame.src !== href) {
        previewFrame.src = href;
      }

      if (previewLink instanceof HTMLAnchorElement) {
        previewLink.href = href;
      }
    };

    sections.forEach((child, index) => {
      if (!(child instanceof HTMLElement) || !child.matches("[data-section-preview]")) {
        return;
      }

      const fragment = child.dataset.sectionPreviewFragment ?? "";
      const href = buildSectionPreviewHref(fragment);
      const title =
        child.dataset.sectionPreviewTitle ??
        child.querySelector("h2")?.textContent?.trim() ??
        "Preview sekcije";
      const copy =
        child.dataset.sectionPreviewCopy ??
        child.querySelector(".section-copy")?.textContent?.trim() ??
        "";

      child.classList.add("admin-section-editor");
      child.classList.toggle("is-active", index === 0);
      child.classList.toggle("is-collapsed", index !== 0);

      const existingNodes = Array.from(child.childNodes);
      const body = document.createElement("div");
      body.className = "admin-section-editor__body";
      existingNodes.forEach((node) => body.append(node));

      const header = document.createElement("div");
      header.className = "admin-section-editor__header";

      const badge = document.createElement("span");
      badge.className = "admin-section-editor__badge";
      badge.textContent = String(index + 1).padStart(2, "0");

      const meta = document.createElement("div");
      meta.className = "admin-section-editor__meta";

      const heading = document.createElement("h2");
      heading.textContent = title;
      meta.append(heading);

      if (copy) {
        const summary = document.createElement("p");
        summary.className = "admin-section-editor__copy";
        summary.textContent = copy;
        meta.append(summary);
      }

      const actions = document.createElement("div");
      actions.className = "admin-section-editor__actions";

      const toggle = document.createElement("button");
      toggle.type = "button";
      toggle.className = "button-primary admin-section-editor__toggle";
      toggle.dataset.adminSectionToggle = "true";
      toggle.textContent = index === 0 ? "Zatvori sekciju" : "Otvori sekciju";
      toggle.setAttribute("aria-expanded", index === 0 ? "true" : "false");
      toggle.addEventListener("click", () => {
        if (child.classList.contains("is-active")) {
          activateSection(null);
          return;
        }

        activateSection(index);
      });

      actions.append(toggle);
      header.append(badge, meta, actions);

      child.replaceChildren(header, body);

      if (nav instanceof HTMLElement) {
        const navButton = document.createElement("button");
        navButton.type = "button";
        navButton.className = `admin-section-nav__button${index === 0 ? " is-active" : ""}`;
        navButton.dataset.adminSectionNavIndex = String(index);

        const navIndex = document.createElement("span");
        navIndex.className = "admin-section-nav__index";
        navIndex.textContent = String(index + 1).padStart(2, "0");

        const navTitle = document.createElement("span");
        navTitle.className = "admin-section-nav__title";
        navTitle.textContent = title;

        navButton.append(navIndex, navTitle);

        if (copy) {
          const navCopy = document.createElement("span");
          navCopy.className = "admin-section-nav__copy";
          navCopy.textContent = copy;
          navButton.append(navCopy);
        }

        navButton.addEventListener("click", () => activateSection(index));
        nav.append(navButton);
      }

      child.addEventListener(
        "invalid",
        (event) => {
          if (event.target instanceof HTMLElement) {
            activateSection(index);
          }
        },
        true,
      );
    });

    activateSection(0);
  });
};
