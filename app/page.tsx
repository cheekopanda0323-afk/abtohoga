"use client"

import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { TopPlayers } from "@/components/top-players"
import { ParticleBackground } from "@/components/particle-background"

export default function Home() {
  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      <ParticleBackground />

      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <TopPlayers />
      </div>
    </main>
  )
}
