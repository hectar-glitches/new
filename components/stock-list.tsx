"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowUpDown, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

interface StockData {
  symbol: string
  close_price: number
  change_amount: number | null
  change_percent: number | null
  volume: number | null
  stocks: {
    name: string
    sector: string | null
  }
}

export function StockList() {
  const [stocks, setStocks] = useState<StockData[]>([])
  const [filteredStocks, setFilteredStocks] = useState<StockData[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: "ascending" | "descending"
  } | null>(null)

  useEffect(() => {
    fetchStocks()
  }, [])

  const fetchStocks = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/stocks")

      // Check if response is ok
      if (!response.ok) {
        console.error(`HTTP Error: ${response.status} ${response.statusText}`)
        setStocks([])
        setFilteredStocks([])
        return
      }

      // Check content type
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text()
        console.error("Non-JSON response:", text.substring(0, 200))
        setStocks([])
        setFilteredStocks([])
        return
      }

      const data = await response.json()

      if (data.success && data.data) {
        setStocks(data.data)
        setFilteredStocks(data.data)
      } else {
        console.error("API returned error:", data.error || "Unknown error")
        setStocks([])
        setFilteredStocks([])
      }
    } catch (error) {
      console.error("Error fetching stocks:", error)
      setStocks([])
      setFilteredStocks([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let result = [...stocks]

    if (searchQuery) {
      result = result.filter(
        (stock) =>
          stock.stocks.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (sortConfig !== null) {
      result.sort((a, b) => {
        let aValue: any
        let bValue: any

        if (sortConfig.key === "name") {
          aValue = a.stocks.name
          bValue = b.stocks.name
        } else if (sortConfig.key === "price") {
          aValue = a.close_price
          bValue = b.close_price
        } else if (sortConfig.key === "changePercent") {
          aValue = a.change_percent || 0
          bValue = b.change_percent || 0
        } else if (sortConfig.key === "volume") {
          aValue = a.volume || 0
          bValue = b.volume || 0
        } else {
          aValue = a[sortConfig.key as keyof StockData]
          bValue = b[sortConfig.key as keyof StockData]
        }

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1
        }
        return 0
      })
    }

    setFilteredStocks(result)
  }, [stocks, searchQuery, sortConfig])

  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending"
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  const getSortIcon = (name: string) => {
    if (!sortConfig || sortConfig.key !== name) {
      return <ArrowUpDown className="h-4 w-4 ml-1" />
    }
    return sortConfig.direction === "ascending" ? (
      <ArrowUpRight className="h-4 w-4 ml-1" />
    ) : (
      <ArrowDownRight className="h-4 w-4 ml-1" />
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading real NSE stock data...</p>
        </div>
      </div>
    )
  }

  if (stocks.length === 0) {
    return (
      <Alert className="border-amber-200 bg-amber-50">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>No Stock Data Available</strong>
          <br />
          Please click "Process NSE Data" on the Real-time tab to fetch current stock prices from mystocks.co.ke
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <Input
          placeholder="Search stocks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4">
                <Button
                  variant="ghost"
                  className="font-medium flex items-center p-0 h-auto"
                  onClick={() => requestSort("symbol")}
                >
                  Symbol
                  {getSortIcon("symbol")}
                </Button>
              </th>
              <th className="text-left py-3 px-4">
                <Button
                  variant="ghost"
                  className="font-medium flex items-center p-0 h-auto"
                  onClick={() => requestSort("name")}
                >
                  Name
                  {getSortIcon("name")}
                </Button>
              </th>
              <th className="text-right py-3 px-4">
                <Button
                  variant="ghost"
                  className="font-medium flex items-center p-0 h-auto ml-auto"
                  onClick={() => requestSort("price")}
                >
                  Price (KES)
                  {getSortIcon("price")}
                </Button>
              </th>
              <th className="text-right py-3 px-4">
                <Button
                  variant="ghost"
                  className="font-medium flex items-center p-0 h-auto ml-auto"
                  onClick={() => requestSort("changePercent")}
                >
                  Change
                  {getSortIcon("changePercent")}
                </Button>
              </th>
              <th className="text-right py-3 px-4">
                <Button
                  variant="ghost"
                  className="font-medium flex items-center p-0 h-auto ml-auto"
                  onClick={() => requestSort("volume")}
                >
                  Volume
                  {getSortIcon("volume")}
                </Button>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredStocks.map((stock) => (
              <tr key={stock.symbol} className="border-b hover:bg-muted/50">
                <td className="py-3 px-4">
                  <Link href={`/stocks/${stock.symbol}`} className="font-medium text-primary hover:underline">
                    {stock.symbol}
                  </Link>
                </td>
                <td className="py-3 px-4">{stock.stocks.name}</td>
                <td className="py-3 px-4 text-right">{stock.close_price.toFixed(2)}</td>
                <td
                  className={`py-3 px-4 text-right ${
                    stock.change_amount !== null && stock.change_amount >= 0
                      ? "text-green-500"
                      : stock.change_amount !== null && stock.change_amount < 0
                        ? "text-red-500"
                        : "text-muted-foreground"
                  }`}
                >
                  <div className="flex items-center justify-end">
                    {stock.change_amount !== null && stock.change_percent !== null ? (
                      <>
                        {stock.change_amount >= 0 ? (
                          <ArrowUpRight className="h-4 w-4 mr-1" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 mr-1" />
                        )}
                        <span>
                          {stock.change_amount >= 0 ? "+" : ""}
                          {stock.change_amount.toFixed(2)}
                        </span>
                        <span className="ml-1">({stock.change_percent.toFixed(2)}%)</span>
                      </>
                    ) : (
                      <span>N/A</span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4 text-right">{stock.volume ? stock.volume.toLocaleString() : "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
