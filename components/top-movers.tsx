"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowUpRight, ArrowDownRight, AlertTriangle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface StockData {
  symbol: string
  close_price: number
  change_amount: number | null
  change_percent: number | null
  stocks: {
    name: string
  }
}

export function TopMovers() {
  const [topMovers, setTopMovers] = useState<{ gainers: StockData[]; losers: StockData[] }>({ gainers: [], losers: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTopMovers()
  }, [])

  const fetchTopMovers = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/top-movers")

      // Check if response is ok
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      // Check content type
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text()
        throw new Error(`Expected JSON but got: ${text.substring(0, 100)}...`)
      }

      const data = await response.json()

      if (data.success) {
        setTopMovers(data.data || { gainers: [], losers: [] })
      } else {
        setTopMovers({ gainers: [], losers: [] })
        setError(data.error || "Failed to fetch top movers")
      }
    } catch (error) {
      console.error("Error fetching top movers:", error)
      setTopMovers({ gainers: [], losers: [] })
      setError(error instanceof Error ? error.message : "Unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-2"></div>
        <span>Loading top movers...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Error Loading Top Movers</strong>
          <br />
          {error}
        </AlertDescription>
      </Alert>
    )
  }

  if (topMovers.gainers.length === 0 && topMovers.losers.length === 0) {
    return (
      <Alert className="border-amber-200 bg-amber-50">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>No Top Movers Data</strong>
          <br />
          Please process NSE data first to see top gainers and losers.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Tabs defaultValue="gainers">
      <TabsList className="grid grid-cols-2 mb-4">
        <TabsTrigger value="gainers">Top Gainers</TabsTrigger>
        <TabsTrigger value="losers">Top Losers</TabsTrigger>
      </TabsList>

      <TabsContent value="gainers" className="space-y-4">
        {topMovers.gainers.length > 0 ? (
          topMovers.gainers.map((stock) => (
            <Link
              href={`/stocks/${stock.symbol}`}
              key={stock.symbol}
              className="flex justify-between items-center p-3 border rounded-lg hover:bg-muted/50"
            >
              <div>
                <div className="font-medium">{stock.symbol}</div>
                <div className="text-sm text-muted-foreground">{stock.stocks?.name || "Unknown"}</div>
              </div>
              <div className="text-right">
                <div>KES {stock.close_price.toFixed(2)}</div>
                <div className="flex items-center text-green-500">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  <span>
                    {stock.change_amount !== null && stock.change_percent !== null
                      ? `+${stock.change_amount.toFixed(2)} (+${stock.change_percent.toFixed(2)}%)`
                      : "N/A"}
                  </span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-center text-muted-foreground py-4">No gainers data available</p>
        )}
      </TabsContent>

      <TabsContent value="losers" className="space-y-4">
        {topMovers.losers.length > 0 ? (
          topMovers.losers.map((stock) => (
            <Link
              href={`/stocks/${stock.symbol}`}
              key={stock.symbol}
              className="flex justify-between items-center p-3 border rounded-lg hover:bg-muted/50"
            >
              <div>
                <div className="font-medium">{stock.symbol}</div>
                <div className="text-sm text-muted-foreground">{stock.stocks?.name || "Unknown"}</div>
              </div>
              <div className="text-right">
                <div>KES {stock.close_price.toFixed(2)}</div>
                <div className="flex items-center text-red-500">
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                  <span>
                    {stock.change_amount !== null && stock.change_percent !== null
                      ? `${stock.change_amount.toFixed(2)} (${stock.change_percent.toFixed(2)}%)`
                      : "N/A"}
                  </span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-center text-muted-foreground py-4">No losers data available</p>
        )}
      </TabsContent>
    </Tabs>
  )
}
