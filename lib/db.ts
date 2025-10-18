import type { Player } from "./types"

const STORAGE_KEY = "alivetierlist_players"

const kv = {
  async get(key: string) {
    try {
      if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
        console.warn("[v0] Redis env vars not set, using localStorage")
        return null
      }

      const response = await fetch(process.env.KV_REST_API_URL + "/get/" + key, {
        headers: {
          Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
        },
      })

      if (!response.ok) {
        console.warn("[v0] Redis API error:", response.status)
        return null
      }

      const contentType = response.headers.get("content-type")
      if (!contentType?.includes("application/json")) {
        console.warn("[v0] Redis returned non-JSON response")
        return null
      }

      const data = await response.json()
      return data.result
    } catch (error) {
      console.warn("[v0] Redis get error, falling back to localStorage:", error)
      return null
    }
  },
  async set(key: string, value: string) {
    try {
      if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
        return
      }

      await fetch(process.env.KV_REST_API_URL + "/set/" + key, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ value }),
      })
    } catch (error) {
      console.warn("[v0] Redis set error:", error)
    }
  },
}

let playersCache: Player[] = []
let initialized = false

async function initializeFromRedis() {
  if (initialized) return
  initialized = true

  try {
    const stored = await kv.get(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].stats?.UHC) {
        playersCache = parsed
        return
      }
    }
  } catch (e) {
    console.warn("[v0] Error reading from Redis:", e)
  }

  try {
    if (typeof window !== "undefined") {
      const localStored = localStorage.getItem(STORAGE_KEY)
      if (localStored) {
        const parsed = JSON.parse(localStored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          playersCache = parsed
          return
        }
      }
    }
  } catch (e) {
    console.warn("[v0] Error reading from localStorage:", e)
  }

  // If no data anywhere, initialize with defaults
  playersCache = getDefaultPlayers()
  await saveToRedis()
}

function getDefaultPlayers(): Player[] {
  return [
    {
      id: "1",
      name: "Marlowww",
      overallPoints: 5200,
      stats: {
        UHC: { tier: "HT5", points: 5200 },
        Crystal: { tier: "HT4", points: 4800 },
        Sword: { tier: "HT3", points: 4200 },
        Nethpot: { tier: "HT2", points: 3800 },
        SMP: { tier: "HT1", points: 3200 },
      },
    },
    {
      id: "2",
      name: "ItzRealMe",
      overallPoints: 5100,
      stats: {
        UHC: { tier: "HT4", points: 4800 },
        Crystal: { tier: "HT5", points: 5100 },
        Sword: { tier: "HT2", points: 3800 },
        Nethpot: { tier: "HT3", points: 4200 },
        SMP: { tier: "LT1", points: 2800 },
      },
    },
    {
      id: "3",
      name: "Swight",
      overallPoints: 4800,
      stats: {
        UHC: { tier: "HT3", points: 4200 },
        Crystal: { tier: "HT2", points: 3800 },
        Sword: { tier: "HT5", points: 4800 },
        Nethpot: { tier: "HT1", points: 3200 },
        SMP: { tier: "HT2", points: 3800 },
      },
    },
    {
      id: "4",
      name: "NetherKing",
      overallPoints: 4600,
      stats: {
        UHC: { tier: "HT2", points: 3800 },
        Crystal: { tier: "HT3", points: 4200 },
        Sword: { tier: "HT1", points: 3200 },
        Nethpot: { tier: "HT5", points: 4600 },
        SMP: { tier: "HT3", points: 4200 },
      },
    },
    {
      id: "5",
      name: "VoidWalker",
      overallPoints: 4200,
      stats: {
        UHC: { tier: "HT4", points: 4800 },
        Crystal: { tier: "LT1", points: 2800 },
        Sword: { tier: "LT2", points: 3200 },
        Nethpot: { tier: "LT1", points: 2800 },
        SMP: { tier: "HT2", points: 3800 },
      },
    },
    {
      id: "6",
      name: "PhantomSlayer",
      overallPoints: 3800,
      stats: {
        UHC: { tier: "LT3", points: 3800 },
        Crystal: { tier: "LT2", points: 3200 },
        Sword: { tier: "LT1", points: 2800 },
        Nethpot: { tier: "LT2", points: 3200 },
        SMP: { tier: "LT1", points: 2800 },
      },
    },
    {
      id: "7",
      name: "IceBreaker",
      overallPoints: 3200,
      stats: {
        UHC: { tier: "LT2", points: 3200 },
        Crystal: { tier: "LT1", points: 2800 },
        Sword: { tier: "LT3", points: 3800 },
        Nethpot: { tier: "N/A", points: 0 },
        SMP: { tier: "LT2", points: 3200 },
      },
    },
    {
      id: "8",
      name: "FireDancer",
      overallPoints: 3100,
      stats: {
        UHC: { tier: "LT1", points: 2800 },
        Crystal: { tier: "LT2", points: 3200 },
        Sword: { tier: "N/A", points: 0 },
        Nethpot: { tier: "LT2", points: 3200 },
        SMP: { tier: "LT1", points: 2800 },
      },
    },
  ]
}

