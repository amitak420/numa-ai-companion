"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Bot, User, AlertTriangle } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

const CRISIS_KEYWORDS = [
  "suicide", "kill myself", "end my life", "want to die", "hurt myself",
  "self harm", "cutting", "overdose", "jump off"
]

const CRISIS_RESPONSE = "I'm really concerned about what you're sharing. Please know that you're not alone, and there are people who want to help. Please reach out to:\n\n🆘 National Suicide Prevention: 1-800-273-8255\n📞 Crisis Text Line: Text HOME to 741741\n🇮🇳 AASRA: +91-9820466726\n\nYour life matters, and things can get better with support."

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showCrisisAlert, setShowCrisisAlert] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load messages from localStorage
    const stored = localStorage.getItem("numa-chat-history")
    if (stored) {
      const parsed = JSON.parse(stored)
      setMessages(parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })))
    } else {
      // Welcome message
      setMessages([{
        id: "welcome",
        role: "assistant",
        content: "Hi there! I'm Numa, your emotional support companion. 💜 I'm here to listen and support you through whatever you're going through. How are you feeling today?",
        timestamp: new Date()
      }])
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  useEffect(() => {
    if (messages.length > 1) {
      localStorage.setItem("numa-chat-history", JSON.stringify(messages))
    }
  }, [messages])

  const detectCrisis = (text: string): boolean => {
    const lowerText = text.toLowerCase()
    return CRISIS_KEYWORDS.some(keyword => lowerText.includes(keyword))
  }

  const generateResponse = async (userMessage: string): Promise<string> => {
    // Crisis detection
    if (detectCrisis(userMessage)) {
      setShowCrisisAlert(true)
      return CRISIS_RESPONSE
    }

    // Simulated AI responses (in production, connect to Gemini API)
    const responses = [
      "I hear you, and I want you to know that your feelings are valid. Can you tell me more about what's going on?",
      "That sounds really difficult. It's okay to feel this way. How long have you been feeling like this?",
      "Thank you for sharing that with me. Remember, healing takes time, and it's okay to take things one day at a time.",
      "I'm here for you. What you're experiencing is part of being human. Have you tried any coping strategies that help?",
      "Your strength in reaching out shows courage. What's one small thing that might help you feel a bit better today?",
    ]

    // Simulate typing delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    const responseText = await generateResponse(userMessage.content)

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: responseText,
      timestamp: new Date()
    }

    setIsTyping(false)
    setMessages(prev => [...prev, assistantMessage])
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-180px)]">
      {/* Crisis Alert */}
      <AnimatePresence>
        {showCrisisAlert && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-4"
          >
            <Alert className="bg-destructive/10 border-destructive">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <AlertDescription className="text-sm">
                Crisis support resources are available. Your safety matters.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <Card className="glass flex-1 overflow-y-auto p-4 space-y-4 border-0 mb-4">
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {message.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-sm"
                  : "glass rounded-bl-sm"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <span className="text-xs opacity-60 mt-1 block">
                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
            {message.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </motion.div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3 items-center"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="glass rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </Card>

      {/* Input Area */}
      <div className="glass rounded-2xl p-3 border-0">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 bg-background/50 border-border/50"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            size="icon"
            className="rounded-full"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}