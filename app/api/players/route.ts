import type { Player } from "@/lib/types"

const STORAGE_KEY = "alivetierlist_players"

const kv = {
  async get(key: string) {
    try {
      if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
        console.log("[v0] Redis env vars not set, using localStorage fallback")
        return null
      }

      const response = await fetch(process.env.KV_REST_API_URL + "/get/" + key, {
        headers: {
          Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
        },
      })

      if (!response.ok) {
        console.log("[v0] Redis API error:", response.status)
        return null
      }

      const data = await response.json()
      return data.result
    } catch (error) {
      console.log("[v0] Redis get error:", error)
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
      console.log("[v0] Redis set error:", error)
    }
  },
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

async function getPlayersData(): Promise<Player[]> {
  try {
    const stored = await kv.get(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (e) {
    console.log("[v0] Error reading from Redis:", e)
  }

  return getDefaultPlayers()
}

async function savePlayersData(players: Player[]) {
  await kv.set(STORAGE_KEY, JSON.stringify(players))
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get("action")

  try {
    const players = await getPlayersData()

    if (action === "top") {
      const limit = Number.parseInt(searchParams.get("limit") || "5")
      return Response.json(players.sort((a, b) => b.overallPoints - a.overallPoints).slice(0, limit))
    }

    if (action === "search") {
      const query = searchParams.get("q") || ""
      const lowerQuery = query.toLowerCase()
      return Response.json(players.filter((p) => p.name.toLowerCase().includes(lowerQuery)))
    }

    if (action === "gamemode") {
      const gameMode = searchParams.get("mode") || ""
      return Response.json(
        players
          .filter((p) => p.stats[gameMode as keyof typeof p.stats]?.tier !== "N/A")
          .sort((a, b) => {
            const aPoints = a.stats[gameMode as keyof typeof a.stats]?.points || 0
            const bPoints = b.stats[gameMode as keyof typeof b.stats]?.points || 0
            return bPoints - aPoints
          }),
      )
    }

    if (action === "id") {
      const id = searchParams.get("id") || ""
      const player = players.find((p) => p.id === id)
      return Response.json(player || null)
    }

    return Response.json(players)
  } catch (error) {
    console.error("[v0] API error:", error)
    return Response.json({ error: "Failed to fetch players" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, player, id, updates } = body

    const players = await getPlayersData()

    if (action === "add") {
      const newPlayer: Player = {
        ...player,
        id: Date.now().toString(),
      }
      players.push(newPlayer)
      await savePlayersData(players)
      return Response.json(newPlayer)
    }

    if (action === "update") {
      const index = players.findIndex((p) => p.id === id)
      if (index === -1) {
        return Response.json({ error: "Player not found" }, { status: 404 })
      }
      players[index] = { ...players[index], ...updates }
      await savePlayersData(players)
      return Response.json(players[index])
    }

    if (action === "delete") {
      const index = players.findIndex((p) => p.id === id)
      if (index === -1) {
        return Response.json({ error: "Player not found" }, { status: 404 })
      }
      players.splice(index, 1)
      await savePlayersData(players)
      return Response.json({ success: true })
    }

    return Response.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("[v0] API error:", error)
    return Response.json({ error: "Failed to process request" }, { status: 500 })
  }
}
