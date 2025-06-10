import { NextResponse } from "next/server"
import { NSEScraperService } from "@/lib/nse-scraper-service"

export async function GET() {
  try {
    const scraperService = new NSEScraperService()
    const latestPrices = await scraperService.getLatestPrices()

    return NextResponse.json({
      success: true,
      data: latestPrices,
      count: latestPrices.length,
    })
  } catch (error) {
    console.error("Error fetching stocks:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch stock data",
        data: [],
        count: 0,
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 200 }, // Return 200 to avoid breaking the client
    )
  }
}
