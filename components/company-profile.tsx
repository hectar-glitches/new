"use client"

import { useState } from "react"
import { Globe, MapPin, Users, Calendar } from "lucide-react"
import { getStockData } from "@/lib/data"

export function CompanyProfile({ symbol }: { symbol: string }) {
  const [stock] = useState(() => getStockData(symbol))

  if (!stock) return null

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-3">About {stock.name}</h3>
        <p className="text-muted-foreground">
          {stock.description ||
            `${stock.name} is a company listed on the Nairobi Securities Exchange (NSE). The company operates in the ${stock.sector} sector and is one of the leading companies in Kenya.`}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Globe className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-medium">Website</h4>
              <a href="#" className="text-primary hover:underline">
                {stock.website || `www.${stock.symbol.toLowerCase()}.co.ke`}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-medium">Headquarters</h4>
              <p className="text-muted-foreground">{stock.headquarters || "Nairobi, Kenya"}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Users className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-medium">Employees</h4>
              <p className="text-muted-foreground">{stock.employees?.toLocaleString() || "5,000+"}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-medium">Founded</h4>
              <p className="text-muted-foreground">{stock.founded || "1975"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t">
        <h3 className="text-lg font-medium mb-3">Key Management</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium">CEO</h4>
            <p className="text-muted-foreground">{stock.management?.ceo || "John Mwangi"}</p>
          </div>
          <div>
            <h4 className="font-medium">CFO</h4>
            <p className="text-muted-foreground">{stock.management?.cfo || "Sarah Kamau"}</p>
          </div>
          <div>
            <h4 className="font-medium">COO</h4>
            <p className="text-muted-foreground">{stock.management?.coo || "David Ochieng"}</p>
          </div>
          <div>
            <h4 className="font-medium">Chairman</h4>
            <p className="text-muted-foreground">{stock.management?.chairman || "Elizabeth Wanjiru"}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
