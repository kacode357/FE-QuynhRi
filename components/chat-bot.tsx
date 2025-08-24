"use client"

import { useEffect, useRef, useState } from "react"
import { MessageCircle, X, Send, Loader2 } from "lucide-react"
import { geminiApiClient } from "@/services/GeminiApiClient"
import { FormattedMessage } from "@/components/ui/formatted-message"

type Lang = "vi" | "en"

interface ChatBotProps {
  language?: Lang
}

interface ChatMsg {
  role: "user" | "assistant"
  text: string
}

export default function ChatBot({ language = "vi" }: ChatBotProps) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      role: "assistant",
      text:
        language === "vi"
          ? "**Chào mày!** 👋 Mình là trợ lý cho chủ đề *Thời kỳ bao cấp (1975–1996)*. Cứ hỏi thoải mái nhé."
          : "**Hey there!** 👋 I’m your assistant for the *Subsidy Period (1975–1996)*. Feel free to ask.",
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true) // NEW
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages, open, loading])

  const t = {
    openLabel: language === "vi" ? "Mở chat" : "Open chat",
    title: language === "vi" ? "Trợ lý AI" : "AI Assistant",
    placeholder: language === "vi" ? "Nhập câu hỏi..." : "Type your question...",
    send: language === "vi" ? "Gửi" : "Send",
    hint:
      language === "vi"
        ? "Mẹo: chọn gợi ý hoặc nhập câu hỏi về Thời kỳ bao cấp."
        : "Tip: pick a suggestion or type a question about the Subsidy Period.",
  }

  const suggestionsVi = [
    "Bối cảnh sau 1975 có gì đặc biệt?",
    "Tại sao lạm phát 1986 lên tới 774,5%?",
    "Đại hội VI (1986) tự phê bình điều gì?",
    "Chỉ thị 100-CT/TW (1981) có ý nghĩa gì?",
    "Nghị quyết 10 (1988) đổi mới thế nào?",
  ]
  const suggestionsEn = [
    "What was Vietnam’s context after 1975?",
    "Why did inflation in 1986 reach 774.5%?",
    "What did the 6th Congress (1986) self-criticize?",
    "What was the significance of Directive 100-CT/TW (1981)?",
    "How did Resolution 10 (1988) reform agriculture?",
  ]
  const suggestions = language === "vi" ? suggestionsVi : suggestionsEn

  async function onSend(customText?: string) {
    const text = (customText ?? input).trim()
    if (!text || loading) return

    setMessages((m) => [...m, { role: "user", text }])
    setInput("")
    if (customText) setShowSuggestions(false) // ẩn suggestions khi chọn 1 gợi ý

    setLoading(true)
    try {
      const prompt = `[lang=${language}] ${text}`
      const reply = await geminiApiClient.generateContent(prompt)
      setMessages((m) => [...m, { role: "assistant", text: reply }])
    } catch (e: any) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text:
            language === "vi"
              ? `Xin lỗi, có lỗi khi gọi AI: ${e?.message || "Không rõ nguyên nhân"}.`
              : `Sorry, AI call failed: ${e?.message || "Unknown error"}.`,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  return (
    <>
      {/* nút tròn góc phải */}
      <button
        aria-label={t.openLabel}
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} aria-hidden />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-3xl h-[80vh] bg-card text-card-foreground border rounded-2xl shadow-xl flex flex-col animate-scale-in overflow-hidden">
              {/* header */}
              <div className="px-4 py-3 border-b bg-card/70 backdrop-blur-sm flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-lg">{t.title}</h3>
                  <p className="text-xs text-muted-foreground">{t.hint}</p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="h-9 w-9 inline-flex items-center justify-center rounded-lg bg-accent/30 hover:bg-accent/40 transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                  aria-label="Close chat"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* messages */}
              <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-background">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm leading-relaxed shadow-sm ${
                        m.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-sm"
                          : "bg-muted text-muted-foreground rounded-bl-sm"
                      }`}
                    >
                      <FormattedMessage text={m.text} />
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="max-w-[75%] rounded-2xl px-3 py-2 text-sm leading-relaxed shadow-sm bg-muted text-muted-foreground rounded-bl-sm inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {language === "vi" ? "Đang suy nghĩ..." : "Thinking..."}
                    </div>
                  </div>
                )}
              </div>

              {/* suggestions + input */}
              <div className="border-t bg-card/70 backdrop-blur-sm p-3">
                {showSuggestions && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {suggestions.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => onSend(s)}
                        className="px-3 py-1.5 text-xs rounded-full border bg-background hover:bg-accent/20 transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex items-end gap-2">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={onKeyDown}
                    rows={1}
                    placeholder={t.placeholder}
                    className="flex-1 resize-none rounded-xl border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <button
                    onClick={() => onSend()}
                    disabled={loading}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-3 py-2 text-sm shadow hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
                  >
                    <Send className="h-4 w-4" />
                    {t.send}
                  </button>
                </div>
                <p className="mt-2 text-[10px] text-muted-foreground">
                  {language === "vi"
                    ? "Mẹo: Enter để gửi, Shift+Enter để xuống dòng."
                    : "Tip: Enter to send, Shift+Enter for newline."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
