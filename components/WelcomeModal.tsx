// components/WelcomeModal.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2 } from "lucide-react";

type Props = {
  language: "vi" | "en";
  /** Đường dẫn file nhạc trong /public, mặc định: /videoplayback.m4a */
  src?: string;
  /** Âm lượng khởi tạo 0..1 (mặc định 0.35) */
  volume?: number;
  /** Khóa lưu trữ trong localStorage (mặc định "welcomeSeen" / "welcomeVol") */
  storageKeySeen?: string;
  storageKeyVol?: string;
};

export default function WelcomeModal({
  language,
  src = "/videoplayback.m4a",
  volume = 0.35,
  storageKeySeen = "welcomeSeen",
  storageKeyVol = "welcomeVol",
}: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // --- State ---
  const [ready, setReady] = useState(false); // chặn render sớm để tránh flicker
  const [open, setOpen] = useState(false);
  const [vol, setVol] = useState(volume);
  const [isPlaying, setIsPlaying] = useState(false);

  // --- Init từ localStorage trước khi render UI ---
  useEffect(() => {
    if (typeof window === "undefined") return;

    const seen = window.localStorage.getItem(storageKeySeen);
    setOpen(seen === "1" ? false : true);

    const savedVol = window.localStorage.getItem(storageKeyVol);
    if (savedVol !== null) {
      const v = clamp01(parseFloat(savedVol));
      setVol(v);
      if (audioRef.current) audioRef.current.volume = v;
    }

    setReady(true);
  }, [storageKeySeen, storageKeyVol]);

  // Khóa scroll khi modal mở
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Đồng bộ volume -> audio
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  }, [vol]);

  const t =
    language === "vi"
      ? {
          title: "Chào mừng bạn tới website nội dung học thuật",
          desc: "Nhấn Bắt đầu để vào trang và bật nhạc nền.",
          start: "Bắt đầu",
          later: "Đóng",
          volume: "Âm lượng",
          play: "Phát",
          pause: "Tạm dừng",
        }
      : {
          title: "Welcome to the academic content website",
          desc: "Press Start to enter and turn on background music.",
          start: "Start",
          later: "Close",
          volume: "Volume",
          play: "Play",
          pause: "Pause",
        };

  const handleCloseOnly = () => {
    setOpen(false);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(storageKeySeen, "1");
    }
  };

  const handleStart = async () => {
    setOpen(false);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(storageKeySeen, "1");
    }
    try {
      if (audioRef.current) {
        audioRef.current.volume = vol;
        await audioRef.current.play(); // user gesture -> ok
        setIsPlaying(true);
      }
    } catch (err) {
      console.warn("Audio play blocked:", err);
      setIsPlaying(false);
    }
  };

  // Handler volume (0..100 -> 0..1)
  const onChangeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value) / 100;
    const clamped = clamp01(v);
    setVol(clamped);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(storageKeyVol, String(clamped));
    }
  };

  // Play / Pause ở widget
  const togglePlay = async () => {
    if (!audioRef.current) return;
    try {
      if (audioRef.current.paused) {
        await audioRef.current.play();
        setIsPlaying(true);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    } catch (e) {
      console.warn("Toggle play failed:", e);
    }
  };

  // Chưa "ready" thì đừng render modal để tránh nháy
  if (!ready) {
    return (
      <>
        <audio ref={audioRef} src={src} loop preload="auto" />
      </>
    );
  }

  return (
    <>
      {/* Audio ẩn – luôn tồn tại để widget điều khiển được */}
      <audio ref={audioRef} src={src} loop preload="auto" />

      {/* Modal lần đầu (không flicker vì chỉ render sau khi ready) */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900">
            <h2 className="mb-2 text-xl font-semibold">{t.title}</h2>
            <p className="mb-6 text-sm opacity-80">{t.desc}</p>

            {/* Điều khiển âm lượng trong modal */}
            <div className="mb-6">
              <label htmlFor="welcome-volume" className="mb-2 block text-sm">
                {t.volume}:{" "}
                <span className="font-medium">{Math.round(vol * 100)}%</span>
              </label>
              <input
                id="welcome-volume"
                type="range"
                min={0}
                max={100}
                step={1}
                value={Math.round(vol * 100)}
                onChange={onChangeVolume}
                className="w-full accent-black dark:accent-white"
                aria-label={t.volume}
              />
            </div>

            <div className="flex items-center justify-end gap-3">
              {/* Đóng không phát */}
              <button
                type="button"
                onClick={handleCloseOnly}
                className="rounded-xl border px-4 py-2 text-sm hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
              >
                {t.later}
              </button>

              {/* Đóng + phát */}
              <button
                type="button"
                onClick={handleStart}
                className="rounded-xl bg-black px-4 py-2 text-sm text-white hover:opacity-90 dark:bg-white dark:text-black"
              >
                {t.start}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Widget điều khiển sau khi modal đóng — CHUYỂN sang góc trái */}
      {!open && (
        <div className="fixed bottom-4 left-4 z-40 flex items-center gap-3 rounded-2xl border bg-white/90 p-3 shadow-lg backdrop-blur dark:border-zinc-700 dark:bg-zinc-900/90">
          <button
            type="button"
            onClick={togglePlay}
            className="flex items-center gap-2 rounded-xl border px-3 py-2 text-xs hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
            aria-label={isPlaying ? t.pause : t.play}
            title={isPlaying ? t.pause : t.play}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            <span className="hidden sm:inline">{isPlaying ? t.pause : t.play}</span>
          </button>

          <div className="flex items-center gap-2">
            <Volume2 size={16} className="opacity-70" />
            <div className="flex flex-col">
              <label htmlFor="welcome-volume-mini" className="text-[11px] opacity-70">
                {t.volume}: <span className="font-medium">{Math.round(vol * 100)}%</span>
              </label>
              <input
                id="welcome-volume-mini"
                type="range"
                min={0}
                max={100}
                step={1}
                value={Math.round(vol * 100)}
                onChange={onChangeVolume}
                className="w-40 accent-black dark:accent-white"
                aria-label={t.volume}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/** Chặn ngoài biên 0..1 */
function clamp01(n: number) {
  if (Number.isNaN(n)) return 0.35;
  return Math.max(0, Math.min(1, n));
}
