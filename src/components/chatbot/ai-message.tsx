"use client"

import DOMPurify from "dompurify"

interface AIMessageProps {
  content: string
}

const stripHtmlCodeFence = (value: string): string => {
  const trimmed = value.trim()
  const fencedMatch = trimmed.match(/^```(?:html|xml)?\s*([\s\S]*?)\s*```$/i)
  return fencedMatch ? fencedMatch[1].trim() : trimmed
}

const decodeEscapedHtml = (value: string): string => {
  if (typeof window === "undefined") return value
  let decoded = value

  // Decode nested entities (e.g. &amp;lt;p&amp;gt; => <p>)
  for (let i = 0; i < 3; i += 1) {
    const textarea = document.createElement("textarea")
    textarea.innerHTML = decoded
    const next = textarea.value
    if (next === decoded) break
    decoded = next
  }

  return decoded
}

export default function AIMessage({ content }: AIMessageProps) {
  const normalizedContent = stripHtmlCodeFence(content || "")
  const decodedContent = decodeEscapedHtml(normalizedContent)
  const sanitizedHtml = DOMPurify.sanitize(decodedContent, {
    ADD_ATTR: ["target", "rel"],
  })

  const safeHtml = (() => {
    if (typeof window === "undefined") return sanitizedHtml
    const doc = new DOMParser().parseFromString(sanitizedHtml, "text/html")
    const anchors = doc.querySelectorAll("a[href]")
    anchors.forEach((anchor) => {
      anchor.setAttribute("target", "_blank")
      anchor.setAttribute("rel", "noopener noreferrer")
    })
    return doc.body.innerHTML
  })()

  return (
    <div
      data-bot-html="true"
      className="max-w-none text-sm leading-relaxed [&>p]:mb-2 [&>p:last-child]:mb-0 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-1.5 [&_li]:ml-5 [&_a]:font-semibold [&_a]:text-[#0A4229] [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-[#0a3523] [&_a[data-cta]]:inline-flex [&_a[data-cta]]:items-center [&_a[data-cta]]:gap-1.5 [&_a[data-cta]]:rounded-lg [&_a[data-cta]]:bg-[#0A4229] [&_a[data-cta]]:px-3.5 [&_a[data-cta]]:py-1.5 [&_a[data-cta]]:text-xs [&_a[data-cta]]:text-white [&_a[data-cta]]:no-underline hover:[&_a[data-cta]]:bg-[#0a3523]"
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  )
}
