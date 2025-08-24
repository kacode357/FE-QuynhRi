// file: components/ui/formatted-message.tsx
import React from "react"

/**
 * FormattedMessage
 * - Hỗ trợ:
 *   - Heading: #, ##, ###
 *   - Đoạn ngắt: dòng trống
 *   - Horizontal rule: ---
 *   - Blockquote: > ...
 *   - Bullet list: "* ..." hoặc "- ..." (nested bằng 4 spaces)
 *   - Numbered list: "1. ..." (nested bằng 4 spaces)
 *   - Inline: **bold**, *italic* hoặc _italic_, `code`, [text](url)
 *   - Code block: ```lang\n...\n```
 *
 * Lưu ý: Parser "markdown-lite" đủ dùng cho chat; không bao trùm hết Markdown.
 */

export interface FormattedMessageProps {
  text: string
  className?: string
}

type Block =
  | { type: "heading"; level: 1 | 2 | 3; content: string }
  | { type: "hr" }
  | { type: "blockquote"; content: string }
  | { type: "codeblock"; language?: string; content: string }
  | { type: "list"; ordered: boolean; items: { text: string; indent: number }[] }
  | { type: "paragraph"; content: string }

const INLINE_PATTERNS = {
  link: /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, // [text](url)
  code: /`([^`]+)`/g, // `code`
  bold: /\*\*(.+?)\*\*/g, // **bold**
  italicStar: /\*(?!\s)([^*]+?)\*/g, // *italic*
  italicUnd: /_(?!\s)([^_]+?)_/g, // _italic_
}

function renderInline(text: string, keyPrefix = ""): React.ReactNode[] {
  // Quy trình: link -> code -> bold -> italic
  // Ta sẽ split + map theo từng regex để giữ thứ tự và tránh lồng nhau quá phức tạp
  const apply = (nodes: React.ReactNode[], regex: RegExp, wrap: (m: RegExpExecArray, i: number) => React.ReactNode) => {
    const out: React.ReactNode[] = []
    nodes.forEach((node, idx) => {
      if (typeof node !== "string") {
        out.push(node)
        return
      }
      const parts: React.ReactNode[] = []
      let lastIndex = 0
      let m: RegExpExecArray | null
      const r = new RegExp(regex) // clone regex to reset lastIndex
      while ((m = r.exec(node)) !== null) {
        const [full] = m
        const start = m.index
        if (start > lastIndex) parts.push(node.slice(lastIndex, start))
        parts.push(wrap(m, idx))
        lastIndex = start + full.length
      }
      if (lastIndex < node.length) parts.push(node.slice(lastIndex))
      out.push(...parts)
    })
    return out
  }

  let nodes: React.ReactNode[] = [text]

  // links
  nodes = apply(
    nodes,
    INLINE_PATTERNS.link,
    (m, i) => (
      <a
        key={`${keyPrefix}-lnk-${i}-${m.index}`}
        href={m[2]}
        target="_blank"
        rel="noopener noreferrer"
        className="underline decoration-dotted hover:decoration-solid text-primary"
      >
        {m[1]}
      </a>
    )
  )

  // inline code
  nodes = apply(
    nodes,
    INLINE_PATTERNS.code,
    (m, i) => (
      <code
        key={`${keyPrefix}-code-${i}-${m.index}`}
        className="rounded bg-muted px-1 py-0.5 font-mono text-[0.85em]"
      >
        {m[1]}
      </code>
    )
  )

  // bold
  nodes = apply(
    nodes,
    INLINE_PATTERNS.bold,
    (m, i) => (
      <strong key={`${keyPrefix}-b-${i}-${m.index}`} className="font-semibold">
        {m[1]}
      </strong>
    )
  )

  // italic (*...* và _..._)
  nodes = apply(
    nodes,
    INLINE_PATTERNS.italicStar,
    (m, i) => (
      <em key={`${keyPrefix}-i1-${i}-${m.index}`} className="italic">
        {m[1]}
      </em>
    )
  )
  nodes = apply(
    nodes,
    INLINE_PATTERNS.italicUnd,
    (m, i) => (
      <em key={`${keyPrefix}-i2-${i}-${m.index}`} className="italic">
        {m[1]}
      </em>
    )
  )

  return nodes
}

function parseBlocks(text: string): Block[] {
  const lines = text.replace(/\r\n?/g, "\n").split("\n")
  const blocks: Block[] = []

  let i = 0
  while (i < lines.length) {
    const line = lines[i]

    // Code block fence ```
    if (/^```/.test(line)) {
      const lang = line.replace(/^```/, "").trim() || undefined
      const buf: string[] = []
      i++
      while (i < lines.length && !/^```/.test(lines[i])) {
        buf.push(lines[i])
        i++
      }
      // skip closing ```
      if (i < lines.length && /^```/.test(lines[i])) i++
      blocks.push({ type: "codeblock", language: lang, content: buf.join("\n") })
      continue
    }

    // horizontal rule
    if (/^\s*---\s*$/.test(line)) {
      blocks.push({ type: "hr" })
      i++
      continue
    }

    // Empty line → paragraph break (we'll handle as empty paragraph)
    if (line.trim() === "") {
      // Insert empty paragraph to preserve spacing
      blocks.push({ type: "paragraph", content: "" })
      i++
      continue
    }

    // Heading
    if (/^###\s+/.test(line)) {
      blocks.push({ type: "heading", level: 3, content: line.replace(/^###\s+/, "") })
      i++
      continue
    }
    if (/^##\s+/.test(line)) {
      blocks.push({ type: "heading", level: 2, content: line.replace(/^##\s+/, "") })
      i++
      continue
    }
    if (/^#\s+/.test(line)) {
      blocks.push({ type: "heading", level: 1, content: line.replace(/^#\s+/, "") })
      i++
      continue
    }

    // Blockquote
    if (/^\s*>\s+/.test(line)) {
      blocks.push({ type: "blockquote", content: line.replace(/^\s*>\s+/, "") })
      i++
      continue
    }

    // Lists (collect contiguous lines)
    if (/^\s*([*-]|\d+\.)\s+/.test(line)) {
      const items: { text: string; indent: number }[] = []
      const ordered = /^\s*\d+\.\s+/.test(line)
      while (i < lines.length && /^\s*([*-]|\d+\.)\s+/.test(lines[i])) {
        const raw = lines[i]
        const indentSpaces = raw.match(/^\s*/)?.[0]?.length ?? 0
        const indent = Math.floor(indentSpaces / 4) // indent theo block 4 spaces
        const text = raw.replace(/^\s*([*-]|\d+\.)\s+/, "")
        items.push({ text, indent })
        i++
      }
      blocks.push({ type: "list", ordered, items })
      continue
    }

    // Default → paragraph. Hợp nhất các dòng paragraph liên tiếp
    const buf: string[] = [line]
    i++
    while (i < lines.length && lines[i].trim() !== "" && !/^(###|##|#|\s*>\s+|\s*([*-]|\d+\.)\s+|```|\s*---\s*$)/.test(lines[i])) {
      buf.push(lines[i])
      i++
    }
    blocks.push({ type: "paragraph", content: buf.join(" ") })
  }

  return blocks
}

