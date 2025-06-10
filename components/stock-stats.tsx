"use client"

import { useState } from "react"
import { getStockData } from "@/lib/data"

export function StockStats({ symbol }: { symbol: string }) {
  const [stock] = useState(() => getStockData(symbol))

  if (!stock) return null

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Market Cap</p>
          <p className="font-medium">KES {stock.marketCap.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">P/E Ratio</p>
          <p className="font-medium">{stock.peRatio.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">EPS</p>
          <p className="font-medium">KES {stock.eps.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Dividend Yield</p>
          <p className="font-medium">{stock.dividendYield.toFixed(2)}%</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">52-Week Range</p>
          <p className="font-medium">
            KES {stock.yearLow.toFixed(2)} - {stock.yearHigh.toFixed(2)}
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
            <span className={stock.performance.oneMonth >= 0 ? "text-green-500" : "text-red-500"}>
              {stock.performance.oneMonth >= 0 ? "+" : ""}
              {stock.performance.oneMonth.toFixed(2)}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">3 Months</span>
            <span className={stock.performance.threeMonths >= 0 ? "text-green-500" : "text-red-500"}>
              {stock.performance.threeMonths >= 0 ? "+" : ""}
              {stock.performance.threeMonths.toFixed(2)}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">6 Months</span>
            <span className={stock.performance.sixMonths >= 0 ? "text-green-500" : "text-red-500"}>
              {stock.performance.sixMonths >= 0 ? "+" : ""}
              {stock.performance.sixMonths.toFixed(2)}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">1 Year</span>
            <span className={stock.performance.oneYear >= 0 ? "text-green-500" : "text-red-500"}>
              {stock.performance.oneYear >= 0 ? "+" : ""}
              {stock.performance.oneYear.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
