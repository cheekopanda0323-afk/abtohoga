"use client"

import { useState, useEffect } from "react"
import { getTopPlayers } from "@/lib/db"
import type { Player } from "@/lib/types"
import Image from "next/image"
import { PlayerDetailModal } from "./player-detail-modal"
import Link from "next/link"

export function TopPlayers() {
  const [players, setPlayers] = useState<Player[]>([])
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const fetchPlayers = async () => {
      const topPlayers = await getTopPlayers(5)
      setPlayers(topPlayers)
    }
    fetchPlayers()
  }, [])

  const handlePlayerClick = (player: Player) => {
    setSelectedPlayer(player)
    setIsModalOpen(true)
  }

  return (
    <>
      <section id="ranking-section" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-background relative">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-primary mb-1 sm:mb-2 text-glow-orange">
              Overall Rankings
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">Top 5 players by points</p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {players.map((player, index) => (
              <button
                key={player.id}
                onClick={() => handlePlayerClick(player)}
                className="w-full bg-gradient-to-r from-card to-secondary/50 border border-border rounded-lg p-3 sm:p-4 md:p-6 hover:border-primary hover:from-card hover:to-secondary/70 transition-all duration-300 cursor-pointer text-left group shine-effect-players glow-orange-hover"
              >
                <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
                  <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center glow-orange border border-accent/50">
                    <span className="text-lg sm:text-xl md:text-2xl font-black text-white">{index + 1}</span>
                  </div>

                  <div className="flex-1 flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0">
                    <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg overflow-hidden border-2 border-primary/50 glow-orange flex-shrink-0">
                      <Image
                        src={`https://mc-heads.net/avatar/${player.name}/64`}
                        alt={player.name}
                        width={64}
                        height={64}
                        className="w-full h-full"
                      />
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-black text-sm sm:text-base md:text-lg text-foreground uppercase truncate">
                        {player.name}
                      </h3>
                      <p className="text-xs text-muted-foreground truncate">{player.name}</p>
                    </div>
                  </div>

                  <div className="flex-shrink-0 text-right">
                    <p className="text-xl sm:text-2xl md:text-3xl font-black text-primary text-glow-orange">
                      {player.overallPoints}
                    </p>
                    <p className="text-xs text-muted-foreground">points</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-8 sm:mt-10 md:mt-12 flex justify-center">
            <Link href="/leaderboard">
              <button className="px-6 sm:px-8 py-2 sm:py-3 bg-primary text-primary-foreground font-black text-sm sm:text-base rounded-lg hover:bg-accent transition-all duration-300 glow-orange-hover">
                View All Leaderboard
              </button>
            </Link>
          </div>
        </div>
      </section>

      <PlayerDetailModal player={selectedPlayer} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
