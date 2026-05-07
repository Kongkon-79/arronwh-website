// "use client"

// import type React from "react"

// import { useState, useRef, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Bot, MessageSquareText, Send, Sparkles, X } from "lucide-react"
// import { cn } from "@/lib/utils"

// interface Message {
//   id: string
//   sender: "user" | "bot"
//   text: string
// }

// interface PreviousChatItem {
//   user_query: string
//   ai_response: string
// }

// export function ChatBot() {
//   const [isOpen, setIsOpen] = useState(false)
//   const [input, setInput] = useState("")
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
//   // const API_ENDPOINT = "https://arronwh.onrender.com/api/ai/chatbot"
//   const quickPrompts = [
//     "Controller prices",
//     "Best boiler for my home",
//     "Installation timeline",
//   ]
//   const API_ENDPOINT = "http://72.62.213.212:8000/api/ai/chatbot"

//   // Handle outside click to close the chat
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (chatRef.current && !chatRef.current.contains(event.target as Node) && isOpen) {
//         setIsOpen(false)
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside)
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside)
//     }
//   }, [isOpen])

//   // Scroll to bottom of messages
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
//   }, [messages])

//   // Lock background page scroll while chat is open.
//   useEffect(() => {
//     if (!isOpen) return

//     const previousOverflow = document.body.style.overflow
//     document.body.style.overflow = "hidden"

//     return () => {
//       document.body.style.overflow = previousOverflow
//     }
//   }, [isOpen])

//   const buildPreviousChat = (chatMessages: Message[]): PreviousChatItem[] => {
//     const previousChat: PreviousChatItem[] = []

//     for (let i = 0; i < chatMessages.length; i += 1) {
//       if (chatMessages[i].sender !== "user") continue

//       const aiReply = chatMessages.slice(i + 1).find((msg) => msg.sender === "bot")
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
//     return (doc.body.textContent || "").trim()
//   }

//   const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

//   const typeBotMessage = async (fullText: string) => {
//     const typingText = fullText.trim()
//     if (!typingText) return

//     const botId = `bot-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
//     setMessages((prev) => [...prev, { id: botId, sender: "bot", text: "" }])

//     const tokens = typingText.split(/(\s+)/).filter((token) => token.length > 0)
//     let built = ""

//     for (const token of tokens) {
//       built += token
//       setMessages((prev) => {
//         return prev.map((msg) => (msg.id === botId ? { ...msg, text: built } : msg))
//       })

//       const delay = /\s+/.test(token) ? 25 : 55
//       await sleep(delay)
//     }
//   }

//   const handleSendMessage = async (e?: React.FormEvent) => {
//     if (e) e.preventDefault()

//     const trimmedInput = input.trim()
//     if (!trimmedInput) return

//     const userMessage = trimmedInput
//     const updatedMessages = [
//       ...messages,
//       { id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, sender: "user" as const, text: userMessage },
//     ]
//     setMessages(updatedMessages)
//     setInput("")
//     setIsLoading(true)

//     try {
//       const response = await fetch(API_ENDPOINT, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           accept: "application/json",
//         },
//         body: JSON.stringify({
//           previous_chat: buildPreviousChat(messages),
//           user_query: userMessage,
//         }),
//       })

//       if (!response.ok) {
//         throw new Error(`Request failed with status ${response.status}`)
//       }

//       const rawResponse = await response.text()
//       let botText = ""

//       try {
//         const parsed = JSON.parse(rawResponse)
//         const candidate =
//           (typeof parsed === "string" && parsed) ||
//           parsed?.response ||
//           parsed?.message ||
//           parsed?.data ||
//           parsed?.text

//         if (typeof candidate === "string") {
//           botText = candidate.trim()
//         }
//       } catch {
//         botText = rawResponse.trim()
//       }

//       if (botText) {
//         const isHtml = /<\/?[a-z][\s\S]*>/i.test(botText)
//         const textForTyping = isHtml ? htmlToPlainText(botText) : botText
//         await typeBotMessage(textForTyping)
//       } else {
//         setMessages((prev) => [
//           ...prev,
//           {
//             id: `bot-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
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
//           id: `bot-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
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

//   const handleChatWheelCapture = (e: React.WheelEvent<HTMLDivElement>) => {
//     const container = chatScrollRef.current
//     if (!container) return

//     const { scrollTop, scrollHeight, clientHeight } = container
//     const isAtTop = scrollTop <= 0
//     const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1
//     const isScrollingDown = e.deltaY > 0
//     const isScrollingUp = e.deltaY < 0