export async function getAllPlayers(): Promise<Player[]> {
  try {
    const response = await fetch("/api/players")
    if (!response.ok) throw new Error("Failed to fetch players")
    return response.json()
  } catch (error) {
    console.error("[v0] Error fetching players:", error)
    return []
  }
}

export async function getTopPlayers(limit = 5): Promise<Player[]> {
  try {
    const response = await fetch(`/api/players?action=top&limit=${limit}`)
    if (!response.ok) throw new Error("Failed to fetch top players")
    return response.json()
  } catch (error) {
    console.error("[v0] Error fetching top players:", error)
    return []
  }
}

export async function getPlayersByGameMode(gameMode: string): Promise<Player[]> {
  try {
    const response = await fetch(`/api/players?action=gamemode&mode=${gameMode}`)
    if (!response.ok) throw new Error("Failed to fetch players by gamemode")
    return response.json()
  } catch (error) {
    console.error("[v0] Error fetching players by gamemode:", error)
    return []
  }
}

export async function searchPlayers(query: string): Promise<Player[]> {
  try {
    const response = await fetch(`/api/players?action=search&q=${encodeURIComponent(query)}`)
    if (!response.ok) throw new Error("Failed to search players")
    return response.json()
  } catch (error) {
    console.error("[v0] Error searching players:", error)
    return []
  }
}

export async function getPlayerById(id: string): Promise<Player | null> {
  try {
    const response = await fetch(`/api/players?action=id&id=${id}`)
    if (!response.ok) throw new Error("Failed to fetch player")
    return response.json()
  } catch (error) {
    console.error("[v0] Error fetching player:", error)
    return null
  }
}

export async function addPlayer(player: Omit<Player, "id">): Promise<Player | null> {
  try {
    const response = await fetch("/api/players", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "add", player }),
    })
    if (!response.ok) throw new Error("Failed to add player")
    return response.json()
  } catch (error) {
    console.error("[v0] Error adding player:", error)
    return null
  }
}

export async function updatePlayer(id: string, updates: Partial<Player>): Promise<Player | null> {
  try {
    const response = await fetch("/api/players", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update", id, updates }),
    })
    if (!response.ok) throw new Error("Failed to update player")
    return response.json()
  } catch (error) {
    console.error("[v0] Error updating player:", error)
    return null
  }
}

export async function deletePlayer(id: string): Promise<boolean> {
  try {
    const response = await fetch("/api/players", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", id }),
    })
    if (!response.ok) throw new Error("Failed to delete player")
    return true
  } catch (error) {
    console.error("[v0] Error deleting player:", error)
    return false
  }
}

async function saveToRedis() {
  await kv.set(STORAGE_KEY, JSON.stringify(playersCache))

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(playersCache))
    } catch (e) {
      console.warn("[v0] Error saving to localStorage:", e)
    }
  }
}
