"use client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full bg-background/95 backdrop-blur border-b border-border z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity flex-shrink-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-sm sm:text-lg font-bold text-primary-foreground">⚔</span>
          </div>
          <div className="flex flex-col hidden sm:flex">
            <span className="text-lg sm:text-xl font-bold text-glow-red">AliveTierList</span>
            <span className="text-xs text-muted-foreground">Tier System</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-foreground hover:text-primary transition-colors font-medium text-sm">
            Home
          </Link>
          <Link
            href="/leaderboard"
            className="text-foreground hover:text-primary transition-colors font-medium text-sm"
          >
            Rankings
          </Link>
          <Button asChild className="bg-primary hover:bg-primary/90 glow-red-hover text-sm">
            <a href="https://discord.gg" target="_blank" rel="noopener noreferrer">
              Discord
            </a>
          </Button>
        </div>

        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden flex flex-col gap-1.5 p-2">
          <div className="w-5 h-0.5 bg-foreground"></div>
          <div className="w-5 h-0.5 bg-foreground"></div>
          <div className="w-5 h-0.5 bg-foreground"></div>
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-card border-t border-border">
          <div className="px-4 py-3 space-y-3">
            <Link href="/" className="block text-foreground hover:text-primary transition-colors font-medium text-sm">
              Home
            </Link>
            <Link
              href="/leaderboard"
              className="block text-foreground hover:text-primary transition-colors font-medium text-sm"
            >
              Rankings
            </Link>
            <Button asChild className="w-full bg-primary hover:bg-primary/90 glow-red-hover text-sm">
              <a href="https://discord.gg" target="_blank" rel="noopener noreferrer">
                Discord
              </a>
            </Button>
          </div>
        </div>
      )}
    </nav>
  )
}