//     // When chat can consume scroll, keep wheel inside chat and block page scroll.
//     if ((isScrollingDown && !isAtBottom) || (isScrollingUp && !isAtTop)) {
//       e.preventDefault()
//       e.stopPropagation()
//       container.scrollTop += e.deltaY
//     }
//   }

//   return (
//     <div className="fixed bottom-24 right-[33px] z-50">
//       {/* Chat Button */}
//       {!isOpen && (
//         <button
//           onClick={() => setIsOpen(true)}
//           className="h-12 w-12 rounded-full flex justify-center items-center shadow-xl bg-[#0A4229]  border border-white/20 hover:scale-105 transition-transform duration-300"
//           aria-label="Open chat support"
//         >
//           <MessageSquareText className="h-5 w-5 text-white " />
//         </button>
//       )}

//       {/* Chat Window */}
//       {isOpen && (
//         <div ref={chatRef} className="animate-in fade-in slide-in-from-bottom-10 duration-300">
//           <Card className="w-[92vw] sm:w-[420px] h-[560px] shadow-2xl border-slate-200 flex flex-col overflow-hidden rounded-3xl bg-white">
//             <CardHeader className="bg-gradient-to-r from-[#0A4229] to-[#0a3523] text-white p-4 flex flex-row justify-between items-center rounded-t-3xl flex-shrink-0">
//               <div className="flex items-center gap-3">
//                 <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
//                   <Bot className="h-5 w-5" />
//                 </span>
//                 <div>
//                   <p className="font-semibold leading-tight">ArronWH Assistant</p>
//                   <p className="text-xs text-white/80">Online now • Fast replies</p>
//                 </div>
//               </div>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 onClick={() => setIsOpen(false)}
//                 className="h-9 w-9 text-white hover:bg-white/10 rounded-full"
//                 aria-label="Close chat support"
//               >
//                 <X className="h-5 w-5" />
//               </Button>
//             </CardHeader>

//             <CardContent
//               ref={chatScrollRef}
//               onWheelCapture={handleChatWheelCapture}
//               className="p-4 flex-grow overflow-y-auto overscroll-contain touch-pan-y bg-gradient-to-b from-slate-50 to-white"
//             >
//               {messages.length === 0 ? (
//                 <div className="h-full flex items-center justify-center text-gray-500">
//                   <p className="text-center">Send a message to start chatting!</p>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {messages.map((msg) => (
//                     <div
//                       key={msg.id}
//                       className={cn(
//                         "max-w-[88%] p-3.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm",
//                         msg.sender === "user"
//                           ? "bg-[#0A4229] text-white ml-auto rounded-br-md"
//                           : "bg-white border border-slate-200 text-gray-800 rounded-bl-md",
//                       )}
//                     >
//                       {msg.text}
//                     </div>
//                   ))}
//                   {isLoading && (
//                     <div className="bg-white border border-slate-200 text-gray-800 max-w-[30%] p-3 rounded-2xl rounded-bl-md shadow-sm">
//                       <div className="flex space-x-2">
//                         <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }} />
//                         <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }} />
//                         <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }} />
//                       </div>
//                     </div>
//                   )}
//                   {!isLoading && messages.length <= 2 && (
//                     <div className="pt-1">
//                       <p className="text-xs text-slate-500 mb-2 flex items-center gap-1.5">
//                         <Sparkles className="h-3.5 w-3.5" />
//                         Try a quick question
//                       </p>
//                       <div className="flex flex-wrap gap-2">
//                         {quickPrompts.map((prompt) => (
//                           <button
//                             key={prompt}
//                             type="button"
//                             onClick={() => handleQuickPrompt(prompt)}
//                             className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs text-slate-700 hover:bg-slate-100 transition-colors"
//                           >
//                             {prompt}
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                   <div ref={messagesEndRef} />
//                 </div>
//               )}
//             </CardContent>

//             <CardFooter className="p-3 border-t bg-white/95 backdrop-blur-sm flex-shrink-0">
//           <form
//   onSubmit={handleSendMessage}
//   className="flex w-full gap-2 max-w-full p-1 rounded-2xl border border-slate-200 bg-slate-50 focus-within:border-[#0A4229] transition-colors duration-200"
// >
//   <Input
//     value={input}
//     onChange={(e) => setInput(e.target.value)}
//     placeholder="Ask about prices, products, installation..."
//     className="flex-1 min-w-0 border-0 bg-transparent shadow-none placeholder:text-[#616161] focus-visible:ring-0 focus-visible:ring-offset-0"
//     disabled={isLoading}
//   />