export function FormattedMessage({ text, className = "" }: FormattedMessageProps) {
  const blocks = React.useMemo(() => parseBlocks(text), [text])

  return (
    <div className={`space-y-3 ${className}`}>
      {blocks.map((b, idx) => {
        switch (b.type) {
          case "heading": {
            const common = "font-serif font-bold"
            if (b.level === 1) return <h1 key={idx} className={`${common} text-xl`}>{renderInline(b.content, `h1-${idx}`)}</h1>
            if (b.level === 2) return <h2 key={idx} className={`${common} text-lg`}>{renderInline(b.content, `h2-${idx}`)}</h2>
            return <h3 key={idx} className={`${common} text-base`}>{renderInline(b.content, `h3-${idx}`)}</h3>
          }
          case "hr":
            return <hr key={idx} className="border-muted" />
          case "blockquote":
            return (
              <blockquote key={idx} className="border-l-4 border-muted pl-3 text-muted-foreground">
                {renderInline(b.content, `bq-${idx}`)}
              </blockquote>
            )
          case "codeblock":
            return (
              <pre
                key={idx}
                className="overflow-x-auto rounded-xl bg-muted p-3 text-sm leading-relaxed"
                aria-label={b.language ? `code ${b.language}` : "code"}
              >
                <code className="font-mono">{b.content}</code>
              </pre>
            )
          case "list": {
            // Render list phẳng theo indent bằng padding; không lồng <ul> trong <ul> để giảm độ phức tạp
            return (
              <div key={idx} className="space-y-1">
                {b.items.map((it, i2) => (
                  <div key={i2} className={`flex ${it.indent ? `pl-${Math.min(it.indent, 4) * 4}` : ""}`}>
                    {/* marker */}
                    <div className="select-none pr-2 text-muted-foreground">
                      {b.ordered ? `${i2 + 1}.` : "•"}
                    </div>
                    <div className="min-w-0">
                      {renderInline(it.text, `li-${idx}-${i2}`)}
                    </div>
                  </div>
                ))}
              </div>
            )
          }
          case "paragraph":
            // Dòng trống → tạo spacing nhỏ
            if (b.content.trim() === "") return <div key={idx} className="h-2" />
            return <p key={idx}>{renderInline(b.content, `p-${idx}`)}</p>
          default:
            return null
        }
      })}
    </div>
  )
}

export default FormattedMessage
