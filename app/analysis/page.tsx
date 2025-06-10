import { InvestmentAnalysis } from "@/components/investment-analysis"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default function AnalysisPage() {
  return (
    <main className="container mx-auto p-4 space-y-6">
      <div className="flex items-center mb-6">
        <Link href="/" className="flex items-center text-primary mr-4">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold">Investment Analysis</h1>
        <p className="text-muted-foreground">Comprehensive analysis of NSE stocks with AI-powered insights</p>
      </div>

      <InvestmentAnalysis />
    </main>
  )
}
