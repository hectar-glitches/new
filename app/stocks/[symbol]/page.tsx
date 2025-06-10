import { Suspense } from "react"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StockChart } from "@/components/stock-chart"
import { CompanyProfile } from "@/components/company-profile"
import { StockStats } from "@/components/stock-stats"
import { StockNews } from "@/components/stock-news"
import { Skeleton } from "@/components/ui/skeleton"
import { getStockData } from "@/lib/data"

export default function StockPage({ params }: { params: { symbol: string } }) {
  const stockData = getStockData(params.symbol)

  if (!stockData) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center mb-6">
          <Link href="/" className="flex items-center text-primary mr-4">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Link>
        </div>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-2">Stock Not Found</h1>
          <p className="text-muted-foreground">The stock symbol {params.symbol} could not be found.</p>
        </div>
      </div>
    )
  }

  return (
    <main className="container mx-auto p-4 space-y-6">
      <div className="flex items-center mb-6">
        <Link href="/" className="flex items-center text-primary mr-4">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">
            {stockData.name} ({stockData.symbol})
          </h1>
          <p className="text-muted-foreground">{stockData.sector} • NSE</p>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-2xl font-bold">KES {stockData.price.toFixed(2)}</div>
          <div className={`flex items-center ${stockData.change >= 0 ? "text-green-500" : "text-red-500"}`}>
            <span>
              {stockData.change >= 0 ? "+" : ""}
              {stockData.change.toFixed(2)}
            </span>
            <span className="ml-1">({stockData.changePercent.toFixed(2)}%)</span>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Price Chart</CardTitle>
              <CardDescription>Historical performance and real-time updates</CardDescription>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-sm rounded-md bg-muted">1D</button>
              <button className="px-3 py-1 text-sm rounded-md bg-primary text-primary-foreground">1W</button>
              <button className="px-3 py-1 text-sm rounded-md bg-muted">1M</button>
              <button className="px-3 py-1 text-sm rounded-md bg-muted">3M</button>
              <button className="px-3 py-1 text-sm rounded-md bg-muted">1Y</button>
              <button className="px-3 py-1 text-sm rounded-md bg-muted">5Y</button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
            <StockChart symbol={params.symbol} />
          </Suspense>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Key Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="h-[200px] w-full" />}>
              <StockStats symbol={params.symbol} />
            </Suspense>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Trading Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Open</p>
                <p className="font-medium">KES {stockData.open.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Previous Close</p>
                <p className="font-medium">KES {stockData.previousClose.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Day High</p>
                <p className="font-medium">KES {stockData.dayHigh.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Day Low</p>
                <p className="font-medium">KES {stockData.dayLow.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">52-Week High</p>
                <p className="font-medium">KES {stockData.yearHigh.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">52-Week Low</p>
                <p className="font-medium">KES {stockData.yearLow.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Volume</p>
                <p className="font-medium">{stockData.volume.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Volume</p>
                <p className="font-medium">{stockData.avgVolume.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="about" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="about">Company Profile</TabsTrigger>
          <TabsTrigger value="financials">Financials</TabsTrigger>
          <TabsTrigger value="news">News</TabsTrigger>
        </TabsList>
        <TabsContent value="about">
          <Card>
            <CardContent className="pt-6">
              <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
                <CompanyProfile symbol={params.symbol} />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="financials">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <p className="text-muted-foreground">Financial data is available with a premium subscription.</p>
                <button className="mt-4 bg-primary text-primary-foreground px-4 py-2 rounded-md">
                  Upgrade to Premium
                </button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="news">
          <Card>
            <CardContent className="pt-6">
              <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
                <StockNews symbol={params.symbol} />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}
