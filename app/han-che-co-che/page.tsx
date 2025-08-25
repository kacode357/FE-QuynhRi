// app/han-che-co-che/page.tsx
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { detailLimitations } from "@/lib/content-detail-limitations"

// shadcn/ui breadcrumb
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default function HanCheCoChePage() {
  const [language, setLanguage] = useState<"vi" | "en">("vi")
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const data = detailLimitations[language]

  return (
    <div className="min-h-screen bg-background">
      <Header
        language={language}
        onLanguageChange={() => setLanguage(language === "vi" ? "en" : "vi")}
        title={data.title}
        subtitle={data.subtitle}
        isVisible={isVisible}
      />

      {/* Breadcrumb */}
      <div className="border-b bg-card/30">
        <nav className="container mx-auto px-4 py-3 animate-fade-in-up" aria-label="Breadcrumb">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">{language === "vi" ? "Trang chủ" : "Home"}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{data.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </nav>
      </div>

      <main className="container mx-auto px-4 py-8">
        <article className="max-w-3xl mx-auto space-y-10 animate-fade-in-up">
          <header className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-serif font-bold">{data.title}</h1>
            <p className="text-muted-foreground">{data.subtitle}</p>
          </header>

          {/* Sections */}
          <div className="space-y-8">
            {data.sections.map((sec, idx) => (
              <section key={idx} className="space-y-3">
                <h2 className="text-xl font-semibold">{sec.heading}</h2>
                <p className="leading-relaxed whitespace-pre-line">{sec.text}</p>
                {sec.source && sec.source.length > 0 ? (
                  <p className="text-sm text-muted-foreground">
                    {language === "vi" ? "Nguồn" : "Source"}:{" "}
                    {sec.source.map((s, sIdx) => (
                      <span key={sIdx}>
                        <Link href={s.url} className="underline" target="_blank" rel="noopener noreferrer">
                          {s.text}
                        </Link>
                        {sIdx < sec.source.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </p>
                ) : null}
              </section>
            ))}
          </div>

          {/* Images */}
          <section className="space-y-3">
            <h3 className="text-lg font-medium">
              {language === "vi" ? "Tư liệu hình ảnh" : "Image References"}
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {data.images?.length ? (
                data.images.map((img, i) =>
                  img?.src ? (
                    <div key={i} className="bg-card border rounded-xl overflow-hidden">
                      <Image
                        src={img.src}
                        alt={img.alt || (language === "vi" ? "Ảnh tư liệu" : "Reference image")}
                        width={1200}
                        height={800}
                        className="w-full h-56 md:h-64 object-cover"
                        priority={i === 0}
                      />
                      {img.alt ? (
                        <div className="px-3 py-2 text-xs text-muted-foreground">{img.alt}</div>
                      ) : null}
                    </div>
                  ) : (
                    <div
                      key={i}
                      className="bg-card border rounded-xl h-56 md:h-64 flex items-center justify-center text-sm text-muted-foreground"
                    >
                      {language === "vi" ? "Placeholder ảnh — Chèn sau" : "Image placeholder — Add later"}
                    </div>
                  )
                )
              ) : (
                <>
                  <div className="bg-card border rounded-xl h-56 md:h-64 flex items-center justify-center text-sm text-muted-foreground">
                    {language === "vi" ? "Ảnh 1 — Chèn sau" : "Image 1 — Add later"}
                  </div>
                  <div className="bg-card border rounded-xl h-56 md:h-64 flex items-center justify-center text-sm text-muted-foreground">
                    {language === "vi" ? "Ảnh 2 — Chèn sau" : "Image 2 — Add later"}
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Footer refs */}
          <footer className="pt-6 border-t">
            <div className="text-sm text-muted-foreground">
              {language === "vi" ? "Tham khảo thêm:" : "See also:"}{" "}
              <Link href="https://thuvienphapluat.vn/" className="underline" target="_blank" rel="noopener noreferrer">THƯ VIỆN PHÁP LUẬT</Link>,{" "}
              <Link href="https://vnanet.vn/" className="underline" target="_blank" rel="noopener noreferrer">TTXVN</Link>,{" "}
              <Link href="https://tapchicongthuong.vn/" className="underline" target="_blank" rel="noopener noreferrer">tcct</Link>,{" "}
              <Link href="https://baotanglichsu.vn/vi" className="underline" target="_blank" rel="noopener noreferrer">
                {language === "vi" ? "Bảo tàng Lịch sử Quốc gia" : "National Museum of History"}
              </Link>
            </div>
          </footer>
        </article>
      </main>

      <Footer language={language} isVisible={isVisible} />
    </div>
  )
}