//   <Button
//     type="submit"
//     size="icon"
//     className="bg-[#0A4229] hover:bg-[#0a3523] flex-shrink-0 rounded-xl"
//     disabled={isLoading || !input.trim()}
//     aria-label="Send message"
//   >
//     <Send className="h-4 w-4 text-white" />
//   </Button>
// </form>
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

interface Message {
  id: string
  sender: "user" | "bot"
  text: string
}

interface PreviousChatItem {
  user_query: string
  ai_response: string
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const [showBlink, setShowBlink] = useState(true)

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "bot-welcome",
      sender: "bot",
      text: "Hi, I’m your ArronWH assistant. Ask me anything about boilers, controllers, prices, or installation.",
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

  const API_ENDPOINT = "http://72.62.213.212:8000/api/ai/chatbot"

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
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    })
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

  const buildPreviousChat = (
    chatMessages: Message[]
  ): PreviousChatItem[] => {
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

    return (doc.body.textContent || "").trim()
  }

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms))

  const typeBotMessage = async (fullText: string) => {
    const typingText = fullText.trim()

    if (!typingText) return

    const botId = `bot-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`

    setMessages((prev) => [
      ...prev,
      {
        id: botId,
        sender: "bot",
        text: "",
      },
    ])

    const tokens = typingText
      .split(/(\s+)/)
      .filter((token) => token.length > 0)

    let built = ""

    for (const token of tokens) {
      built += token

      setMessages((prev) => {
        return prev.map((msg) =>
          msg.id === botId
            ? {
                ...msg,
                text: built,
              }
            : msg
        )
      })

      const delay = /\s+/.test(token) ? 25 : 55

      await sleep(delay)
    }
  }

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    const trimmedInput = input.trim()

    if (!trimmedInput) return

    const userMessage = trimmedInput

    const updatedMessages = [
      ...messages,
      {
        id: `user-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}`,
        sender: "user" as const,
        text: userMessage,
      },
    ]

    setMessages(updatedMessages)
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          previous_chat: buildPreviousChat(messages),
          user_query: userMessage,
        }),
      })

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      const rawResponse = await response.text()

      let botText = ""

      try {
        const parsed = JSON.parse(rawResponse)

        const candidate =
          (typeof parsed === "string" && parsed) ||
          parsed?.response ||
          parsed?.message ||
          parsed?.data ||
          parsed?.text

        if (typeof candidate === "string") {
          botText = candidate.trim()
        }
      } catch {
        botText = rawResponse.trim()
      }

      if (botText) {
        const isHtml = /<\/?[a-z][\s\S]*>/i.test(botText)

        const textForTyping = isHtml
          ? htmlToPlainText(botText)
          : botText

        await typeBotMessage(textForTyping)
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}-${Math.random()
              .toString(36)
              .slice(2, 8)}`,
            sender: "bot",
            text: "I received your message but couldn’t read a proper response. Please try again.",
          },
        ])
      }
    } catch (error) {
      console.error("Error sending message:", error)

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2, 8)}`,
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

  const handleChatWheelCapture = (
    e: React.WheelEvent<HTMLDivElement>
  ) => {
    const container = chatScrollRef.current

    if (!container) return

    const {
      scrollTop,
      scrollHeight,
      clientHeight,
    } = container

    const isAtTop = scrollTop <= 0

    const isAtBottom =
      scrollTop + clientHeight >= scrollHeight - 1

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
          {/* Blink Animation */}
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
                  <p className="font-semibold leading-tight">
                    ArronWH Assistant
                  </p>

                  <p className="text-xs text-white/80">
                    Online now • Fast replies
                  </p>
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
                      "max-w-[88%] p-3.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm",
                      msg.sender === "user"
                        ? "bg-[#0A4229] text-white ml-auto rounded-br-md"
                        : "bg-white border border-slate-200 text-gray-800 rounded-bl-md"
                    )}
                  >
                    {msg.text}
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
                          onClick={() =>
                            handleQuickPrompt(prompt)
                          }
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
                  onChange={(e) =>
                    setInput(e.target.value)
                  }
                  placeholder="Ask about prices, products, installation..."
                  className="flex-1 min-w-0 border-0 bg-transparent shadow-none placeholder:text-[#616161] focus-visible:ring-0 focus-visible:ring-offset-0"
                  disabled={isLoading}
                />

                <Button
                  type="submit"
                  size="icon"
                  className="bg-[#0A4229] hover:bg-[#0a3523] flex-shrink-0 rounded-xl"
                  disabled={
                    isLoading || !input.trim()
                  }
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

