import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import type { JSX, PointerEvent as ReactPointerEvent } from "react";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { LinkNode, TOGGLE_LINK_COMMAND, $isLinkNode } from "@lexical/link";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListItemNode,
  ListNode,
  REMOVE_LIST_COMMAND,
  $isListNode,
} from "@lexical/list";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
import { uploadWithProgress } from "@/lib/http/upload-with-progress";
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
  $isQuoteNode,
  HeadingNode,
  QuoteNode,
} from "@lexical/rich-text";
import {
  $getSelectionStyleValueForProperty,
  $patchStyleText,
  $setBlocksType,
} from "@lexical/selection";
import type { RangeSelection } from "lexical";
import { $getNearestBlockElementAncestorOrThrow, mergeRegister } from "@lexical/utils";
import {
  $createParagraphNode,
  $getNodeByKey,
  $getRoot,
  $getSelection,
  $insertNodes,
  $isDecoratorNode,
  $isElementNode,
  $isNodeSelection,
  $isParagraphNode,
  $isRangeSelection,
  $isTextNode,
  $setSelection,
  TextNode,
  CLICK_COMMAND,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_EDITOR,
  COMMAND_PRIORITY_LOW,
  createCommand,
  DecoratorNode,
  type ElementFormatType,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
  type DOMConversionMap,
  type DOMConversionOutput,
  type DOMExportOutput,
  type EditorThemeClasses,
  type LexicalEditor,
  type LexicalNode,
  type NodeKey,
  type SerializedLexicalNode,
  type Spread,
} from "lexical";

export type AdminRichTextFieldProps = {
  name: string;
  initialValue: string;
  uploadUrl: string;
  uploadFolder?: string;
  mode?: "full" | "inline";
  allowFontSize?: boolean;
  labels: {
    bold: string;
    italic: string;
    underline: string;
    heading2: string;
    heading3: string;
    bulletList: string;
    orderedList: string;
    quote: string;
    link: string;
    image: string;
    clear: string;
    uploadFailed: string;
    paragraph?: string;
    undo?: string;
    redo?: string;
    strikethrough?: string;
    removeLink?: string;
    placeholder?: string;
    fontSize?: string;
    fontFamily?: string;
    textColor?: string;
    highlightColor?: string;
    alignLeft?: string;
    alignCenter?: string;
    alignRight?: string;
    alignJustify?: string;
  };
  /**
   * Optional callback invoked whenever the editor's HTML value changes.
   * Useful when the field is consumed by a parent React component that wants
   * to react to changes instead of (or in addition to) relying on the hidden
   * form input.
   */
  onValueChange?: (value: string) => void;
};

type Props = AdminRichTextFieldProps;
type EditorMode = NonNullable<Props["mode"]>;
type ToolbarBlockType = "paragraph" | "h2" | "h3" | "quote" | "ul" | "ol";
type ImageLayout = "center" | "wide" | "full" | "wrap-left" | "wrap-right";
type ImageResizeEdge = "left" | "right";
type InsertImagePayload = {
  altText: string;
  src: string;
  layout?: ImageLayout;
  widthPct?: number;
};
type SerializedImageNode = Spread<
  {
    altText: string;
    layout: ImageLayout;
    src: string;
    widthPct: number;
    type: "image";
    version: 2;
  },
  SerializedLexicalNode
>;

// Lexical's default TextNode importer does NOT propagate inline `style` from a wrapping
// `<span style="…">…</span>` onto the TextNode itself. That means saved HTML like
// `<p>Hello <span style="color: red">world</span></p>` round-trips through
// $generateNodesFromDOM as plain "Hello world" (style erased), and reopening the editor
// shows no formatting. We register a custom node whose only purpose is to add a `<span>`
// importer that copies the inline style onto every TextNode child via `forChild`.
class SpanStyleImporterNode extends TextNode {
  static getType(): string {
    return "span-style-importer";
  }
  static clone(node: SpanStyleImporterNode): SpanStyleImporterNode {
    return new SpanStyleImporterNode(node.__text, node.__key);
  }
  static importDOM(): DOMConversionMap | null {
    return {
      span: () => ({
        conversion: (element: HTMLElement): DOMConversionOutput => ({
          node: null,
          forChild: (child) => {
            if ($isTextNode(child)) {
              const style = element.getAttribute("style");
              if (style) {
                const existing = child.getStyle();
                const combined = [existing, style].filter(Boolean).join("; ");
                child.setStyle(combined);
              }
            }
            return child;
          },
        }),
        priority: 1,
      }),
    };
  }
}

const editorTheme: EditorThemeClasses = {
  heading: {
    h2: "admin-rtf__heading",
    h3: "admin-rtf__heading",
  },
  image: "admin-rtf__image-node",
  link: "admin-rtf__link",
  list: {
    listitem: "admin-rtf__list-item",
    nested: {
      listitem: "admin-rtf__list-item",
    },
    ol: "admin-rtf__list",
    ul: "admin-rtf__list",
  },
  paragraph: "admin-rtf__paragraph",
  quote: "admin-rtf__quote",
  text: {
    bold: "admin-rtf__text--bold",
    italic: "admin-rtf__text--italic",
    strikethrough: "admin-rtf__text--strikethrough",
    underline: "admin-rtf__text--underline",
  },
};

const buttonSymbols = {
  bold: "B",
  italic: "I",
  underline: "U",
  strikethrough: "S",
  paragraph: "P",
  heading2: "H2",
  heading3: "H3",
  bulletList: "*",
  orderedList: "1.",
  quote: '"',
  link: "Lk",
  unlink: "Un",
  image: "Img",
  undo: "<",
  redo: ">",
  alignLeft: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="15" y2="12" />
      <line x1="3" y1="18" x2="18" y2="18" />
    </svg>
  ),
  alignCenter: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="6" y1="12" x2="18" y2="12" />
      <line x1="4" y1="18" x2="20" y2="18" />
    </svg>
  ),
  alignRight: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="9" y1="12" x2="21" y2="12" />
      <line x1="6" y1="18" x2="21" y2="18" />
    </svg>
  ),
  alignJustify: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
} as const;

