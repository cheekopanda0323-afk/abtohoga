import { Navbar } from "@/components/navbar"
import { LeaderboardView } from "@/components/leaderboard-view"

export default function LeaderboardPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <LeaderboardView />
    </main>
  )
}
