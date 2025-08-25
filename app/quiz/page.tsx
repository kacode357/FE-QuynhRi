// app/quiz/page.tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, type Variants, type Transition } from "framer-motion";
import { CheckCircle2, XCircle, RotateCcw, Home } from "lucide-react";

/** ====== DATA QUIZ (VI + EN) ====== */
type Q = {
  id: number;
  vi: { question: string; options: string[] };
  en: { question: string; options: string[] };
  correctIndex: number; // 0..3
};

const QUESTIONS: Q[] = [
  {
    id: 1,
    vi: {
      question:
        "Hoàn cảnh nào dẫn đến việc hình thành cơ chế bao cấp ở Việt Nam sau 1975?",
      options: [
        "Đất nước phát triển nhanh, kinh tế dư thừa",
        "Đất nước thống nhất nhưng hậu quả chiến tranh nặng nề, thiếu thốn, cấm vận",
        "Thị trường hàng hóa phong phú",
        "Muốn hội nhập kinh tế quốc tế sớm",
      ],
    },
    en: {
      question:
        "What context led to the formation of the subsidy (bao cấp) mechanism in Vietnam after 1975?",
      options: [
        "Rapid development with economic surplus",
        "National reunification but heavy war aftermath, shortages, embargo",
        "Abundant goods market",
        "Early desire for global economic integration",
      ],
    },
    correctIndex: 1,
  },
  {
    id: 2,
    vi: {
      question: "Tổng điều chỉnh “giá – lương – tiền” diễn ra vào năm nào?",
      options: ["1975", "1981", "1985", "1988"],
    },
    en: {
      question: "In which year did the comprehensive 'price–wage–money' adjustment occur?",
      options: ["1975", "1981", "1985", "1988"],
    },
    correctIndex: 2,
  },
  {
    id: 3,
    vi: {
      question:
        "Tỷ lệ lạm phát cao nhất Việt Nam phải chịu sau đợt điều chỉnh 1985 là bao nhiêu?",
      options: ["200%", "350%", "500%", "774,5%"],
    },
    en: {
      question:
        "What was the peak inflation rate Vietnam suffered after the 1985 adjustment?",
      options: ["200%", "350%", "500%", "774.5%"],
    },
    correctIndex: 3,
  },
  {
    id: 4,
    vi: {
      question:
        "Đại hội nào của Đảng đã chính thức tự phê bình, thừa nhận sai lầm nghiêm trọng và quyết định đổi mới?",
      options: [
        "Đại hội IV (1976)",
        "Đại hội V (1982)",
        "Đại hội VI (1986)",
        "Đại hội VII (1991)",
      ],
    },
    en: {
      question:
        "Which Party Congress officially self-criticized, acknowledged major mistakes, and decided to reform?",
      options: [
        "4th Congress (1976)",
        "5th Congress (1982)",
        "6th Congress (1986)",
        "7th Congress (1991)",
      ],
    },
    correctIndex: 2,
  },
  {
    id: 5,
    vi: {
      question:
        "Trong đường lối sau Đại hội VI, Đảng đã xác định mô hình kinh tế nào?",
      options: [
        "Kinh tế tập trung bao cấp thuần túy",
        "Kinh tế tư bản chủ nghĩa",
        "Kinh tế nhiều thành phần, vận hành theo cơ chế thị trường quản lý Nhà nước",
        "Kinh tế tự cung tự cấp",
      ],
    },
    en: {
      question:
        "What economic model did the Party identify after the 6th Congress?",
      options: [
        "Pure centralized subsidy economy",
        "Capitalist economy",
        "Multi-sector economy operating by market mechanisms under State management",
        "Self-sufficient economy",
      ],
    },
    correctIndex: 2,
  },
  {
    id: 6,
    vi: {
      question: "Kết luận đúng nhất về “thời kỳ bao cấp” là gì?",
      options: [
        "Sai lầm ngay từ lựa chọn ban đầu",
        "Không có sai lầm nào trong toàn bộ quá trình",
        "Ban đầu hợp lý, sau bộc lộ sai lầm, Đảng thừa nhận và đổi mới",
        "Một chủ trương chỉ áp dụng trong nông nghiệp",
      ],
    },
    en: {
      question: "What is the most accurate conclusion about the 'subsidy period'?",
      options: [
        "Wrong from the very beginning",
        "No mistakes at all",
        "Initially reasonable, later showed mistakes; the Party acknowledged and reformed",
        "A policy applied only to agriculture",
      ],
    },
    correctIndex: 2,
  },
  {
    id: 7,
    vi: {
      question:
        "Vì sao trong thời kỳ bao cấp, dù có tiền trong tay người dân vẫn “chưa chắc đã mua được” hàng hóa thiết yếu?",
      options: [
        "Do Nhà nước cấm sử dụng tiền mặt",
        "Vì hàng hóa khan hiếm, phải phân phối qua tem phiếu, xin – cho",
        "Người dân chưa quen tiêu dùng",
        "Giá cả hàng hóa quá cao",
      ],
    },
    en: {
      question:
        "Why, during the subsidy period, could people not always buy essential goods even with money?",
      options: [
        "The State banned cash usage",
        "Goods were scarce; distribution via ration coupons and 'ask–give' bureaucracy",
        "People weren’t used to consumption",
        "Prices were too high",
      ],
    },
    correctIndex: 1,
  },
  {
    id: 8,
    vi: {
      question:
        "Một trong những hạn chế lớn nhất của cơ chế bao cấp đối với đời sống nhân dân là gì?",
      options: [
        "Người dân có nhiều lựa chọn mua sắm",
        "Lương cao, giá thấp nên dễ tích lũy",
        "Phải xếp hàng dài để mua lương thực, thực phẩm",
        "Hệ thống chợ dân sinh hoạt động rất hiệu quả",
      ],
    },
    en: {
      question:
        "Which was a major limitation of the subsidy mechanism on daily life?",
      options: [
        "People had many shopping choices",
        "High wages and low prices made saving easy",
        "Long queues for food and essentials",
        "Public markets operated very efficiently",
      ],
    },
    correctIndex: 2,
  },
  {
    id: 9,
    vi: {
      question:
        "Vì sao Đảng quyết định chấm dứt cơ chế bao cấp và tiến hành Đổi mới từ năm 1986?",
      options: [
        "Bao cấp không còn phù hợp, gây khủng hoảng kinh tế – xã hội và lạm phát nặng nề",
        "Việt Nam đã gia nhập WTO",
        "Đất nước không còn chịu hậu quả chiến tranh",
        "Bao cấp đã đạt được mọi mục tiêu đề ra",
      ],
    },
    en: {
      question:
        "Why did the Party end the subsidy mechanism and launch Đổi mới in 1986?",
      options: [
        "Subsidy became unsuitable, causing socio-economic crisis and severe inflation",
        "Vietnam had joined the WTO",
        "The country no longer suffered war consequences",
        "The subsidy met all its goals",
      ],
    },
    correctIndex: 0,
  },
  {
    id: 10,
    vi: {
      question:
        "Hệ quả tích cực lớn nhất của công cuộc Đổi mới (1986) đối với nền kinh tế - xã hội Việt Nam là gì?",
      options: [
        "Lạm phát tiếp tục gia tăng mạnh",
        "Nông nghiệp đạt nhiều thành tựu, đời sống nhân dân dần ổn định",
        "Quan hệ kinh tế đối ngoại bị hạn chế",
        "Thương mại chỉ bó hẹp trong nước",
      ],
    },
    en: {
      question:
        "What was the biggest positive outcome of Đổi mới (1986) for Vietnam’s economy and society?",
      options: [
        "Inflation continued to surge",
        "Major agricultural gains; people’s lives gradually stabilized",
        "External economic relations were restricted",
        "Trade remained domestic-only",
      ],
    },
    correctIndex: 1,
  },
];