const fontSizeOptions = [
  "12px",
  "14px",
  "16px",
  "18px",
  "20px",
  "24px",
  "28px",
  "32px",
  "40px",
  "48px",
  "56px",
  "72px",
] as const;

const fontFamilyOptions = [
  { label: "Sistemski", value: "" },
  { label: "Lexend (telo)", value: "Lexend, system-ui, sans-serif" },
  { label: "Castoro (naslovi)", value: "Castoro, Georgia, serif" },
  { label: "Sans-serif", value: "system-ui, -apple-system, Arial, sans-serif" },
  { label: "Serif", value: "Georgia, 'Times New Roman', serif" },
  { label: "Monospace", value: "ui-monospace, 'SF Mono', Menlo, monospace" },
] as const;
const imageMimeAccept = "image/*";
const imageMaxBytes = 1_000_000;
const imageScales = [1, 0.92, 0.84, 0.76, 0.68];
const imageQualities = [0.92, 0.84, 0.76, 0.68, 0.6, 0.52, 0.44];
const defaultImageLayout: ImageLayout = "center";
const defaultImageWidthPct = 100;
const clampImageWidthPct = (value: number) => Math.max(25, Math.min(100, Math.round(value)));
const INSERT_IMAGE_COMMAND = createCommand<InsertImagePayload>();
const canUseDomParser = () => typeof window !== "undefined" && typeof DOMParser !== "undefined";

const normalizeLinkUrl = (value: string) => {
  if (/^(https?:\/\/|mailto:|tel:)/i.test(value)) {
    return value;
  }

  return `https://${value.replace(/^\/+/, "")}`;
};

// Strip Lexical-internal junk from exported HTML so what's saved is clean, portable HTML.
// - Drops editor-only theme classes (`admin-rtf__text--bold`, etc.)
// - Drops the `white-space: pre-wrap;` style Lexical sprinkles on every TextNode export
// - Collapses redundant `<b><strong>...</strong></b>` (and `<i><em>`) double-wrappers
// - Unwraps `<span>`s that have no remaining attributes
const sanitizeExportedHtml = (html: string) => {
  if (!html) return html;
  if (!canUseDomParser()) return html;

  const doc = new DOMParser().parseFromString(html, "text/html");

  // 1) Strip editor theme classes
  doc.querySelectorAll("[class]").forEach((el) => {
    const filtered = (el.getAttribute("class") || "")
      .split(/\s+/)
      .filter((c) => c && !c.startsWith("admin-rtf__"))
      .join(" ");
    if (filtered) el.setAttribute("class", filtered);
    else el.removeAttribute("class");
  });

  // 2) Strip white-space: pre-wrap from inline styles (Lexical default), keep user styles
  doc.querySelectorAll("[style]").forEach((el) => {
    const style = el.getAttribute("style") || "";
    const filtered = style
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s && !/^white-space\s*:\s*pre-wrap\s*$/i.test(s))
      .join("; ");
    if (filtered) el.setAttribute("style", filtered + (filtered.endsWith(";") ? "" : ";"));
    else el.removeAttribute("style");
  });

  // 3) Collapse <b><strong>…</strong></b> and <i><em>…</em></i> double-wrappers.
  const collapse = (outerTag: string, innerTag: string) => {
    doc.querySelectorAll(outerTag).forEach((outer) => {
      if (outer.children.length === 1 && outer.firstElementChild?.tagName === innerTag.toUpperCase()) {
        const inner = outer.firstElementChild as HTMLElement;
        outer.replaceWith(inner);
      }
    });
  };
  collapse("b", "strong");
  collapse("strong", "b");
  collapse("i", "em");
  collapse("em", "i");

  // 4) Unwrap spans that have no remaining attributes (purely structural)
  doc.querySelectorAll("span").forEach((span) => {
    if (span.attributes.length === 0) {
      const parent = span.parentNode;
      if (parent) {
        while (span.firstChild) parent.insertBefore(span.firstChild, span);
        parent.removeChild(span);
      }
    }
  });

  return doc.body.innerHTML;
};

const normalizeFullEditorHtml = (value: string) => {
  const html = sanitizeExportedHtml(value.trim());

  if (html === "<p><br></p>" || html === "<p><br /></p>") {
    return "";
  }

  return html;
};

const normalizeInlineEditorHtml = (value: string) => {
  const html = normalizeFullEditorHtml(value);

  if (!html) {
    return "";
  }

  if (!canUseDomParser()) {
    return html
      .replace(/<\/p>\s*<p>/gi, "<br />")
      .replace(/^<p>/i, "")
      .replace(/<\/p>$/i, "")
      .trim();
  }

  const document = new DOMParser().parseFromString(html, "text/html");
  const segments: string[] = [];

  for (const node of Array.from(document.body.childNodes)) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim();

      if (text) {
        segments.push(text);
      }

      continue;
    }

    if (!(node instanceof HTMLElement)) {
      continue;
    }

    if (node.tagName === "P") {
      const inner = node.innerHTML.trim();

      if (!inner || inner === "<br>" || inner === "<br />") {
        continue;
      }

      // Preserve block-level paragraph styling (e.g. text-align) that would otherwise
      // be lost when the <p> wrapper is dropped in inline mode. A display:block span
      // keeps the styling AND stays valid phrasing content inside the headings/paragraphs
      // these inline fields get injected into via set:html.
      const style = node.getAttribute("style")?.trim();
      segments.push(style ? `<span style="display: block; ${style}">${inner}</span>` : inner);
      continue;
    }

    const segment = node.outerHTML.trim();

    if (segment && segment !== "<br>" && segment !== "<br />") {
      segments.push(segment);
    }
  }

  return segments.join("<br />").trim();
};

