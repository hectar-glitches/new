import { NextResponse } from "next/server";
import { NSEScraperService } from "@/lib/nse-scraper-service";
import fs from "fs/promises";
import path from "path";

/**
 * POST handler for scraping and saving NSE data.
 */
export async function POST() {
  try {
    console.log("🚀 Starting real NSE data scraping process...");

    // Ensure the data directory exists
    const dataDir = path.join(process.cwd(), "data");
    try {
      await fs.access(dataDir);
    } catch {
      console.log("Creating data directory...");
      await fs.mkdir(dataDir, { recursive: true });
    }

    const scraperService = new NSEScraperService();

    // Run the real NSE scraper
    const scrapedData = await scraperService.runRealScraper();

    if (!scrapedData.length) {
      console.log("No data scraped, returning empty result");
      return NextResponse.json(
        {
          success: false,
          message: "No real data was scraped",
          error: "Scraper returned empty results",
        },
        { status: 200 } // Keep status 200 to avoid breaking the client
      );
    }

    // Save scraped data
    await scraperService.saveStockData(scrapedData);

    return NextResponse.json({
      success: true,
      message: `Successfully scraped and saved ${scrapedData.length} real NSE stocks`,
      data: scrapedData.slice(0, 10), // Preview first 10
      total: scrapedData.length,
      source: "mystocks.co.ke",
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("❌ Error in real data scraping:", error);

    // Provide detailed error response
    return NextResponse.json(
      {
        success: false,
        error: "Failed to scrape real NSE data",
        details: error instanceof Error ? error.message : "Unknown error",
        suggestion: "Check if mystocks.co.ke is accessible and the scraper is working correctly",
      },
      { status: 200 } // Keep status 200 to avoid breaking the client
    );
  }
}
