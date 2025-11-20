"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, TrendingUp } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

type MoodEntry = {
  date: string
  emoji: string
  intensity: number
  note?: string
}

const moods = [
  { emoji: "😊", label: "Happy", color: "bg-green-500" },
  { emoji: "😌", label: "Calm", color: "bg-blue-500" },
  { emoji: "😔", label: "Sad", color: "bg-indigo-500" },
  { emoji: "😰", label: "Anxious", color: "bg-yellow-500" },
  { emoji: "😡", label: "Angry", color: "bg-red-500" },
  { emoji: "😴", label: "Tired", color: "bg-purple-500" },
  { emoji: "🥰", label: "Loved", color: "bg-pink-500" },
  { emoji: "😢", label: "Heartbroken", color: "bg-rose-500" },
]

export default function MoodPage() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [intensity, setIntensity] = useState([5])
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([])
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("numa-mood-history")
    if (stored) {
      setMoodHistory(JSON.parse(stored))
    }
  }, [])

  const handleSave = () => {
    if (!selectedMood) return

    const entry: MoodEntry = {
      date: new Date().toISOString(),
      emoji: selectedMood,
      intensity: intensity[0],
    }

    const updated = [entry, ...moodHistory]
    setMoodHistory(updated)
    localStorage.setItem("numa-mood-history", JSON.stringify(updated))

    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
      setSelectedMood(null)
      setIntensity([5])
    }, 2000)
  }

  const getWeekDays = () => {
    const days = []
    const today = new Date()
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      days.push(date)
    }
    return days
  }

  const getMoodForDate = (date: Date) => {
    const dateStr = date.toDateString()
    return moodHistory.find(
      (entry) => new Date(entry.date).toDateString() === dateStr
    )
  }

  const getIntensityColor = (intensity: number) => {
    if (intensity <= 3) return "bg-green-500"
    if (intensity <= 6) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="space-y-6">
      {/* Success Message */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass p-4 rounded-2xl border-0 bg-green-500/10"
          >
            <p className="text-center text-green-600 dark:text-green-400 font-medium">
              ✓ Mood logged successfully!
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mood Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="glass p-6 border-0">
          <h2 className="text-lg font-semibold mb-4">How are you feeling?</h2>
          <div className="grid grid-cols-4 gap-3 mb-6">
            {moods.map((mood) => (
              <button
                key={mood.emoji}
                onClick={() => setSelectedMood(mood.emoji)}
                className={cn(
                  "p-4 rounded-2xl transition-all duration-200 hover:scale-105",
                  selectedMood === mood.emoji
                    ? "bg-primary/20 scale-105 ring-2 ring-primary"
                    : "bg-muted/50 hover:bg-muted"
                )}
              >
                <div className="text-4xl mb-1">{mood.emoji}</div>
                <div className="text-xs text-muted-foreground">{mood.label}</div>
              </button>
            ))}
          </div>

          {/* Intensity Slider */}
          <AnimatePresence>
            {selectedMood && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium">Intensity</label>
                    <span className="text-sm text-muted-foreground">
                      {intensity[0]}/10
                    </span>
                  </div>
                  <Slider
                    value={intensity}
                    onValueChange={setIntensity}
                    max={10}
                    min={1}
                    step={1}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Mild</span>
                    <span>Moderate</span>
                    <span>Intense</span>
                  </div>
                </div>

                <Button
                  onClick={handleSave}
                  className="w-full rounded-xl"
                  size="lg"
                >
                  Log Mood
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>

      {/* Weekly Calendar View */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="glass p-6 border-0">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">This Week</h3>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {getWeekDays().map((date, index) => {
              const mood = getMoodForDate(date)
              const isToday = date.toDateString() === new Date().toDateString()

              return (
                <div
                  key={index}
                  className={cn(
                    "aspect-square rounded-xl flex flex-col items-center justify-center p-2 transition-all",
                    mood ? "glass-hover" : "bg-muted/30",
                    isToday && "ring-2 ring-primary"
                  )}
                >
                  <div className="text-xs text-muted-foreground mb-1">
                    {date.toLocaleDateString("en-US", { weekday: "short" })}
                  </div>
                  {mood ? (
                    <>
                      <div className="text-2xl mb-1">{mood.emoji}</div>
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full",
                          getIntensityColor(mood.intensity)
                        )}
                      />
                    </>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-muted/50" />
                  )}
                </div>
              )
            })}
          </div>
        </Card>
      </motion.div>

      {/* Recent Mood History */}
      {moodHistory.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass p-6 border-0">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Recent Check-ins</h3>
            </div>
            <div className="space-y-3">
              {moodHistory.slice(0, 5).map((entry, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-4 p-3 rounded-xl bg-muted/30"
                >
                  <div className="text-3xl">{entry.emoji}</div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">
                      {new Date(entry.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Intensity: {entry.intensity}/10
                    </div>
                  </div>
                  <div
                    className={cn(
                      "w-3 h-3 rounded-full",
                      getIntensityColor(entry.intensity)
                    )}
                  />
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  )
}