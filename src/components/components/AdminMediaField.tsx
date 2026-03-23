import { useEffect, useId, useState } from "react";
import Uppy from "@uppy/core";
import type { UppyFile } from "@uppy/core";
import ImageEditor from "@uppy/image-editor";
import Dashboard from "@uppy/react/dashboard";

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
  const [value, setValue] = useState(initialValue);
  const [status, setStatus] = useState("");
  const [showUploader, setShowUploader] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
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
    if (isVideoField || !uppy) {
      return;
    }

    const syncSelection = () => {
      setHasSelectedImage(uppy.getFiles().length > 0);
      setStatus("");
    };

    uppy.on("file-added", syncSelection);
    uppy.on("file-removed", syncSelection);
    uppy.on("file-editor:complete", syncSelection);
    uppy.on("cancel-all", syncSelection);

    return () => {
      uppy.off("file-added", syncSelection);
      uppy.off("file-removed", syncSelection);
      uppy.off("file-editor:complete", syncSelection);
      uppy.off("cancel-all", syncSelection);
    };
  }, [isVideoField, uppy]);

  useEffect(() => {
    if (!uppy) {
      return;
    }

    return () => {
      uppy.destroy();
    };
  }, [uppy]);

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", uploadFolder);

    try {
      setStatus("");
      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        setStatus("Upload nije uspeo.");
        return;
      }

      const data = (await response.json()) as { url?: string };

      if (!data.url) {
        setStatus("Upload nije uspeo.");
        return;
      }

      setValue(data.url);
      setStatus("Fajl je otpremljen.");
    } catch {
      setStatus("Upload nije uspeo.");
    }
  };

  const uploadSelectedImage = async () => {
    if (!uppy) {
      return;
    }

    const selectedFile = uppy.getFiles()[0];

    if (!selectedFile) {
      setStatus("Prvo izaberite sliku.");
      return;
    }

    setIsUploading(true);

    try {
      const preparedFile = fileFromUppy(selectedFile as UppyFile<Record<string, never>, Record<string, never>>);
      const compressedFile = await compressImageToMaxSize(preparedFile, imageMaxBytes);
      await uploadFile(compressedFile);
      uppy.clear();
      setHasSelectedImage(false);
      setShowUploader(false);
    } catch {
      setStatus("Obrada slike nije uspela.");
    } finally {
      setIsUploading(false);
    }
  };

  if (isVideoField) {
    return (
      <div className="admin-media-field">
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
                  void uploadFile(file);
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

        {status ? <p className="admin-media-field__status">{status}</p> : null}
      </div>
    );
  }

  return (
    <div className="admin-media-field">
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
        <button
          className="button-secondary"
          type="button"
          onClick={() => setShowUploader((current) => !current)}
        >
          {showUploader ? "Zatvori Uppy" : uploadLabel}
        </button>
        <button
          className="button-primary"
          type="button"
          disabled={!hasSelectedImage || isUploading}
          onClick={() => void uploadSelectedImage()}
        >
          {isUploading ? "Otpremanje..." : "Sačuvaj izabranu sliku"}
        </button>
        <p className="admin-media-field__help">
          {helpText ?? "Uppy editor + automatska kompresija slike do 1 MB pre slanja."}
        </p>
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
            note="JPG, PNG, WEBP • edit + kompresija do 1 MB"
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

      {status ? <p className="admin-media-field__status">{status}</p> : null}
    </div>
  );
}
