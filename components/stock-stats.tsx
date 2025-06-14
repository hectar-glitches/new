"use client"

import { useEffect, useState } from "react"
import { getStockData } from "@/lib/data"

// Define a TypeScript interface for Stock
interface Stock {
  marketCap: number
  peRatio: number
  eps: number
  dividendYield: number
  yearLow: number
  yearHigh: number
  beta: number
  performance: {
    oneMonth: number
    threeMonths: number
    sixMonths: number
    oneYear: number
  }
}

export function StockStats({ symbol }: { symbol: string }) {
  const [stock, setStock] = useState<Stock | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    getStockData(symbol)
      .then((data) => setStock(data))
      .catch(() => setError("Failed to load stock data."))
      .finally(() => setLoading(false))
  }, [symbol])

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>
  if (!stock) return <div>No data found.</div>

  // Currency/percentage formatting
  const currency = (value: number) =>
    new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 2 }).format(value)
  const percent = (value: number) =>
    `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`

  // Color for performance
  const perfClass = (value: number) => (value >= 0 ? "text-green-500" : "text-red-500")

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Market Cap</p>
          <p className="font-medium">{currency(stock.marketCap)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">P/E Ratio</p>
          <p className="font-medium">{stock.peRatio.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">EPS</p>
          <p className="font-medium">{currency(stock.eps)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Dividend Yield</p>
          <p className="font-medium">{stock.dividendYield.toFixed(2)}%</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">52-Week Range</p>
          <p className="font-medium">
            {currency(stock.yearLow)} - {currency(stock.yearHigh)}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Beta</p>
          <p className="font-medium">{stock.beta.toFixed(2)}</p>
        </div>
      </div>

      <div className="pt-4 border-t">
        <h3 className="font-medium mb-2">Performance</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">1 Month</span>
            <span className={perfClass(stock.performance.oneMonth)}>
              {percent(stock.performance.oneMonth)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">3 Months</span>
            <span className={perfClass(stock.performance.threeMonths)}>
              {percent(stock.performance.threeMonths)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">6 Months</span>
            <span className={perfClass(stock.performance.sixMonths)}>
              {percent(stock.performance.sixMonths)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">1 Year</span>
            <span className={perfClass(stock.performance.oneYear)}>
              {percent(stock.performance.oneYear)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
