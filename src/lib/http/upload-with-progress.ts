type UploadWithProgressOptions = {
  formData: FormData;
  onProgress?: (percent: number) => void;
  url: string;
};

export const uploadWithProgress = <T>({ formData, onProgress, url }: UploadWithProgressOptions) =>
  new Promise<T>((resolve, reject) => {
    const request = new XMLHttpRequest();

    request.open("POST", url);
    request.responseType = "json";

    request.upload.addEventListener("progress", (event) => {
      if (!event.lengthComputable) {
        return;
      }

      const percent = Math.max(0, Math.min(100, Math.round((event.loaded / event.total) * 100)));
      onProgress?.(percent);
    });

    request.addEventListener("load", () => {
      if (request.status < 200 || request.status >= 300) {
        reject(new Error(`Upload failed with status ${request.status}`));
        return;
      }

      resolve(request.response as T);
    });

    request.addEventListener("error", () => {
      reject(new Error("Upload failed"));
    });

    request.addEventListener("abort", () => {
      reject(new Error("Upload aborted"));
    });

    request.send(formData);
  });
