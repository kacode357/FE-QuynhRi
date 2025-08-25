// components/content-sections.tsx
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Calendar, TrendingDown, TrendingUp, BookOpen } from "lucide-react"

interface ContentSection {
  title: string
  description: string
  content: string
}

interface ContentSectionsProps {
  sections: ContentSection[]
}

export function ContentSections({ sections }: ContentSectionsProps) {
  const icons = [Calendar, TrendingDown, TrendingUp, BookOpen, BookOpen]
  const links = [
    "/boi-canh-ra-doi",
    "/han-che-co-che",
    "/qua-trinh-doi-moi",
    "/tra-loi-cau-hoi",
    "/ket-luan",
  ]
  const ariaLabels = [
    "Xem chi tiết: Bối cảnh ra đời",
    "Xem chi tiết: Hạn chế của cơ chế",
    "Xem chi tiết: Quá trình Đổi mới",
    "Xem chi tiết: Trả lời câu hỏi",
    "Xem chi tiết: Kết luận",
  ]

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* Grid 2 cột, 4 thằng đầu chia đều, thằng cuối full width */}
        <div className="grid gap-8 md:grid-cols-2">
          {sections.map((section, index) => {
            const IconComponent = icons[index] || BookOpen
            const href = links[index]
            const isLink = Boolean(href)

            // Nếu card cuối (Kết luận) thì chiếm full width (col-span-2)
            const spanClass = index === sections.length - 1 ? "md:col-span-2" : ""

            const card = (
              <Card
                className={`h-full card-hover animate-fade-in-up timeline-item-${
                  index + 1
                } ${isLink ? "cursor-pointer" : ""} ${spanClass}`}
                role={isLink ? "button" : undefined}
                aria-label={isLink ? ariaLabels[index] : undefined}
                tabIndex={0}
              >
                <CardHeader>
                  <div className="mb-2 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20 hover:bg-accent/30 transition-colors">
                      <IconComponent className="h-5 w-5 text-accent-foreground" />
                    </div>
                    <CardTitle className="font-serif">
                      {section.title}
                    </CardTitle>
                  </div>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">{section.content}</p>
                </CardContent>
              </Card>
            )

            if (isLink) {
              return (
                <Link
                  href={href}
                  key={index}
                  className={`block focus:outline-none focus:ring-2 focus:ring-primary rounded-xl ${spanClass}`}
                  aria-label={ariaLabels[index]}
                >
                  {card}
                </Link>
              )
            }

            return (
              <div key={index} className={spanClass}>
                {card}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
