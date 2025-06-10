import { Header } from "@/components/header"
import { RealTimeDashboard } from "@/components/real-time-dashboard"

export default function RealTimePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto p-4">
        <RealTimeDashboard />
      </main>
    </div>
  )
}
