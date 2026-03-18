import { useMemo, useRef, useState } from "react";

type Props = {
  name: string;
  initialValue: string;
  uploadUrl: string;
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
  };
};

const buttonSymbols = {
  bold: "B",
  italic: "I",
  underline: "U",
  heading2: "H2",
  heading3: "H3",
  bulletList: "*",
  orderedList: "1.",
  quote: "\"",
  link: "Lk",
  image: "Img",
  clear: "X",
} as const;

export function AdminRichTextField({ name, initialValue, uploadUrl, labels }: Props) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState("");
  const imageMimeAccept = "image/*"; // i18n-exempt
  // i18n-exempt
  const blockquoteTag = "<blockquote>";

  const toolset = useMemo(
    () => [
      {
        key: "bold",
        label: labels.bold,
        symbol: buttonSymbols.bold,
        action: () => document.execCommand("bold", false),
      },
      {
        key: "italic",
        label: labels.italic,
        symbol: buttonSymbols.italic,
        action: () => document.execCommand("italic", false),
      },
      {
        key: "underline",
        label: labels.underline,
        symbol: buttonSymbols.underline,
        action: () => document.execCommand("underline", false),
      },
      {
        key: "heading2",
        label: labels.heading2,
        symbol: buttonSymbols.heading2,
        action: () => document.execCommand("formatBlock", false, "<h2>"),
      },
      {
        key: "heading3",
        label: labels.heading3,
        symbol: buttonSymbols.heading3,
        action: () => document.execCommand("formatBlock", false, "<h3>"),
      },
      {
        key: "bulletList",
        label: labels.bulletList,
        symbol: buttonSymbols.bulletList,
        action: () => document.execCommand("insertUnorderedList", false),
      },
      {
        key: "orderedList",
        label: labels.orderedList,
        symbol: buttonSymbols.orderedList,
        action: () => document.execCommand("insertOrderedList", false),
      },
      {
        key: "quote",
        label: labels.quote,
        symbol: buttonSymbols.quote,
        action: () => document.execCommand("formatBlock", false, blockquoteTag),
      },
      {
        key: "link",
        label: labels.link,
        symbol: buttonSymbols.link,
        action: () => {
          const url = window.prompt("", "https://")?.trim();

          if (!url) {
            return;
          }

          document.execCommand("createLink", false, url);
        },
      },
      {
        key: "clear",
        label: labels.clear,
        symbol: buttonSymbols.clear,
        action: () => document.execCommand("removeFormat", false),
      },
    ],
    [labels],
  );

  const syncValue = () => {
    const html = editorRef.current?.innerHTML ?? "";
    setValue(html);
  };

  const runAction = (action: () => void) => {
    editorRef.current?.focus();
    action();
    syncValue();
  };

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      setError("");
      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        setError(labels.uploadFailed);
        return;
      }

      const data = (await response.json()) as { url?: string };

      if (!data.url) {
        setError(labels.uploadFailed);
        return;
      }

      editorRef.current?.focus();
      document.execCommand("insertImage", false, data.url);
      syncValue();
    } catch {
      setError(labels.uploadFailed);
    }
  };

  return (
    <div className="admin-rtf">
      <div className="admin-rtf__toolbar">
        {toolset.map((tool) => (
          <button
            key={tool.key}
            className="admin-rtf__button"
            type="button"
            aria-label={tool.label}
            title={tool.label}
            onClick={() => runAction(tool.action)}
          >
            {tool.symbol}
          </button>
        ))}

        <button
          className="admin-rtf__button"
          type="button"
          aria-label={labels.image}
          title={labels.image}
          onClick={() => fileInputRef.current?.click()}
        >
          {buttonSymbols.image}
        </button>
      </div>

      <div
        ref={editorRef}
        className="admin-rtf__editor"
        contentEditable
        suppressContentEditableWarning
        onInput={syncValue}
        dangerouslySetInnerHTML={{ __html: initialValue }}
      />

      <textarea name={name} value={value} readOnly hidden />

      <input
        ref={fileInputRef}
        type="file"
        accept={imageMimeAccept}
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0];

          if (file) {
            void handleUpload(file);
          }

          event.currentTarget.value = "";
        }}
      />

      {error ? <p className="admin-rtf__error">{error}</p> : null}
    </div>
  );
}
