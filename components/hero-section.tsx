"use client"

import { useState } from "react"
import { searchPlayers } from "@/lib/db"
import type { Player } from "@/lib/types"
import Image from "next/image"
import { PlayerDetailModal } from "./player-detail-modal"

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Player[]>([])
  const [showResults, setShowResults] = useState(false)
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      const results = searchPlayers(query)
      setSearchResults(results)
      setShowResults(true)
    } else {
      setShowResults(false)
    }
  }

  const handlePlayerClick = (player: Player) => {
    setSelectedPlayer(player)
    setIsModalOpen(true)
    setShowResults(false)
  }

  return (
    <>
      <section className="min-h-screen bg-background pt-20 sm:pt-24 px-4 sm:px-6 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-20 right-10 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-br from-accent/10 to-transparent rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-br from-orange-500/5 to-transparent rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8 relative z-10 w-full">
          <div className="space-y-2 sm:space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-primary tracking-tight text-glow-orange">
              AliveTierList
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground font-medium">
              Minecraft Player Rankings
            </p>
          </div>

          <div className="pt-2 sm:pt-4">
            <div className="max-w-md mx-auto relative">
              <input
                type="text"
                placeholder="Search player IGN..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-card border border-border rounded-lg text-sm sm:text-base text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
              />

              {/* Search results dropdown */}
              {showResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg overflow-hidden shadow-lg z-50 max-h-64 overflow-y-auto">
                  {searchResults.map((player) => (
                    <button
                      key={player.id}
                      onClick={() => handlePlayerClick(player)}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 hover:bg-secondary/50 transition-colors text-left flex items-center gap-2 sm:gap-3 border-b border-border last:border-b-0"
                    >
                      <Image
                        src={`https://mc-heads.net/avatar/${player.name}/32`}
                        alt={player.name}
                        width={32}
                        height={32}
                        className="rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground text-sm truncate">{player.name}</p>
                        <p className="text-xs text-muted-foreground">{player.overallPoints} points</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {showResults && searchResults.length === 0 && searchQuery.trim() && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg p-3 sm:p-4 text-center text-sm text-muted-foreground">
                  No players found
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 sm:pt-8 bg-gradient-to-br from-card to-secondary/50 border border-border rounded-lg p-4 sm:p-6 md:p-8 max-w-2xl mx-auto">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="text-left">
                <h2 className="text-lg sm:text-2xl font-black text-foreground mb-1 sm:mb-2">
                  Welcome to AliveTierList
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  The ultimate Minecraft player ranking system. Track your performance across multiple gamemodes and
                  compete with the best players in the community.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-4 sm:pt-8 max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-card to-secondary/30 border border-border rounded-lg p-4 sm:p-6 text-center cursor-pointer transition-all hover:border-primary">
              <p className="font-black text-sm sm:text-base text-foreground mb-1">5 Gamemodes</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Compete in SMP, UHC, NETH, Crystal, and Sword</p>
            </div>
            <div className="bg-gradient-to-br from-card to-secondary/30 border border-border rounded-lg p-4 sm:p-6 text-center cursor-pointer transition-all hover:border-primary">
              <p className="font-black text-sm sm:text-base text-foreground mb-1">Global Rankings</p>
              <p className="text-xs sm:text-sm text-muted-foreground">See where you stand against other players</p>
            </div>
            <div className="bg-gradient-to-br from-card to-secondary/30 border border-border rounded-lg p-4 sm:p-6 text-center cursor-pointer transition-all hover:border-primary">
              <p className="font-black text-sm sm:text-base text-foreground mb-1">Real-time Updates</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Rankings update instantly as players compete</p>
            </div>
          </div>
        </div>
      </section>

      <PlayerDetailModal player={selectedPlayer} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
