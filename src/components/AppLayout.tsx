"use client"

import { Header } from "./Header"
import { BottomNav } from "./BottomNav"
import { PageTransition } from "./PageTransition"

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 pb-24 px-4">
        <div className="max-w-lg mx-auto">
          <PageTransition>
            {children}
          </PageTransition>
        </div>
      </main>
      <BottomNav />
    </>
  )
}
