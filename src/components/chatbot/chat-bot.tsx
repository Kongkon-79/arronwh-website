


// "use client"

// import type React from "react"

// import { useState, useRef, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Bot, MessageSquareText, Send, Sparkles, X } from "lucide-react"
// import { cn } from "@/lib/utils"
// import { usePathname, useRouter, useSearchParams } from "next/navigation"

// interface Message {
//   id: string
//   sender: "user" | "bot"
//   text: string
//   html?: string
// }

// interface PreviousChatItem {
//   user_query: string
//   ai_response: string
// }

// export function ChatBot() {
//   const [isOpen, setIsOpen] = useState(false)
//   const [input, setInput] = useState("")
//   const [showBlink, setShowBlink] = useState(true)
//   const pathname = usePathname()
//   const router = useRouter()
//   const searchParams = useSearchParams()

//   const [messages, setMessages] = useState<Message[]>([
//     {
//       id: "bot-welcome",
//       sender: "bot",
//       text: "Hi, I’m your ArronWH assistant. Ask me anything about boilers, controllers, prices, or installation.",
//     },
//   ])

//   const [isLoading, setIsLoading] = useState(false)

//   const chatRef = useRef<HTMLDivElement>(null)
//   const chatScrollRef = useRef<HTMLDivElement>(null)
//   const messagesEndRef = useRef<HTMLDivElement>(null)

//   const quickPrompts = [
//     "Controller prices",
//     "Best boiler for my home",
//     "Installation timeline",
//   ]

//   // const API_ENDPOINT = "http://72.62.213.212:8000/api/ai/chatbot"

//   // Blink animation only once
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setShowBlink(false)
//     }, 3500)

//     return () => clearTimeout(timer)
//   }, [])

//   // Handle outside click
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         chatRef.current &&
//         !chatRef.current.contains(event.target as Node) &&
//         isOpen
//       ) {
//         setIsOpen(false)
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside)

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside)
//     }
//   }, [isOpen])

