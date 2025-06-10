"use client"

import { useState, useEffect } from "react"
import { Chart } from "@/components/ui/chart"
import { useWebSocket } from "@/components/websocket-provider"
import { getStockChartData } from "@/lib/data"

export function StockChart({ symbol }: { symbol: string }) {
  const [data, setData] = useState(() => getStockChartData(symbol))
  const { lastMessage } = useWebSocket()

  useEffect(() => {
    if (lastMessage && lastMessage.type === "STOCK_UPDATE" && lastMessage.data.symbol === symbol) {
      setData((prev) => {
        const newPoint = {
          date: new Date().toISOString(),
          price: lastMessage.data.price,
          volume: lastMessage.data.volume,
        }
        return [...prev.slice(1), newPoint]
      })
    }
  }, [lastMessage, symbol])

  return (
    <div className="h-[400px]">
      <Chart
        type="candlestick"
        series={[
          {
            name: "candle",
            data: data.map((item, index) => {
              // For demo purposes, generate candlestick data from price
              const open = item.price - Math.random() * 2
              const close = item.price
              const low = Math.min(open, close) - Math.random() * 1.5
              const high = Math.max(open, close) + Math.random() * 1.5

              return {
                x: new Date(item.date).getTime(),
                y: [open, high, low, close],
              }
            }),
          },
        ]}
        options={{
          chart: {
            type: "candlestick",
            height: 400,
            toolbar: {
              show: true,
              tools: {
                download: true,
                selection: true,
                zoom: true,
                zoomin: true,
                zoomout: true,
                pan: true,
                reset: true,
              },
            },
          },
          title: {
            text: `${symbol} Stock Price`,
            align: "left",
          },
          xaxis: {
            type: "datetime",
            labels: {
              datetimeFormatter: {
                year: "yyyy",
                month: "MMM 'yy",
                day: "dd MMM",
                hour: "HH:mm",
              },
            },
          },
          yaxis: {
            tooltip: {
              enabled: true,
            },
            labels: {
              formatter: (value) => "KES " + value.toFixed(2),
            },
          },
          grid: {
            borderColor: "#f1f1f1",
          },
          plotOptions: {
            candlestick: {
              colors: {
                upward: "#10b981",
                downward: "#ef4444",
              },
              wick: {
                useFillColor: true,
              },
            },
          },
          tooltip: {
            x: {
              format: "dd MMM yyyy HH:mm",
            },
          },
        }}
      />
    </div>
  )
}