const normalizeEditorHtml = (value: string, mode: EditorMode) =>
  mode === "inline" ? normalizeInlineEditorHtml(value) : normalizeFullEditorHtml(value);

const appendImportedNodesToRoot = (nodes: LexicalNode[]) => {
  const root = $getRoot();
  let currentParagraph: ReturnType<typeof $createParagraphNode> | null = null;

  root.clear();

  const appendInlineNode = (node: LexicalNode) => {
    if (currentParagraph === null) {
      currentParagraph = $createParagraphNode();
      root.append(currentParagraph);
    }

    currentParagraph.append(node);
  };

  for (const node of nodes) {
    if ($isDecoratorNode(node)) {
      currentParagraph = null;
      root.append(node);
      continue;
    }

    if ($isElementNode(node) && !node.isInline()) {
      currentParagraph = null;
      root.append(node);
      continue;
    }

    if (
      $isTextNode(node) ||
      ($isElementNode(node) && node.isInline()) ||
      node.getType() === "linebreak"
    ) {
      appendInlineNode(node);
      continue;
    }

    currentParagraph = null;
    root.append(node);
  }

  if (root.getChildrenSize() === 0) {
    root.append($createParagraphNode());
  }
};

const getInitialEditorHtml = (value: string, mode: EditorMode) => {
  const normalized = value.trim();

  if (!normalized) {
    return "";
  }

  return mode === "inline" ? `<p>${normalized}</p>` : normalized;
};

const loadImage = (file: File) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Image load failed"));
    };

    image.src = objectUrl;
  });

const canvasToBlob = (canvas: HTMLCanvasElement, type: string, quality?: number) =>
  new Promise<Blob | null>((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type, quality);
  });

