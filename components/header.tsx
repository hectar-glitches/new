"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Search, Bell, Menu, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useToast } from "@/hooks/use-toast"

export function Header() {
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      toast({
        title: "Search functionality",
        description: "Search would navigate to stock details in a full implementation",
      })
    }
  }

  return (
    <header className="border-b sticky top-0 z-50 bg-background">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-xl">
            NSE<span className="text-primary">Tracker</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:text-primary">
              Dashboard
            </Link>
            <Link href="/stocks" className="text-sm font-medium hover:text-primary">
              Stocks
            </Link>
            <Link href="/realtime" className="text-sm font-medium hover:text-primary">
              Real-time
            </Link>
            <Link href="/analysis" className="text-sm font-medium hover:text-primary">
              Analysis
            </Link>
            <Link href="#" className="text-sm font-medium hover:text-primary">
              Screener
            </Link>
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search stocks..."
              className="w-[200px] pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary"></span>
          </Button>

          <ThemeToggle />

          <Button variant="outline" size="sm" className="gap-2">
            <User className="h-4 w-4" />
            <span>Sign In</span>
          </Button>
        </div>

        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <div className="flex flex-col h-full">
              <div className="font-bold text-xl mb-6">
                NSE<span className="text-primary">Tracker</span>
              </div>

              <form onSubmit={handleSearch} className="relative mb-6">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search stocks..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>

              <nav className="flex flex-col gap-4">
                <Link href="/" className="text-sm font-medium hover:text-primary">
                  Dashboard
                </Link>
                <Link href="/stocks" className="text-sm font-medium hover:text-primary">
                  Stocks
                </Link>
                <Link href="/realtime" className="text-sm font-medium hover:text-primary">
                  Real-time
                </Link>
                <Link href="/analysis" className="text-sm font-medium hover:text-primary">
                  Analysis
                </Link>
                <Link href="#" className="text-sm font-medium hover:text-primary">
                  Screener
                </Link>
              </nav>

              <div className="mt-auto flex flex-col gap-4">
                <Button variant="outline" className="w-full gap-2">
                  <User className="h-4 w-4" />
                  <span>Sign In</span>
                </Button>
                <ThemeToggle />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
