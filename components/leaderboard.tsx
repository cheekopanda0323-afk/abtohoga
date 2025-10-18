"use client"

import { useState, useEffect } from "react"
import { getAllPlayers, searchPlayers } from "@/lib/db"
import type { Player } from "@/lib/types"
import { Input } from "@/components/ui/input"
import Image from "next/image"

export function Leaderboard() {
  const [players, setPlayers] = useState<Player[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([])

  useEffect(() => {
    const allPlayers = getAllPlayers().sort((a, b) => b.points - a.points)
    setPlayers(allPlayers)
    setFilteredPlayers(allPlayers)
  }, [])

  useEffect(() => {
    if (searchQuery.trim()) {
      setFilteredPlayers(searchPlayers(searchQuery).sort((a, b) => b.points - a.points))
    } else {
      setFilteredPlayers(players)
    }
  }, [searchQuery, players])

  const getTierColor = (tier: string) => {
    if (tier.startsWith("HT")) return "text-primary"
    return "text-yellow-400"
  }

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-glow-red mb-6">Leaderboard</h2>
          <Input
            placeholder="Search player by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-4 text-muted-foreground font-semibold">Rank</th>
                <th className="text-left py-4 px-4 text-muted-foreground font-semibold">Player</th>
                <th className="text-left py-4 px-4 text-muted-foreground font-semibold">Tier</th>
                <th className="text-left py-4 px-4 text-muted-foreground font-semibold">Points</th>
                <th className="text-left py-4 px-4 text-muted-foreground font-semibold">Game Mode</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlayers.map((player, index) => (
                <tr key={player.id} className="border-b border-border hover:bg-card/50 transition-colors">
                  <td className="py-4 px-4 text-primary font-bold">#{index + 1}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded overflow-hidden border border-primary/30">
                        <Image
                          src={`https://mc-heads.net/avatar/${player.name}/32`}
                          alt={player.name}
                          width={32}
                          height={32}
                          className="w-full h-full"
                        />
                      </div>
                      <span className="font-semibold">{player.name}</span>
                    </div>
                  </td>
                  <td className={`py-4 px-4 font-bold ${getTierColor(player.tier)}`}>{player.tier}</td>
                  <td className="py-4 px-4 text-primary font-bold">{player.points}</td>
                  <td className="py-4 px-4 text-muted-foreground">{player.gameMode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPlayers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No players found</p>
          </div>
        )}
      </div>
    </section>
  )
}
