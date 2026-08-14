import type { Locator, Page } from "@playwright/test";

/** The RTF toolbar aria-labels, matching src/features/i18n/dictionaries/sr-latn.json `admin.blogForm.richText`. */
export const RTF_LABELS = {
  bold: "Bold",
  italic: "Italic",
  fontSize: "Veličina fonta",
  fontFamily: "Font",
  textColor: "Boja teksta",
} as const;

/** Locates the `.admin-rtf` wrapper (toolbar + editor) for a named RTF field by its hidden textarea. */
export const rtfFieldWrapper = (page: Page, fieldName: string): Locator =>
  page.locator(".admin-rtf", { has: page.locator(`textarea[name="${fieldName}"]`) });

/**
 * Selects all text in the given RTF field and applies a font-size, font-family,
 * text color, and bold via the real toolbar controls (not by writing HTML directly).
 * Returns the field's resulting saved HTML (its hidden textarea value) for assertions.
 */
export const applyRichTextStyling = async (
  page: Page,
  fieldName: string,
  styles: { fontSize?: string; fontFamily?: string; color?: string; bold?: boolean; italic?: boolean },
) => {
  const wrapper = rtfFieldWrapper(page, fieldName);
  const editor = wrapper.locator(".admin-rtf__editor");

  // Client-rendered admin islands (React forms/builders) can still be
  // settling their first render/effects right after navigation, which
  // occasionally detaches the editor mid-interaction; retry once on that.
  const withRetryOnDetach = async (action: () => Promise<void>) => {
    try {
      await action();
    } catch (error) {
      if (error instanceof Error && error.message.includes("not attached to the DOM")) {
        await action();
        return;
      }
      throw error;
    }
  };

  // Home/managed-page forms group fields into collapsible accordion sections
  // (only one open at a time); expand the target field's containing section
  // first if needed. Uses an ElementHandle + closest() rather than a CSS
  // attribute selector because `data-section-preview-fragment` values are not
  // guaranteed unique across a page's sections.
  const wrapperHandle = await wrapper.elementHandle();
  if (wrapperHandle) {
    const sectionHandle = await wrapperHandle.evaluateHandle((el) => el.closest("[data-section-preview]"));
    const sectionElement = sectionHandle.asElement();
    if (sectionElement) {
      const isCollapsed = await sectionElement.evaluate((el) => el.classList.contains("is-collapsed"));
      if (isCollapsed) {
        const toggle = await sectionElement.$("[data-admin-section-toggle]");
        await toggle?.click();
      }
    }
  }

  // Long admin forms also have a fixed floating save button in the
  // bottom-right corner that can overlap a tall editor visually; focus()
  // (rather than click()) avoids the pointer-interception/hit-testing issues
  // that causes, while still letting keyboard commands reach the editor.
  await withRetryOnDetach(async () => {
    await editor.scrollIntoViewIfNeeded();
    await editor.focus();
  });
  await page.keyboard.press("ControlOrMeta+a");

  if (styles.fontSize) {
    await wrapper.locator(`select[aria-label="${RTF_LABELS.fontSize}"]`).selectOption(styles.fontSize);
  }
  if (styles.fontFamily) {
    await wrapper.locator(`select[aria-label="${RTF_LABELS.fontFamily}"]`).selectOption(styles.fontFamily);
  }
  if (styles.color) {
    await wrapper.locator(`label[aria-label="${RTF_LABELS.textColor}"] input[type="color"]`).fill(styles.color);
  }
  if (styles.bold) {
    await wrapper.locator(`button[aria-label="${RTF_LABELS.bold}"]`).click();
  }
  if (styles.italic) {
    await wrapper.locator(`button[aria-label="${RTF_LABELS.italic}"]`).click();
  }

  return wrapper.locator(`textarea[name="${fieldName}"]`).inputValue();
};

/** Snapshots every current field value of a form as a plain string->string object (for safe save + restore). */
export const snapshotForm = async (page: Page, formSelector: string): Promise<Record<string, string>> =>
  page.locator(formSelector).evaluate((form: HTMLFormElement) => {
    const fd = new FormData(form);
    const obj: Record<string, string> = {};
    for (const [key, value] of fd.entries()) {
      if (typeof value === "string") {
        obj[key] = value;
      }
    }
    return obj;
  });

/** Posts a snapshot (from `snapshotForm`, optionally mutated) as `application/x-www-form-urlencoded`. */
export const postForm = (page: Page, url: string, payload: Record<string, string>) =>
  page.request.post(url, { form: payload });
