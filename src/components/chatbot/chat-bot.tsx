"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Bot, MessageSquareText, Send, Sparkles, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
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
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Hi, I’m your ArronWH assistant. Ask me anything about boilers, controllers, prices, or installation.",
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  // const API_ENDPOINT = "https://arronwh.onrender.com/api/ai/chatbot"
  const quickPrompts = [
    "Controller prices",
    "Best boiler for my home",
    "Installation timeline",
  ]

  // Handle outside click to close the chat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatRef.current && !chatRef.current.contains(event.target as Node) && isOpen) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const buildPreviousChat = (chatMessages: Message[]): PreviousChatItem[] => {
    const previousChat: PreviousChatItem[] = []

    for (let i = 0; i < chatMessages.length; i += 1) {
      if (chatMessages[i].sender !== "user") continue

      const aiReply = chatMessages.slice(i + 1).find((msg) => msg.sender === "bot")
      if (!aiReply) continue

      previousChat.push({
        user_query: chatMessages[i].text,
        ai_response: aiReply.text,
      })
    }

    return previousChat
  }

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    const trimmedInput = input.trim()
    if (!trimmedInput) return

    const userMessage = trimmedInput
    const updatedMessages = [...messages, { sender: "user" as const, text: userMessage }]
    setMessages(updatedMessages)
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("http://72.62.213.212:8000/api/ai/chatbot", {
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

      const data = await response.json()

      console.log("API response:", data)

      const botText =
        (typeof data === "string" && data) ||
        data?.response ||
        data?.message ||
        data?.data ||
        data?.text

      if (typeof botText === "string" && botText.trim()) {
        setMessages((prev) => [...prev, { sender: "bot", text: botText.trim() }])
      } else {
        setMessages((prev) => [
          ...prev,
          {
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

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full shadow-xl bg-[#0A4229] border border-white/20 hover:scale-105 transition-transform duration-200"
          aria-label="Open chat support"
        >
          <MessageSquareText className="h-7 w-7 text-white hover:text-primary" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div ref={chatRef} className="animate-in fade-in slide-in-from-bottom-10 duration-300">
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
                aria-label="Close chat support"
              >
                <X className="h-5 w-5" />
              </Button>
            </CardHeader>

            <CardContent className="p-4 flex-grow overflow-y-auto bg-gradient-to-b from-slate-50 to-white">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-500">
                  <p className="text-center">Send a message to start chatting!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={cn(
                        "max-w-[88%] p-3.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm",
                        msg.sender === "user"
                          ? "bg-[#0A4229] text-white ml-auto rounded-br-md"
                          : "bg-white border border-slate-200 text-gray-800 rounded-bl-md",
                      )}
                    >
                      {msg.text}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="bg-white border border-slate-200 text-gray-800 max-w-[30%] p-3 rounded-2xl rounded-bl-md shadow-sm">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }} />
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
              )}
            </CardContent>

            <CardFooter className="p-3 border-t bg-white/95 backdrop-blur-sm flex-shrink-0">
              <form
                onSubmit={handleSendMessage}
                className="flex w-full gap-2 max-w-full p-2 rounded-2xl border border-slate-200 bg-slate-50"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about prices, products, installation..."
                  className="flex-1 min-w-0 border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  size="icon"
                  className="bg-[#0A4229] hover:bg-[#0a3523] flex-shrink-0 rounded-xl"
                  disabled={isLoading || !input.trim()}
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}
