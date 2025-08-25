// components/VideoModal.tsx
"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  youtube?: string;
};

export default function VideoModal({
  open,
  onClose,
  youtube = "https://www.youtube.com/watch?v=gyLKiiQr0GY",
}: Props) {
  // lấy id từ url hoặc nhận luôn id
  const videoId = extractYoutubeId(youtube);
  const src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;

  // ESC để đóng
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // chặn scroll nền khi mở
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity ${
        open ? "opacity-100 visible" : "pointer-events-none opacity-0 invisible"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Video modal"
      onClick={onClose}
    >
      <div
        className="mx-4 w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative overflow-hidden rounded-2xl bg-black shadow-2xl">
          {/* nút đóng */}
          <button
            aria-label="Close"
            onClick={onClose}
            className="absolute right-3 top-3 z-10 rounded-full bg-white/90 p-2 shadow hover:bg-white"
          >
            <X className="h-4 w-4" />
          </button>

          {/* khung 16:9 */}
          {open && (
            <div className="aspect-video w-full">
              <iframe
                key={videoId} // reset khi id đổi
                className="h-full w-full"
                src={src}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function extractYoutubeId(input: string) {
  const directId = /^[a-zA-Z0-9_-]{10,}$/.test(input);
  if (directId) return input;
  const url = new URL(input);
  if (url.hostname.includes("youtu.be")) {
    return url.pathname.replace("/", "");
  }
  return url.searchParams.get("v") ?? "";
}
