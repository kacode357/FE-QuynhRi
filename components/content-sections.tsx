// components/content-sections.tsx
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  // Icon gợi ý theo thứ tự 5 card; thừa/thiếu sẽ fallback BookOpen
  const icons = [Calendar, TrendingDown, TrendingUp, BookOpen, BookOpen]

  // Mapping đường dẫn cho 5 card
  const links = [
    "/boi-canh-ra-doi",  // 0
    "/han-che-co-che",   // 1
    "/qua-trinh-doi-moi",// 2
    "/tra-loi-cau-hoi",  // 3
    "/ket-luan",         // 4
  ]

  // Tạo label a11y theo index
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
        {/* Cân đối: 2 cột ở sm/md, 3 cột ở lg */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((section, index) => {
            const IconComponent = icons[index] || BookOpen
            const href = links[index]
            const isLink = Boolean(href)

            // Cân lưới cho 5 card: card cuối (index === 4) span 2 cột để lấp đầy hàng
            const spanClass =
              index === 4 ? "sm:col-span-2 lg:col-span-2" : "" // sm/md: full width; lg: chiếm 2 cột để hàng đủ 3

            const card = (
              <Card
                className={`h-full card-hover animate-fade-in-up timeline-item-${index + 1} ${
                  isLink ? "cursor-pointer" : ""
                } ${spanClass}`}
                role={isLink ? "button" : undefined}
                aria-label={isLink ? ariaLabels[index] : undefined}
                tabIndex={0}
              >
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center hover:bg-accent/30 transition-colors">
                      <IconComponent className="w-5 h-5 text-accent-foreground" />
                    </div>
                    <CardTitle className="font-serif">{section.title}</CardTitle>
                  </div>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Nội dung tóm gọn – teaser */}
                  <p className="text-sm leading-relaxed">{section.content}</p>
                </CardContent>
              </Card>
            )

            // Nếu có link → bọc Link (key đặt ở wrapper)
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

            // Không có link → trả card thường
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
