"use client"
import type { Player } from "@/lib/types"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface PlayerDetailModalProps {
  player: Player | null
  isOpen: boolean
  onClose: () => void
}

export function PlayerDetailModal({ player, isOpen, onClose }: PlayerDetailModalProps) {
  if (!isOpen || !player) return null

  const getTierColor = (tier: string) => {
    if (tier === "N/A") return "text-muted-foreground"
    if (tier.startsWith("HT")) return "text-primary"
    return "text-yellow-400"
  }

  const getTierBgColor = (tier: string) => {
    if (tier === "N/A") return "bg-secondary/50 border-secondary"
    if (tier.startsWith("HT")) return "bg-primary/10 border-primary/50"
    return "bg-yellow-400/10 border-yellow-400/50"
  }

  const gameModesArray = Object.entries(player.stats)

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-card border border-primary/30 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with close button */}
        <div className="sticky top-0 bg-card border-b border-border p-4 flex justify-end">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Player Avatar and Name */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary glow-red">
              <Image
                src={`https://mc-heads.net/avatar/${player.name}/128`}
                alt={player.name}
                width={128}
                height={128}
                className="w-full h-full"
              />
            </div>
            <div className="text-center">
              <h2 className="text-3xl font-bold text-glow-red">{player.name}</h2>
              <p className="text-sm text-muted-foreground">{player.name}</p>
            </div>
          </div>

          {/* Overall Position and Points */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-secondary/50 rounded-lg p-4 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-primary-foreground font-bold text-sm">
                  1
                </div>
                <span className="text-xs text-muted-foreground">POSITION</span>
              </div>
              <p className="text-xs text-muted-foreground">OVERALL</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-4 border border-border">
              <p className="text-2xl font-bold text-primary mb-1">{player.overallPoints}</p>
              <p className="text-xs text-muted-foreground">points</p>
            </div>
          </div>

          {/* Game Mode Tiers */}
          <div>
            <h3 className="text-sm font-bold text-foreground mb-3">TIERS</h3>
            <div className="grid grid-cols-3 gap-3">
              {gameModesArray.slice(0, 4).map(([mode, stats]) => (
                <div
                  key={mode}
                  className={`rounded-lg p-3 border ${getTierBgColor(stats.tier)} flex flex-col items-center gap-2`}
                >
                  <div className="w-6 h-6 flex items-center justify-center text-lg">
                    {mode === "UHC" && "⚔"}
                    {mode === "Crystal" && "💎"}
                    {mode === "Sword" && "🗡"}
                    {mode === "Nethpot" && "🔥"}
                    {mode === "SMP" && "🏠"}
                  </div>
                  <p className={`text-xs font-bold ${getTierColor(stats.tier)}`}>{stats.tier}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Primary Game Mode Stats */}
          {player.stats.SMP && (
            <div className="border border-primary/30 rounded-lg p-4 bg-primary/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center text-lg">🏠</div>
                <div>
                  <p className="text-sm font-bold text-foreground">SMP</p>
                  <p className={`text-xs font-bold ${getTierColor(player.stats.SMP.tier)}`}>{player.stats.SMP.tier}</p>
                </div>
                <div className="ml-auto text-right">
                  <p className={`text-lg font-bold ${getTierColor(player.stats.SMP.tier)}`}>
                    {player.stats.SMP.points}
                  </p>
                  <p className="text-xs text-muted-foreground">pts</p>
                </div>
              </div>
            </div>
          )}

          {/* Close Button */}
          <Button onClick={onClose} className="w-full bg-primary hover:bg-primary/90 glow-red-hover">
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
