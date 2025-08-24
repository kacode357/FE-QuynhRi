import { Badge } from "@/components/ui/badge"
import { Calendar, Users } from "lucide-react"

interface HeroSectionProps {
  mainTitle: string
  description: string
  language: "vi" | "en"
  isVisible: boolean
}

export function HeroSection({ mainTitle, description, language, isVisible }: HeroSectionProps) {
  return (
    <section
      className={`py-16 bg-gradient-to-b from-card/30 to-background ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
    >
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 font-serif animate-scale-in">{mainTitle}</h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 animate-fade-in-up">{description}</p>
        <div className="flex flex-wrap justify-center gap-4 animate-fade-in-up">
          <Badge variant="secondary" className="px-4 py-2 hover:scale-105 transition-transform">
            <Calendar className="w-4 h-4 mr-2" />
            1975-1986
          </Badge>
          <Badge variant="secondary" className="px-4 py-2 hover:scale-105 transition-transform">
            <Users className="w-4 h-4 mr-2" />
            {language === "vi" ? "Lịch Sử Kinh Tế" : "Economic History"}
          </Badge>
        </div>
      </div>
    </section>
  )
}