const compressImageToMaxSize = async (file: File, maxBytes: number) => {
  if (file.size <= maxBytes) {
    return file;
  }

  const image = await loadImage(file);
  let smallestBlob: Blob | undefined;

  for (const scale of imageScales) {
    const width = Math.max(1, Math.round(image.naturalWidth * scale));
    const height = Math.max(1, Math.round(image.naturalHeight * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");

    if (!context) {
      continue;
    }

    context.drawImage(image, 0, 0, width, height);

    for (const quality of imageQualities) {
      const blob = await canvasToBlob(canvas, "image/webp", quality);

      if (!blob) {
        continue;
      }

      if (!smallestBlob || blob.size < smallestBlob.size) {
        smallestBlob = blob;
      }

      if (blob.size <= maxBytes) {
        const nextName = file.name.replace(/\.[^.]+$/, "") || "image";
        return new File([blob], `${nextName}.webp`, { type: "image/webp" });
      }
    }
  }

  if (smallestBlob) {
    const nextName = file.name.replace(/\.[^.]+$/, "") || "image";
    return new File([smallestBlob], `${nextName}.webp`, { type: "image/webp" });
  }

  return file;
};

const convertImageElement = (domNode: Node): DOMConversionOutput | null => {
  if (!(domNode instanceof HTMLImageElement)) {
    return null;
  }

  const src = domNode.getAttribute("src");

  if (!src) {
    return null;
  }

  return {
    node: $createImageNode({
      altText: domNode.getAttribute("alt") ?? "",
      layout:
        domNode.dataset.layout === "wide" ||
        domNode.dataset.layout === "full" ||
        domNode.dataset.layout === "wrap-left" ||
        domNode.dataset.layout === "wrap-right"
          ? domNode.dataset.layout
          : defaultImageLayout,
      src,
      widthPct: (() => {
        const widthValue =
          domNode.dataset.widthPct ?? domNode.style.width.replace(/%$/, "").trim() ?? "";
        const parsedWidth = Number(widthValue);
        return Number.isFinite(parsedWidth)
          ? clampImageWidthPct(parsedWidth)
          : defaultImageWidthPct;
      })(),
    }),
  };
};

function ImageComponent({
  altText,
  layout,
  nodeKey,
  src,
  widthPct,
}: InsertImagePayload & { nodeKey: NodeKey }) {
  const [editor] = useLexicalComposerContext();
  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);
  const figureRef = useRef<HTMLElement | null>(null);
  const resizeSessionRef = useRef<{ cleanup: () => void } | null>(null);

  const updateWidthPct = useCallback(
    (nextWidthPct: number) => {
      editor.update(() => {
        const node = $getNodeByKey(nodeKey);

        if ($isImageNode(node)) {
          node.setWidthPct(nextWidthPct);
        }
      });
    },
    [editor, nodeKey],
  );

  const removeImage = useCallback(() => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);

      if ($isImageNode(node)) {
        node.remove();
      }
    });
  }, [editor, nodeKey]);

  const stopResize = useCallback(() => {
    const activeSession = resizeSessionRef.current;

    if (!activeSession) {
      return;
    }

    activeSession.cleanup();
    resizeSessionRef.current = null;
    document.body.style.removeProperty("cursor");
    document.body.style.removeProperty("user-select");
  }, []);

  useEffect(() => () => stopResize(), [stopResize]);

  useEffect(
    () =>
      mergeRegister(
        editor.registerCommand(
          CLICK_COMMAND,
          (event) => {
            const figure = figureRef.current;

            if (!(event.target instanceof Node) || !figure?.contains(event.target)) {
              return false;
            }

            event.preventDefault();

            if (event.shiftKey) {
              setSelected(!isSelected);
            } else {
              clearSelection();
              setSelected(true);
            }

            return true;
          },
          COMMAND_PRIORITY_LOW,
        ),
        editor.registerCommand(
          KEY_BACKSPACE_COMMAND,
          (event) => {
            const selection = $getSelection();

            if (!isSelected || !$isNodeSelection(selection)) {
              return false;
            }

            event.preventDefault();
            removeImage();
            return true;
          },
          COMMAND_PRIORITY_LOW,
        ),
        editor.registerCommand(
          KEY_DELETE_COMMAND,
          (event) => {
            const selection = $getSelection();

            if (!isSelected || !$isNodeSelection(selection)) {
              return false;
            }

            event.preventDefault();
            removeImage();
            return true;
          },
          COMMAND_PRIORITY_LOW,
        ),
      ),
    [clearSelection, editor, isSelected, removeImage, setSelected],
  );

  const startResize = useCallback(
    (event: ReactPointerEvent<HTMLSpanElement>, edge: ImageResizeEdge) => {
      event.preventDefault();
      event.stopPropagation();

      stopResize();
      clearSelection();
      setSelected(true);

      const rootWidth =
        editor.getRootElement()?.getBoundingClientRect().width ??
        figureRef.current?.getBoundingClientRect().width ??
        0;

      if (rootWidth <= 0) {
        return;
      }

      const pointerTarget = event.currentTarget;
      const startX = event.clientX;
      const initialWidthPct = widthPct;

      const handlePointerMove = (moveEvent: PointerEvent) => {
        const deltaPx = moveEvent.clientX - startX;
        const signedDeltaPx = edge === "right" ? deltaPx : -deltaPx;
        const nextWidthPct = clampImageWidthPct(
          initialWidthPct + (signedDeltaPx / rootWidth) * 100,
        );

        updateWidthPct(nextWidthPct);
      };

      const handlePointerEnd = () => {
        pointerTarget.releasePointerCapture?.(event.pointerId);
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", handlePointerEnd);
        window.removeEventListener("pointercancel", handlePointerEnd);
        document.body.style.removeProperty("cursor");
        document.body.style.removeProperty("user-select");

        if (resizeSessionRef.current?.cleanup === handlePointerEnd) {
          resizeSessionRef.current = null;
        }
      };

      pointerTarget.setPointerCapture?.(event.pointerId);
      document.body.style.cursor = "ew-resize";
      document.body.style.userSelect = "none";
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerEnd);
      window.addEventListener("pointercancel", handlePointerEnd);
      resizeSessionRef.current = { cleanup: handlePointerEnd };
    },
    [clearSelection, editor, setSelected, stopResize, updateWidthPct, widthPct],
  );

  return (
    <figure
      ref={figureRef}
      className={`admin-rtf__image admin-rtf__image--${layout}${isSelected ? " is-selected" : ""}`}
      data-selected={isSelected ? "true" : undefined}
      onClick={(event) => {
        event.preventDefault();
      }}
      style={{ width: `${widthPct}%` }}
    >
      <div className="admin-rtf__image-frame">
        <img draggable={false} src={src} alt={altText} />
        {isSelected ? (
          <>
            <span className="admin-rtf__image-size">{widthPct}%</span>
            <span
              aria-hidden="true"
              className="admin-rtf__image-handle admin-rtf__image-handle--left"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
              }}
              onPointerDown={(event) => {
                void startResize(event, "left");
              }}
            />
            <span
              aria-hidden="true"
              className="admin-rtf__image-handle admin-rtf__image-handle--right"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
              }}
              onPointerDown={(event) => {
                void startResize(event, "right");
              }}
            />
          </>
        ) : null}
      </div>
    </figure>
  );
}

class ImageNode extends DecoratorNode<JSX.Element> {
  __altText: string;
  __layout: ImageLayout;
  __src: string;
  __widthPct: number;

  static getType() {
    return "image";
  }

  static clone(node: ImageNode) {
    return new ImageNode(node.__src, node.__altText, node.__layout, node.__widthPct, node.__key);
  }

  static importDOM(): DOMConversionMap | null {
    return {
      img: () => ({
        conversion: convertImageElement,
        priority: 1,
      }),
    };
  }

  static importJSON(serializedNode: SerializedImageNode) {
    return $createImageNode({
      altText: serializedNode.altText,
      layout: serializedNode.layout,
      src: serializedNode.src,
      widthPct: serializedNode.widthPct,
    });
  }

  constructor(
    src: string,
    altText = "",
    layout: ImageLayout = defaultImageLayout,
    widthPct = defaultImageWidthPct,
    key?: NodeKey,
  ) {
    super(key);
    this.__src = src;
    this.__altText = altText;
    this.__layout = layout;
    this.__widthPct = clampImageWidthPct(widthPct);
  }

  setAltText(altText: string) {
    const writable = this.getWritable();
    writable.__altText = altText;
  }

  setLayout(layout: ImageLayout) {
    const writable = this.getWritable();
    writable.__layout = layout;
  }

  setWidthPct(widthPct: number) {
    const writable = this.getWritable();
    writable.__widthPct = clampImageWidthPct(widthPct);
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("img");
    element.setAttribute("src", this.__src);
    element.setAttribute("loading", "lazy");
    element.setAttribute("class", `richtext-image richtext-image--${this.__layout}`);
    element.setAttribute("data-layout", this.__layout);
    element.setAttribute("data-width-pct", String(this.__widthPct));
    element.style.width = `${this.__widthPct}%`;

    if (this.__altText) {
      element.setAttribute("alt", this.__altText);
    }

    return { element };
  }

