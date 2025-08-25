// app/ket-luan/page.tsx
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { detailConclusion } from "@/lib/content-detail-conclusion"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default function KetLuanPage() {
  const [language, setLanguage] = useState<"vi" | "en">("vi")
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const data = detailConclusion[language]

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
            <h3 className="text-lg font-medium">{language === "vi" ? "Hình ảnh" : "Images"}</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {data.images.map((img, i) => (
                <div key={i} className="bg-card border rounded-xl h-56 md:h-64 flex items-center justify-center text-sm text-muted-foreground overflow-hidden">
                  <Image src={img.src} alt={img.alt} width={600} height={400} className="object-cover w-full h-full" />
                </div>
              ))}
            </div>
          </section>
        </article>
      </main>

      <Footer language={language} isVisible={isVisible} />
    </div>
  )
}