import { Header } from "@/components/header"
import { MarketOverview } from "@/components/market-overview"
import { StockList } from "@/components/stock-list"
import { MarketIndices } from "@/components/market-indices"
import { TopMovers } from "@/components/top-movers"
import { MarketNews } from "@/components/market-news"
import { MarketDepth } from "@/components/market-depth"
import { RealTimeDashboard } from "@/components/real-time-dashboard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { WebSocketProvider } from "@/components/websocket-provider"

export default function Home() {
  return (
    <WebSocketProvider>
      <div className="min-h-screen bg-background">
        <Header />

        <main className="container mx-auto p-4 space-y-6">
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="dashboard">Market Dashboard</TabsTrigger>
              <TabsTrigger value="realtime">Real-time Data</TabsTrigger>
              <TabsTrigger value="stocks">All Stocks</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6">
              <MarketOverview />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Market Indices</CardTitle>
                      <CardDescription>NSE key indices performance</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <MarketIndices />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Market News</CardTitle>
                      <CardDescription>Latest market updates and news</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <MarketNews />
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Movers</CardTitle>
                      <CardDescription>Best and worst performers</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <TopMovers />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Market Depth</CardTitle>
                      <CardDescription>Order book and recent trades</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <MarketDepth />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="realtime">
              <RealTimeDashboard />
            </TabsContent>

            <TabsContent value="stocks">
              <Card>
                <CardHeader>
                  <CardTitle>All NSE Stocks</CardTitle>
                  <CardDescription>Complete list of stocks with real-time prices</CardDescription>
                </CardHeader>
                <CardContent>
                  <StockList />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analysis">
              <Card>
                <CardHeader>
                  <CardTitle>Investment Analysis</CardTitle>
                  <CardDescription>AI-powered stock analysis and recommendations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">Investment analysis coming soon...</p>
                    <a href="/analysis" className="text-primary hover:underline">
                      View detailed analysis page →
                    </a>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </WebSocketProvider>
  )
}
