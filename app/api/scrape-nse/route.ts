import { type NextRequest, NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"
import fs from "fs/promises"
import path from "path"

const execAsync = promisify(exec)

export async function POST(request: NextRequest) {
  try {
    // Execute the Python scraper
    const { stdout, stderr } = await execAsync("python lib/nse-scraper.py")

    if (stderr) {
      console.error("Python script stderr:", stderr)
    }

    // Read the generated CSV file
    const dataDir = "data"
    const files = await fs.readdir(dataDir)
    const latestFile = files
      .filter((file) => file.startsWith("nse_data_"))
      .sort()
      .pop()

    if (!latestFile) {
      return NextResponse.json({ error: "No data file found" }, { status: 404 })
    }

    const filePath = path.join(dataDir, latestFile)
    const csvContent = await fs.readFile(filePath, "utf-8")

    // Parse CSV content
    const lines = csvContent.split("\n")
    const headers = lines[0].split(",")
    const stocks = lines
      .slice(1)
      .filter((line) => line.trim())
      .map((line) => {
        const values = line.split(",")
        return {
          date: values[0],
          code: values[1],
          name: values[2],
          lowestPrice: values[3] ? Number.parseFloat(values[3]) : null,
          highestPrice: values[4] ? Number.parseFloat(values[4]) : null,
          closingPrice: values[5] ? Number.parseFloat(values[5]) : null,
          previousClose: values[6] ? Number.parseFloat(values[6]) : null,
          volume: values[7] || null,
        }
      })

    return NextResponse.json({
      success: true,
      date: latestFile.replace("nse_data_", "").replace(".csv", ""),
      stocks,
      count: stocks.length,
    })
  } catch (error) {
    console.error("Error running scraper:", error)
    return NextResponse.json({ error: "Failed to scrape NSE data" }, { status: 500 })
  }
}
