"use client"

import { PWAInstallPrompt } from "@/components/PWAInstallPrompt"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"
import { Sparkles, TrendingUp, Flame, Heart, Brain, Smile } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useEffect, useState } from "react"

const moodData = [
  { day: "Mon", mood: 6, energy: 5 },
  { day: "Tue", mood: 7, energy: 6 },
  { day: "Wed", mood: 5, energy: 4 },
  { day: "Thu", mood: 8, energy: 7 },
  { day: "Fri", mood: 7, energy: 8 },
  { day: "Sat", mood: 9, energy: 8 },
  { day: "Sun", mood: 8, energy: 7 },
]

const stats = [
  { label: "Wellness Score", value: 76, icon: Sparkles, color: "text-purple-500" },
  { label: "Mood Avg", value: 7.3, max: 10, icon: Heart, color: "text-pink-500" },
  { label: "Check-ins", value: 24, icon: Brain, color: "text-blue-500" },
  { label: "Streak", value: 7, suffix: " days", icon: Flame, color: "text-orange-500" },
]

export default function Dashboard() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
      <div className="space-y-6">
        {/* Welcome Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass glass-hover p-6 border-0">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                <Smile className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-1">Hello! How are you feeling today?</h2>
                <p className="text-sm text-muted-foreground">
                  You've been doing great this week. Keep it up! 💪
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <Card className="glass glass-hover p-4 border-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                    <span className="text-xs text-muted-foreground">{stat.label}</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {stat.value}{stat.suffix || ""}
                    {stat.max && <span className="text-sm text-muted-foreground">/{stat.max}</span>}
                  </div>
                  {stat.label === "Wellness Score" && mounted && (
                    <Progress value={stat.value} className="mt-2 h-1.5" />
                  )}
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Mood Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="glass p-6 border-0">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Weekly Mood Trend</h3>
            </div>
            {mounted && (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={moodData}>
                  <defs>
                    <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis 
                    dataKey="day" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    domain={[0, 10]}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      backdropFilter: "blur(20px)"
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="mood" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    fill="url(#moodGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="glass p-6 border-0">
            <h3 className="text-lg font-semibold mb-4">Today's Insight</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <p className="text-sm">Your mood has improved by 15% this week! 📈</p>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/10">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <p className="text-sm">You've maintained a 7-day streak. Amazing! 🔥</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
      <PWAInstallPrompt />
    </>
  )
}