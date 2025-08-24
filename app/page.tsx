// app/page.tsx
"use client"

import { useState, useEffect } from "react"
import { content } from "@/lib/content"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { TimelineSection } from "@/components/timeline-section"
import { ContentSections } from "@/components/content-sections"
import { Footer } from "@/components/footer"
import ChatBot from "@/components/chat-bot" // <-- thêm

export default function HomePage() {
  const [language, setLanguage] = useState<"vi" | "en">("vi")
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const currentContent = content[language]

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

      <TimelineSection timeline={currentContent.timeline} language={language} />

      <ContentSections sections={currentContent.sections} />

      <Footer language={language} isVisible={isVisible} />

      {/* Nút chat nổi góc phải + modal chat */}
      <ChatBot language={language} />
    </div>
  )
}