/** ====== UI STRINGS ====== */
const UI = {
  vi: {
    title: "Quiz: Thời kỳ Bao Cấp & Đổi mới",
    start: "Bắt đầu",
    next: "Câu tiếp",
    finish: "Kết thúc",
    score: "Điểm số",
    correct: "Chính xác!",
    wrong: "Chưa đúng",
    tryAgain: "Làm lại",
    backHome: "Về trang chủ",
    chooseLang: "Ngôn ngữ",
    question: "Câu hỏi",
  },
  en: {
    title: "Quiz: Subsidy Period & Doi Moi",
    start: "Start",
    next: "Next",
    finish: "Finish",
    score: "Score",
    correct: "Correct!",
    wrong: "Incorrect",
    tryAgain: "Try again",
    backHome: "Back Home",
    chooseLang: "Language",
    question: "Question",
  },
};

type Lang = "vi" | "en";

/** ====== COMPONENT ====== */
export default function QuizPage() {
  const [lang, setLang] = useState<Lang>("vi");
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const t = UI[lang];
  const total = QUESTIONS.length;

  const current = useMemo(() => QUESTIONS[index], [index]);

  // Animation presets
  const springy: Transition = { type: "spring", stiffness: 260, damping: 22 };
  const card: Variants = {
    hidden: { opacity: 0, y: 16, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1, transition: springy },
    exit: { opacity: 0, y: -16, scale: 0.98, transition: { duration: 0.18 } },
  };
  const opt: Variants = {
    hidden: { opacity: 0, y: 8 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.05 * i, ...springy },
    }),
  };

  const handleSelect = (i: number) => {
    if (selected !== null) return; // khóa chọn lại
    setSelected(i);
    if (i === current.correctIndex) setScore((s) => s + 1);
  };

  const goNext = () => {
    if (index < total - 1) {
      setIndex((i) => i + 1);
      setSelected(null);
      // cuộn lên trên nhẹ
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const restart = () => {
    setStarted(false);
    setIndex(0);
    setSelected(null);
    setScore(0);
  };

  const showLabel = (i: number) => String.fromCharCode(65 + i); // A/B/C/D

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-950">
      <div className="container mx-auto max-w-3xl px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between gap-3">
          <h1 className="text-xl font-semibold">{t.title}</h1>

          {/* Language toggle */}
          <div className="flex items-center gap-2">
            <span className="text-sm opacity-70">{t.chooseLang}:</span>
            <div className="inline-flex overflow-hidden rounded-xl border">
              <button
                onClick={() => setLang("vi")}
                className={`px-3 py-1 text-sm ${lang === "vi" ? "bg-black text-white dark:bg-white dark:text-black" : ""}`}
              >
                VI
              </button>
              <button
                onClick={() => setLang("en")}
                className={`px-3 py-1 text-sm ${lang === "en" ? "bg-black text-white dark:bg-white dark:text-black" : ""}`}
              >
                EN
              </button>
            </div>
          </div>
        </div>

        {/* Start screen */}
        {!started && (
          <motion.div
            variants={card}
            initial="hidden"
            animate="show"
            className="rounded-2xl border bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <p className="mb-6 text-sm opacity-80">
              {lang === "vi"
                ? "Gồm 10 câu trắc nghiệm. Chọn đáp án và xem phản hồi tức thì."
                : "Includes 10 multiple-choice questions. Pick an answer to get instant feedback."}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
              >
                <Home className="h-4 w-4" />
                {t.backHome}
              </Link>
              <button
                onClick={() => setStarted(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-sm text-white hover:opacity-90 dark:bg-white dark:text-black"
              >
                {t.start}
              </button>
            </div>
          </motion.div>
        )}

        {/* Quiz screen */}
        {started && (
          <>
            {/* Progress */}
            <div className="mb-4">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm opacity-75">
                  {t.question} {index + 1}/{total}
                </span>
                <span className="text-sm opacity-75">
                  {t.score}: {score}/{total}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                <motion.div
                  className="h-full bg-gradient-to-r from-violet-500 to-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${((index + (selected !== null ? 1 : 0)) / total) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Card câu hỏi */}
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id + "-" + lang}
                variants={card}
                initial="hidden"
                animate="show"
                exit="exit"
                className="mb-6 rounded-2xl border bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                <h2 className="mb-4 font-medium">
                  {lang === "vi" ? current.vi.question : current.en.question}
                </h2>

                <div className="grid gap-3">
                  {(lang === "vi" ? current.vi.options : current.en.options).map(
                    (text, i) => {
                      const isCorrect = i === current.correctIndex;
                      const isChosen = selected === i;

                      // màu trạng thái
                      const activeClass =
                        selected === null
                          ? "hover:bg-zinc-50 dark:hover:bg-zinc-800"
                          : isCorrect
                          ? "border-emerald-500 bg-emerald-50/60 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                          : isChosen
                          ? "border-rose-500 bg-rose-50/60 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300"
                          : "opacity-70";

                      return (
                        <motion.button
                          key={i}
                          custom={i}
                          variants={opt}
                          initial="hidden"
                          animate="show"
                          whileHover={selected === null ? { scale: 1.01 } : undefined}
                          whileTap={selected === null ? { scale: 0.98 } : undefined}
                          onClick={() => handleSelect(i)}
                          disabled={selected !== null}
                          className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition ${activeClass}`}
                        >
                          <span className="flex items-center gap-3">
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-zinc-200 text-xs font-semibold dark:bg-zinc-700">
                              {showLabel(i)}
                            </span>
                            <span className="text-sm">{text}</span>
                          </span>

                          {selected !== null && isCorrect && (
                            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                          )}
                          {selected !== null && isChosen && !isCorrect && (
                            <XCircle className="h-5 w-5 text-rose-600" />
                          )}
                        </motion.button>
                      );
                    }
                  )}
                </div>

                {/* Feedback */}
                {selected !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 text-sm"
                  >
                    {selected === current.correctIndex ? (
                      <span className="rounded-lg bg-emerald-50 px-3 py-2 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                        {t.correct}
                      </span>
                    ) : (
                      <span className="rounded-lg bg-rose-50 px-3 py-2 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300">
                        {t.wrong}
                      </span>
                    )}
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Điều hướng */}
            <div className="flex flex-wrap items-center gap-3">
              {index < total - 1 ? (
                <button
                  onClick={goNext}
                  disabled={selected === null}
                  className="rounded-xl bg-black px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50 hover:opacity-90 dark:bg-white dark:text-black"
                >
                  {t.next}
                </button>
              ) : (
                <button
                  onClick={() => setIndex(total - 1)}
                  disabled={selected === null}
                  className="rounded-xl bg-black px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50 hover:opacity-90 dark:bg-white dark:text-black"
                >
                  {t.finish}
                </button>
              )}

              <button
                onClick={restart}
                className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
              >
                <RotateCcw className="h-4 w-4" />
                {t.tryAgain}
              </button>

              <Link
                href="/"
                className="rounded-xl border px-4 py-2 text-sm hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
              >
                {t.backHome}
              </Link>
            </div>

            {/* Kết quả cuối (hiển thị đơn giản ở thanh điểm + khi hết) */}
            {index === total - 1 && selected !== null && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 rounded-2xl border bg-white p-4 text-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                {t.score}: <strong>{score}/{total}</strong>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
