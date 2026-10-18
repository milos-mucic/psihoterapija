(() => {
  const switchTimers = new WeakMap();

  const syncScrolledState = () => {
    document.querySelectorAll("[data-appbar-root]").forEach((root) => {
      root.classList.toggle("is-scrolled", window.scrollY > 24);
    });
  };

  const initLocaleToggles = (appBar) => {
    appBar.querySelectorAll("[data-locale-toggle]").forEach((toggle) => {
      if (toggle.dataset.localeReady === "true") return;
      toggle.dataset.localeReady = "true";

      toggle.querySelectorAll("[data-locale-chip-target]").forEach((target) => {
        if (!(target instanceof HTMLAnchorElement)) return;

        target.addEventListener("click", () => {
          const nextLocale = target.dataset.nextLocale;
          if (nextLocale) {
            toggle.dataset.activeLocale = nextLocale;
          }

          if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

          toggle.classList.add("is-switching");
          const previousTimer = switchTimers.get(toggle);
          if (previousTimer) {
            window.clearTimeout(previousTimer);
          }

          const nextTimer = window.setTimeout(() => {
            toggle.classList.remove("is-switching");
          }, 520);

          switchTimers.set(toggle, nextTimer);
        });
      });
    });
  };

  const initDesktopDropdowns = (appBar) => {
    const closeDropdown = (dropdown) => {
      if (!(dropdown instanceof HTMLDetailsElement)) return;
      dropdown.open = false;
      dropdown.dataset.dropdownPinned = "false";
    };

    const closeOtherDropdowns = (currentDropdown) => {
      appBar.querySelectorAll("[data-appbar-dropdown]").forEach((dropdown) => {
        if (!(dropdown instanceof HTMLDetailsElement)) return;
        if (dropdown === currentDropdown) return;
        closeDropdown(dropdown);
      });
    };

    const hasPinnedDropdown = () =>
      Array.from(appBar.querySelectorAll("[data-appbar-dropdown]")).some(
        (dropdown) =>
          dropdown instanceof HTMLDetailsElement && dropdown.dataset.dropdownPinned === "true",
      );

    if (appBar.dataset.dropdownDismissReady !== "true") {
      appBar.dataset.dropdownDismissReady = "true";

      document.addEventListener("pointerdown", (event) => {
        if (appBar.contains(event.target)) return;
        appBar.querySelectorAll("[data-appbar-dropdown]").forEach((dropdown) => {
          closeDropdown(dropdown);
        });
      });

      document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") return;
        appBar.querySelectorAll("[data-appbar-dropdown]").forEach((dropdown) => {
          closeDropdown(dropdown);
        });
      });
    }

    appBar.querySelectorAll("[data-appbar-dropdown]").forEach((dropdown) => {
      if (!(dropdown instanceof HTMLDetailsElement)) return;
      if (dropdown.dataset.dropdownReady === "true") return;
      dropdown.dataset.dropdownReady = "true";

      const summary = dropdown.querySelector("summary");
      if (!(summary instanceof HTMLElement)) return;

      const isDesktop = () => window.matchMedia("(min-width: 1101px)").matches;
      let closeTimer;

      const openDropdown = () => {
        if (!isDesktop()) return;
        if (hasPinnedDropdown() && dropdown.dataset.dropdownPinned !== "true") return;
        window.clearTimeout(closeTimer);
        closeOtherDropdowns(dropdown);
        dropdown.open = true;
      };

      const scheduleCloseDropdown = () => {
        if (!isDesktop()) return;
        if (dropdown.dataset.dropdownPinned === "true") return;
        window.clearTimeout(closeTimer);
        closeTimer = window.setTimeout(() => {
          if (dropdown.dataset.dropdownPinned === "true") return;
          dropdown.open = false;
        }, 120);
      };

      dropdown.addEventListener("mouseenter", openDropdown);
      dropdown.addEventListener("mouseleave", scheduleCloseDropdown);

      dropdown.addEventListener("focusin", () => {
        if (hasPinnedDropdown() && dropdown.dataset.dropdownPinned !== "true") return;
        closeOtherDropdowns(dropdown);
        dropdown.open = true;
      });

      dropdown.addEventListener("focusout", (event) => {
        if (dropdown.contains(event.relatedTarget)) return;
        if (dropdown.dataset.dropdownPinned === "true") return;
        dropdown.open = false;
      });

      summary.addEventListener("click", (event) => {
        if (!isDesktop()) return;
        event.preventDefault();
        window.clearTimeout(closeTimer);
        const shouldPinOpen = dropdown.dataset.dropdownPinned !== "true";
        closeOtherDropdowns(dropdown);
        dropdown.dataset.dropdownPinned = shouldPinOpen ? "true" : "false";
        dropdown.open = shouldPinOpen;
      });
    });
  };

  const initAppBar = (appBar) => {
    if (!(appBar instanceof HTMLElement)) return;
    if (appBar.dataset.appbarReady === "true") {
      syncScrolledState();
      return;
    }

    appBar.dataset.appbarReady = "true";
    const mobile = appBar.querySelector("[data-appbar-mobile]");
    let closeDrawerTimer;

    const closeDrawer = () => {
      if (!(mobile instanceof HTMLDetailsElement)) return;
      if (mobile.dataset.closing === "true") return;
      mobile.dataset.closing = "true";
      mobile.classList.add("is-closing");
      document.body.classList.remove("appbar-drawer-open");
      window.clearTimeout(closeDrawerTimer);
      closeDrawerTimer = window.setTimeout(() => {
        mobile.open = false;
        mobile.classList.remove("is-closing");
        mobile.dataset.closing = "false";
      }, 320);
    };

    const syncDrawerState = () => {
      if (!(mobile instanceof HTMLDetailsElement)) return;
      if (mobile.open) {
        window.clearTimeout(closeDrawerTimer);
        mobile.classList.remove("is-closing");
        mobile.dataset.closing = "false";
      }
      document.body.classList.toggle("appbar-drawer-open", mobile.open);
    };

    initLocaleToggles(appBar);
    initDesktopDropdowns(appBar);
    syncScrolledState();

    if (mobile instanceof HTMLDetailsElement) {
      mobile.addEventListener("toggle", syncDrawerState);

      mobile.querySelector(".appbar__backdrop")?.addEventListener("click", closeDrawer);
      mobile.querySelector(".appbar__drawer-close")?.addEventListener("click", closeDrawer);
      mobile.querySelectorAll(".appbar__drawer a").forEach((link) => {
        link.addEventListener("click", closeDrawer);
      });

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          closeDrawer();
        }
      });
    }
  };

  const initCurrentAppBar = () => {
    const appBar = document.querySelector("[data-appbar-root]");
    if (!appBar) return;
    initAppBar(appBar);
  };

  if (!window.__ikarAppBarScrollReady) {
    window.__ikarAppBarScrollReady = true;
    window.addEventListener("scroll", syncScrolledState, { passive: true });
  }

  initCurrentAppBar();
})();
