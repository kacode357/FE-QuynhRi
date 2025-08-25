// app/tra-loi-cau-hoi/page.tsx
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { detailAnswer } from "@/lib/content-detail-answer"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default function TraLoiCauHoiPage() {
  const [language, setLanguage] = useState<"vi" | "en">("vi")
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const data = detailAnswer[language]

  return (
    <div className="min-h-screen bg-background">
      <Header
        language={language}
        onLanguageChange={() => setLanguage(language === "vi" ? "en" : "vi")}
        title={data.title}
        subtitle={data.subtitle}
        isVisible={isVisible}
      />

      <div className="border-b bg-card/30">
        <nav className="container mx-auto px-4 py-3 animate-fade-in-up">
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

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">
              {language === "vi" ? "Đặt vấn đề" : "Context"}
            </h2>
            <p className="leading-relaxed whitespace-pre-line">{data.preamble}</p>
          </section>

          <div className="space-y-8">
            {data.sections.map((sec, idx) => (
              <section key={idx} className="space-y-3">
                <h2 className="text-xl font-semibold">{sec.heading}</h2>
                <p className="leading-relaxed whitespace-pre-line">{sec.text}</p>
                {sec.source && sec.source.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {language === "vi" ? "Nguồn" : "Source"}:{" "}
                    {sec.source.map((s, sIdx) => (
                      <span key={sIdx}>
                        <Link
                          href={s.url}
                          className="underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {s.text}
                        </Link>
                        {sIdx < sec.source.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </p>
                )}
              </section>
            ))}
          </div>

          <section className="space-y-3">
            <h3 className="text-lg font-medium">
              {language === "vi" ? "Kết luận" : "Conclusion"}
            </h3>
            <div className="rounded-xl border bg-card p-6 shadow">
              <p className="leading-relaxed whitespace-pre-line">
                {data.conclusion.text}
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-medium">
              {language === "vi" ? "Video tư liệu" : "Reference video"}
            </h3>
            <div className="aspect-video w-full overflow-hidden rounded-xl border bg-card">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${
                  data.video.url.split("v=")[1]
                }`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          </section>
        </article>
      </main>

      <Footer language={language} isVisible={isVisible} />
    </div>
  )
}