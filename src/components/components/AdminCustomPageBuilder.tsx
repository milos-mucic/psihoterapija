import { useCallback, useId, useMemo, useRef, useState } from "react";
import { AdminRichTextField } from "@/components/components/AdminRichTextField";
import type { AdminRichTextFieldProps } from "@/components/components/AdminRichTextField";
import type {
  CustomPageBlock,
  CustomPageBlockType,
  CustomPageStatus,
  HeroBlockData,
  ImageBlockData,
  RichTextBlockData,
  CtaBlockData,
} from "@/features/custom-pages/types/custom-page.types";
import type { SiteLocale } from "@/lib/config/site";

const RTF_LABELS: AdminRichTextFieldProps["labels"] = {
  bold: "Bold",
  italic: "Italic",
  underline: "Underline",
  heading2: "Heading 2",
  heading3: "Heading 3",
  bulletList: "Lista",
  orderedList: "Numerisana lista",
  quote: "Citat",
  link: "Link",
  image: "Slika",
  clear: "Ukloni format",
  uploadFailed: "Upload slike nije uspeo.",
  fontSize: "Veličina fonta",
  fontFamily: "Font",
  textColor: "Boja teksta",
  highlightColor: "Marker (pozadina)",
  alignLeft: "Poravnaj levo",
  alignCenter: "Centriraj",
  alignRight: "Poravnaj desno",
  alignJustify: "Obostrano poravnanje",
};

type RichTextProps = {
  blockId: string;
  field: string;
  value: string;
  onChange: (html: string) => void;
  mode?: "full" | "inline";
};

function BlockRichText({ blockId, field, value, onChange, mode = "full" }: RichTextProps) {
  const stable = useRef(value);
  const handleChange = useCallback(
    (html: string) => {
      if (html === stable.current) return;
      stable.current = html;
      onChange(html);
    },
    [onChange],
  );
  return (
    <AdminRichTextField
      name={`rtf-${blockId}-${field}`}
      initialValue={value}
      uploadUrl="/api/admin/media/upload"
      uploadFolder="pages"
      mode={mode}
      labels={RTF_LABELS}
      onValueChange={handleChange}
    />
  );
}

type Props = {
  pageId?: string;
  initial: {
    slug: string;
    locale: SiteLocale;
    title: string;
    description: string;
    blocks: CustomPageBlock[];
    status: CustomPageStatus;
  };
  action: string;
  mode: "create" | "edit";
};

const BLOCK_LABEL: Record<CustomPageBlockType, string> = {
  hero: "Hero",
  richtext: "Rich text",
  image: "Slika",
  cta: "CTA dugme",
};

const BLOCK_DESC: Record<CustomPageBlockType, string> = {
  hero: "Naslovni banner sa eyebrow, naslovom, podtekstom i opcionalnom slikom + CTA.",
  richtext: "Sloboda formatirani tekst — naslovi, paragrafi, liste.",
  image: "Pojedinačna slika ili slika sa tekstom kraj nje.",
  cta: "Poziv na akciju — naslov + dugme.",
};

const newBlockData = (type: CustomPageBlockType): CustomPageBlock["data"] => {
  switch (type) {
    case "hero":
      return { eyebrow: "", title: "", subtitle: "", image: "", ctaLabel: "", ctaHref: "", align: "left" } as HeroBlockData;
    case "richtext":
      return { html: "" } as RichTextBlockData;
    case "image":
      return { src: "", alt: "", layout: "full", title: "", text: "", caption: "" } as ImageBlockData;
    case "cta":
      return { eyebrow: "", title: "", copy: "", buttonLabel: "", buttonHref: "", variant: "light" } as CtaBlockData;
  }
};

const randomId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `blk-${Math.random().toString(36).slice(2, 11)}`;

