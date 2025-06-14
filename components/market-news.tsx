"use client"

import React, { useState, useEffect } from "react"
import { Calendar, Clock } from "lucide-react"
import { getMarketNews } from "@/lib/data"

// Define the type for a news item
type NewsItem = {
  id: string
  source: string
  date: string
  time: string
  title: string
  summary: string
  url?: string // Add this if you have URLs for "Read more"
}

export function MarketNews() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    async function fetchNews() {
      try {
        const res = await getMarketNews()
        if (isMounted) {
          setNews(res)
        }
      } catch (err) {
        if (isMounted) {
          setError("Failed to load market news.")
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    fetchNews()
    return () => {
      isMounted = false
    }
  }, [])

  if (loading) {
    return <div>Loading market news...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

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
            {item.url ? (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline text-sm"
                aria-label={`Read more about ${item.title}`}
              >
                Read more
              </a>
            ) : (
              <span className="text-muted-foreground text-sm italic">
                No further details
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
