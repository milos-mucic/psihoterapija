import { createRoot, type Root } from "react-dom/client";
import {
  AdminRichTextField,
  type AdminRichTextFieldProps,
} from "@/components/components/AdminRichTextField";

const roots = new WeakMap<HTMLElement, Root>();

export const mountAdminRichTextField = (container: HTMLElement, props: AdminRichTextFieldProps) => {
  let root = roots.get(container);

  if (!root) {
    root = createRoot(container);
    roots.set(container, root);
  }

  root.render(<AdminRichTextField {...props} />);
};

export const unmountAdminRichTextField = (container: HTMLElement) => {
  const root = roots.get(container);

  if (!root) {
    return;
  }

  root.unmount();
  roots.delete(container);
};
