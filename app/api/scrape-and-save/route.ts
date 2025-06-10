import { NextResponse } from "next/server"
import { NSEScraperService } from "@/lib/nse-scraper-service"
import fs from "fs/promises"
import path from "path"

export async function POST() {
  try {
    console.log("🚀 Starting real NSE data scraping process...")

    // Create data directory if it doesn't exist
    const dataDir = path.join(process.cwd(), "data")
    try {
      await fs.access(dataDir)
    } catch {
      console.log("Creating data directory...")
      await fs.mkdir(dataDir, { recursive: true })
    }

    const scraperService = new NSEScraperService()

    // Run the real scraper only
    const scrapedData = await scraperService.runRealScraper()

    if (scrapedData.length === 0) {
      console.log("No data scraped, returning empty result")
      return NextResponse.json(
        {
          success: false,
          message: "No real data was scraped",
          error: "Scraper returned empty results",
        },
        { status: 200 }, // Return 200 instead of 500 to avoid breaking the client
      )
    }

    // Save to Supabase
    await scraperService.saveStockData(scrapedData)

    return NextResponse.json({
      success: true,
      message: `Successfully scraped and saved ${scrapedData.length} real NSE stocks`,
      data: scrapedData.slice(0, 10), // Return first 10 for preview
      total: scrapedData.length,
      source: "mystocks.co.ke",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ Error in real data scraping:", error)

    // Return a more detailed error response
    return NextResponse.json(
      {
        success: false,
        error: "Failed to scrape real NSE data",
        details: error instanceof Error ? error.message : "Unknown error",
        suggestion: "Check if mystocks.co.ke is accessible and the scraper is working correctly",
      },
      { status: 200 }, // Return 200 instead of 500 to avoid breaking the client
    )
  }
}
