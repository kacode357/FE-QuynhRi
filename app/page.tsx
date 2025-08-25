// app/page.tsx
"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion, type Variants, type Transition } from "framer-motion";
import { content } from "@/lib/content"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { TimelineSection } from "@/components/timeline-section"
import { ContentSections } from "@/components/content-sections"
import { Footer } from "@/components/footer"
import ChatBot from "@/components/chat-bot"
import WelcomeModal from "@/components/WelcomeModal"
import VideoModal from "@/components/VideoModal"

// icon
import { BookOpen, PlayCircle, Sparkles } from "lucide-react"

export default function HomePage() {
  const [language, setLanguage] = useState<"vi" | "en">("vi")
  const [isVisible, setIsVisible] = useState(false)
  const [openVideo, setOpenVideo] = useState(false) // ⬅️ modal video

  // ref để scroll tới ContentSections
  const contentRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const currentContent = content[language]

  const scrollToContent = () => {
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

 const springy: Transition = { type: "spring", stiffness: 260, damping: 20 };

const item: Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: springy,
  },
};

  return (
    <div className="min-h-screen bg-background">
      <Header
        language={language}
        onLanguageChange={() => setLanguage(language === "vi" ? "en" : "vi")}
        title={currentContent.title}
        subtitle={currentContent.subtitle}
        isVisible={isVisible}
      />

      <HeroSection
        mainTitle={currentContent.mainTitle}
        description={currentContent.description}
        language={language}
        isVisible={isVisible}
      />

      {/* Button group với animation */}
      <div className="container mx-auto -mt-2 mb-8 px-4">
        <motion.div
          className="flex flex-wrap items-center justify-center gap-3"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Nội dung (scroll) */}
          <motion.button
            variants={item}
            type="button"
            onClick={scrollToContent}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-blue-500 px-4 py-2 text-white shadow hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-violet-400"
          >
            <BookOpen className="h-4 w-4" />
            <span className="font-medium">Nội Dung</span>
          </motion.button>

          {/* Xem video (mở modal YouTube) */}
          <motion.button
            variants={item}
            type="button"
            onClick={() => setOpenVideo(true)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-500 px-4 py-2 text-emerald-600 shadow-sm hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            <PlayCircle className="h-4 w-4" />
            <span className="font-medium">Xem Video</span>
          </motion.button>

          {/* Ôn bài ngay (link) */}
          <motion.div variants={item}>
            <Link
              href="/quiz" 
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 px-4 py-2 text-white shadow hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-pink-400"
              aria-label="Ôn bài ngay"
            >
              <Sparkles className="h-4 w-4" />
              <span className="font-medium">Ôn bài ngay</span>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <TimelineSection timeline={currentContent.timeline} language={language} />

      {/* Bọc ContentSections để scroll tới */}
      <div ref={contentRef} id="noi-dung">
        <ContentSections sections={currentContent.sections} />
      </div>

      <Footer language={language} isVisible={isVisible} />

      {/* Chat bot + welcome modal */}
      <ChatBot language={language} />
      <WelcomeModal language={language} />

      {/* Modal Video YouTube */}
      <VideoModal
        open={openVideo}
        onClose={() => setOpenVideo(false)}
        youtube="https://www.youtube.com/watch?v=gyLKiiQr0GY"
      />
    </div>
  )
}
