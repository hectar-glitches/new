import { NextResponse } from "next/server"
import { NSEScraperService } from "@/lib/nse-scraper-service"

export async function GET() {
  try {
    const scraperService = new NSEScraperService()
    const topMovers = await scraperService.getTopMovers()

    return NextResponse.json({
      success: true,
      data: topMovers,
    })
  } catch (error) {
    console.error("Error fetching top movers:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch top movers",
        data: { gainers: [], losers: [] },
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 200 }, // Return 200 to avoid breaking the client
    )
  }
}
