"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useWebSocket } from "@/components/websocket-provider"
import { getMarketDepth } from "@/lib/data"

export function MarketDepth() {
  const [selectedStock, setSelectedStock] = useState("EABL")
  const [marketDepth, setMarketDepth] = useState(() => getMarketDepth("EABL"))
  const { lastMessage } = useWebSocket()

  useEffect(() => {
    if (lastMessage && lastMessage.type === "MARKET_DEPTH_UPDATE" && lastMessage.data.symbol === selectedStock) {
      setMarketDepth(lastMessage.data.depth)
    }
  }, [lastMessage, selectedStock])

  const handleStockChange = (value: string) => {
    setSelectedStock(value)
    setMarketDepth(getMarketDepth(value))
  }

  // Calculate the maximum quantity for proper scaling
  const maxQuantity = Math.max(
    ...marketDepth.bids.map((bid) => bid.quantity),
    ...marketDepth.asks.map((ask) => ask.quantity),
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Order Book</h3>
        <Select value={selectedStock} onValueChange={handleStockChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select stock" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="EABL">EABL</SelectItem>
            <SelectItem value="SCOM">SCOM</SelectItem>
            <SelectItem value="KCB">KCB</SelectItem>
            <SelectItem value="EQTY">EQTY</SelectItem>
            <SelectItem value="BAT">BAT</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <div className="flex justify-between text-sm font-medium mb-2">
            <span>Bid Price</span>
            <span>Quantity</span>
          </div>
          <div className="space-y-1">
            {marketDepth.bids.map((bid, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="text-green-500">{bid.price.toFixed(2)}</div>
                <div className="flex items-center gap-2">
                  <div className="text-right">{bid.quantity.toLocaleString()}</div>
                  <div
                    className="h-4 bg-green-100 dark:bg-green-900/30"
                    style={{ width: `${(bid.quantity / maxQuantity) * 100}px` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm font-medium mb-2">
            <span>Ask Price</span>
            <span>Quantity</span>
          </div>
          <div className="space-y-1">
            {marketDepth.asks.map((ask, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="text-red-500">{ask.price.toFixed(2)}</div>
                <div className="flex items-center gap-2">
                  <div className="text-right">{ask.quantity.toLocaleString()}</div>
                  <div
                    className="h-4 bg-red-100 dark:bg-red-900/30"
                    style={{ width: `${(ask.quantity / maxQuantity) * 100}px` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className="font-medium mb-2">Recent Trades</h4>
        <div className="space-y-2">
          {marketDepth.recentTrades.map((trade, index) => (
            <div key={index} className="flex justify-between items-center text-sm">
              <div className="flex items-center">
                <span className={trade.side === "buy" ? "text-green-500" : "text-red-500"}>
                  {trade.side === "buy" ? "BUY" : "SELL"}
                </span>
                <span className="mx-2">•</span>
                <span>{trade.time}</span>
              </div>
              <div className="flex items-center gap-4">
                <span>{trade.price.toFixed(2)}</span>
                <span>{trade.quantity.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
