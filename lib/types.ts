export interface GameModeStats {
  tier: "HT1" | "LT1" | "HT2" | "LT2" | "HT3" | "LT3" | "HT4" | "LT4" | "HT5" | "LT5" | "N/A"
  points: number
}

export interface Player {
  id: string
  name: string
  overallPoints: number
  stats: {
    UHC: GameModeStats
    Crystal: GameModeStats
    Sword: GameModeStats
    Nethpot: GameModeStats
    SMP: GameModeStats
  }
}

export const TIERS = ["HT1", "LT1", "HT2", "LT2", "HT3", "LT3", "HT4", "LT4", "HT5", "LT5", "N/A"] as const
export const GAME_MODES = ["UHC", "Crystal", "Sword", "Nethpot", "SMP"] as const
