

"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { FileText, MessageSquareText, Mic, Paperclip, Search, Send, Smile, Sparkles, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import AIMessage from "@/components/chatbot/ai-message"

interface Message {
  id: string
  sender: "user" | "bot"
  text: string
  html?: string
  attachment?: {
    kind: "image" | "gif" | "file"
    name: string
    sizeLabel?: string
    previewUrl?: string
  }
  createdAt: number
}

interface GifOption {
  id: string
  label: string
  tags: string[]
  url: string
}

interface EmojiOption {
  emoji: string
  label: string
  tags: string[]
}

interface EmojiSection {
  id: string
  label: string
  emojis: EmojiOption[]
}

interface PreviousChatItem {
  user_query: string
  ai_response: string
}

interface SpeechRecognitionAlternativeLike {
  transcript: string
}

interface SpeechRecognitionResultLike extends ArrayLike<SpeechRecognitionAlternativeLike> {
  isFinal: boolean
}

interface SpeechRecognitionEventLike extends Event {
  resultIndex: number
  results: ArrayLike<SpeechRecognitionResultLike>
}

interface BrowserSpeechRecognition extends EventTarget {
  lang: string
  interimResults: boolean
  continuous: boolean
  onresult: ((event: SpeechRecognitionEventLike) => void) | null
  onerror: (() => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
}

type BrowserSpeechRecognitionConstructor = new () => BrowserSpeechRecognition

declare global {
  interface Window {
    SpeechRecognition?: BrowserSpeechRecognitionConstructor
    webkitSpeechRecognition?: BrowserSpeechRecognitionConstructor
  }
}

const URL_REGEX = /(https?:\/\/[^\s<>"')\]]+)/gi
const MARKDOWN_LINK_REGEX = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/gi
const QUOTE_TOOL_URL = "/boilers/property-overview"
const QUOTE_TOOL_LABEL_REGEX = /\bstart\s+online\s+quote\s+tool\b/i
const CHATBOT_BASE_URL = process.env.NEXT_PUBLIC_CHATBOT_URL
const CHATBOT_INITIAL_MESSAGE_ENDPOINT = CHATBOT_BASE_URL?.endsWith("/chatbot")
  ? CHATBOT_BASE_URL.replace(/\/chatbot$/, "/chatbot-initial-message")
  : null
const CHATBOT_INITIAL_FALLBACK_MESSAGE = "👋 Hi there! What brings you here today?"
const GIF_SUGGESTIONS: GifOption[] = [
  {
    id: "celebrate",
    label: "Celebrate",
    tags: ["party", "wow", "happy", "celebrate"],
    url: "https://media.giphy.com/media/3o7TKTDn976rzVgky4/giphy.gif",
  },
  {
    id: "thumbs-up",
    label: "Thumbs Up",
    tags: ["ok", "nice", "great", "approve"],
    url: "https://media.giphy.com/media/111ebonMs90YLu/giphy.gif",
  },
  {
    id: "laugh",
    label: "Laugh",
    tags: ["funny", "lol", "haha", "laugh"],
    url: "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif",
  },
  {
    id: "excited",
    label: "Excited",
    tags: ["excited", "hype", "energy"],
    url: "https://media.giphy.com/media/MeIucAjPKoA120R7sN/giphy.gif",
  },
  {
    id: "clap",
    label: "Clap",
    tags: ["clap", "congrats", "well done"],
    url: "https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif",
  },
  {
    id: "heart",
    label: "Love",
    tags: ["heart", "love", "care"],
    url: "https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif",
  },
]

const EMOJI_SECTIONS: EmojiSection[] = [
  {
    id: "smileys",
    label: "Smileys",
    emojis: [
      { emoji: "😀", label: "Grinning face", tags: ["happy", "smile", "joy"] },
      { emoji: "😄", label: "Smiling face", tags: ["cheerful", "happy"] },
      { emoji: "😁", label: "Beaming face", tags: ["grin", "teeth"] },
      { emoji: "😂", label: "Face with tears of joy", tags: ["funny", "lol", "laugh"] },
      { emoji: "😊", label: "Smiling eyes", tags: ["kind", "sweet"] },
      { emoji: "😉", label: "Winking face", tags: ["wink", "playful"] },
      { emoji: "😍", label: "Heart eyes", tags: ["love", "crush"] },
      { emoji: "😘", label: "Face blowing a kiss", tags: ["kiss", "affection"] },
      { emoji: "😎", label: "Smiling face with sunglasses", tags: ["cool", "style"] },
      { emoji: "🤔", label: "Thinking face", tags: ["hmm", "question"] },
      { emoji: "🙃", label: "Upside-down face", tags: ["sarcasm", "playful"] },
      { emoji: "😴", label: "Sleeping face", tags: ["sleep", "tired"] },
      { emoji: "😭", label: "Loudly crying face", tags: ["sad", "cry"] },
      { emoji: "😡", label: "Pouting face", tags: ["angry", "mad"] },
      { emoji: "🤯", label: "Exploding head", tags: ["mind blown", "wow"] },
      { emoji: "🥺", label: "Pleading face", tags: ["please", "cute"] },
    ],
  },
  {
    id: "gestures",
    label: "Gestures",
    emojis: [
      { emoji: "👍", label: "Thumbs up", tags: ["ok", "yes", "approve"] },
      { emoji: "👎", label: "Thumbs down", tags: ["no", "reject"] },
      { emoji: "👏", label: "Clapping hands", tags: ["clap", "congrats"] },
      { emoji: "🙌", label: "Raising hands", tags: ["celebrate", "yay"] },
      { emoji: "🙏", label: "Folded hands", tags: ["thanks", "please", "pray"] },
      { emoji: "👌", label: "OK hand", tags: ["perfect", "fine"] },
      { emoji: "✌️", label: "Victory hand", tags: ["peace", "victory"] },
      { emoji: "🤝", label: "Handshake", tags: ["deal", "agreement"] },
      { emoji: "🤞", label: "Crossed fingers", tags: ["luck", "hope"] },
      { emoji: "🤟", label: "Love-you gesture", tags: ["love", "support"] },
      { emoji: "👋", label: "Waving hand", tags: ["hello", "bye"] },
      { emoji: "💪", label: "Flexed biceps", tags: ["strong", "power"] },
      { emoji: "🫶", label: "Heart hands", tags: ["care", "love"] },
      { emoji: "🫡", label: "Saluting face", tags: ["respect", "roger"] },
    ],
  },
  {
    id: "hearts",
    label: "Hearts",
    emojis: [
      { emoji: "❤️", label: "Red heart", tags: ["love", "heart"] },
      { emoji: "💛", label: "Yellow heart", tags: ["friendship"] },
      { emoji: "💚", label: "Green heart", tags: ["nature", "safe"] },
      { emoji: "💙", label: "Blue heart", tags: ["trust", "loyal"] },
      { emoji: "💜", label: "Purple heart", tags: ["care", "support"] },
      { emoji: "🖤", label: "Black heart", tags: ["dark", "mood"] },
      { emoji: "🤍", label: "White heart", tags: ["pure", "peace"] },
      { emoji: "🤎", label: "Brown heart", tags: ["warm", "earth"] },
      { emoji: "💔", label: "Broken heart", tags: ["sad", "breakup"] },
      { emoji: "❣️", label: "Heart exclamation", tags: ["love", "emphasis"] },
      { emoji: "💕", label: "Two hearts", tags: ["affection", "romance"] },
      { emoji: "💖", label: "Sparkling heart", tags: ["cute", "sparkle"] },
    ],
  },
  {
    id: "celebration",
    label: "Celebration",
    emojis: [
      { emoji: "🎉", label: "Party popper", tags: ["party", "congrats"] },
      { emoji: "🎊", label: "Confetti ball", tags: ["celebrate", "festival"] },
      { emoji: "🥳", label: "Partying face", tags: ["birthday", "party"] },
      { emoji: "🎁", label: "Wrapped gift", tags: ["gift", "present"] },
      { emoji: "🎈", label: "Balloon", tags: ["party", "decor"] },
      { emoji: "🍰", label: "Shortcake", tags: ["cake", "birthday"] },
      { emoji: "🍕", label: "Pizza", tags: ["food", "eat"] },
      { emoji: "☕", label: "Hot beverage", tags: ["coffee", "tea"] },
      { emoji: "🍿", label: "Popcorn", tags: ["movie", "snack"] },
      { emoji: "🎵", label: "Musical note", tags: ["music", "song"] },
      { emoji: "🎶", label: "Musical notes", tags: ["melody", "music"] },
      { emoji: "🏆", label: "Trophy", tags: ["winner", "award"] },
      { emoji: "✨", label: "Sparkles", tags: ["shiny", "magic"] },
      { emoji: "🔥", label: "Fire", tags: ["hot", "lit", "trend"] },
    ],
  },
  {
    id: "animals-nature",
    label: "Animals & Nature",
    emojis: [
      { emoji: "🐶", label: "Dog face", tags: ["dog", "pet"] },
      { emoji: "🐱", label: "Cat face", tags: ["cat", "pet"] },
      { emoji: "🐼", label: "Panda", tags: ["panda", "cute"] },
      { emoji: "🦊", label: "Fox", tags: ["fox", "animal"] },
      { emoji: "🐸", label: "Frog", tags: ["frog", "green"] },
      { emoji: "🐵", label: "Monkey face", tags: ["monkey", "funny"] },
      { emoji: "🐧", label: "Penguin", tags: ["penguin", "winter"] },
      { emoji: "🐢", label: "Turtle", tags: ["slow", "nature"] },
      { emoji: "🌞", label: "Sun with face", tags: ["sun", "day"] },
      { emoji: "🌙", label: "Crescent moon", tags: ["night", "moon"] },
      { emoji: "⭐", label: "Star", tags: ["star", "favorite"] },
      { emoji: "🌈", label: "Rainbow", tags: ["color", "hope"] },
      { emoji: "🌸", label: "Cherry blossom", tags: ["flower", "spring"] },
      { emoji: "🍀", label: "Four leaf clover", tags: ["luck", "nature"] },
    ],
  },
  {
    id: "objects-travel",
    label: "Objects & Travel",
    emojis: [
      { emoji: "🏠", label: "House", tags: ["home", "building"] },
      { emoji: "🚗", label: "Car", tags: ["drive", "travel"] },
      { emoji: "✈️", label: "Airplane", tags: ["flight", "travel"] },
      { emoji: "🚀", label: "Rocket", tags: ["space", "launch"] },
      { emoji: "💻", label: "Laptop", tags: ["computer", "work"] },
      { emoji: "📱", label: "Mobile phone", tags: ["phone", "call"] },
      { emoji: "📷", label: "Camera", tags: ["photo", "picture"] },
      { emoji: "🎮", label: "Video game", tags: ["game", "play"] },
      { emoji: "📚", label: "Books", tags: ["read", "study"] },
      { emoji: "💡", label: "Light bulb", tags: ["idea", "think"] },
      { emoji: "✅", label: "Check mark", tags: ["done", "yes"] },
      { emoji: "❌", label: "Cross mark", tags: ["wrong", "no"] },
      { emoji: "💬", label: "Speech balloon", tags: ["chat", "message"] },
      { emoji: "📌", label: "Pushpin", tags: ["pin", "important"] },
    ],
  },
]

const DEFAULT_RECENT_EMOJI_CHARS = ["😀", "🔥", "👍", "🎉", "🙏", "❤️", "😂", "💬"]
const ALL_EMOJI_OPTIONS = EMOJI_SECTIONS.flatMap((section) => section.emojis)
const EMOJI_BY_CHAR = new Map(
  ALL_EMOJI_OPTIONS.map((option) => [option.emoji, option] as const),
)
const RECORDING_BAR_COUNT = 34
const RECORDING_BASE_BARS = Array.from({ length: RECORDING_BAR_COUNT }, (_, index) => {
  const center = (RECORDING_BAR_COUNT - 1) / 2
  const distance = Math.abs(index - center)
  if (distance < 1.5) return 15
  if (distance < 4) return 11
  if (distance < 8) return 8
  return 5
})

const normalizeVoiceTranscript = (value: string): string => {
  return value
    .replace(/\s+/g, " ")
    .replace(/([.!?])\s+/g, "$1\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

const formatMessageAge = (createdAt: number, now: number): string => {
  const diffSeconds = Math.max(0, Math.floor((now - createdAt) / 1000))
  if (diffSeconds < 8) return "Just now"
  if (diffSeconds < 60) return `${diffSeconds}s ago`

  const diffMinutes = Math.floor(diffSeconds / 60)
  if (diffMinutes < 60) return `${diffMinutes}m ago`

  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours}h ago`

  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) return `${diffDays}d ago`

  return new Date(createdAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  })
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const [showBlink, setShowBlink] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingBars, setRecordingBars] = useState<number[]>(RECORDING_BASE_BARS)
  const [showEmojiMenu, setShowEmojiMenu] = useState(false)
  const [emojiQuery, setEmojiQuery] = useState("")
  const [showGifMenu, setShowGifMenu] = useState(false)
  const [gifQuery, setGifQuery] = useState("")
  const [recentEmojis, setRecentEmojis] = useState<EmojiOption[]>(
    () =>
      DEFAULT_RECENT_EMOJI_CHARS
        .map((char) => EMOJI_BY_CHAR.get(char))
        .filter((option): option is EmojiOption => Boolean(option)),
  )
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedFilePreview, setSelectedFilePreview] = useState<string | null>(null)
  const [selectedGif, setSelectedGif] = useState<GifOption | null>(null)
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [messages, setMessages] = useState<Message[]>([])

  const [isLoading, setIsLoading] = useState(false)
  const [messageTimeNow, setMessageTimeNow] = useState(() => Date.now())

  const chatRef = useRef<HTMLDivElement>(null)
  const chatScrollRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const waveformStreamRef = useRef<MediaStream | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const waveformFrameRef = useRef<number | null>(null)
  const recordingCancelledRef = useRef(false)
  const recordingDraftRef = useRef("")

  const quickPrompts = [
    "I want to get a quote",
    "I have a question about pricing",
    "I have a product question",
    "I'm a customer, and I need help",
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

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop()
      waveformStreamRef.current?.getTracks().forEach((track) => track.stop())
      if (waveformFrameRef.current !== null) {
        cancelAnimationFrame(waveformFrameRef.current)
      }
      if (audioContextRef.current) {
        void audioContextRef.current.close()
      }
    }
  }, [])

  useEffect(() => {
    if (!selectedFile || !selectedFile.type.startsWith("image/")) {
      setSelectedFilePreview(null)
      return
    }

    const objectUrl = URL.createObjectURL(selectedFile)
    setSelectedFilePreview(objectUrl)

    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }, [selectedFile])

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (!isOpen) return

    setMessageTimeNow(Date.now())
    const timer = window.setInterval(() => {
      setMessageTimeNow(Date.now())
    }, 30_000)

    return () => window.clearInterval(timer)
  }, [isOpen])

  // Lock background scroll
  useEffect(() => {
    if (!isOpen) return
    const previousHtmlOverflow = document.documentElement.style.overflow
    const previousHtmlOverscroll = document.documentElement.style.overscrollBehavior
    const previousBodyOverflow = document.body.style.overflow
    const previousBodyOverscroll = document.body.style.overscrollBehavior

    document.documentElement.style.overflow = "hidden"
    document.documentElement.style.overscrollBehavior = "none"
    document.body.style.overflow = "hidden"
    document.body.style.overscrollBehavior = "none"

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow
      document.documentElement.style.overscrollBehavior = previousHtmlOverscroll
      document.body.style.overflow = previousBodyOverflow
      document.body.style.overscrollBehavior = previousBodyOverscroll
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

  const stripHtmlCodeFence = (value: string): string => {
    const trimmed = value.trim()
    const fencedMatch = trimmed.match(/^```(?:html|xml)?\s*([\s\S]*?)\s*```$/i)
    return fencedMatch ? fencedMatch[1].trim() : trimmed
  }

  const decodeHtmlEntities = (value: string): string => {
    if (typeof window === "undefined") return value
    let decoded = value

    // Decode nested entities safely (e.g. &amp;lt;p&amp;gt; -> <p>)
    for (let i = 0; i < 3; i += 1) {
      const textarea = document.createElement("textarea")
      textarea.innerHTML = decoded
      const next = textarea.value
      if (next === decoded) break
      decoded = next
    }

    return decoded
  }

  const getSanitizedHtmlIfPresent = (value: string): string | null => {
    const decoded = decodeHtmlEntities(stripHtmlCodeFence(value))
    const isHtml = /<\/?[a-z][\s\S]*>/i.test(decoded)
    if (!isHtml) return null

    const sanitized = sanitizeHtml(decoded)
    return sanitized || null
  }

  const formatBotMessage = (value: string): { text: string; html?: string } => {
    const trimmed = value.trim()
    if (!trimmed) return { text: "" }
    const sanitized = getSanitizedHtmlIfPresent(trimmed)
    if (sanitized) {
      return {
        text: htmlToPlainText(sanitized) || trimmed,
        html: sanitized,
      }
    }
    return { text: decodeHtmlEntities(stripHtmlCodeFence(trimmed)) }
  }

  useEffect(() => {
    let isCancelled = false

    const setWelcomeMessage = (rawMessage: string) => {
      const formatted = formatBotMessage(rawMessage)
      const text = formatted.text.trim() || CHATBOT_INITIAL_FALLBACK_MESSAGE

      setMessages((prev) => {
        const welcomeMessage: Message = {
          id: "bot-welcome",
          sender: "bot",
          text,
          html: formatted.html,
          createdAt: Date.now(),
        }
        const withoutWelcome = prev.filter((message) => message.id !== "bot-welcome")
        return [welcomeMessage, ...withoutWelcome]
      })
    }

    const loadInitialMessage = async () => {
      if (!CHATBOT_INITIAL_MESSAGE_ENDPOINT) {
        setWelcomeMessage(CHATBOT_INITIAL_FALLBACK_MESSAGE)
        return
      }

      try {
        const response = await fetch(CHATBOT_INITIAL_MESSAGE_ENDPOINT, {
          method: "POST",
          headers: {
            accept: "application/json",
          },
        })

        if (!response.ok) {
          throw new Error(`Initial message request failed with status ${response.status}`)
        }

        const rawResponse = await response.text()
        if (!isCancelled) {
          setWelcomeMessage(rawResponse)
        }
      } catch (error) {
        console.error("Error loading initial chatbot message:", error)
        if (!isCancelled) {
          setWelcomeMessage(CHATBOT_INITIAL_FALLBACK_MESSAGE)
        }
      }
    }

    void loadInitialMessage()

    return () => {
      isCancelled = true
    }
  }, [])

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

  const buildGifFile = async (gif: GifOption): Promise<File> => {
    const response = await fetch(gif.url)
    if (!response.ok) {
      throw new Error(`GIF download failed with status ${response.status}`)
    }

    const blob = await response.blob()
    const extFromType = blob.type === "image/gif" ? "gif" : "bin"
    const safeName = gif.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")
    return new File([blob], `${safeName || "gif-attachment"}.${extFromType}`, {
      type: blob.type || "application/octet-stream",
    })
  }

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (isRecording) return
    const trimmedInput = input.trim()
    if (!trimmedInput && !selectedFile && !selectedGif) return

    const attachmentText = selectedFile ? `\n[Attachment: ${selectedFile.name}]` : ""
    const gifAttachmentText = selectedGif ? `\n[GIF: ${selectedGif.label}]` : ""
    const userMessage = `${trimmedInput}${attachmentText}${gifAttachmentText}`.trim()
    const fileToSend = selectedFile
    const gifToSend = selectedGif
    const hasAttachment = Boolean(fileToSend || gifToSend)
    const previousChat = buildPreviousChat(messages)

    const userAttachment: Message["attachment"] = fileToSend
      ? {
          kind: fileToSend.type.startsWith("image/") ? "image" : "file",
          name: fileToSend.name,
          sizeLabel: formatFileSize(fileToSend.size),
          previewUrl: fileToSend.type.startsWith("image/") ? selectedFilePreview || undefined : undefined,
        }
      : gifToSend
        ? {
            kind: "gif",
            name: gifToSend.label,
            sizeLabel: "GIF",
            previewUrl: gifToSend.url,
          }
        : undefined

    const newUserMessage: Message = {
      id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      sender: "user",
      text: userMessage,
      attachment: userAttachment,
      createdAt: Date.now(),
    }

    const updatedMessages: Message[] = [...messages, newUserMessage]
    setMessages(updatedMessages)
    setInput("")
    setSelectedFile(null)
    setSelectedFilePreview(null)
    setSelectedGif(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    setIsLoading(true)

    try {
      const response = hasAttachment
        ? await (async () => {
            const formData = new FormData()
            formData.append("previous_chat", JSON.stringify(previousChat))
            formData.append("user_query", trimmedInput || "Please analyze this file.")

            if (fileToSend) {
              formData.append("file", fileToSend, fileToSend.name)
            } else if (gifToSend) {
              const gifFile = await buildGifFile(gifToSend)
              formData.append("file", gifFile, gifFile.name)
            }

            return fetch("/api/chatbot", {
              method: "POST",
              body: formData,
            })
          })()
        : await fetch("/api/chatbot", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              accept: "text/event-stream",
            },
            body: JSON.stringify({
              previous_chat: previousChat,
              user_query: userMessage,
            }),
          })

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      const botId = `bot-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
      setMessages((prev) => [
        ...prev,
        { id: botId, sender: "bot", text: "", createdAt: Date.now() },
      ])

      if (hasAttachment) {
        const payload = await response.json()
        const rawText =
          (typeof payload?.response === "string" && payload.response) ||
          (typeof payload?.message === "string" && payload.message) ||
          ""
        const formatted = formatBotMessage(rawText.trim())

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botId
              ? {
                  ...msg,
                  text: formatted.text || "Thanks for your attachment. I could not parse a response this time.",
                  html: formatted.html,
                }
              : msg,
          ),
        )
        setIsLoading(false)
        return
      }

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
            createdAt: Date.now(),
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
          createdAt: Date.now(),
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
    e.stopPropagation()
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

  const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSelectedFile(file)
    setShowGifMenu(false)
    setShowEmojiMenu(false)
    setEmojiQuery("")
  }

  const handleEmojiClick = () => {
    setShowGifMenu(false)
    setShowEmojiMenu((prev) => {
      const next = !prev
      if (next) {
        setEmojiQuery("")
      }
      return next
    })
  }

  const handleEmojiSelect = (option: EmojiOption) => {
    setInput((prev) => `${prev}${option.emoji}`)
    setRecentEmojis((prev) => {
      const next = [option, ...prev.filter((item) => item.emoji !== option.emoji)]
      return next.slice(0, 18)
    })
  }

  const handleGifInsert = (gif: GifOption) => {
    setSelectedGif(gif)
    setShowEmojiMenu(false)
    setShowGifMenu(false)
    setGifQuery("")
  }

  const stopScrollPropagation = (
    event: React.WheelEvent<HTMLElement> | React.TouchEvent<HTMLElement>,
  ) => {
    event.stopPropagation()
  }

  const resetRecordingWave = () => {
    setRecordingBars(RECORDING_BASE_BARS)
  }

  const stopRecordingWave = () => {
    if (waveformFrameRef.current !== null) {
      cancelAnimationFrame(waveformFrameRef.current)
      waveformFrameRef.current = null
    }

    analyserRef.current = null

    if (waveformStreamRef.current) {
      waveformStreamRef.current.getTracks().forEach((track) => track.stop())
      waveformStreamRef.current = null
    }

    if (audioContextRef.current) {
      void audioContextRef.current.close()
      audioContextRef.current = null
    }

    resetRecordingWave()
  }

  const startRecordingWave = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      resetRecordingWave()
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      waveformStreamRef.current = stream

      const AudioContextCtor =
        window.AudioContext ||
        (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext

      if (!AudioContextCtor) {
        stream.getTracks().forEach((track) => track.stop())
        waveformStreamRef.current = null
        resetRecordingWave()
        return
      }

      const audioContext = new AudioContextCtor()
      audioContextRef.current = audioContext

      const source = audioContext.createMediaStreamSource(stream)
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 256
      analyser.smoothingTimeConstant = 0.8
      source.connect(analyser)
      analyserRef.current = analyser

      const frequencies = new Uint8Array(analyser.frequencyBinCount)
      const center = (RECORDING_BASE_BARS.length - 1) / 2

      const tick = () => {
        if (!analyserRef.current) return
        analyser.getByteFrequencyData(frequencies)

        let total = 0
        for (let i = 0; i < frequencies.length; i += 1) {
          total += frequencies[i]
        }
        const overallLevel = total / (frequencies.length * 255)
        const bandSize = Math.max(1, Math.floor(frequencies.length / RECORDING_BASE_BARS.length))

        const nextBars = RECORDING_BASE_BARS.map((baseHeight, index) => {
          const start = index * bandSize
          const end = Math.min(frequencies.length, start + bandSize)

          let bandTotal = 0
          for (let i = start; i < end; i += 1) {
            bandTotal += frequencies[i]
          }

          const bandLevel = end > start ? bandTotal / ((end - start) * 255) : 0
          const distanceFactor = 1 - Math.min(1, Math.abs(index - center) / center)
          const dynamicBoost = (bandLevel * 15 + overallLevel * 10) * (0.55 + distanceFactor * 0.95)

          return Math.min(28, Math.max(4, Math.round(baseHeight + dynamicBoost)))
        })

        setRecordingBars(nextBars)
        waveformFrameRef.current = requestAnimationFrame(tick)
      }

      waveformFrameRef.current = requestAnimationFrame(tick)
    } catch {
      stopRecordingWave()
    }
  }

