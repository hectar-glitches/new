"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Database } from "lucide-react"

export function MarketOverview() {
  const [hasData, setHasData] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if we have real market data
    const checkForData = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch("/api/stocks")

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
          setHasData(data.data && data.data.length > 0)
        } else {
          setHasData(false)
          setError(data.error || "Failed to fetch data")
        }
      } catch (error) {
        console.error("Error checking for data:", error)
        setHasData(false)
        setError(error instanceof Error ? error.message : "Unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    checkForData()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <Database className="h-6 w-6 animate-pulse mr-2" />
            <span>Checking for market data...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Error Loading Market Data</strong>
              <br />
              {error}
              <br />
              <span className="text-sm text-muted-foreground mt-2 block">
                Try refreshing the page or processing new NSE data.
              </span>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  if (!hasData) {
    return (
      <Card>
        <CardContent className="p-6">
          <Alert className="border-amber-200 bg-amber-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>No Market Data Available</strong>
              <br />
              Please click "Process NSE Data" on the Real-time tab to fetch real market data from mystocks.co.ke
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold">NSE Market Overview</h2>
            <div className="flex items-center mt-1">
              <span className="text-lg font-bold">Real Market Data Available</span>
            </div>
          </div>
        </div>
        <div className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">Market overview chart will display when real data is available</p>
        </div>
      </CardContent>
    </Card>
  )
}
