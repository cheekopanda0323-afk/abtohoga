"use client"

import { useState, useEffect } from "react"
import { getAllPlayers } from "@/lib/db"
import type { Player } from "@/lib/types"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlayerDetailModal } from "./player-detail-modal"

export function LeaderboardView() {
  const [players, setPlayers] = useState<Player[]>([])
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGameMode, setSelectedGameMode] = useState("SMP")
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const fetchPlayers = async () => {
      const allPlayers = await getAllPlayers()
      setPlayers(allPlayers)
      filterPlayers(allPlayers, selectedGameMode, searchQuery)
    }
    fetchPlayers()
  }, [])

  const filterPlayers = (playerList: Player[], gameMode: string, query: string) => {
    let filtered = playerList

    if (query) {
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
    } else {
      if (gameMode !== "ALL") {
        filtered = filtered.filter((p) => {
          const stats = p.stats[gameMode as keyof typeof p.stats]
          return stats && stats.tier !== "N/A"
        })
      }
    }

    // Sort by overall points
    filtered.sort((a, b) => b.overallPoints - a.overallPoints)
    setFilteredPlayers(filtered)
  }

  const handleGameModeChange = (mode: string) => {
    setSelectedGameMode(mode)
    filterPlayers(players, mode, searchQuery)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    filterPlayers(players, selectedGameMode, query)
  }

  const handlePlayerClick = (player: Player) => {
    setSelectedPlayer(player)
    setIsModalOpen(true)
  }

  const getTierColor = (tier: string) => {
    if (tier === "N/A") return "text-muted-foreground"
    if (tier.startsWith("HT")) return "text-primary"
    return "text-yellow-400"
  }

  const getTierBgColor = (tier: string) => {
    if (tier === "N/A") return "bg-secondary/50"
    if (tier.startsWith("HT")) return "bg-primary/10"
    return "bg-yellow-400/10"
  }

  const getGameModeIcon = (mode: string) => {
    const icons: Record<string, string> = {
      SMP: "🔱",
      UHC: "❤️",
      Nethpot: "⚔️",
      Sword: "💎",
      Crystal: "🔮",
    }
    return icons[mode] || "⚔️"
  }

  return (
    <>
      <div className="min-h-screen bg-background pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl sm:text-6xl font-bold text-glow-red mb-2">AliveTierList</h1>
            <p className="text-xl text-muted-foreground">Minecraft Player Rankings</p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <Input
              placeholder="Search player IGN..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Game Mode Filters */}
          <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
            {["SMP", "UHC", "Crystal", "Sword", "Nethpot", "ALL"].map((mode) => (
              <Button
                key={mode}
                onClick={() => handleGameModeChange(mode)}
                className={`whitespace-nowrap ${
                  selectedGameMode === mode
                    ? "bg-primary hover:bg-primary/90 glow-red-hover"
                    : "bg-secondary/50 hover:bg-secondary text-foreground"
                }`}
              >
                {mode !== "ALL" && getGameModeIcon(mode)} {mode}
              </Button>
            ))}
          </div>

          {/* Leaderboard */}
          <div className="space-y-3">
            {filteredPlayers.length > 0 ? (
              filteredPlayers.map((player, index) => {
                const gameModeStats = player.stats[selectedGameMode as keyof typeof player.stats]
                const displayPoints = gameModeStats?.points || player.overallPoints
                const displayTier = gameModeStats?.tier || "N/A"

                return (
                  <button
                    key={player.id}
                    onClick={() => handlePlayerClick(player)}
                    className="w-full bg-card border border-border rounded-lg p-4 hover:border-primary transition-all hover:shadow-lg hover:shadow-primary/20 cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-2xl font-bold text-primary w-8 text-center">#{index + 1}</div>

                      <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-border flex-shrink-0">
                        <Image
                          src={`https://mc-heads.net/avatar/${player.name}/64`}
                          alt={player.name}
                          width={48}
                          height={48}
                          className="w-full h-full"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-foreground truncate">{player.name}</h3>
                        <p className="text-sm text-muted-foreground">{displayPoints} pts</p>
                      </div>

                      <div className={`px-3 py-1 rounded-lg ${getTierBgColor(displayTier)}`}>
                        <p className={`font-bold text-sm ${getTierColor(displayTier)}`}>{displayTier}</p>
                      </div>
                    </div>
                  </button>
                )
              })
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No players found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <PlayerDetailModal player={selectedPlayer} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
