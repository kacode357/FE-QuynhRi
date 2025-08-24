import { Card, CardContent } from "@/components/ui/card"

interface TimelineItem {
  year: string
  event: string
}

interface TimelineSectionProps {
  timeline: TimelineItem[]
  language: "vi" | "en"
}

export function TimelineSection({ timeline, language }: TimelineSectionProps) {
  return (
    <section className="py-10 bg-card/20">
      <div className="container mx-auto px-4">
        <h3 className="text-3xl font-bold text-center mb-12 font-serif animate-fade-in-up">
          {language === "vi" ? "Dòng Thời Gian" : "Timeline"}
        </h3>
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary/30"></div>
            {timeline.map((item, index) => (
              <div
                key={index}
                className={`relative flex items-center mb-8 animate-slide-in-left timeline-item-${index + 1}`}
              >
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold mr-6 relative z-10 hover:scale-110 transition-transform cursor-pointer">
                  {item.year}
                </div>
                <Card className="flex-1 card-hover">
                  <CardContent className="p-4">
                    <p className="text-sm leading-relaxed">{item.event}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
