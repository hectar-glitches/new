import { NextResponse } from "next/server";
import { NSEScraperService } from "@/lib/nse-scraper-service";

interface StockResponse {
  success: boolean;
  data: any[];
  count: number;
  error?: string;
  details?: string;
}

export async function GET(request: Request) {
  try {
    // Example: Handling query parameters
    const { searchParams } = new URL(request.url);
    const stockSymbol = searchParams.get("symbol");

    if (!stockSymbol) {
      return NextResponse.json(
        { success: false, error: "Stock symbol is required" },
        { status: 400 }, // Bad Request
      );
    }

    const scraperService = new NSEScraperService();
    const latestPrices = await scraperService.getLatestPrices();

    const response: StockResponse = {
      success: true,
      data: latestPrices,
      count: latestPrices.length,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error fetching stocks:`, error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch stock data",
        data: [],
        count: 0,
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }, // Return 500 for server error
    );
  }
}
