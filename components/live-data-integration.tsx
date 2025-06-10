"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RefreshCw, Download, AlertTriangle } from "lucide-react"
import { liveDataService, type LiveStockData } from "@/lib/live-data-service"

export function LiveDataIntegration() {
  const [liveData, setLiveData] = useState<LiveStockData[]>([])
  const [loading, setLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchLiveData = async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await liveDataService.fetchLatestData()
      setLiveData(data)
      setLastUpdate(new Date().toLocaleString())
    } catch (err) {
      setError("Failed to fetch live data. Please try again.")
      console.error("Error fetching live data:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Fetch data on component mount
    fetchLiveData()
  }, [])

  const exportToCSV = () => {
    if (liveData.length === 0) return

    const headers = ["Code", "Name", "Closing Price", "Change", "Change %", "Volume", "Date"]
    const csvContent = [
      headers.join(","),
      ...liveData.map((stock) =>
        [
          stock.code,
          `"${stock.name}"`,
          stock.closingPrice || "",
          stock.change || "",
          stock.changePercent ? `${stock.changePercent.toFixed(2)}%` : "",
          stock.volume || "",
          stock.date,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `nse_live_data_${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <Alert className="border-blue-200 bg-blue-50">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Live Data Integration:</strong> This uses web scraping from mystocks.co.ke. Please ensure compliance
          with their terms of service and consider rate limiting. For production use, contact NSE directly for official
          data feeds.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Live NSE Data</CardTitle>
              <CardDescription>
                Real-time stock data scraped from mystocks.co.ke
                {lastUpdate && (
                  <span className="block text-sm text-muted-foreground mt-1">Last updated: {lastUpdate}</span>
                )}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={fetchLiveData} disabled={loading} size="sm" variant="outline">
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button onClick={exportToCSV} disabled={liveData.length === 0} size="sm" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-4 border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin mr-2" />
              <span>Fetching live data...</span>
            </div>
          ) : liveData.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="secondary">{liveData.length} stocks loaded</Badge>
                <span className="text-sm text-muted-foreground">Data from: {liveData[0]?.date}</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Code</th>
                      <th className="text-left py-2">Name</th>
                      <th className="text-right py-2">Price (KES)</th>
                      <th className="text-right py-2">Change</th>
                      <th className="text-right py-2">Volume</th>
                    </tr>
                  </thead>
                  <tbody>
                    {liveData.slice(0, 20).map((stock, index) => (
                      <tr key={`${stock.code}-${index}`} className="border-b hover:bg-muted/50">
                        <td className="py-2 font-medium">{stock.code}</td>
                        <td className="py-2">{stock.name}</td>
                        <td className="py-2 text-right">{stock.closingPrice ? stock.closingPrice.toFixed(2) : "-"}</td>
                        <td
                          className={`py-2 text-right ${
                            stock.change && stock.change > 0
                              ? "text-green-500"
                              : stock.change && stock.change < 0
                                ? "text-red-500"
                                : ""
                          }`}
                        >
                          {stock.change ? (
                            <>
                              {stock.change > 0 ? "+" : ""}
                              {stock.change.toFixed(2)}
                              {stock.changePercent && <span className="ml-1">({stock.changePercent.toFixed(2)}%)</span>}
                            </>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="py-2 text-right">
                          {stock.volume ? Number.parseInt(stock.volume).toLocaleString() : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {liveData.length > 20 && (
                <p className="text-sm text-muted-foreground text-center">
                  Showing first 20 of {liveData.length} stocks. Export CSV for complete data.
                </p>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No live data available. Click refresh to fetch latest data.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