  exportJSON(): SerializedImageNode {
    return {
      ...super.exportJSON(),
      altText: this.__altText,
      layout: this.__layout,
      src: this.__src,
      widthPct: this.__widthPct,
      type: "image",
      version: 2,
    };
  }

  createDOM(): HTMLElement {
    const element = document.createElement("div");
    element.className = "admin-rtf__image-node";
    return element;
  }

  updateDOM(): false {
    return false;
  }

  getTextContent() {
    return "";
  }

  isInline() {
    return false;
  }

  decorate() {
    return (
      <ImageComponent
        altText={this.__altText}
        layout={this.__layout}
        nodeKey={this.__key}
        src={this.__src}
        widthPct={this.__widthPct}
      />
    );
  }
}

const $createImageNode = ({
  altText,
  layout = defaultImageLayout,
  src,
  widthPct = defaultImageWidthPct,
}: InsertImagePayload) => new ImageNode(src, altText, layout, widthPct);
const $isImageNode = (node: LexicalNode | null | undefined): node is ImageNode =>
  node instanceof ImageNode;

function ImagePlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(
    () =>
      editor.registerCommand(
        INSERT_IMAGE_COMMAND,
        ({ altText, src }) => {
          const imageNode = $createImageNode({ altText, src });
          const paragraphNode = $createParagraphNode();
          const selection = $getSelection();

          if ($isRangeSelection(selection)) {
            selection.insertNodes([imageNode, paragraphNode]);
            paragraphNode.select();
            return true;
          }

          $insertNodes([imageNode, paragraphNode]);
          paragraphNode.select();
          return true;
        },
        COMMAND_PRIORITY_EDITOR,
      ),
    [editor],
  );

  return null;
}

