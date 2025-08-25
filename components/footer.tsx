import { Separator } from "@/components/ui/separator";
import Link from "next/link"; // Nhớ import Link

interface FooterProps {
  language: "vi" | "en";
  isVisible: boolean;
}

export function Footer({ language, isVisible }: FooterProps) {
  return (
    <footer
      className={`border-t bg-card/30 py-12 ${
        isVisible ? "animate-fade-in-up" : "opacity-0"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h4 className="font-bold mb-4 font-serif">
            {language === "vi" ? "Tài Liệu Tham Khảo" : "References"}
          </h4>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <Link
              href="https://tulieuvankien.dangcongsan.vn/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              tulieuvankien.dangcongsan.vn
            </Link>
            <Separator orientation="vertical" className="h-4" />
            <Link
              href="https://baotanglichsu.vn/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              {language === "vi" ? "Bảo tàng Lịch sử Quốc gia" : "National Museum of History"}
            </Link>
            <Separator orientation="vertical" className="h-4" />
            <Link
              href="https://thuvienphapluat.vn/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              THƯ VIỆN PHÁP LUẬT
            </Link>
            <Separator orientation="vertical" className="h-4" />
            <Link
              href="https://www.vietnamplus.vn/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              TTXVN
            </Link>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            {language === "vi"
              ? "Trang web giáo dục về lịch sử kinh tế Việt Nam"
              : "Educational website on Vietnam's economic history"}
          </p>
        </div>
      </div>
    </footer>
  );
}