  const startSpeechRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          sender: "bot",
          text: "Voice input is not supported in this browser. Please use Chrome for mic support.",
          createdAt: Date.now(),
        },
      ])
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = "en-US"
    recognition.interimResults = true
    recognition.continuous = false
    recordingCancelledRef.current = false
    recordingDraftRef.current = ""
    resetRecordingWave()
    setShowEmojiMenu(false)
    setShowGifMenu(false)
    let finalTranscript = ""

    recognition.onresult = (event: SpeechRecognitionEventLike) => {
      let nextFinalTranscript = ""
      let interimTranscript = ""

      for (let i = 0; i < event.results.length; i += 1) {
        const result = event.results[i]
        const transcriptPiece = result[0]?.transcript?.trim()
        if (!transcriptPiece) continue

        if (result.isFinal) {
          nextFinalTranscript += `${transcriptPiece} `
        } else {
          interimTranscript += `${transcriptPiece} `
        }
      }

      finalTranscript = nextFinalTranscript.trim()
      const composedTranscript = `${nextFinalTranscript}${interimTranscript}`.trim()
      recordingDraftRef.current = normalizeVoiceTranscript(composedTranscript)
    }

    recognition.onerror = () => {
      setIsRecording(false)
      stopRecordingWave()
    }

    recognition.onend = () => {
      setIsRecording(false)
      stopRecordingWave()
      const transcriptToUse = normalizeVoiceTranscript(finalTranscript || recordingDraftRef.current)

      if (!recordingCancelledRef.current && transcriptToUse) {
        setInput(transcriptToUse)
      }
      recordingDraftRef.current = ""
      recordingCancelledRef.current = false
    }

    recognitionRef.current = recognition
    recognition.start()
    setIsRecording(true)
    void startRecordingWave()
  }

  const stopSpeechRecognition = ({ discard }: { discard: boolean }) => {
    recordingCancelledRef.current = discard
    stopRecordingWave()
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
      return
    }
    setIsRecording(false)
    if (discard) {
      recordingDraftRef.current = ""
    }
  }

  const handleMicClick = () => {
    if (isRecording) return
    startSpeechRecognition()
  }

  const handleStopRecording = () => {
    stopSpeechRecognition({ discard: false })
  }

  const handleCancelRecording = () => {
    stopSpeechRecognition({ discard: true })
  }

  const filteredGifSuggestions = GIF_SUGGESTIONS.filter((gif) => {
    const query = gifQuery.trim().toLowerCase()
    if (!query) return true
    const haystack = `${gif.label} ${gif.tags.join(" ")}`.toLowerCase()
    return haystack.includes(query)
  })

  const normalizedEmojiQuery = emojiQuery.trim().toLowerCase()
  const searchedEmojis = normalizedEmojiQuery
    ? ALL_EMOJI_OPTIONS.filter((option) => {
        const haystack = `${option.label} ${option.tags.join(" ")}`.toLowerCase()
        return haystack.includes(normalizedEmojiQuery)
      })
    : []

  const emojiSectionsToRender: EmojiSection[] = normalizedEmojiQuery
    ? [{ id: "search-results", label: "Search results", emojis: searchedEmojis }]
    : [
        ...(recentEmojis.length > 0
          ? [{ id: "recent", label: "Recent", emojis: recentEmojis }]
          : []),
        ...EMOJI_SECTIONS,
      ]

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const stripInlineAttachmentLabels = (value: string): string => {
    return value
      .replace(/\n?\[Attachment:[^\]]+\]/gi, "")
      .replace(/\n?\[GIF:[^\]]+\]/gi, "")
      .trim()
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
          <Card className="w-[92vw] sm:w-[420px] h-[700px] shadow-2xl border-slate-200 flex flex-col overflow-hidden rounded-3xl bg-white">
            <CardHeader className="bg-gradient-to-r from-[#0A4229] to-[#0a3523] text-white p-4 flex flex-row justify-between items-center rounded-t-3xl flex-shrink-0">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                  <Image src="/assets/images/robot.svg" alt="bot image" width={100} height={100} className="w-auto h-auto object-contain"/>
                </span>
                <div>
                  <p className="font-semibold leading-tight">YOLO HEAT</p>
                  <p className="text-xs text-white/90 pt-1">Online now • Fast replies</p>
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
              data-lenis-prevent
              data-lenis-prevent-wheel
              data-lenis-prevent-touch
              onWheelCapture={handleChatWheelCapture}
              onTouchMoveCapture={stopScrollPropagation}
              className="p-4 flex-grow overflow-y-auto overscroll-contain touch-pan-y bg-gradient-to-b from-slate-50 to-white [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              <div className="space-y-4">
                {messages.map((msg) => {
                  const timeLabel = formatMessageAge(msg.createdAt, messageTimeNow)
                  const metaLabel =
                    msg.sender === "bot"
                      ? `YOLO HEAT • AI Agent • ${timeLabel}`
                      : `You • ${timeLabel}`

                  return (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex flex-col gap-1",
                        msg.sender === "user" ? "items-end" : "items-start",
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[88%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm",
                          msg.sender === "user"
                            ? "bg-[#0A4229] text-white rounded-br-md"
                            : "bg-white border border-slate-200 text-gray-800 rounded-bl-md"
                        )}
                      >
                        {msg.sender === "bot" ? (
                          <AIMessage content={(typeof msg.html === "string" && msg.html.trim()) || msg.text} />
                        ) : (
                          <div className="space-y-2">
                            {msg.attachment?.previewUrl && (
                              <Image
                                src={msg.attachment.previewUrl}
                                alt={msg.attachment.name}
                                width={220}
                                height={140}
                                className="max-h-[180px] w-full rounded-xl border border-white/20 object-cover"
                                unoptimized
                              />
                            )}
                            {msg.attachment && !msg.attachment.previewUrl && (
                              <div className="inline-flex max-w-full items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-2.5 py-1.5 text-[11px] text-white/95">
                                <FileText className="h-3.5 w-3.5" />
                                <span className="max-w-[160px] truncate font-medium">{msg.attachment.name}</span>
                                {msg.attachment.sizeLabel && (
                                  <span className="text-[10px] text-white/80">{msg.attachment.sizeLabel}</span>
                                )}
                              </div>
                            )}
                            {stripInlineAttachmentLabels(msg.text) && (
                              <p className="whitespace-pre-wrap">
                                {renderTextWithLinks(stripInlineAttachmentLabels(msg.text))}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                      <p
                        className={cn(
                          "px-1 text-[11px] font-medium text-slate-500",
                          msg.sender === "user" && "text-right",
                        )}
                      >
                        {metaLabel}
                      </p>
                    </div>
                  )
                })}

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
                className={cn(
                  "flex w-full max-w-full items-end gap-2 rounded-2xl border border-[#0A4229] bg-slate-50 p-2 transition-colors duration-200 focus-within:border-[#0A4229]",
                  isRecording && "items-stretch gap-0 border-none bg-transparent p-0",
                )}
              >
                {isRecording && (
                  <div className="w-full rounded-2xl bg-gradient-to-r from-[#0A4229] to-[#0a3523] p-3 shadow-[0_12px_24px_rgba(10,66,41,0.25)]">
                    <div className="flex h-[56px] w-full items-center gap-3 rounded-[16px] border border-white/15 bg-white/5 px-3">
                      <button
                        type="button"
                        onClick={handleCancelRecording}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-white/25 bg-white/10 transition-colors hover:bg-white/20"
                        aria-label="Cancel recording"
                      >
                        <X className="h-4 w-4 text-white" />
                      </button>

                      <div className="flex h-9 flex-1 items-end justify-center gap-[3px] rounded-xl border border-white/15 bg-black/10 px-3">
                        {recordingBars.map((barHeight, index) => (
                          <span
                            key={`voice-bar-${barHeight}-${index}`}
                            className="w-[2px] rounded-full bg-white/95"
                            style={{
                              height: `${barHeight}px`,
                            }}
                          />
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={handleStopRecording}
                        className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white transition-colors hover:bg-white/90"
                        aria-label="Stop recording"
                      >
                        <span className="h-3 w-3 rounded-sm bg-[#0A4229]" />
                      </button>
                    </div>
                  </div>
                )}

                <div
                  className={cn(
                    "relative flex min-w-0 flex-1 flex-col",
                    isRecording && "hidden",
                  )}
                >
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask a question..."
                    className="h-9 min-w-0 border-0 bg-transparent px-2 shadow-none placeholder:text-[#616161] focus-visible:ring-0 focus-visible:ring-offset-0"
                    disabled={isLoading}
                  />
                  {selectedFile && (
                    <div className="mx-2 mb-1 mt-0.5 inline-flex max-w-full items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] text-slate-600 shadow-sm">
                      {selectedFile.type.startsWith("image/") && selectedFilePreview ? (
                        <Image
                          src={selectedFilePreview}
                          alt={selectedFile.name}
                          width={26}
                          height={26}
                          className="h-[26px] w-[26px] rounded-md border border-slate-200 object-cover"
                          unoptimized
                        />
                      ) : (
                        <FileText className="h-3.5 w-3.5 text-[#0A4229]" />
                      )}
                      <span className="max-w-[160px] truncate font-medium text-slate-700">{selectedFile.name}</span>
                      <span className="text-[10px] text-slate-400">{formatFileSize(selectedFile.size)}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(null)
                          setSelectedFilePreview(null)
                          if (fileInputRef.current) {
                            fileInputRef.current.value = ""
                          }
                        }}
                        className="text-slate-400 hover:text-slate-700"
                      >
                        ×
                      </button>
                    </div>
                  )}
                  {selectedGif && (
                    <div className="mx-2 mb-1 mt-0.5 inline-flex max-w-full items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] text-slate-600 shadow-sm">
                      <Image
                        src={selectedGif.url}
                        alt={selectedGif.label}
                        width={28}
                        height={28}
                        className="h-7 w-7 rounded-md object-cover"
                      />
                      <span className="max-w-[140px] truncate font-medium text-slate-700">{selectedGif.label}</span>
                      <span className="text-[10px] text-slate-400">GIF</span>
                      <button
                        type="button"
                        onClick={() => setSelectedGif(null)}
                        className="text-slate-400 hover:text-slate-700"
                      >
                        ×
                      </button>
                    </div>
                  )}
                  <div className="relative flex items-center gap-3 px-2 pb-1 pt-0.5 text-slate-500">
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      onChange={handleSelectFile}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="transition-colors hover:text-slate-700"
                      aria-label="Attach file"
                    >
                      <Paperclip className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleEmojiClick}
                      className="transition-colors hover:text-slate-700"
                      aria-label="Open emojis"
                    >
                      <Smile className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowEmojiMenu(false)
                        setEmojiQuery("")
                        setGifQuery("")
                        setShowGifMenu((prev) => !prev)
                      }}
                      className="rounded border border-slate-300 px-1.5 py-[1px] text-[10px] font-semibold leading-none text-slate-500 transition-colors hover:text-slate-700"
                      aria-label="Insert GIF"
                    >
                      GIF
                    </button>
                    <button
                      type="button"
                      onClick={handleMicClick}
                      className={cn(
                        "relative transition-colors hover:text-slate-700",
                        isRecording && "text-red-500",
                      )}
                      aria-label={isRecording ? "Stop recording" : "Start voice input"}
                    >
                      {isRecording ? (
                        <span className="relative flex h-4 w-4 items-end justify-center gap-[2px]">
                          <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-red-400/40" />
                          <span
                            className="w-[2px] rounded-full bg-red-500 animate-pulse"
                            style={{ height: "7px", animationDuration: "620ms" }}
                          />
                          <span
                            className="w-[2px] rounded-full bg-red-500 animate-pulse"
                            style={{ height: "12px", animationDuration: "520ms" }}
                          />
                          <span
                            className="w-[2px] rounded-full bg-red-500 animate-pulse"
                            style={{ height: "9px", animationDuration: "700ms" }}
                          />
                        </span>
                      ) : (
                        <Mic className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {showEmojiMenu && (
                    <div className="absolute bottom-10 left-0 z-20 w-[300px] rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                      <div className="mb-2 flex items-center justify-between px-1">
                        <p className="text-xs font-semibold text-slate-700">Emoji</p>
                        <button
                          type="button"
                          onClick={() => {
                            setShowEmojiMenu(false)
                            setEmojiQuery("")
                          }}
                          className="text-xs text-slate-400 hover:text-slate-600"
                        >
                          Close
                        </button>
                      </div>

                      <div className="relative mb-2">
                        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                        <input
                          value={emojiQuery}
                          onChange={(e) => setEmojiQuery(e.target.value)}
                          placeholder="Search emoji..."
                          className="h-8 w-full rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-2 text-xs outline-none focus:border-[#0A4229]"
                        />
                      </div>

                      <div
                        data-lenis-prevent
                        data-lenis-prevent-wheel
                        data-lenis-prevent-touch
                        onWheelCapture={stopScrollPropagation}
                        onTouchMoveCapture={stopScrollPropagation}
                        className="max-h-[230px] space-y-3 overflow-y-auto pr-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                      >
                        {emojiSectionsToRender.every((section) => section.emojis.length === 0) ? (
                          <p className="rounded-lg bg-slate-50 p-2 text-center text-[11px] text-slate-500">
                            No emoji found
                          </p>
                        ) : (
                          emojiSectionsToRender.map((section) => {
                            if (section.emojis.length === 0) return null

                            return (
                              <div key={section.id}>
                                <p className="mb-1 px-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                                  {section.label}
                                </p>
                                <div className="grid grid-cols-8 gap-1">
                                  {section.emojis.map((option) => (
                                    <button
                                      key={`${section.id}-${option.emoji}`}
                                      type="button"
                                      title={option.label}
                                      aria-label={option.label}
                                      onClick={() => handleEmojiSelect(option)}
                                      className="flex h-8 w-8 items-center justify-center rounded-lg text-base transition-colors hover:bg-slate-100"
                                    >
                                      {option.emoji}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )
                          })
                        )}
                      </div>
                    </div>
                  )}

                  {showGifMenu && (
                    <div className="absolute bottom-10 left-0 z-20 w-[282px] rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                      <div className="mb-2 flex items-center justify-between px-1">
                        <p className="text-xs font-semibold text-slate-700">Choose a GIF</p>
                        <button
                          type="button"
                          onClick={() => {
                            setShowGifMenu(false)
                            setGifQuery("")
                          }}
                          className="text-xs text-slate-400 hover:text-slate-600"
                        >
                          Close
                        </button>
                      </div>
                      <input
                        value={gifQuery}
                        onChange={(e) => setGifQuery(e.target.value)}
                        placeholder="Search GIF..."
                        className="mb-2 h-8 w-full rounded-lg border border-slate-200 px-2 text-xs outline-none focus:border-[#0A4229]"
                      />
                      <div
                        data-lenis-prevent
                        data-lenis-prevent-wheel
                        data-lenis-prevent-touch
                        onWheelCapture={stopScrollPropagation}
                        onTouchMoveCapture={stopScrollPropagation}
                        className="grid max-h-[180px] grid-cols-2 gap-2 overflow-y-auto pr-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                      >
                        {filteredGifSuggestions.map((gif) => (
                          <button
                            key={gif.id}
                            type="button"
                            onClick={() => handleGifInsert(gif)}
                            className="group overflow-hidden rounded-lg border border-slate-200 bg-slate-50 text-left transition hover:border-[#0A4229]/40 hover:shadow-sm"
                          >
                            <Image
                              src={gif.url}
                              alt={gif.label}
                              width={140}
                              height={64}
                              className="h-16 w-full object-cover"
                              loading="lazy"
                            />
                            <p className="truncate px-2 py-1 text-[10px] font-medium text-slate-600 group-hover:text-[#0A4229]">
                              {gif.label}
                            </p>
                          </button>
                        ))}
                        {filteredGifSuggestions.length === 0 && (
                          <p className="col-span-2 rounded-lg bg-slate-50 p-2 text-center text-[11px] text-slate-500">
                            No GIF found
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <Button
                  type="submit"
                  size="icon"
                  className={cn(
                    "mb-1 h-8 w-8 flex-shrink-0 rounded-full bg-[#0A4229] text-white hover:bg-[#0a3523] disabled:bg-[#0A4229]/45 disabled:text-white/80",
                    isRecording && "hidden",
                  )}
                  disabled={isLoading || (!input.trim() && !selectedFile && !selectedGif)}
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
