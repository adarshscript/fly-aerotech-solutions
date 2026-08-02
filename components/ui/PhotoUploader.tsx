"use client";
import { useRef, useState } from "react";
import { ImageUp, Loader2, X } from "lucide-react";

const MAX_PHOTO_BYTES = 2_000_000;

interface PhotoUploaderProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read the image file."));
    reader.readAsDataURL(file);
  });
}

async function resizeImage(file: File): Promise<string> {
  const dataUrl = await readAsDataUrl(file);
  const image = new Image();
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error("The selected file is not a valid image."));
    image.src = dataUrl;
  });

  const MAX_SIZE = 600;
  let { width, height } = image;
  if (width > height && width > MAX_SIZE) {
    height = Math.round((height / width) * MAX_SIZE);
    width = MAX_SIZE;
  } else if (height > MAX_SIZE) {
    width = Math.round((width / height) * MAX_SIZE);
    height = MAX_SIZE;
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) return dataUrl;
  context.drawImage(image, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", 0.85);
}

export default function PhotoUploader({ value, onChange, label = "Photo" }: PhotoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File | undefined | null) {
    if (!file) return;
    setError("");
    setProcessing(true);
    try {
      if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
        setError("Please choose a PNG, JPG or WebP image.");
        return;
      }
      if (file.size > MAX_PHOTO_BYTES) {
        setError("Photo must be under 2 MB.");
        return;
      }
      const resized = await resizeImage(file);
      if (resized.length > MAX_PHOTO_BYTES) {
        setError("Photo is still too large after compression. Try a smaller image.");
        return;
      }
      onChange(resized);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not process the photo.");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">{label}</label>
      <div className="flex items-center gap-3">
        <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-300 bg-slate-100 dark:border-navy-700 dark:bg-navy-800">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="Student photo preview" className="size-full object-cover" />
          ) : (
            <ImageUp className="size-5 text-slate-400" />
          )}
        </div>
        <div className="flex flex-col gap-1">
          <button
            type="button"
            disabled={processing}
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:border-tech-500 hover:text-tech-600 disabled:opacity-50 dark:border-navy-700 dark:text-slate-200"
          >
            {processing ? <Loader2 className="size-3.5 animate-spin" /> : <ImageUp className="size-3.5" />}
            {processing ? "Processing..." : value ? "Change photo" : "Upload photo"}
          </button>
          {value ? (
            <button
              type="button"
              onClick={() => onChange("")}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-red-500 transition hover:text-red-600"
            >
              <X className="size-3.5" />
              Remove
            </button>
          ) : null}
        </div>
      </div>
      {error ? <p className="mt-1.5 text-xs text-red-500">{error}</p> : null}
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(event) => handleFile(event.target.files?.[0])}
      />
    </div>
  );
}
