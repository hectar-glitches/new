"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  RefreshCw,
  Database,
  TrendingUp,
  TrendingDown,
  Activity,
  Globe,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface StockData {
  symbol: string
  close_price: number
  change_amount: number
  change_percent: number
  volume: number
  date: string
  stocks: {
    name: string
    sector: string
  }
}

export function RealTimeDashboard() {
  const [stocks, setStocks] = useState<StockData[]>([])
  const [topMovers, setTopMovers] = useState<{ gainers: StockData[]; losers: StockData[] }>({ gainers: [], losers: [] })
  const [loading, setLoading] = useState(false)
  const [scraping, setScraping] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<string | null>(null)
  const [dataSource, setDataSource] = useState<string>("No data")
  const [scraperStatus, setScraperStatus] = useState<"idle" | "running" | "success" | "error">("idle")
  const { toast } = useToast()

  const fetchStockData = async () => {
    setLoading(true)
    try {
      const [stocksResponse, moversResponse] = await Promise.all([fetch("/api/stocks"), fetch("/api/top-movers")])

      if (stocksResponse.ok) {
        const stocksData = await stocksResponse.json()
        setStocks(stocksData.data || [])
      }

      if (moversResponse.ok) {
        const moversData = await moversResponse.json()
        setTopMovers(moversData.data || { gainers: [], losers: [] })
      }

      setLastUpdate(new Date().toLocaleString())
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "Failed to fetch stock data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const runDataProcessor = async () => {
    setScraping(true)
    setScraperStatus("running")

    try {
      toast({
        title: "🚀 Processing NSE Data",
        description: "Attempting to fetch and process stock data...",
      })

      const response = await fetch("/api/scrape-and-save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      // Check if response is ok first
      if (!response.ok) {
        console.error(`HTTP Error: ${response.status} ${response.statusText}`)
        const errorText = await response.text()
        console.error("Error response:", errorText)
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      // Check content type
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text()
        console.error("Non-JSON response:", text)
        throw new Error(`Expected JSON but got: ${text.substring(0, 100)}...`)
      }

      const result = await response.json()
      console.log("Scraper result:", result)

      if (result.success) {
        setScraperStatus("success")
        setDataSource(result.source || "mystocks.co.ke")

        toast({
          title: "✅ Real Data Success!",
          description: result.message,
        })

        // Refresh data after processing
        await fetchStockData()
      } else {
        setScraperStatus("error")
        throw new Error(result.error || result.details || "Data processing failed")
      }
    } catch (error) {
      console.error("Error processing data:", error)
      setScraperStatus("error")

      let errorMessage = "Failed to process NSE data"
      if (error instanceof Error) {
        errorMessage = error.message
      }

      toast({
        title: "❌ Processing Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setScraping(false)
    }
  }

  useEffect(() => {
    fetchStockData()
  }, [])

  const formatPrice = (price: number) => `KES ${price.toFixed(2)}`
  const formatChange = (change: number | null, percent: number | null) => {
    // Handle null values safely
    if (change === null || percent === null || change === undefined || percent === undefined) {
      return "N/A"
    }

    const sign = change >= 0 ? "+" : ""
    return `${sign}${change.toFixed(2)} (${sign}${percent.toFixed(2)}%)`
  }

  const getStatusIcon = () => {
    switch (scraperStatus) {
      case "running":
        return <Database className="h-4 w-4 animate-pulse text-blue-500" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <Database className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">🇰🇪 NSE Real-Time Dashboard</h1>
          <p className="text-muted-foreground">
            Nairobi Securities Exchange market data • {lastUpdate && `Last updated: ${lastUpdate}`}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Globe className="h-3 w-3" />
              Source: {dataSource}
            </Badge>
            {scraperStatus !== "idle" && (
              <Badge
                variant={
                  scraperStatus === "success" ? "default" : scraperStatus === "error" ? "destructive" : "secondary"
                }
              >
                {getStatusIcon()}
                {scraperStatus === "running" ? "Processing..." : scraperStatus === "success" ? "Success" : "Error"}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={runDataProcessor}
            disabled={scraping}
            variant="default"
            className="bg-green-600 hover:bg-green-700"
          >
            {getStatusIcon()}
            <span className="ml-2">{scraping ? "Processing..." : "🔄 Process NSE Data"}</span>
          </Button>
          <Button onClick={fetchStockData} disabled={loading} variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      <Alert className="border-blue-200 bg-blue-50">
        <Activity className="h-4 w-4" />
        <AlertDescription>
          <strong>🌐 NSE Real Data System:</strong> This dashboard scrapes live NSE stock data from mystocks.co.ke.
          Please ensure compliance with their terms of service. Click "Process NSE Data" to fetch the latest real market
          data.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Top Gainers
            </CardTitle>
            <CardDescription>Best performing stocks today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topMovers.gainers.length > 0 ? (
                topMovers.gainers.map((stock) => (
                  <div key={stock.symbol} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{stock.symbol}</div>
                      <div className="text-sm text-muted-foreground">{stock.stocks?.name || "Unknown"}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatPrice(stock.close_price)}</div>
                      <div className="text-sm text-green-500">
                        {stock.change_amount !== null && stock.change_percent !== null
                          ? formatChange(stock.change_amount, stock.change_percent)
                          : "N/A"}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">No gainers data available</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-500" />
              Top Losers
            </CardTitle>
            <CardDescription>Worst performing stocks today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topMovers.losers.length > 0 ? (
                topMovers.losers.map((stock) => (
                  <div key={stock.symbol} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{stock.symbol}</div>
                      <div className="text-sm text-muted-foreground">{stock.stocks?.name || "Unknown"}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatPrice(stock.close_price)}</div>
                      <div className="text-sm text-red-500">
                        {stock.change_amount !== null && stock.change_percent !== null
                          ? formatChange(stock.change_amount, stock.change_percent)
                          : "N/A"}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">No losers data available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>🇰🇪 All NSE Stocks</CardTitle>
          <CardDescription>
            Stock prices from the Nairobi Securities Exchange
            {stocks.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {stocks.length} stocks
              </Badge>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin mr-2" />
              <span>Loading stock data...</span>
            </div>
          ) : stocks.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Symbol</th>
                    <th className="text-left py-2">Name</th>
                    <th className="text-left py-2">Sector</th>
                    <th className="text-right py-2">Price (KES)</th>
                    <th className="text-right py-2">Change</th>
                    <th className="text-right py-2">Volume</th>
                  </tr>
                </thead>
                <tbody>
                  {stocks.map((stock) => (
                    <tr key={stock.symbol} className="border-b hover:bg-muted/50">
                      <td className="py-2 font-medium">{stock.symbol}</td>
                      <td className="py-2">{stock.stocks?.name || "Unknown"}</td>
                      <td className="py-2">
                        <Badge variant="outline">{stock.stocks?.sector || "N/A"}</Badge>
                      </td>
                      <td className="py-2 text-right">{formatPrice(stock.close_price)}</td>
                      <td
                        className={`py-2 text-right ${
                          stock.change_amount !== null && stock.change_amount >= 0
                            ? "text-green-500"
                            : stock.change_amount !== null && stock.change_amount < 0
                              ? "text-red-500"
                              : "text-muted-foreground"
                        }`}
                      >
                        {formatChange(stock.change_amount, stock.change_percent)}
                      </td>
                      <td className="py-2 text-right">{stock.volume ? stock.volume.toLocaleString() : "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No stock data available</p>
              <Button onClick={runDataProcessor} disabled={scraping} className="bg-green-600 hover:bg-green-700">
                {getStatusIcon()}
                <span className="ml-2">🔄 Process NSE Data</span>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
