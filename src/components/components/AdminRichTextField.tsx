import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import type { JSX } from "react";
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
import { uploadWithProgress } from "@/lib/http/upload-with-progress";
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
  $isQuoteNode,
  HeadingNode,
  QuoteNode,
} from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { $getNearestBlockElementAncestorOrThrow, mergeRegister } from "@lexical/utils";
import {
  $createParagraphNode,
  $getNodeByKey,
  $getRoot,
  $getSelection,
  $insertNodes,
  $isDecoratorNode,
  $isParagraphNode,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  DecoratorNode,
  FORMAT_TEXT_COMMAND,
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
  };
};

type Props = AdminRichTextFieldProps;
type EditorMode = NonNullable<Props["mode"]>;
type ToolbarBlockType = "paragraph" | "h2" | "h3" | "quote" | "ul" | "ol";
type ImageLayout = "center" | "wide" | "full" | "wrap-left" | "wrap-right";
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
} as const;
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

const normalizeFullEditorHtml = (value: string) => {
  const html = value.trim();

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

    const segment = node.tagName === "P" ? node.innerHTML.trim() : node.outerHTML.trim();

    if (segment && segment !== "<br>" && segment !== "<br />") {
      segments.push(segment);
    }
  }

  return segments.join("<br />").trim();
};

const normalizeEditorHtml = (value: string, mode: EditorMode) =>
  mode === "inline" ? normalizeInlineEditorHtml(value) : normalizeFullEditorHtml(value);

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
        return Number.isFinite(parsedWidth) ? clampImageWidthPct(parsedWidth) : defaultImageWidthPct;
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

  return (
    <figure
      className={`admin-rtf__image admin-rtf__image--${layout}`}
      style={{ width: `${widthPct}%` }}
    >
      <img src={src} alt={altText} />
      <div className="admin-rtf__image-controls">
        <label className="admin-rtf__image-control admin-rtf__image-control--full">
          <span>Alt</span>
          <input
            className="input-control"
            type="text"
            value={altText}
            onChange={(event) => {
              const nextValue = event.target.value;

              editor.update(() => {
                const node = $getNodeByKey(nodeKey);

                if ($isImageNode(node)) {
                  node.setAltText(nextValue);
                }
              });
            }}
          />
        </label>

        <label className="admin-rtf__image-control">
          <span>Layout</span>
          <select
            className="input-control"
            value={layout}
            onChange={(event) => {
              const nextLayout = event.target.value as ImageLayout;

              editor.update(() => {
                const node = $getNodeByKey(nodeKey);

                if ($isImageNode(node)) {
                  node.setLayout(nextLayout);
                }
              });
            }}
          >
            <option value="center">Centar</option>
            <option value="wide">Široko</option>
            <option value="full">Puna širina</option>
            <option value="wrap-left">Levo uz tekst</option>
            <option value="wrap-right">Desno uz tekst</option>
          </select>
        </label>

        <label className="admin-rtf__image-control">
          <span>Širina {widthPct}%</span>
          <input
            type="range"
            min="25"
            max="100"
            step="5"
            value={widthPct}
            onChange={(event) => {
              const nextWidth = clampImageWidthPct(Number(event.target.value));

              editor.update(() => {
                const node = $getNodeByKey(nodeKey);

                if ($isImageNode(node)) {
                  node.setWidthPct(nextWidth);
                }
              });
            }}
          />
        </label>

        <button
          className="admin-rtf__image-remove"
          type="button"
          onClick={() => {
            editor.update(() => {
              const node = $getNodeByKey(nodeKey);

              if ($isImageNode(node)) {
                node.remove();
              }
            });
          }}
        >
          Remove
        </button>
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
  onImageSelect,
}: {
  labels: Props["labels"];
  mode: EditorMode;
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

  const refreshToolbar = useCallback(() => {
    const selection = $getSelection();

    if (!$isRangeSelection(selection)) {
      setIsBold(false);
      setIsItalic(false);
      setIsUnderline(false);
      setIsStrikethrough(false);
      setIsLink(false);
      setBlockType("paragraph");
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

  useEffect(
    () =>
      mergeRegister(
        editor.registerUpdateListener(({ editorState }) => {
          editorState.read(() => {
            refreshToolbar();
          });
        }),
        editor.registerCommand(
          SELECTION_CHANGE_COMMAND,
          () => {
            refreshToolbar();
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
  onValueChange,
  uploadFolder,
  uploadUrl,
}: {
  labels: Props["labels"];
  mode: EditorMode;
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
  uploadUrl,
  uploadFolder = "blog",
  labels,
}: Props) {
  const [value, setValue] = useState(initialValue);
  const initialConfig = useMemo(
    () => ({
      namespace: `admin-rich-text-${name}`,
      nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, LinkNode, ImageNode],
      onError: (editorError: Error) => {
        throw editorError;
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
              const root = $getRoot();

              root.clear();
              root.append(...nodes);

              if (root.getChildrenSize() === 0) {
                root.append($createParagraphNode());
              }
            }
          : undefined,
    }),
    [initialValue, mode, name],
  );

  return (
    <div className="admin-rtf">
      <LexicalComposer initialConfig={initialConfig}>
        <AdminRichTextEditor
          labels={labels}
          mode={mode}
          onValueChange={setValue}
          uploadUrl={uploadUrl}
          uploadFolder={uploadFolder}
        />
      </LexicalComposer>

      <textarea name={name} value={value} readOnly hidden />
    </div>
  );
}
