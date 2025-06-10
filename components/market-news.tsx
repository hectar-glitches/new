"use client"

import { useState } from "react"
import { Calendar, Clock } from "lucide-react"
import { getMarketNews } from "@/lib/data"

export function MarketNews() {
  const [news] = useState(() => getMarketNews())

  return (
    <div className="space-y-6">
      {news.map((item) => (
        <div key={item.id} className="border-b pb-6 last:border-0">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <span className="font-medium text-primary">{item.source}</span>
            <span>•</span>
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{item.date}</span>
            </div>
            <span>•</span>
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span>{item.time}</span>
            </div>
          </div>
          <h3 className="text-lg font-medium mb-2">{item.title}</h3>
          <p className="text-muted-foreground">{item.summary}</p>
          <div className="mt-3">
            <a href="#" className="text-primary hover:underline text-sm">
              Read more
            </a>
          </div>
        </div>
      ))}
    </div>
  )
}
