"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, DollarSign, BarChart3, Shield } from "lucide-react"
import { getStocks } from "@/lib/data"

interface AnalysisMetrics {
  symbol: string
  name: string
  currentPrice: number
  technicalScore: number
  fundamentalScore: number
  dividendYield: number
  riskLevel: "Low" | "Medium" | "High"
  priceTarget: number
  recommendation: "Strong Buy" | "Buy" | "Hold" | "Sell" | "Strong Sell"
  reasoning: string[]
}

export function InvestmentAnalysis() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<"short" | "medium" | "long">("medium")
  const stocks = getStocks()

  // Mock analysis - In real implementation, this would use actual financial models
  const generateAnalysis = (): AnalysisMetrics[] => {
    return stocks.slice(0, 5).map((stock) => {
      // Mock scoring based on various factors
      const technicalScore = Math.random() * 100
      const fundamentalScore = Math.random() * 100
      const overallScore = (technicalScore + fundamentalScore) / 2

      let recommendation: AnalysisMetrics["recommendation"]
      let riskLevel: AnalysisMetrics["riskLevel"]

      if (overallScore >= 80) recommendation = "Strong Buy"
      else if (overallScore >= 65) recommendation = "Buy"
      else if (overallScore >= 45) recommendation = "Hold"
      else if (overallScore >= 30) recommendation = "Sell"
      else recommendation = "Strong Sell"

      if (stock.beta < 0.8) riskLevel = "Low"
      else if (stock.beta < 1.2) riskLevel = "Medium"
      else riskLevel = "High"

      const priceTarget = stock.price * (1 + (Math.random() * 0.4 - 0.1)) // ±20% variation

      return {
        symbol: stock.symbol,
        name: stock.name,
        currentPrice: stock.price,
        technicalScore: Math.round(technicalScore),
        fundamentalScore: Math.round(fundamentalScore),
        dividendYield: stock.dividendYield,
        riskLevel,
        priceTarget: Math.round(priceTarget * 100) / 100,
        recommendation,
        reasoning: generateReasoning(stock, overallScore, recommendation),
      }
    })
  }

  const generateReasoning = (stock: any, score: number, recommendation: string): string[] => {
    const reasons = []

    if (stock.peRatio < 15) reasons.push("Attractive P/E ratio suggests undervaluation")
    if (stock.dividendYield > 5) reasons.push("High dividend yield provides steady income")
    if (stock.sector === "Banking") reasons.push("Banking sector showing strong fundamentals")
    if (stock.performance.oneYear > 15) reasons.push("Strong historical performance")
    if (stock.beta < 1) reasons.push("Lower volatility than market average")

    if (recommendation === "Strong Buy" || recommendation === "Buy") {
      reasons.push("Technical indicators suggest upward momentum")
      reasons.push("Fundamental analysis shows strong growth potential")
    }

    return reasons.slice(0, 3) // Limit to 3 reasons
  }

  const analysis = generateAnalysis()

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case "Strong Buy":
        return "bg-green-500"
      case "Buy":
        return "bg-green-400"
      case "Hold":
        return "bg-yellow-500"
      case "Sell":
        return "bg-red-400"
      case "Strong Sell":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "bg-green-100 text-green-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "High":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <Alert className="border-amber-200 bg-amber-50">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Investment Disclaimer</AlertTitle>
        <AlertDescription>
          This analysis is for educational purposes only and uses simulated data. Always consult with qualified
          financial advisors and conduct your own research before making investment decisions. Past performance does not
          guarantee future results.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Investment Analysis Dashboard
          </CardTitle>
          <CardDescription>AI-powered analysis of NSE stocks for different investment strategies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setSelectedTimeframe("short")}
              className={`px-4 py-2 rounded-md text-sm ${
                selectedTimeframe === "short" ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}
            >
              Short-term (1-3 months)
            </button>
            <button
              onClick={() => setSelectedTimeframe("medium")}
              className={`px-4 py-2 rounded-md text-sm ${
                selectedTimeframe === "medium" ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}
            >
              Medium-term (3-12 months)
            </button>
            <button
              onClick={() => setSelectedTimeframe("long")}
              className={`px-4 py-2 rounded-md text-sm ${
                selectedTimeframe === "long" ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}
            >
              Long-term (1+ years)
            </button>
          </div>

          <div className="grid gap-4">
            {analysis.map((stock) => (
              <Card key={stock.symbol} className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{stock.symbol}</h3>
                    <p className="text-sm text-muted-foreground">{stock.name}</p>
                    <p className="text-xl font-bold mt-1">KES {stock.currentPrice.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <Badge className={`${getRecommendationColor(stock.recommendation)} text-white mb-2`}>
                      {stock.recommendation}
                    </Badge>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Target: </span>
                      <span className="font-medium">KES {stock.priceTarget.toFixed(2)}</span>
                    </div>
                    <div className="text-sm">
                      <span className={`${stock.priceTarget > stock.currentPrice ? "text-green-500" : "text-red-500"}`}>
                        {stock.priceTarget > stock.currentPrice ? "+" : ""}
                        {(((stock.priceTarget - stock.currentPrice) / stock.currentPrice) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Technical Score</div>
                    <div className="text-lg font-semibold">{stock.technicalScore}/100</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Fundamental Score</div>
                    <div className="text-lg font-semibold">{stock.fundamentalScore}/100</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Dividend Yield</div>
                    <div className="text-lg font-semibold flex items-center justify-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {stock.dividendYield.toFixed(1)}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Risk Level</div>
                    <Badge className={getRiskColor(stock.riskLevel)}>
                      <Shield className="h-3 w-3 mr-1" />
                      {stock.riskLevel}
                    </Badge>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Key Analysis Points:</h4>
                  <ul className="space-y-1">
                    {stock.reasoning.map((reason, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Dividend Stocks</CardTitle>
          <CardDescription>Highest dividend-yielding stocks for income investors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stocks
              .sort((a, b) => b.dividendYield - a.dividendYield)
              .slice(0, 5)
              .map((stock) => (
                <div key={stock.symbol} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{stock.symbol}</div>
                    <div className="text-sm text-muted-foreground">{stock.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-green-600">{stock.dividendYield.toFixed(1)}%</div>
                    <div className="text-sm text-muted-foreground">KES {stock.price.toFixed(2)}</div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
