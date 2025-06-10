import { type NextRequest, NextResponse } from "next/server"
import { NSEScraperService } from "@/lib/nse-scraper-service"

export async function GET(request: NextRequest, { params }: { params: { symbol: string } }) {
  try {
    const scraperService = new NSEScraperService()
    const history = await scraperService.getStockHistory(params.symbol, 30)

    return NextResponse.json({
      success: true,
      data: history,
    })
  } catch (error) {
    console.error("Error fetching stock history:", error)
    return NextResponse.json({ error: "Failed to fetch stock history" }, { status: 500 })
  }
}