function ToolbarPlugin({
  labels,
  mode,
  allowFontSize,
  onImageSelect,
}: {
  labels: Props["labels"];
  mode: EditorMode;
  allowFontSize: boolean;
  onImageSelect: () => void;
}) {
  const [editor] = useLexicalComposerContext();
  const [blockType, setBlockType] = useState<ToolbarBlockType>("paragraph");
  const [canRedo, setCanRedo] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [fontSize, setFontSize] = useState<string>("");
  const [fontFamily, setFontFamily] = useState<string>("");
  const [textColor, setTextColor] = useState<string>("#163c3d");
  const [highlightColor, setHighlightColor] = useState<string>("#faf3e1");
  const [elementAlignment, setElementAlignment] = useState<ElementFormatType>("left");

  const refreshToolbar = useCallback(() => {
    const selection = $getSelection();

    if (!$isRangeSelection(selection)) {
      setIsBold(false);
      setIsItalic(false);
      setIsUnderline(false);
      setIsStrikethrough(false);
      setIsLink(false);
      setBlockType("paragraph");
      setFontSize("");
      setFontFamily("");
      setElementAlignment("left");
      return;
    }

    const anchorNode = selection.anchor.getNode();
    const element =
      anchorNode.getKey() === "root"
        ? anchorNode
        : $isDecoratorNode(anchorNode)
          ? anchorNode.getParentOrThrow()
          : anchorNode.getTopLevelElementOrThrow();
    const nearestBlock = $isListNode(element)
      ? element
      : $getNearestBlockElementAncestorOrThrow(anchorNode);
    const linkNode = selection
      .getNodes()
      .find((node) => $isLinkNode(node) || $isLinkNode(node.getParent()));

    setIsBold(selection.hasFormat("bold"));
    setIsItalic(selection.hasFormat("italic"));
    setIsUnderline(selection.hasFormat("underline"));
    setIsStrikethrough(selection.hasFormat("strikethrough"));
    setIsLink(Boolean(linkNode));
    setFontSize($getSelectionStyleValueForProperty(selection, "font-size", ""));
    setFontFamily($getSelectionStyleValueForProperty(selection, "font-family", ""));
    const currentColor = $getSelectionStyleValueForProperty(selection, "color", "");
    if (currentColor) setTextColor(currentColor);
    const currentBg = $getSelectionStyleValueForProperty(selection, "background-color", "");
    if (currentBg) setHighlightColor(currentBg);
    const blockAlign = $isElementNode(nearestBlock) ? nearestBlock.getFormatType() : "";
    setElementAlignment((blockAlign || "left") as ElementFormatType);

    if ($isListNode(nearestBlock)) {
      setBlockType(nearestBlock.getTag() === "ol" ? "ol" : "ul");
      return;
    }

    if ($isHeadingNode(nearestBlock)) {
      setBlockType(nearestBlock.getTag() === "h3" ? "h3" : "h2");
      return;
    }

    if ($isQuoteNode(nearestBlock)) {
      setBlockType("quote");
      return;
    }

    if ($isParagraphNode(nearestBlock)) {
      setBlockType("paragraph");
    }
  }, []);

  const setBlocks = (nextBlockType: Exclude<ToolbarBlockType, "ul" | "ol">) => {
    editor.update(() => {
      const selection = $getSelection();

      if (!$isRangeSelection(selection)) {
        return;
      }

      if (nextBlockType === "paragraph") {
        $setBlocksType(selection, () => $createParagraphNode());
        return;
      }

      if (nextBlockType === "quote") {
        $setBlocksType(selection, () => $createQuoteNode());
        return;
      }

      $setBlocksType(selection, () => $createHeadingNode(nextBlockType));
    });
  };

  const toggleLink = () => {
    let currentUrl = "https://";

    editor.getEditorState().read(() => {
      const selection = $getSelection();

      if (!$isRangeSelection(selection)) {
        return;
      }

      const currentNode = selection.anchor.getNode();
      const parentNode = currentNode.getParent();
      const linkNode = $isLinkNode(currentNode)
        ? currentNode
        : parentNode && $isLinkNode(parentNode)
          ? parentNode
          : null;

      if (linkNode) {
        currentUrl = linkNode.getURL();
      }
    });

    const nextUrl = window.prompt(labels.link, currentUrl);

    if (nextUrl === null) {
      return;
    }

    const trimmedUrl = nextUrl.trim();

    if (!trimmedUrl) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
      return;
    }

    editor.dispatchCommand(TOGGLE_LINK_COMMAND, normalizeLinkUrl(trimmedUrl));
  };

  // Selection is lost when toolbar controls (select, color picker) take DOM focus.
  // We keep a live snapshot of the editor's range selection so that applyStyle can
  // restore it inside editor.update() before applying inline CSS.
  const savedSelectionRef = useRef<RangeSelection | null>(null);

  const captureSelection = useCallback(() => {
    editor.getEditorState().read(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        savedSelectionRef.current = selection.clone();
      }
    });
  }, [editor]);

  const applyStyle = useCallback(
    (styles: Record<string, string | null>) => {
      editor.update(() => {
        const saved = savedSelectionRef.current;
        if (saved) {
          // Restore saved selection so the style applies to the user's range,
          // not to the empty selection caused by toolbar focus.
          $setSelection(saved.clone());
        }
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return;
        $patchStyleText(selection, styles);
      });
    },
    [editor],
  );

  const setAlignment = useCallback(
    (alignment: ElementFormatType) => {
      editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, alignment);
    },
    [editor],
  );

  useEffect(
    () =>
      mergeRegister(
        editor.registerUpdateListener(({ editorState }) => {
          editorState.read(() => {
            refreshToolbar();
            // Keep a live snapshot of any range selection inside the editor,
            // so toolbar controls that steal DOM focus can still restore it.
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              savedSelectionRef.current = selection.clone();
            }
          });
        }),
        editor.registerCommand(
          SELECTION_CHANGE_COMMAND,
          () => {
            refreshToolbar();
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              savedSelectionRef.current = selection.clone();
            }
            return false;
          },
          COMMAND_PRIORITY_EDITOR,
        ),
        editor.registerCommand(
          CAN_UNDO_COMMAND,
          (payload) => {
            setCanUndo(payload);
            return false;
          },
          COMMAND_PRIORITY_EDITOR,
        ),
        editor.registerCommand(
          CAN_REDO_COMMAND,
          (payload) => {
            setCanRedo(payload);
            return false;
          },
          COMMAND_PRIORITY_EDITOR,
        ),
      ),
    [editor, refreshToolbar],
  );

  return (
    <div className="admin-rtf__toolbar">
      <button
        className={`admin-rtf__button${canUndo ? "" : " is-disabled"}`}
        type="button"
        aria-label={labels.undo ?? "Poništi"}
        title={labels.undo ?? "Poništi"}
        disabled={!canUndo}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
      >
        {buttonSymbols.undo}
      </button>

      <button
        className={`admin-rtf__button${canRedo ? "" : " is-disabled"}`}
        type="button"
        aria-label={labels.redo ?? "Ponovi"}
        title={labels.redo ?? "Ponovi"}
        disabled={!canRedo}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, undefined);
        }}
      >
        {buttonSymbols.redo}
      </button>

      {mode === "full" ? (
        <>
          <button
            className={`admin-rtf__button${blockType === "paragraph" ? " is-active" : ""}`}
            type="button"
            aria-label={labels.paragraph ?? "Paragraf"}
            title={labels.paragraph ?? "Paragraf"}
            onClick={() => setBlocks("paragraph")}
          >
            {buttonSymbols.paragraph}
          </button>

          <button
            className={`admin-rtf__button${blockType === "h2" ? " is-active" : ""}`}
            type="button"
            aria-label={labels.heading2}
            title={labels.heading2}
            onClick={() => setBlocks("h2")}
          >
            {buttonSymbols.heading2}
          </button>

          <button
            className={`admin-rtf__button${blockType === "h3" ? " is-active" : ""}`}
            type="button"
            aria-label={labels.heading3}
            title={labels.heading3}
            onClick={() => setBlocks("h3")}
          >
            {buttonSymbols.heading3}
          </button>
        </>
      ) : null}

      <button
        className={`admin-rtf__button${isBold ? " is-active" : ""}`}
        type="button"
        aria-label={labels.bold}
        title={labels.bold}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        }}
      >
        {buttonSymbols.bold}
      </button>

      <button
        className={`admin-rtf__button${isItalic ? " is-active" : ""}`}
        type="button"
        aria-label={labels.italic}
        title={labels.italic}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        }}
      >
        {buttonSymbols.italic}
      </button>

      <button
        className={`admin-rtf__button${isUnderline ? " is-active" : ""}`}
        type="button"
        aria-label={labels.underline}
        title={labels.underline}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
        }}
      >
        {buttonSymbols.underline}
      </button>

      <button
        className={`admin-rtf__button${isStrikethrough ? " is-active" : ""}`}
        type="button"
        aria-label={labels.strikethrough ?? "Precrtano"}
        title={labels.strikethrough ?? "Precrtano"}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
        }}
      >
        {buttonSymbols.strikethrough}
      </button>

      <span className="admin-rtf__divider" aria-hidden="true" />

      {allowFontSize ? (
        <select
          className="admin-rtf__select"
          aria-label={labels.fontSize ?? "Veličina fonta"}
          title={labels.fontSize ?? "Veličina fonta"}
          value={fontSize}
          onMouseDown={captureSelection}
          onFocus={captureSelection}
          onChange={(event) => {
            const next = event.target.value;
            applyStyle({ "font-size": next || null });
          }}
        >
          <option value="">{labels.fontSize ?? "Veličina"}</option>
          {fontSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      ) : null}

      <select
        className="admin-rtf__select"
        aria-label={labels.fontFamily ?? "Font"}
        title={labels.fontFamily ?? "Font"}
        value={fontFamily}
        onMouseDown={captureSelection}
        onFocus={captureSelection}
        onChange={(event) => {
          const next = event.target.value;
          applyStyle({ "font-family": next || null });
        }}
      >
        {fontFamilyOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <label
        className="admin-rtf__color"
        aria-label={labels.textColor ?? "Boja teksta"}
        title={labels.textColor ?? "Boja teksta"}
        onMouseDown={captureSelection}
      >
        <span className="admin-rtf__color-icon" style={{ color: textColor }}>
          A
        </span>
        <input
          type="color"
          value={textColor}
          onChange={(event) => {
            const next = event.target.value;
            setTextColor(next);
            applyStyle({ color: next });
          }}
        />
      </label>

      <label
        className="admin-rtf__color admin-rtf__color--highlight"
        aria-label={labels.highlightColor ?? "Marker"}
        title={labels.highlightColor ?? "Marker"}
        onMouseDown={captureSelection}
      >
        <span
          className="admin-rtf__color-icon"
          style={{ backgroundColor: highlightColor, color: "#000" }}
        >
          ab
        </span>
        <input
          type="color"
          value={highlightColor}
          onChange={(event) => {
            const next = event.target.value;
            setHighlightColor(next);
            applyStyle({ "background-color": next });
          }}
        />
      </label>

      <span className="admin-rtf__divider" aria-hidden="true" />

      <button
        className={`admin-rtf__button${elementAlignment === "left" ? " is-active" : ""}`}
        type="button"
        aria-label={labels.alignLeft ?? "Levo"}
        title={labels.alignLeft ?? "Poravnaj levo"}
        onClick={() => setAlignment("left")}
      >
        {buttonSymbols.alignLeft}
      </button>

      <button
        className={`admin-rtf__button${elementAlignment === "center" ? " is-active" : ""}`}
        type="button"
        aria-label={labels.alignCenter ?? "Centar"}
        title={labels.alignCenter ?? "Centriraj"}
        onClick={() => setAlignment("center")}
      >
        {buttonSymbols.alignCenter}
      </button>

      <button
        className={`admin-rtf__button${elementAlignment === "right" ? " is-active" : ""}`}
        type="button"
        aria-label={labels.alignRight ?? "Desno"}
        title={labels.alignRight ?? "Poravnaj desno"}
        onClick={() => setAlignment("right")}
      >
        {buttonSymbols.alignRight}
      </button>

      <button
        className={`admin-rtf__button${elementAlignment === "justify" ? " is-active" : ""}`}
        type="button"
        aria-label={labels.alignJustify ?? "Justify"}
        title={labels.alignJustify ?? "Obostrano"}
        onClick={() => setAlignment("justify")}
      >
        {buttonSymbols.alignJustify}
      </button>

      <span className="admin-rtf__divider" aria-hidden="true" />

      {mode === "full" ? (
        <>
          <button
            className={`admin-rtf__button${blockType === "ul" ? " is-active" : ""}`}
            type="button"
            aria-label={labels.bulletList}
            title={labels.bulletList}
            onClick={() => {
              if (blockType === "ul") {
                editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
                return;
              }

              editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
            }}
          >
            {buttonSymbols.bulletList}
          </button>

          <button
            className={`admin-rtf__button${blockType === "ol" ? " is-active" : ""}`}
            type="button"
            aria-label={labels.orderedList}
            title={labels.orderedList}
            onClick={() => {
              if (blockType === "ol") {
                editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
                return;
              }

              editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
            }}
          >
            {buttonSymbols.orderedList}
          </button>

          <button
            className={`admin-rtf__button${blockType === "quote" ? " is-active" : ""}`}
            type="button"
            aria-label={labels.quote}
            title={labels.quote}
            onClick={() => setBlocks("quote")}
          >
            {buttonSymbols.quote}
          </button>
        </>
      ) : null}

      <button
        className={`admin-rtf__button${isLink ? " is-active" : ""}`}
        type="button"
        aria-label={labels.link}
        title={labels.link}
        onClick={toggleLink}
      >
        {buttonSymbols.link}
      </button>

      <button
        className={`admin-rtf__button${isLink ? "" : " is-disabled"}`}
        type="button"
        aria-label={labels.removeLink ?? "Ukloni link"}
        title={labels.removeLink ?? "Ukloni link"}
        disabled={!isLink}
        onClick={() => {
          editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
        }}
      >
        {buttonSymbols.unlink}
      </button>

      {mode === "full" ? (
        <button
          className="admin-rtf__button"
          type="button"
          aria-label={labels.image}
          title={labels.image}
          onClick={onImageSelect}
        >
          {buttonSymbols.image}
        </button>
      ) : null}
    </div>
  );
}

