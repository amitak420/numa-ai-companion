"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Search, BookOpen, Lock, Trash2, X } from "lucide-react"
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type JournalEntry = {
  id: string
  date: string
  title: string
  content: string
  prompt?: string
}

const dailyPrompts = [
  "What made you smile today?",
  "What's one thing you're grateful for?",
  "How did you take care of yourself today?",
  "What's a challenge you faced and how did you handle it?",
  "What would you like to tell your future self?",
  "What's something you learned about yourself today?",
  "Describe a moment when you felt proud of yourself.",
  "What's weighing on your mind right now?",
]

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentEntry, setCurrentEntry] = useState({
    title: "",
    content: "",
  })
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null)
  const [todaysPrompt, setTodaysPrompt] = useState("")

  useEffect(() => {
    const stored = localStorage.getItem("numa-journal-entries")
    if (stored) {
      setEntries(JSON.parse(stored))
    }

    // Get daily prompt based on day of year
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
        86400000
    )
    setTodaysPrompt(dailyPrompts[dayOfYear % dailyPrompts.length])
  }, [])

  const saveEntry = () => {
    if (!currentEntry.title.trim() || !currentEntry.content.trim()) return

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      title: currentEntry.title.trim(),
      content: currentEntry.content.trim(),
      prompt: todaysPrompt,
    }

    const updated = [newEntry, ...entries]
    setEntries(updated)
    localStorage.setItem("numa-journal-entries", JSON.stringify(updated))

    setCurrentEntry({ title: "", content: "" })
    setIsDialogOpen(false)
  }

  const deleteEntry = (id: string) => {
    const updated = entries.filter((entry) => entry.id !== id)
    setEntries(updated)
    localStorage.setItem("numa-journal-entries", JSON.stringify(updated))
    setSelectedEntry(null)
  }

  const filteredEntries = entries.filter(
    (entry) =>
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header with Search and Add */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search entries..."
            className="pl-10 glass border-0"
          />
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="icon" className="rounded-full flex-shrink-0">
              <Plus className="w-5 h-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="glass border-0 max-w-lg">
            <DialogHeader>
              <DialogTitle>New Journal Entry</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              {/* Daily Prompt */}
              <Card className="glass p-4 border-0 bg-primary/5">
                <p className="text-sm text-muted-foreground mb-1">
                  Today's Prompt
                </p>
                <p className="text-sm font-medium">{todaysPrompt}</p>
              </Card>

              <Input
                value={currentEntry.title}
                onChange={(e) =>
                  setCurrentEntry({ ...currentEntry, title: e.target.value })
                }
                placeholder="Entry title..."
                className="glass border-0"
              />
              <Textarea
                value={currentEntry.content}
                onChange={(e) =>
                  setCurrentEntry({ ...currentEntry, content: e.target.value })
                }
                placeholder="Write your thoughts..."
                className="glass border-0 min-h-[200px] resize-none"
              />
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Lock className="w-3 h-3" />
                <span>Your entries are encrypted and stored locally</span>
              </div>
              <Button
                onClick={saveEntry}
                disabled={!currentEntry.title.trim() || !currentEntry.content.trim()}
                className="w-full rounded-xl"
                size="lg"
              >
                Save Entry
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Daily Prompt Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="glass glass-hover p-6 border-0">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Today's Prompt
              </h3>
              <p className="text-lg font-semibold">{todaysPrompt}</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Entries List */}
      {filteredEntries.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass p-12 border-0 text-center">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No entries yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Start journaling to track your thoughts and feelings
            </p>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="rounded-xl"
            >
              Write Your First Entry
            </Button>
          </Card>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {filteredEntries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
            >
              <Card
                className="glass glass-hover p-5 border-0 cursor-pointer"
                onClick={() => setSelectedEntry(entry)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold">{entry.title}</h3>
                  <span className="text-xs text-muted-foreground">
                    {new Date(entry.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                {entry.prompt && (
                  <p className="text-xs text-primary mb-2">
                    💭 {entry.prompt}
                  </p>
                )}
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {entry.content}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Entry Detail Modal */}
      <AnimatePresence>
        {selectedEntry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end md:items-center justify-center p-4"
            onClick={() => setSelectedEntry(null)}
          >
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="glass rounded-3xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto border-0"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-1">
                    {selectedEntry.title}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedEntry.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedEntry(null)}
                  className="rounded-full"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {selectedEntry.prompt && (
                <Card className="glass p-4 border-0 bg-primary/5 mb-4">
                  <p className="text-sm text-muted-foreground mb-1">Prompt</p>
                  <p className="text-sm font-medium">{selectedEntry.prompt}</p>
                </Card>
              )}

              <div className="prose prose-sm dark:prose-invert mb-6">
                <p className="whitespace-pre-wrap">{selectedEntry.content}</p>
              </div>

              <Button
                variant="destructive"
                onClick={() => deleteEntry(selectedEntry.id)}
                className="w-full rounded-xl"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Entry
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}