"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Database } from "lucide-react"

export function MarketIndices() {
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
      <div className="flex items-center justify-center py-8">
        <Database className="h-6 w-6 animate-pulse mr-2" />
        <span>Checking for market indices data...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Error Loading Market Indices</strong>
          <br />
          {error}
        </AlertDescription>
      </Alert>
    )
  }

  if (!hasData) {
    return (
      <Alert className="border-amber-200 bg-amber-50">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>No Market Indices Data</strong>
          <br />
          Market indices will be calculated from real NSE data once available.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <p className="text-muted-foreground">Market indices will be calculated from real NSE stock data</p>
      </div>
    </div>
  )
}
