// app/tra-loi-cau-hoi/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { detailAnswer } from "@/lib/content-detail-answer";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// Helpers
const slugify = (s: string) =>
  s
    .toLowerCase()
    // remove Vietnamese diacritics
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    // keep letters/numbers -> hyphens
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export default function TraLoiCauHoiPage() {
  const [language, setLanguage] = useState<"vi" | "en">("vi");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const data = detailAnswer[language];

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
        <article className="mx-auto max-w-6xl animate-fade-in-up">
          {/* Main content in a single column */}
          <div className="grid grid-cols-1 gap-8">
            {/* NEW: Phần I… trước nội dung cũ */}
            {language === "vi" && Array.isArray((data as any).parts) && (
              <section className="space-y-8">
                {(data as any).parts.map((part: any) => {
                  const partId = part.id || slugify(part.title);
                  return (
                    <div key={partId}>
                      <h2 className="text-2xl md:text-3xl font-serif font-bold">
                        {part.title}
                      </h2>
                      <div className="mt-4 space-y-8">
                        {part.sections?.map((sec: any, idx: number) => {
                          return (
                            <section key={idx}>
                              <h3 className="text-xl font-semibold">{sec.title}</h3>
                              {sec.paragraphs?.length ? (
                                <div className="mt-3 space-y-3">
                                  {sec.paragraphs.map((p: string, i: number) => (
                                    <p key={i} className="leading-relaxed whitespace-pre-line">
                                      {p}
                                    </p>
                                  ))}
                                </div>
                              ) : null}
                              {sec.bullets?.length ? (
                                <ul className="mt-3 list-disc space-y-2 pl-6">
                                  {sec.bullets.map((b: string, i: number) => (
                                    <li key={i} className="leading-relaxed">
                                      {b}
                                    </li>
                                  ))}
                                </ul>
                              ) : null}
                            </section>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </section>
            )}

            {/* NỘI DUNG CŨ */}
            <section className="space-y-6">
              <header className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-serif font-bold">
                  {data.title}
                </h1>
                <p className="text-muted-foreground">{data.subtitle}</p>
              </header>

              <div className="space-y-3">
                <h2 className="text-xl font-semibold">
                  {language === "vi" ? "Đặt vấn đề" : "Context"}
                </h2>
                <p className="leading-relaxed whitespace-pre-line">{data.preamble}</p>
              </div>

              <div className="space-y-8">
                {data.sections.map((sec: any, idx: number) => (
                  <section key={idx} className="space-y-3">
                    <h3 className="text-lg font-semibold">{sec.heading}</h3>
                    <p className="leading-relaxed whitespace-pre-line">{sec.text}</p>
                    {sec.source && sec.source.length > 0 && (
                      <p className="text-sm text-muted-foreground">
                        {language === "vi" ? "Nguồn" : "Source"}:{" "}
                        {sec.source.map((s: any, sIdx: number) => (
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
                <h3 className="text-lg font-semibold">
                  {language === "vi" ? "Kết luận" : "Conclusion"}
                </h3>
                <div className="rounded-xl border bg-card p-6 shadow">
                  <p className="leading-relaxed whitespace-pre-line">
                    {data.conclusion.text}
                  </p>
                </div>
              </section>

              <section className="space-y-3">
                <h3 className="text-lg font-semibold">
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
            </section>
          </div>
        </article>
      </main>

      <Footer language={language} isVisible={isVisible} />
    </div>
  );
}