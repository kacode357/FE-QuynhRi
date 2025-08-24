import { Separator } from "@/components/ui/separator"

interface FooterProps {
  language: "vi" | "en"
  isVisible: boolean
}

export function Footer({ language, isVisible }: FooterProps) {
  return (
    <footer className={`border-t bg-card/30 py-12 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h4 className="font-bold mb-4 font-serif">{language === "vi" ? "Tài Liệu Tham Khảo" : "References"}</h4>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <span className="hover:text-foreground transition-colors cursor-pointer">tulieuvankien.dangcongsan.vn</span>
            <Separator orientation="vertical" className="h-4" />
            <span className="hover:text-foreground transition-colors cursor-pointer">
              {language === "vi" ? "Bảo tàng Lịch sử Quốc gia" : "National Museum of History"}
            </span>
            <Separator orientation="vertical" className="h-4" />
            <span className="hover:text-foreground transition-colors cursor-pointer">THƯ VIỆN PHÁP LUẬT</span>
            <Separator orientation="vertical" className="h-4" />
            <span className="hover:text-foreground transition-colors cursor-pointer">TTXVN</span>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            {language === "vi"
              ? "Trang web giáo dục về lịch sử kinh tế Việt Nam"
              : "Educational website on Vietnam's economic history"}
          </p>
        </div>
      </div>
    </footer>
  )
}
