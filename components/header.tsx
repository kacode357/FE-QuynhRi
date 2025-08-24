"use client"

import { Button } from "@/components/ui/button"
import { BookOpen, Globe } from "lucide-react"

interface HeaderProps {
  language: "vi" | "en"
  onLanguageChange: () => void
  title: string
  subtitle: string
  isVisible: boolean
}

export function Header({ language, onLanguageChange, title, subtitle, isVisible }: HeaderProps) {
  return (
    <header
      className={`border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50 ${isVisible ? "animate-slide-in-left" : "opacity-0"}`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center animate-pulse-slow">
              <BookOpen className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-xl font-serif">{title}</h1>
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onLanguageChange}
            className="gap-2 hover:scale-105 transition-transform bg-transparent"
          >
            <Globe className="w-4 h-4" />
            {language === "vi" ? "English" : "Tiếng Việt"}
          </Button>
        </div>
      </div>
    </header>
  )
}