function AdminRichTextEditor({
  labels,
  mode,
  allowFontSize,
  onValueChange,
  uploadFolder,
  uploadUrl,
}: {
  labels: Props["labels"];
  mode: EditorMode;
  allowFontSize: boolean;
  onValueChange: (value: string) => void;
  uploadFolder: string;
  uploadUrl: string;
}) {
  const [editor] = useLexicalComposerContext();
  const sourceId = useId();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const shouldAutoSaveImageRef = useRef(false);
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const uploadImage = useCallback(
    async (file: File) => {
      const preparedFile = await compressImageToMaxSize(file, imageMaxBytes);
      const formData = new FormData();
      formData.append("file", preparedFile);
      formData.append("folder", uploadFolder);

      const data = await uploadWithProgress<{ url?: string }>({
        formData,
        url: uploadUrl,
        onProgress: (percent) => {
          setUploadProgress(percent);
        },
      });

      if (!data.url) {
        throw new Error("Upload failed");
      }

      return data.url;
    },
    [uploadFolder, uploadUrl],
  );

  useEffect(() => {
    const form = rootRef.current?.closest("form");

    if (!(form instanceof HTMLFormElement)) {
      return;
    }

    form.dispatchEvent(
      new CustomEvent("admin:pending-media", {
        detail: { active: isUploading, sourceId },
      }),
    );

    return () => {
      form.dispatchEvent(
        new CustomEvent("admin:pending-media", {
          detail: { active: false, sourceId },
        }),
      );
    };
  }, [isUploading, sourceId]);

  return (
    <div ref={rootRef}>
      <ToolbarPlugin
        labels={labels}
        mode={mode}
        allowFontSize={allowFontSize}
        onImageSelect={() => {
          fileInputRef.current?.click();
        }}
      />

      <div className="admin-rtf__editor-shell">
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              className={`admin-rtf__editor${mode === "inline" ? " admin-rtf__editor--inline" : ""}`}
            />
          }
          placeholder={
            <div className="admin-rtf__placeholder">
              {labels.placeholder ?? "Unesite sadržaj..."}
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
      </div>

      <HistoryPlugin />
      {mode === "full" ? <ListPlugin /> : null}
      <LinkPlugin
        validateUrl={(url) => /^(https?:\/\/|mailto:|tel:)/i.test(normalizeLinkUrl(url))}
      />
      {mode === "full" ? <ImagePlugin /> : null}
      <OnChangePlugin
        onChange={(editorState, activeEditor) => {
          editorState.read(() => {
            onValueChange(normalizeEditorHtml($generateHtmlFromNodes(activeEditor, null), mode));

            if (!shouldAutoSaveImageRef.current) {
              return;
            }

            const form = rootRef.current?.closest("form");

            shouldAutoSaveImageRef.current = false;

            if (!(form instanceof HTMLFormElement)) {
              return;
            }

            form.dispatchEvent(
              new CustomEvent("admin:auto-save-media", {
                detail: { sourceId },
              }),
            );
          });
        }}
      />

      {mode === "full" ? (
        <input
          ref={fileInputRef}
          type="file"
          accept={imageMimeAccept}
          hidden
          onChange={(event) => {
            const file = event.target.files?.[0];

            if (!file) {
              event.currentTarget.value = "";
              return;
            }

            setIsUploading(true);
            setUploadProgress(0);
            setError("");

            void uploadImage(file)
              .then((url) => {
                const suggestedAltText = file.name.replace(/\.[^.]+$/, "");
                const altText =
                  window.prompt(labels.image, suggestedAltText)?.trim() ?? suggestedAltText;

                shouldAutoSaveImageRef.current = true;
                editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
                  altText,
                  src: url,
                });
              })
              .catch(() => {
                setError(labels.uploadFailed);
              })
              .finally(() => {
                setIsUploading(false);
                setUploadProgress((current) => (current === 100 ? current : null));
                event.currentTarget.value = "";
              });
          }}
        />
      ) : null}

      {mode === "full" && uploadProgress !== null ? (
        <div className="admin-upload-progress" aria-live="polite">
          <div className="admin-upload-progress__track">
            <div className="admin-upload-progress__bar" style={{ width: `${uploadProgress}%` }} />
          </div>
        </div>
      ) : null}
      {mode === "full" && isUploading ? (
        <p className="admin-rtf__status">Upload u toku... {uploadProgress ?? 0}%</p>
      ) : null}
      {error ? <p className="admin-rtf__error">{error}</p> : null}
    </div>
  );
}

