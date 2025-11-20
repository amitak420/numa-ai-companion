# Numa - AI-Powered Emotional Support Companion 💜

An AI-powered Progressive Web App (PWA) designed to provide emotional support for young Indians dealing with heartbreak, loneliness, and anxiety.

## ✨ Features

### 🏠 Dashboard
- **Apple Health-style mood graphs** with weekly trends
- **Wellness score tracking** with visual progress indicators
- **Streak counter** to motivate daily check-ins
- **Animated statistics** using Recharts
- **Glassmorphic design** with smooth transitions

### 💬 Chat Interface
- **WhatsApp-style messaging** with typing indicators
- **Crisis detection** for self-harm keywords with emergency resources
- **Conversation memory** using localStorage
- **AI responses** (placeholder - ready for Gemini API integration)
- **Real-time message bubbles** with timestamps

### 🎭 Mood Tracking
- **8 emoji mood options** (Happy, Calm, Sad, Anxious, Angry, Tired, Loved, Heartbroken)
- **Intensity slider** (1-10 scale)
- **Weekly calendar view** with color-coded mood patterns
- **Recent check-ins history** with timestamps
- **Success animations** on mood log

### 📔 Journal
- **Daily writing prompts** that rotate automatically
- **Encrypted local storage** for privacy
- **Search and filter** functionality
- **Full-screen entry viewer** with smooth animations
- **Delete protection** for entries
- **Local data persistence**

### 🎨 Design System
- **Glassmorphic UI** with backdrop blur effects
- **Light/Dark theme** toggle with smooth transitions
- **Custom purple/pink gradient** color scheme
- **Inter font family** for clean typography
- **Mobile-first responsive** design
- **Smooth page transitions** using Framer Motion

### 📱 PWA Features
- **Offline support** with service worker
- **Install prompt** for home screen
- **App-like experience** in standalone mode
- **Fast loading** with caching strategies

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- Git

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd numa

# Install dependencies
bun install
# or
npm install

# Run development server
bun dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 🔧 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** Shadcn/UI + Radix UI
- **Animations:** Framer Motion
- **Charts:** Recharts
- **Icons:** Lucide React
- **Storage:** LocalStorage (client-side)

## 🔌 Gemini API Integration

To enable real AI responses in the chat:

1. Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

2. Create a `.env.local` file:
```env
NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
```

3. Install the Gemini SDK:
```bash
bun add @google/generative-ai
```

4. Update `src/app/chat/page.tsx`:
```typescript
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: "gemini-pro" })

const generateResponse = async (userMessage: string): Promise<string> => {
  if (detectCrisis(userMessage)) {
    setShowCrisisAlert(true)
    return CRISIS_RESPONSE
  }

  const prompt = `You are Numa, a compassionate AI emotional support companion for young Indians. 
  Respond with empathy, cultural awareness, and emotional intelligence. 
  User message: ${userMessage}`

  const result = await model.generateContent(prompt)
  return result.response.text()
}
```

## 📊 Data Storage

All user data is stored locally using browser localStorage:

- **Chat History:** `numa-chat-history`
- **Mood Entries:** `numa-mood-history`
- **Journal Entries:** `numa-journal-entries`
- **Theme Preference:** `numa-theme`
- **PWA Dismissal:** `numa-pwa-dismissed`

**Note:** Data is private and never leaves the user's device (unless Gemini API is integrated for chat).

## 🌈 Color Scheme

```css
Primary: Purple (#8b5cf6) - Trust, Calm, Wisdom
Accent: Pink (#ec4899) - Compassion, Love, Care
Backgrounds: Glassmorphic with gradients
```

## 🛡️ Crisis Support Resources

The app includes crisis detection for keywords like:
- suicide, self-harm, overdose, etc.

**Integrated Resources:**
- 🆘 National Suicide Prevention: 1-800-273-8255
- 📞 Crisis Text Line: Text HOME to 741741
- 🇮🇳 AASRA (India): +91-9820466726

## 📱 PWA Installation

### Desktop (Chrome/Edge)
1. Click the install icon in the address bar
2. Follow the prompts

### Mobile (iOS Safari)
1. Tap Share button
2. Scroll and tap "Add to Home Screen"

### Mobile (Android Chrome)
1. Tap the three-dot menu
2. Tap "Install app" or "Add to Home Screen"

## 🎯 Roadmap

- [ ] Gemini API integration for intelligent responses
- [ ] Push notifications for daily check-ins
- [ ] Export journal entries as PDF
- [ ] Meditation/breathing exercises
- [ ] Community support groups
- [ ] Professional therapist matching
- [ ] Multi-language support (Hindi, Tamil, Bengali, etc.)

## 🤝 Contributing

This is a mental health support tool. Please be mindful and respectful when contributing.

## 📄 License

MIT License - feel free to use this project for personal or educational purposes.

## ⚠️ Disclaimer

Numa is a supportive tool and **NOT a replacement for professional mental health care**. If you're experiencing a mental health crisis, please contact:

- **Emergency:** 911 or your local emergency services
- **AASRA (India):** +91-9820466626
- **Vandrevala Foundation:** 1860-2662-345

## 💜 Built with care for mental wellness

Remember: You matter. You're not alone. Help is always available.

---

Made with ❤️ for the mental health community