//   // Auto scroll
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({
//       behavior: "smooth",
//     })
//   }, [messages])

//   // Lock background scroll
//   useEffect(() => {
//     if (!isOpen) return

//     const previousOverflow = document.body.style.overflow
//     document.body.style.overflow = "hidden"

//     return () => {
//       document.body.style.overflow = previousOverflow
//     }
//   }, [isOpen])

//   // Open chat automatically when `?openChat=1` is present.
//   useEffect(() => {
//     const shouldOpenChat = searchParams.get("openChat") === "1"
//     if (!shouldOpenChat) return

//     setIsOpen(true)

//     const params = new URLSearchParams(searchParams.toString())
//     params.delete("openChat")
//     const nextQuery = params.toString()
//     router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
//       scroll: false,
//     })
//   }, [pathname, router, searchParams])

//   const buildPreviousChat = (
//     chatMessages: Message[]
//   ): PreviousChatItem[] => {
//     const previousChat: PreviousChatItem[] = []

//     for (let i = 0; i < chatMessages.length; i += 1) {
//       if (chatMessages[i].sender !== "user") continue

//       const aiReply = chatMessages
//         .slice(i + 1)
//         .find((msg) => msg.sender === "bot")

//       if (!aiReply) continue

//       previousChat.push({
//         user_query: chatMessages[i].text,
//         ai_response: aiReply.text,
//       })
//     }

//     return previousChat
//   }

//   const htmlToPlainText = (value: string): string => {
//     if (typeof window === "undefined") return value

//     const parser = new DOMParser()
//     const doc = parser.parseFromString(value, "text/html")
//     const body = doc.body
//     if (!body) return value.trim()

//     return (body.textContent || "").trim()
//   }

//   const sanitizeHtml = (value: string): string => {
//     if (typeof window === "undefined") return value

//     const parser = new DOMParser()
//     const doc = parser.parseFromString(value, "text/html")
//     const body = doc.body
//     if (!body) return value.trim()

//     const allowedTags = new Set([
//       "p",
//       "br",
//       "strong",
//       "b",
//       "em",
//       "i",
//       "u",
//       "a",
//       "ul",
//       "ol",
//       "li",
//       "span",
//       "div",
//       "code",
//     ])

//     const cleanNode = (node: Node) => {
//       if (node.nodeType === Node.ELEMENT_NODE) {
//         const element = node as HTMLElement
//         const tagName = element.tagName.toLowerCase()

//         if (!allowedTags.has(tagName)) {
//           const parent = element.parentNode
//           if (parent) {
//             while (element.firstChild) {
//               parent.insertBefore(element.firstChild, element)
//             }
//             parent.removeChild(element)
//           }
//           return
//         }

//         const attributes = [...element.attributes]
//         for (const attribute of attributes) {
//           const name = attribute.name.toLowerCase()
//           if (tagName === "a" && (name === "href" || name === "target")) {
//             continue
//           }
//           element.removeAttribute(attribute.name)
//         }

//         if (tagName === "a") {
//           const href = element.getAttribute("href") || ""
//           const safeHref =
//             href.startsWith("http://") ||
//             href.startsWith("https://") ||
//             href.startsWith("/")
//           if (!safeHref) {
//             element.removeAttribute("href")
//           }
//           element.setAttribute("rel", "noopener noreferrer")
//           if (element.getAttribute("target") === "_blank") {
//             element.setAttribute("target", "_blank")
//           } else {
//             element.removeAttribute("target")
//           }
//         }
//       }

//       const children = [...node.childNodes]
//       for (const child of children) {
//         cleanNode(child)
//       }
//     }

//     cleanNode(body)
//     return body.innerHTML.trim()
//   }

//   const decodeHtmlEntities = (value: string): string => {
//     if (typeof window === "undefined") return value

//     const parser = new DOMParser()
//     const doc = parser.parseFromString(value, "text/html")
//     const body = doc.body
//     if (!body) return value
//     return body.textContent || value
//   }

//   const formatBotMessage = (value: string): { text: string; html?: string } => {
//     const trimmed = value.trim()
//     if (!trimmed) return { text: "" }

//     const decoded = decodeHtmlEntities(trimmed)
//     const isHtml = /<\/?[a-z][\s\S]*>/i.test(decoded)

//     if (isHtml) {
//       const sanitized = sanitizeHtml(decoded)
//       return {
//         text: htmlToPlainText(sanitized) || trimmed,
//         html: sanitized,
//       }
//     }

//     return { text: decoded }
//   }

//   const extractStreamText = (chunk: string): string => {
//     const lines = chunk.split(/\r?\n/)
//     const dataLines = lines
//       .filter((line) => line.startsWith("data:"))
//       .map((line) => line.replace(/^data:\s?/, "").trim())
//       .filter((line) => line && line !== "[DONE]")

//     if (dataLines.length === 0) return chunk

//     let built = ""

//     for (const line of dataLines) {
//       try {
//         const parsed = JSON.parse(line)
//         const candidate =
//           (typeof parsed === "string" && parsed) ||
//           parsed?.response ||
//           parsed?.message ||
//           parsed?.data ||
//           parsed?.text ||
//           parsed?.delta?.content

//         if (typeof candidate === "string") {
//           built += candidate
//         }
//       } catch {
//         built += line
//       }
//     }

//     return built
//   }

//   const handleSendMessage = async (e?: React.FormEvent) => {
//     if (e) e.preventDefault()

//     const trimmedInput = input.trim()

//     if (!trimmedInput) return

//     const userMessage = trimmedInput

//     const updatedMessages = [
//       ...messages,
//       {
//         id: `user-${Date.now()}-${Math.random()
//           .toString(36)
//           .slice(2, 8)}`,
//         sender: "user" as const,
//         text: userMessage,
//       },
//     ]

//     setMessages(updatedMessages)
//     setInput("")
//     setIsLoading(true)

//     try {
//       const response = await fetch("/api/chatbot", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           accept: "text/event-stream",
//         },
//         body: JSON.stringify({
//           previous_chat: buildPreviousChat(messages),
//           user_query: userMessage,
//         }),
//       })

//       if (!response.ok) {
//         throw new Error(`Request failed with status ${response.status}`)
//       }

//       const botId = `bot-${Date.now()}-${Math.random()
//         .toString(36)
//         .slice(2, 8)}`

//       setMessages((prev) => [
//         ...prev,
//         {
//           id: botId,
//           sender: "bot",
//           text: "",
//         },
//       ])

//       const reader = response.body?.getReader()

//       if (!reader) {
//         throw new Error("No response stream found.")
//       }

//       const decoder = new TextDecoder()
//       let streamedText = ""

//       while (true) {
//         const { done, value } = await reader.read()
//         if (done) break

//         const chunk = decoder.decode(value, { stream: true })
//         const parsedChunk = extractStreamText(chunk)

//         if (!parsedChunk) continue

//         streamedText += parsedChunk
//         setIsLoading(false)
//         const formatted = formatBotMessage(streamedText)

//         setMessages((prev) =>
//           prev.map((msg) =>
//             msg.id === botId
//               ? {
//                   ...msg,
//                   text: formatted.text,
//                   html: formatted.html,
//                 }
//               : msg,
//           ),
//         )
//       }

//       const finalChunk = decoder.decode()
//       if (finalChunk) {
//         streamedText += extractStreamText(finalChunk)
//       }

//       const normalizedText = streamedText.trim()

//       if (normalizedText) {
//         const formatted = formatBotMessage(normalizedText)

//         setMessages((prev) =>
//           prev.map((msg) =>
//             msg.id === botId
//               ? {
//                   ...msg,
//                   text: formatted.text,
//                   html: formatted.html,
//                 }
//               : msg,
//           ),
//         )
//       } else {
//         setMessages((prev) => [
//           ...prev.filter((msg) => msg.id !== botId),
//           {
//             id: botId,
//             sender: "bot",
//             text: "I received your message but couldn’t read a proper response. Please try again.",
//           },
//         ])
//       }
//     } catch (error) {
//       console.error("Error sending message:", error)

//       setMessages((prev) => [
//         ...prev,
//         {
//           id: `bot-${Date.now()}-${Math.random()
//             .toString(36)
//             .slice(2, 8)}`,
//           sender: "bot",
//           text: "Sorry, something went wrong while contacting support AI. Please try again in a moment.",
//         },
//       ])
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleQuickPrompt = (prompt: string) => {
//     if (isLoading) return

//     setInput(prompt)
//   }

//   const handleChatWheelCapture = (
//     e: React.WheelEvent<HTMLDivElement>
//   ) => {
//     const container = chatScrollRef.current

//     if (!container) return

//     const {
//       scrollTop,
//       scrollHeight,
//       clientHeight,
//     } = container

//     const isAtTop = scrollTop <= 0

//     const isAtBottom =
//       scrollTop + clientHeight >= scrollHeight - 1

//     const isScrollingDown = e.deltaY > 0
//     const isScrollingUp = e.deltaY < 0

//     if (
//       (isScrollingDown && !isAtBottom) ||
//       (isScrollingUp && !isAtTop)
//     ) {
//       e.preventDefault()
//       e.stopPropagation()

//       container.scrollTop += e.deltaY
//     }
//   }

//   return (
//     <div className="fixed bottom-24 right-[36px] z-50">
//       {/* Chat Button */}
//       {!isOpen && (
//         <div className="relative">
//           {/* Blink Animation */}
//           {showBlink && (
//             <>
//               <span className="absolute inset-0 rounded-full bg-[#0A4229]/40 animate-ping"></span>

//               <span className="absolute inset-0 rounded-full border-4 border-[#0A4229] animate-pulse"></span>
//             </>
//           )}

//           <button
//             onClick={() => setIsOpen(true)}
//             className="relative h-12 w-12 rounded-full flex justify-center items-center shadow-xl bg-[#0A4229] border border-white/20 hover:scale-105 transition-transform duration-300"
//             aria-label="Open chat support"
//           >
//             <MessageSquareText className="h-5 w-5 text-white" />
//           </button>
//         </div>
//       )}

//       {/* Chat Window */}
//       {isOpen && (
//         <div
//           ref={chatRef}
//           className="animate-in fade-in slide-in-from-bottom-10 duration-300"
//         >
//           <Card className="w-[92vw] sm:w-[420px] h-[560px] shadow-2xl border-slate-200 flex flex-col overflow-hidden rounded-3xl bg-white">
//             <CardHeader className="bg-gradient-to-r from-[#0A4229] to-[#0a3523] text-white p-4 flex flex-row justify-between items-center rounded-t-3xl flex-shrink-0">
//               <div className="flex items-center gap-3">
//                 <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
//                   <Bot className="h-5 w-5" />
//                 </span>

//                 <div>
//                   <p className="font-semibold leading-tight">
//                     ArronWH Assistant
//                   </p>

//                   <p className="text-xs text-white/80">
//                     Online now • Fast replies
//                   </p>
//                 </div>
//               </div>

//               <Button
//                 variant="ghost"
//                 size="icon"
//                 onClick={() => setIsOpen(false)}
//                 className="h-9 w-9 text-white hover:bg-white/10 rounded-full"
//               >
//                 <X className="h-5 w-5" />
//               </Button>
//             </CardHeader>

//             <CardContent
//               ref={chatScrollRef}
//               onWheelCapture={handleChatWheelCapture}
//               className="p-4 flex-grow overflow-y-auto overscroll-contain touch-pan-y bg-gradient-to-b from-slate-50 to-white"
//             >
//               <div className="space-y-4">
//                 {messages.map((msg) => (
//                   <div
//                     key={msg.id}
//                     className={cn(
//                       "max-w-[88%] p-3.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm",
//                       msg.sender === "user"
//                         ? "bg-[#0A4229] text-white ml-auto rounded-br-md"
//                         : "bg-white border border-slate-200 text-gray-800 rounded-bl-md"
//                     )}
//                   >
//                     {msg.sender === "bot" && msg.html ? (
//                       <div
//                         className="[&>p]:mb-2 [&>p:last-child]:mb-0 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-1 [&_a]:font-medium [&_a]:text-[#0A4229] [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-[#0a3523]"
//                         dangerouslySetInnerHTML={{ __html: msg.html }}
//                       />
//                     ) : (
//                       msg.text
//                     )}
//                   </div>
//                 ))}

//                 {isLoading && (
//                   <div className="bg-white border border-slate-200 text-gray-800 max-w-[18%] p-3 rounded-2xl rounded-bl-md shadow-sm">
//                     <div className="flex space-x-2">
//                       <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
//                       <div
//                         className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
//                         style={{ animationDelay: "150ms" }}
//                       ></div>
//                       <div
//                         className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
//                         style={{ animationDelay: "300ms" }}
//                       ></div>
//                     </div>
//                   </div>
//                 )}

//                 {!isLoading && messages.length <= 2 && (
//                   <div className="pt-1">
//                     <p className="text-xs text-slate-500 mb-2 flex items-center gap-1.5">
//                       <Sparkles className="h-3.5 w-3.5" />
//                       Try a quick question
//                     </p>

//                     <div className="flex flex-wrap gap-2">
//                       {quickPrompts.map((prompt) => (
//                         <button
//                           key={prompt}
//                           type="button"
//                           onClick={() =>
//                             handleQuickPrompt(prompt)
//                           }
//                           className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs text-slate-700 hover:bg-slate-100 transition-colors"
//                         >
//                           {prompt}
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 <div ref={messagesEndRef} />
//               </div>
//             </CardContent>

//             <CardFooter className="p-3 border-t bg-white/95 backdrop-blur-sm flex-shrink-0">
//               <form
//                 onSubmit={handleSendMessage}
//                 className="flex w-full gap-2 max-w-full p-1 rounded-2xl border border-slate-200 bg-slate-50 focus-within:border-[#0A4229] transition-colors duration-200"
//               >
//                 <Input
//                   value={input}
//                   onChange={(e) =>
//                     setInput(e.target.value)
//                   }
//                   placeholder="Ask about prices, products, installation..."
//                   className="flex-1 min-w-0 border-0 bg-transparent shadow-none placeholder:text-[#616161] focus-visible:ring-0 focus-visible:ring-offset-0"
//                   disabled={isLoading}
//                 />

//                 <Button
//                   type="submit"
//                   size="icon"
//                   className="bg-[#0A4229] hover:bg-[#0a3523] flex-shrink-0 rounded-xl"
//                   disabled={
//                     isLoading || !input.trim()
//                   }
//                 >
//                   <Send className="h-4 w-4 text-white" />
//                 </Button>
//               </form>
//             </CardFooter>
//           </Card>
//         </div>
//       )}
//     </div>
//   )
// }


"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Bot, MessageSquareText, Send, Sparkles, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

interface Message {
  id: string
  sender: "user" | "bot"
  text: string
  html?: string
}

interface PreviousChatItem {
  user_query: string
  ai_response: string
}

const URL_REGEX = /(https?:\/\/[^\s<>"')\]]+)/gi
const MARKDOWN_LINK_REGEX = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/gi
const QUOTE_TOOL_URL = "https://arronwh-website.vercel.app/boilers/property-overview"
const QUOTE_TOOL_LABEL_REGEX = /\bstart\s+online\s+quote\s+tool\b/i

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const [showBlink, setShowBlink] = useState(true)
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "bot-welcome",
      sender: "bot",
      text: "Hi, I'm your ArronWH assistant. Ask me anything about boilers, controllers, prices, or installation.",
    },
  ])

  const [isLoading, setIsLoading] = useState(false)

  const chatRef = useRef<HTMLDivElement>(null)
  const chatScrollRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const quickPrompts = [
    "Controller prices",
    "Best boiler for my home",
    "Installation timeline",
  ]

  // Blink animation only once
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBlink(false)
    }, 3500)
    return () => clearTimeout(timer)
  }, [])

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        chatRef.current &&
        !chatRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Lock background scroll
  useEffect(() => {
    if (!isOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen])

  // Open chat automatically when ?openChat=1 is present
  useEffect(() => {
    const shouldOpenChat = searchParams.get("openChat") === "1"
    if (!shouldOpenChat) return
    setIsOpen(true)
    const params = new URLSearchParams(searchParams.toString())
    params.delete("openChat")
    const nextQuery = params.toString()
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
      scroll: false,
    })
  }, [pathname, router, searchParams])

  // ✅ Event delegation — একবার mount হলেই সব link handle করবে, re-render এ কোনো সমস্যা নেই
  useEffect(() => {
    const container = chatScrollRef.current
    if (!container) return

    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a[href]")
      if (!target) return

      const insideBotMessage = target.closest("[data-bot-html]")
      if (!insideBotMessage) return

      e.preventDefault()
      const href = (target as HTMLAnchorElement).getAttribute("href")
      if (href) window.open(href, "_blank", "noopener,noreferrer")
    }

    container.addEventListener("click", handleClick)
    return () => container.removeEventListener("click", handleClick)
  }, []) // ✅ empty dependency — runs once only

  const buildPreviousChat = (chatMessages: Message[]): PreviousChatItem[] => {
    const previousChat: PreviousChatItem[] = []
    for (let i = 0; i < chatMessages.length; i += 1) {
      if (chatMessages[i].sender !== "user") continue
      const aiReply = chatMessages
        .slice(i + 1)
        .find((msg) => msg.sender === "bot")
      if (!aiReply) continue
      previousChat.push({
        user_query: chatMessages[i].text,
        ai_response: aiReply.text,
      })
    }
    return previousChat
  }

  const htmlToPlainText = (value: string): string => {
    if (typeof window === "undefined") return value
    const parser = new DOMParser()
    const doc = parser.parseFromString(value, "text/html")
    const body = doc.body
    if (!body) return value.trim()
    return (body.textContent || "").trim()
  }

  const sanitizeHtml = (value: string): string => {
    if (typeof window === "undefined") return value
    const parser = new DOMParser()
    const doc = parser.parseFromString(value, "text/html")
    const body = doc.body
    if (!body) return value.trim()

    const allowedTags = new Set([
      "p", "br", "strong", "b", "em", "i", "u",
      "a", "ul", "ol", "li", "span", "div", "code",
    ])

    const cleanNode = (node: Node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement
        const tagName = element.tagName.toLowerCase()

        if (!allowedTags.has(tagName)) {
          const parent = element.parentNode
          if (parent) {
            while (element.firstChild) {
              parent.insertBefore(element.firstChild, element)
            }
            parent.removeChild(element)
          }
          return
        }

        const attributes = Array.from(element.attributes)
        for (const attribute of attributes) {
          const name = attribute.name.toLowerCase()
          if (tagName === "a" && (name === "href" || name === "target")) {
            continue
          }
          element.removeAttribute(attribute.name)
        }

        if (tagName === "a") {
          const href = element.getAttribute("href") || ""
          const safeHref =
            href.startsWith("http://") ||
            href.startsWith("https://") ||
            href.startsWith("/")
          if (!safeHref) {
            element.removeAttribute("href")
          }
          // ✅ সবসময় new tab এ খুলবে
          element.setAttribute("target", "_blank")
          element.setAttribute("rel", "noopener noreferrer")

          // ✅ Bold text আছে মানে এটা CTA button হবে
          const hasBold = element.querySelector("b, strong")
          if (hasBold) {
            element.setAttribute("data-cta", "true")
          }
        }
      }

      const children = Array.from(node.childNodes)
      for (const child of children) {
        cleanNode(child)
      }
    }

    cleanNode(body)
    return body.innerHTML.trim()
  }

  const decodeHtmlEntities = (value: string): string => {
    if (typeof window === "undefined") return value
    const parser = new DOMParser()
    const doc = parser.parseFromString(value, "text/html")
    const body = doc.body
    if (!body) return value
    return body.textContent || value
  }

  const formatBotMessage = (value: string): { text: string; html?: string } => {
    const trimmed = value.trim()
    if (!trimmed) return { text: "" }
    const decoded = decodeHtmlEntities(trimmed)
    const isHtml = /<\/?[a-z][\s\S]*>/i.test(decoded)
    if (isHtml) {
      const sanitized = sanitizeHtml(decoded)
      return {
        text: htmlToPlainText(sanitized) || trimmed,
        html: sanitized,
      }
    }
    return { text: decoded }
  }

  const extractStreamText = (chunk: string): string => {
    const lines = chunk.split(/\r?\n/)
    const dataLines = lines
      .filter((line) => line.startsWith("data:"))
      .map((line) => line.replace(/^data:\s?/, "").trim())
      .filter((line) => line && line !== "[DONE]")

    if (dataLines.length === 0) return chunk

    let built = ""
    for (const line of dataLines) {
      try {
        const parsed = JSON.parse(line)
        const candidate =
          (typeof parsed === "string" && parsed) ||
          parsed?.response ||
          parsed?.message ||
          parsed?.data ||
          parsed?.text ||
          parsed?.delta?.content
        if (typeof candidate === "string") {
          built += candidate
        }
      } catch {
        built += line
      }
    }
    return built
  }

  const renderTextWithLinks = (text: string) => {
    if (!text) return null

    const lines = text.split("\n")

    return lines.map((line, lineIndex) => {
      const markdownMatches = Array.from(line.matchAll(MARKDOWN_LINK_REGEX))

      if (markdownMatches.length > 0) {
        const nodes: React.ReactNode[] = []
        let cursor = 0

        markdownMatches.forEach((match, matchIndex) => {
          const fullMatch = match[0]
          const label = match[1]
          const href = match[2]
          const start = match.index ?? 0
          const end = start + fullMatch.length

          if (start > cursor) {
            nodes.push(
              <span key={`md-text-${lineIndex}-${matchIndex}`}>
                {line.slice(cursor, start)}
              </span>,
            )
          }

          nodes.push(
            <a
              key={`md-link-${lineIndex}-${matchIndex}`}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#0A4229] underline underline-offset-2 hover:text-[#0a3523]"
            >
              {label}
            </a>,
          )

          cursor = end
        })

        if (cursor < line.length) {
          nodes.push(
            <span key={`md-tail-${lineIndex}`}>
              {line.slice(cursor)}
            </span>,
          )
        }

        return (
          <span key={`line-${lineIndex}`}>
            {nodes}
            {lineIndex < lines.length - 1 && <br />}
          </span>
        )
      }

      const parts = line.split(URL_REGEX)

      return (
        <span key={`line-${lineIndex}`}>
          {parts.map((part, partIndex) => {
            const isUrl = /^https?:\/\/[^\s<>"')\]]+$/i.test(part)
            if (!isUrl) {
              if (!QUOTE_TOOL_LABEL_REGEX.test(part)) {
                return <span key={`text-${lineIndex}-${partIndex}`}>{part}</span>
              }

              const labelParts = part.split(QUOTE_TOOL_LABEL_REGEX)
              const matchLabel = part.match(QUOTE_TOOL_LABEL_REGEX)?.[0] ?? "Start Online Quote Tool"

              return (
                <span key={`label-wrap-${lineIndex}-${partIndex}`}>
                  {labelParts[0]}
                  <a
                    href={QUOTE_TOOL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#0A4229] underline underline-offset-2 hover:text-[#0a3523]"
                  >
                    {matchLabel}
                  </a>
                  {labelParts.slice(1).join(matchLabel)}
                </span>
              )
            }

            return (
              <a
                key={`url-${lineIndex}-${partIndex}`}
                href={part}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#0A4229] underline underline-offset-2 hover:text-[#0a3523]"
              >
                {part}
              </a>
            )
          })}
          {lineIndex < lines.length - 1 && <br />}
        </span>
      )
    })
  }

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const trimmedInput = input.trim()
    if (!trimmedInput) return

    const userMessage = trimmedInput
    const updatedMessages = [
      ...messages,
      {
        id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        sender: "user" as const,
        text: userMessage,
      },
    ]
    setMessages(updatedMessages)
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "text/event-stream",
        },
        body: JSON.stringify({
          previous_chat: buildPreviousChat(messages),
          user_query: userMessage,
        }),
      })

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      const botId = `bot-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
      setMessages((prev) => [
        ...prev,
        { id: botId, sender: "bot", text: "" },
      ])

      const reader = response.body?.getReader()
      if (!reader) throw new Error("No response stream found.")

      const decoder = new TextDecoder()
      let streamedText = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        const parsedChunk = extractStreamText(chunk)
        if (!parsedChunk) continue
        streamedText += parsedChunk
        setIsLoading(false)
        const formatted = formatBotMessage(streamedText)
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botId
              ? { ...msg, text: formatted.text, html: formatted.html }
              : msg
          )
        )
      }

      const finalChunk = decoder.decode()
      if (finalChunk) {
        streamedText += extractStreamText(finalChunk)
      }

      const normalizedText = streamedText.trim()
      if (normalizedText) {
        const formatted = formatBotMessage(normalizedText)
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botId
              ? { ...msg, text: formatted.text, html: formatted.html }
              : msg
          )
        )
      } else {
        setMessages((prev) => [
          ...prev.filter((msg) => msg.id !== botId),
          {
            id: botId,
            sender: "bot",
            text: "I received your message but couldn't read a proper response. Please try again.",
          },
        ])
      }
    } catch (error) {
      console.error("Error sending message:", error)
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          sender: "bot",
          text: "Sorry, something went wrong while contacting support AI. Please try again in a moment.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickPrompt = (prompt: string) => {
    if (isLoading) return
    setInput(prompt)
  }

  const handleChatWheelCapture = (e: React.WheelEvent<HTMLDivElement>) => {
    const container = chatScrollRef.current
    if (!container) return
    const { scrollTop, scrollHeight, clientHeight } = container
    const isAtTop = scrollTop <= 0
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1
    const isScrollingDown = e.deltaY > 0
    const isScrollingUp = e.deltaY < 0
    if (
      (isScrollingDown && !isAtBottom) ||
      (isScrollingUp && !isAtTop)
    ) {
      e.preventDefault()
      e.stopPropagation()
      container.scrollTop += e.deltaY
    }
  }

  return (
    <div className="fixed bottom-24 right-[36px] z-50">
      {/* Chat Button */}
      {!isOpen && (
        <div className="relative">
          {showBlink && (
            <>
              <span className="absolute inset-0 rounded-full bg-[#0A4229]/40 animate-ping"></span>
              <span className="absolute inset-0 rounded-full border-4 border-[#0A4229] animate-pulse"></span>
            </>
          )}
          <button
            onClick={() => setIsOpen(true)}
            className="relative h-12 w-12 rounded-full flex justify-center items-center shadow-xl bg-[#0A4229] border border-white/20 hover:scale-105 transition-transform duration-300"
            aria-label="Open chat support"
          >
            <MessageSquareText className="h-5 w-5 text-white" />
          </button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          ref={chatRef}
          className="animate-in fade-in slide-in-from-bottom-10 duration-300"
        >
          <Card className="w-[92vw] sm:w-[420px] h-[560px] shadow-2xl border-slate-200 flex flex-col overflow-hidden rounded-3xl bg-white">
            <CardHeader className="bg-gradient-to-r from-[#0A4229] to-[#0a3523] text-white p-4 flex flex-row justify-between items-center rounded-t-3xl flex-shrink-0">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                  <Bot className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold leading-tight">ArronWH Assistant</p>
                  <p className="text-xs text-white/80">Online now • Fast replies</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-9 w-9 text-white hover:bg-white/10 rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </CardHeader>

            <CardContent
              ref={chatScrollRef}
              onWheelCapture={handleChatWheelCapture}
              className="p-4 flex-grow overflow-y-auto overscroll-contain touch-pan-y bg-gradient-to-b from-slate-50 to-white"
            >
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "max-w-[88%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm",
                      msg.sender === "user"
                        ? "bg-[#0A4229] text-white ml-auto rounded-br-md"
                        : "bg-white border border-slate-200 text-gray-800 rounded-bl-md"
                    )}
                  >
                    {msg.sender === "bot" && msg.html ? (
                      <div
                        data-bot-html="true"
                        className={cn(
                          // paragraph spacing
                          "[&>p]:mb-2 [&>p:last-child]:mb-0",
                          // list styling
                          "[&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5",
                          "[&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5",
                          "[&_li]:my-1.5",
                          // ✅ সাধারণ inline link — সবুজ underline
                          "[&_a:not([data-cta])]:text-[#0A4229]",
                          "[&_a:not([data-cta])]:font-semibold",
                          "[&_a:not([data-cta])]:underline",
                          "[&_a:not([data-cta])]:underline-offset-2",
                          "[&_a:not([data-cta])]:cursor-pointer",
                          "hover:[&_a:not([data-cta])]:text-[#0a3523]",
                          // ✅ CTA link — সবুজ button style
                          "[&_a[data-cta]]:inline-flex",
                          "[&_a[data-cta]]:items-center",
                          "[&_a[data-cta]]:gap-1.5",
                          "[&_a[data-cta]]:bg-[#0A4229]",
                          "[&_a[data-cta]]:text-white",
                          "[&_a[data-cta]]:no-underline",
                          "[&_a[data-cta]]:text-xs",
                          "[&_a[data-cta]]:font-semibold",
                          "[&_a[data-cta]]:px-3.5",
                          "[&_a[data-cta]]:py-1.5",
                          "[&_a[data-cta]]:rounded-lg",
                          "[&_a[data-cta]]:my-1",
                          "[&_a[data-cta]]:cursor-pointer",
                          "[&_a[data-cta]]:transition-colors",
                          "[&_a[data-cta]]:duration-150",
                          "hover:[&_a[data-cta]]:bg-[#0a3523]",
                        )}
                        dangerouslySetInnerHTML={{ __html: msg.html }}
                      />
                    ) : (
                      <p className="whitespace-pre-wrap">{renderTextWithLinks(msg.text)}</p>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="bg-white border border-slate-200 text-gray-800 max-w-[18%] p-3 rounded-2xl rounded-bl-md shadow-sm">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                      <div
                        className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                  </div>
                )}

                {!isLoading && messages.length <= 2 && (
                  <div className="pt-1">
                    <p className="text-xs text-slate-500 mb-2 flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5" />
                      Try a quick question
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {quickPrompts.map((prompt) => (
                        <button
                          key={prompt}
                          type="button"
                          onClick={() => handleQuickPrompt(prompt)}
                          className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </CardContent>

            <CardFooter className="p-3 border-t bg-white/95 backdrop-blur-sm flex-shrink-0">
              <form
                onSubmit={handleSendMessage}
                className="flex w-full gap-2 max-w-full p-1 rounded-2xl border border-slate-200 bg-slate-50 focus-within:border-[#0A4229] transition-colors duration-200"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about prices, products, installation..."
                  className="flex-1 min-w-0 border-0 bg-transparent shadow-none placeholder:text-[#616161] focus-visible:ring-0 focus-visible:ring-offset-0"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  size="icon"
                  className="bg-[#0A4229] hover:bg-[#0a3523] flex-shrink-0 rounded-xl"
                  disabled={isLoading || !input.trim()}
                >
                  <Send className="h-4 w-4 text-white" />
                </Button>
              </form>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}
