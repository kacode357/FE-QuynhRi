import type React from "react"
import type { Metadata } from "next"
import { Inter, Noto_Sans } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  display: "swap",
  variable: "--font-inter",
})

const notoSans = Noto_Sans({
  subsets: ["latin", "vietnamese"],
  display: "swap",
  variable: "--font-noto-sans",
})

export const metadata: Metadata = {
  title: "Thời Kỳ Bao Cấp | Vietnam Economic History 1975-1986",
  description:
    "Educational resource on Vietnam's subsidy economic system (Bao Cấp) from 1975-1986. Bilingual Vietnamese-English content.",
  generator: "v0.app",
  icons: {
    icon: '/co-dang.jpg', // Dòng này là điểm mấu chốt.
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" className={`${inter.variable} ${notoSans.variable} antialiased`}>
      <body className="font-sans">{children}</body>
    </html>
  )
}