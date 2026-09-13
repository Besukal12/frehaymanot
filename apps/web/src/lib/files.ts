const IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export const MAX_DASHBOARD_FILE_BYTES = 10 * 1024 * 1024;

export function isImageFile(file: File): boolean {
  return file.type.startsWith("image/") || IMAGE_TYPES.has(file.type);
}

export function isPdfFile(file: File): boolean {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

export function sanitizeDownloadName(name: string, extension = "pdf"): string {
  const cleaned = name
    .trim()
    .replace(/[<>:"/\\|?*]+/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 80);
  const base = cleaned || "document";
  const ext = `.${extension}`;
  return base.toLowerCase().endsWith(ext) ? base : `${base}${ext}`;
}

export function cloudinaryAttachmentUrl(url: string, filename: string): string {
  if (!url.includes("/upload/")) return url;
  if (url.includes("fl_attachment")) return url;
  const safe = encodeURIComponent(sanitizeDownloadName(filename).replace(/\.pdf$/i, ""));
  return url.replace("/upload/", `/upload/fl_attachment:${safe}/`);
}

export async function downloadRemoteFile(url: string, filename: string): Promise<void> {
  if (!url) {
    throw new Error("No file is available to download");
  }

  try {
    const response = await fetch(url, { mode: "cors" });
    if (!response.ok) {
      throw new Error("Download failed");
    }

    const blob = await response.blob();
    const typed =
      blob.type === "application/pdf" || blob.type === "application/octet-stream"
        ? new Blob([blob], { type: "application/pdf" })
        : blob;
    const objectUrl = URL.createObjectURL(typed);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = sanitizeDownloadName(filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(objectUrl);
  } catch {
    const fallback = cloudinaryAttachmentUrl(url, filename);
    const link = document.createElement("a");
    link.href = fallback;
    link.rel = "noopener noreferrer";
    link.download = sanitizeDownloadName(filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
}
