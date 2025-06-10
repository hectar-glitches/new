import { Header } from "@/components/header"
import { StockList } from "@/components/stock-list"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { WebSocketProvider } from "@/components/websocket-provider"

export default function StocksPage() {
  return (
    <WebSocketProvider>
      <div className="min-h-screen bg-background">
        <Header />

        <main className="container mx-auto p-4 space-y-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">NSE Stocks</h1>
            <p className="text-muted-foreground">Complete list of Nairobi Securities Exchange stocks</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Listed Stocks</CardTitle>
              <CardDescription>Real-time prices and market data</CardDescription>
            </CardHeader>
            <CardContent>
              <StockList />
            </CardContent>
          </Card>
        </main>
      </div>
    </WebSocketProvider>
  )
}