export function AdminRichTextField({
  name,
  initialValue,
  mode = "full",
  allowFontSize = true,
  uploadUrl,
  uploadFolder = "blog",
  labels,
  onValueChange,
}: Props) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    onValueChange?.(value);
  }, [value, onValueChange]);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const initialConfig = useMemo(
    () => ({
      namespace: `admin-rich-text-${name}`,
      nodes: [
        HeadingNode,
        QuoteNode,
        ListNode,
        ListItemNode,
        LinkNode,
        ImageNode,
        SpanStyleImporterNode,
      ],
      onError: (editorError: Error) => {
        // Don't rethrow: an uncaught error here would unmount this field's React
        // island, silently freezing its value while the rest of the form (and its
        // other RTF fields) keeps working. Log it and keep the editor usable.
        console.error(editorError);
      },
      theme: editorTheme,
      editorState:
        canUseDomParser() && getInitialEditorHtml(initialValue, mode)
          ? (editor: LexicalEditor) => {
              const dom = new DOMParser().parseFromString(
                getInitialEditorHtml(initialValue, mode),
                "text/html",
              );
              const nodes = $generateNodesFromDOM(editor, dom);
              appendImportedNodesToRoot(nodes);
            }
          : undefined,
    }),
    [initialValue, mode, name],
  );

  useEffect(() => {
    const form = rootRef.current?.closest("form");

    if (!(form instanceof HTMLFormElement)) {
      return;
    }

    form.dispatchEvent(new CustomEvent("admin:form-value-change"));
  }, [value]);

  return (
    <div ref={rootRef} className="admin-rtf">
      <LexicalComposer initialConfig={initialConfig}>
        <AdminRichTextEditor
          labels={labels}
          mode={mode}
          allowFontSize={allowFontSize}
          onValueChange={setValue}
          uploadUrl={uploadUrl}
          uploadFolder={uploadFolder}
        />
      </LexicalComposer>

      <textarea name={name} value={value} readOnly hidden />
    </div>
  );
}
