import { useCallback, useEffect, useId, useRef, useState } from "react";
import Uppy from "@uppy/core";
import type { UppyFile } from "@uppy/core";
import ImageEditor from "@uppy/image-editor";
import Dashboard from "@uppy/react/dashboard";
import { uploadWithProgress } from "@/lib/http/upload-with-progress";

import "@uppy/core/css/style.min.css";
import "@uppy/dashboard/css/style.min.css";
import "@uppy/image-editor/css/style.min.css";

type Props = {
  name: string;
  label: string;
  initialValue: string;
  uploadUrl: string;
  uploadFolder?: string;
  accept?: string;
  uploadLabel?: string;
  helpText?: string;
};

const defaultImageAccept = "image/*";
const imageMaxBytes = 1_000_000;
const imageScales = [1, 0.92, 0.84, 0.76, 0.68];
const imageQualities = [0.92, 0.84, 0.76, 0.68, 0.6, 0.52, 0.44];

const fileFromUppy = (file: UppyFile<Record<string, never>, Record<string, never>>) => {
  if (file.data instanceof File) {
    return file.data;
  }

  return new File([file.data], file.name ?? "image", {
    type: file.type ?? "application/octet-stream",
  });
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

export function AdminMediaField({
  name,
  label,
  initialValue,
  uploadUrl,
  uploadFolder = "media",
  accept = defaultImageAccept,
  uploadLabel = "Upload",
  helpText,
}: Props) {
  const inputId = useId();
  const previewId = `${inputId}-preview`;
  const rootRef = useRef<HTMLDivElement | null>(null);
  const shouldAutoSaveImageRef = useRef(false);
  const [value, setValue] = useState(initialValue);
  const [status, setStatus] = useState("");
  const [showUploader, setShowUploader] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [hasSelectedImage, setHasSelectedImage] = useState(false);
  const isVideoField = accept.includes("video");
  const previewValue = value.trim();
  const isDirectVideo = /\.(mp4|webm|ogg|ogv|mov)(\?.*)?$/i.test(previewValue);
  const [uppy] = useState(() => {
    if (isVideoField) {
      return undefined;
    }

    return new Uppy({
      restrictions: {
        maxNumberOfFiles: 1,
        allowedFileTypes: [".jpg", ".jpeg", ".png", ".webp"],
      },
    }).use(ImageEditor, {
      quality: 0.92,
      cropperOptions: {
        viewMode: 1,
        background: false,
      },
    });
  });

  useEffect(() => {
    if (!uppy) {
      return;
    }

    return () => {
      uppy.destroy();
    };
  }, [uppy]);

  useEffect(() => {
    const form = rootRef.current?.closest("form");

    if (!(form instanceof HTMLFormElement)) {
      return;
    }

    const pending = isUploading || (!isVideoField && hasSelectedImage);

    form.dispatchEvent(
      new CustomEvent("admin:pending-media", {
        detail: { active: pending, sourceId: inputId },
      }),
    );

    return () => {
      form.dispatchEvent(
        new CustomEvent("admin:pending-media", {
          detail: { active: false, sourceId: inputId },
        }),
      );
    };
  }, [hasSelectedImage, inputId, isUploading, isVideoField]);

  useEffect(() => {
    if (isVideoField || !shouldAutoSaveImageRef.current) {
      return;
    }

    const form = rootRef.current?.closest("form");

    if (!(form instanceof HTMLFormElement)) {
      return;
    }

    shouldAutoSaveImageRef.current = false;
    form.dispatchEvent(
      new CustomEvent("admin:auto-save-media", {
        detail: { sourceId: inputId },
      }),
    );
  }, [inputId, isVideoField, value]);

  useEffect(() => {
    const form = rootRef.current?.closest("form");

    if (!(form instanceof HTMLFormElement)) {
      return;
    }

    form.dispatchEvent(new CustomEvent("admin:form-value-change"));
  }, [value]);

  const uploadFile = useCallback(
    async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", uploadFolder);

      try {
        setStatus("");
        setUploadProgress(0);
        const data = await uploadWithProgress<{ url?: string }>({
          formData,
          url: uploadUrl,
          onProgress: (percent) => {
            setUploadProgress(percent);
            setStatus(`Otpremanje... ${percent}%`);
          },
        });

        if (!data.url) {
          setStatus("Upload nije uspeo.");
          setUploadProgress(null);
          return;
        }

        if (!isVideoField) {
          shouldAutoSaveImageRef.current = true;
        }

        setValue(data.url);
        setStatus("Fajl je otpremljen.");
        setUploadProgress(100);
      } catch {
        setStatus("Upload nije uspeo.");
        setUploadProgress(null);
      }
    },
    [isVideoField, uploadFolder, uploadUrl],
  );

  const uploadSelectedImage = useCallback(async () => {
    if (!uppy) {
      return;
    }

    const selectedFile = uppy.getFiles()[0];

    if (!selectedFile) {
      setStatus("Prvo izaberite sliku.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(null);
    setStatus("Otpremanje...");

    try {
      const preparedFile = fileFromUppy(
        selectedFile as UppyFile<Record<string, never>, Record<string, never>>,
      );
      const compressedFile = await compressImageToMaxSize(preparedFile, imageMaxBytes);
      await uploadFile(compressedFile);
      uppy.clear();
      setHasSelectedImage(false);
      setShowUploader(false);
    } catch {
      setStatus("Obrada slike nije uspela.");
    } finally {
      setIsUploading(false);
      setUploadProgress((current) => (current === 100 ? current : null));
    }
  }, [uppy, uploadFile]);

  useEffect(() => {
    if (isVideoField || !uppy) {
      return;
    }

    const syncSelection = () => {
      setHasSelectedImage(uppy.getFiles().length > 0);
      setStatus("");
    };

    const handleEditorComplete = () => {
      syncSelection();
      void uploadSelectedImage();
    };

    uppy.on("file-added", syncSelection);
    uppy.on("file-removed", syncSelection);
    uppy.on("file-editor:complete", handleEditorComplete);
    uppy.on("cancel-all", syncSelection);

    return () => {
      uppy.off("file-added", syncSelection);
      uppy.off("file-removed", syncSelection);
      uppy.off("file-editor:complete", handleEditorComplete);
      uppy.off("cancel-all", syncSelection);
    };
  }, [isVideoField, uppy, uploadSelectedImage]);

  if (isVideoField) {
    return (
      <div className="admin-media-field" ref={rootRef}>
        <label className="admin-form__field admin-form__field--full" htmlFor={inputId}>
          <span>{label}</span>
          <input
            id={inputId}
            className="input-control"
            name={name}
            value={value}
            onChange={(event) => setValue(event.currentTarget.value)}
          />
        </label>

        <div className="admin-media-field__actions">
          <label className="button-secondary admin-media-field__upload">
            <span>{uploadLabel}</span>
            <input
              type="file"
              accept={accept}
              hidden
              onChange={(event) => {
                const file = event.currentTarget.files?.[0];

                if (file) {
                  setIsUploading(true);
                  setUploadProgress(null);

                  void uploadFile(file).finally(() => {
                    setIsUploading(false);
                    setUploadProgress((current) => (current === 100 ? current : null));
                  });
                }

                event.currentTarget.value = "";
              }}
            />
          </label>
          {helpText ? <p className="admin-media-field__help">{helpText}</p> : null}
        </div>

        {previewValue ? (
          <div className="admin-media-field__preview" id={previewId}>
            {isDirectVideo ? (
              <video controls src={previewValue} />
            ) : (
              <a href={previewValue} target="_blank" rel="noreferrer">
                {previewValue}
              </a>
            )}
          </div>
        ) : null}

        {uploadProgress !== null ? (
          <div className="admin-upload-progress" aria-live="polite">
            <div className="admin-upload-progress__track">
              <div className="admin-upload-progress__bar" style={{ width: `${uploadProgress}%` }} />
            </div>
          </div>
        ) : null}
        {status ? <p className="admin-media-field__status">{status}</p> : null}
      </div>
    );
  }

  return (
    <div className="admin-media-field" ref={rootRef}>
      <input name={name} type="hidden" value={value} />

      <div className="admin-form__field admin-form__field--full">
        <span>{label}</span>
      </div>

      <div className="admin-media-field__actions">
        <button
          id={inputId}
          className="button-secondary"
          type="button"
          onClick={() => setShowUploader((current) => !current)}
        >
          {showUploader ? "Zatvori" : uploadLabel}
        </button>
        {helpText ? <p className="admin-media-field__help">{helpText}</p> : null}
      </div>

      {showUploader && uppy ? (
        <div className="admin-media-field__uppy">
          <Dashboard
            uppy={uppy}
            proudlyDisplayPoweredByUppy={false}
            hideUploadButton
            hideRetryButton
            hidePauseResumeButton
            hideCancelButton
            showProgressDetails={false}
            doneButtonHandler={() => undefined}
            autoOpen="imageEditor"
            height={360}
          />
        </div>
      ) : null}

      {previewValue ? (
        <div className="admin-media-field__preview" id={previewId}>
          <img src={previewValue} alt="" loading="lazy" />
        </div>
      ) : null}

      {uploadProgress !== null ? (
        <div className="admin-upload-progress" aria-live="polite">
          <div className="admin-upload-progress__track">
            <div className="admin-upload-progress__bar" style={{ width: `${uploadProgress}%` }} />
          </div>
        </div>
      ) : null}
      {status ? <p className="admin-media-field__status">{status}</p> : null}
    </div>
  );
}