export function AdminCustomPageBuilder({ pageId, initial, action, mode }: Props) {
  const formId = useId();
  const [slug, setSlug] = useState(initial.slug);
  const [locale, setLocale] = useState(initial.locale);
  const [title, setTitle] = useState(initial.title);
  const [description, setDescription] = useState(initial.description);
  const [status, setStatus] = useState<CustomPageStatus>(initial.status);
  const [blocks, setBlocks] = useState<CustomPageBlock[]>(initial.blocks);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const payload = useMemo(
    () => JSON.stringify({ slug, locale, title, description, blocks, status }),
    [slug, locale, title, description, blocks, status],
  );

  const updateBlock = (id: string, patch: Partial<CustomPageBlock["data"]>) => {
    setBlocks((bs) =>
      bs.map((b) => (b.id === id ? ({ ...b, data: { ...b.data, ...patch } } as CustomPageBlock) : b)),
    );
  };

  const moveBlock = (id: string, dir: -1 | 1) => {
    setBlocks((bs) => {
      const idx = bs.findIndex((b) => b.id === id);
      if (idx < 0) return bs;
      const target = idx + dir;
      if (target < 0 || target >= bs.length) return bs;
      const copy = [...bs];
      [copy[idx], copy[target]] = [copy[target], copy[idx]];
      return copy;
    });
  };

  const removeBlock = (id: string) => {
    if (!confirm("Obrisati ovaj blok?")) return;
    setBlocks((bs) => bs.filter((b) => b.id !== id));
  };

  const addBlock = (type: CustomPageBlockType) => {
    setBlocks((bs) => [
      ...bs,
      { id: randomId(), type, data: newBlockData(type) } as CustomPageBlock,
    ]);
    setAddOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const response = await fetch(action, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        redirect: "follow",
      });
      if (response.redirected) {
        window.location.href = response.url;
        return;
      }
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setError(data?.message ?? "Greška pri snimanju.");
        setSaving(false);
        return;
      }
      // Unexpected 2xx without redirect — fall back
      if (mode === "create") {
        // server should have redirected; reload
        window.location.reload();
      }
    } catch {
      setError("Greška u komunikaciji sa serverom.");
      setSaving(false);
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>, onUrl: (url: string) => void) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    try {
      const response = await fetch("/api/admin/media/upload", { method: "POST", body: fd });
      if (!response.ok) {
        alert("Upload nije uspeo.");
        return;
      }
      const data = (await response.json()) as { url?: string };
      if (data?.url) onUrl(data.url);
    } catch {
      alert("Greška pri uploadu.");
    } finally {
      event.target.value = "";
    }
  };

  return (
    <form id={formId} onSubmit={handleSubmit} className="cpb">
      <header className="cpb__head">
        <div className="cpb__head-fields">
          <label className="cpb__field">
            <span>Naslov stranice *</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="npr. O našem timu"
            />
          </label>
          <label className="cpb__field">
            <span>URL slug *</span>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              placeholder="npr. o-nasem-timu (bez leading /)"
              disabled={mode === "edit"}
            />
            <small>Javni URL: <code>{locale === "sr-cyrl" ? "/cir/" : "/"}{slug || "..."}</code></small>
          </label>
          <label className="cpb__field cpb__field--row">
            <span>Pismo *</span>
            <select value={locale} onChange={(e) => setLocale(e.target.value as SiteLocale)} disabled={mode === "edit"}>
              <option value="sr-latn">Latinica</option>
              <option value="sr-cyrl">Ћирилица</option>
            </select>
          </label>
          <label className="cpb__field cpb__field--row">
            <span>Status</span>
            <select value={status} onChange={(e) => setStatus(e.target.value as CustomPageStatus)}>
              <option value="draft">Skica (sakriveno)</option>
              <option value="published">Objavljeno (vidljivo)</option>
            </select>
          </label>
        </div>
        <label className="cpb__field cpb__field--full">
          <span>Opis (SEO meta description, opciono)</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Kratak opis koji se pojavljuje u pretraživačima."
          />
        </label>
      </header>

      <div className="cpb__blocks">
        {blocks.length === 0 ? (
          <div className="cpb__empty">
            <div className="cpb__empty-title">Stranica nema blokove</div>
            <p>Dodaj prvi blok ispod da bi stranica imala sadržaj.</p>
          </div>
        ) : (
          blocks.map((block, idx) => (
            <BlockEditor
              key={block.id}
              block={block}
              index={idx}
              total={blocks.length}
              onChange={(patch) => updateBlock(block.id, patch)}
              onMove={(dir) => moveBlock(block.id, dir)}
              onRemove={() => removeBlock(block.id)}
              onUpload={(onUrl) => fileInputRef.current && (fileInputRef.current.onchange = (e: any) => handleUpload(e, onUrl)) && fileInputRef.current.click()}
            />
          ))
        )}
      </div>

      <div className="cpb__add">
        <button type="button" className="cpb__add-btn" onClick={() => setAddOpen((v) => !v)}>
          {addOpen ? "Zatvori" : "+ Dodaj blok"}
        </button>
        {addOpen && (
          <div className="cpb__add-options">
            {(["hero", "richtext", "image", "cta"] as const).map((t) => (
              <button key={t} type="button" className="cpb__add-option" onClick={() => addBlock(t)}>
                <strong>{BLOCK_LABEL[t]}</strong>
                <span>{BLOCK_DESC[t]}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {error && <div className="cpb__error">{error}</div>}

      <div className="cpb__save-bar">
        {pageId && (
          <a className="cpb__save-secondary" href={`${locale === "sr-cyrl" ? "/cir/" : "/"}${slug}/`} target="_blank" rel="noreferrer">
            Otvori javnu stranicu ↗
          </a>
        )}
        <button type="submit" disabled={saving} className="cpb__save">
          {saving ? "Snimam..." : mode === "create" ? "Kreiraj stranicu" : "Sačuvaj"}
        </button>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} />
    </form>
  );
}

/* ------- BLOCK EDITORS ------- */

type BlockEditorProps<B extends CustomPageBlock = CustomPageBlock> = {
  block: B;
  index: number;
  total: number;
  onChange: (patch: Partial<B["data"]>) => void;
  onMove: (dir: -1 | 1) => void;
  onRemove: () => void;
  onUpload: (onUrl: (url: string) => void) => void;
};

function BlockEditor(props: BlockEditorProps) {
  const { block, index, total, onMove, onRemove } = props;
  return (
    <details className="cpb-block" open>
      <summary className="cpb-block__head">
        <span className="cpb-block__chevron">▸</span>
        <span className="cpb-block__type">{BLOCK_LABEL[block.type]}</span>
        <span className="cpb-block__preview">{previewLabel(block)}</span>
        <div className="cpb-block__actions">
          <button type="button" disabled={index === 0} onClick={() => onMove(-1)} aria-label="Pomeri gore">↑</button>
          <button type="button" disabled={index === total - 1} onClick={() => onMove(1)} aria-label="Pomeri dole">↓</button>
          <button type="button" onClick={onRemove} aria-label="Obriši">✕</button>
        </div>
      </summary>
      <div className="cpb-block__body">
        {block.type === "hero" && <HeroEditor {...(props as BlockEditorProps<Extract<CustomPageBlock, { type: "hero" }>>)} />}
        {block.type === "richtext" && <RichTextEditor {...(props as BlockEditorProps<Extract<CustomPageBlock, { type: "richtext" }>>)} />}
        {block.type === "image" && <ImageEditor {...(props as BlockEditorProps<Extract<CustomPageBlock, { type: "image" }>>)} />}
        {block.type === "cta" && <CtaEditor {...(props as BlockEditorProps<Extract<CustomPageBlock, { type: "cta" }>>)} />}
      </div>
    </details>
  );
}

function previewLabel(block: CustomPageBlock): string {
  switch (block.type) {
    case "hero":
      return block.data.title || "(prazan)";
    case "richtext": {
      const text = (block.data.html || "").replace(/<[^>]+>/g, "").trim();
      return text ? text.slice(0, 60) + (text.length > 60 ? "…" : "") : "(prazan)";
    }
    case "image":
      return block.data.src ? block.data.src.split("/").pop() ?? "" : "(bez slike)";
    case "cta":
      return block.data.title || "(prazan)";
  }
}

function HeroEditor({ block, onChange, onUpload }: BlockEditorProps<Extract<CustomPageBlock, { type: "hero" }>>) {
  const { data } = block;
  return (
    <div className="cpb-grid">
      <label className="cpb-grid__field"><span>Eyebrow</span>
        <input value={data.eyebrow ?? ""} onChange={(e) => onChange({ eyebrow: e.target.value })} placeholder="npr. O NAMA" />
      </label>
      <label className="cpb-grid__field"><span>Naslov *</span>
        <input value={data.title} onChange={(e) => onChange({ title: e.target.value })} required />
      </label>
      <div className="cpb-grid__field cpb-grid__field--full"><span>Podtekst</span>
        <BlockRichText
          blockId={block.id}
          field="subtitle"
          value={data.subtitle ?? ""}
          mode="inline"
          onChange={(html) => onChange({ subtitle: html })}
        />
      </div>
      <label className="cpb-grid__field cpb-grid__field--full"><span>Slika (URL)</span>
        <div className="cpb-grid__upload">
          {data.image && <img src={data.image} alt="" />}
          <input value={data.image ?? ""} onChange={(e) => onChange({ image: e.target.value })} placeholder="https://…" />
          <button type="button" onClick={() => onUpload((url) => onChange({ image: url }))}>Upload</button>
        </div>
      </label>
      <label className="cpb-grid__field"><span>CTA labela</span>
        <input value={data.ctaLabel ?? ""} onChange={(e) => onChange({ ctaLabel: e.target.value })} placeholder="npr. Zakaži termin" />
      </label>
      <label className="cpb-grid__field"><span>CTA link</span>
        <input value={data.ctaHref ?? ""} onChange={(e) => onChange({ ctaHref: e.target.value })} placeholder="/kontakt/" />
      </label>
      <label className="cpb-grid__field"><span>Poravnanje</span>
        <select value={data.align ?? "left"} onChange={(e) => onChange({ align: e.target.value as "left" | "center" })}>
          <option value="left">Levo</option>
          <option value="center">Centar</option>
        </select>
      </label>
    </div>
  );
}

function RichTextEditor({ block, onChange }: BlockEditorProps<Extract<CustomPageBlock, { type: "richtext" }>>) {
  const { data } = block;
  return (
    <div className="cpb-grid">
      <div className="cpb-grid__field cpb-grid__field--full">
        <span>Sadržaj</span>
        <BlockRichText
          blockId={block.id}
          field="html"
          value={data.html}
          mode="full"
          onChange={(html) => onChange({ html })}
        />
        <small>Naslovi, paragrafi, liste, linkovi i slike — toolbar iznad polja.</small>
      </div>
    </div>
  );
}

function ImageEditor({ block, onChange, onUpload }: BlockEditorProps<Extract<CustomPageBlock, { type: "image" }>>) {
  const { data } = block;
  return (
    <div className="cpb-grid">
      <label className="cpb-grid__field cpb-grid__field--full"><span>Slika (URL) *</span>
        <div className="cpb-grid__upload">
          {data.src && <img src={data.src} alt="" />}
          <input value={data.src} onChange={(e) => onChange({ src: e.target.value })} required />
          <button type="button" onClick={() => onUpload((url) => onChange({ src: url }))}>Upload</button>
        </div>
      </label>
      <label className="cpb-grid__field"><span>Alt tekst</span>
        <input value={data.alt ?? ""} onChange={(e) => onChange({ alt: e.target.value })} placeholder="opis slike za pristupačnost" />
      </label>
      <label className="cpb-grid__field"><span>Layout</span>
        <select value={data.layout} onChange={(e) => onChange({ layout: e.target.value as ImageBlockData["layout"] })}>
          <option value="full">Cela širina</option>
          <option value="side-text-right">Slika levo, tekst desno</option>
          <option value="side-text-left">Tekst levo, slika desno</option>
        </select>
      </label>
      {data.layout !== "full" && (
        <>
          <label className="cpb-grid__field cpb-grid__field--full"><span>Naslov uz sliku</span>
            <input value={data.title ?? ""} onChange={(e) => onChange({ title: e.target.value })} />
          </label>
          <div className="cpb-grid__field cpb-grid__field--full"><span>Tekst uz sliku</span>
            <BlockRichText
              blockId={block.id}
              field="text"
              value={data.text ?? ""}
              mode="inline"
              onChange={(html) => onChange({ text: html })}
            />
          </div>
        </>
      )}
      <label className="cpb-grid__field cpb-grid__field--full"><span>Caption (sitni opis ispod)</span>
        <input value={data.caption ?? ""} onChange={(e) => onChange({ caption: e.target.value })} />
      </label>
    </div>
  );
}

function CtaEditor({ block, onChange }: BlockEditorProps<Extract<CustomPageBlock, { type: "cta" }>>) {
  const { data } = block;
  return (
    <div className="cpb-grid">
      <label className="cpb-grid__field"><span>Eyebrow</span>
        <input value={data.eyebrow ?? ""} onChange={(e) => onChange({ eyebrow: e.target.value })} />
      </label>
      <label className="cpb-grid__field"><span>Naslov *</span>
        <input value={data.title} onChange={(e) => onChange({ title: e.target.value })} required />
      </label>
      <div className="cpb-grid__field cpb-grid__field--full"><span>Tekst</span>
        <BlockRichText
          blockId={block.id}
          field="copy"
          value={data.copy ?? ""}
          mode="inline"
          onChange={(html) => onChange({ copy: html })}
        />
      </div>
      <label className="cpb-grid__field"><span>Labela dugmeta *</span>
        <input value={data.buttonLabel} onChange={(e) => onChange({ buttonLabel: e.target.value })} required placeholder="npr. Zakaži" />
      </label>
      <label className="cpb-grid__field"><span>Link dugmeta *</span>
        <input value={data.buttonHref} onChange={(e) => onChange({ buttonHref: e.target.value })} required placeholder="/zakazivanje/" />
      </label>
      <label className="cpb-grid__field"><span>Pozadina</span>
        <select value={data.variant} onChange={(e) => onChange({ variant: e.target.value as "light" | "dark" })}>
          <option value="light">Svetla (cream)</option>
          <option value="dark">Tamna (teal)</option>
        </select>
      </label>
    </div>
  );
}
