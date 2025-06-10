"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useRef } from "react"

interface WebSocketMessage {
  type: string
  data: any
}

interface WebSocketContextType {
  lastMessage: WebSocketMessage | null
  sendMessage: (message: any) => void
  connectionStatus: "connecting" | "connected" | "disconnected"
}

const WebSocketContext = createContext<WebSocketContextType>({
  lastMessage: null,
  sendMessage: () => {},
  connectionStatus: "disconnected",
})

export function useWebSocket() {
  return useContext(WebSocketContext)
}

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "disconnected">("disconnected")
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Real WebSocket connection (no simulated data)
  useEffect(() => {
    console.log("🌐 WebSocket Provider initialized - real connections only")
    setConnectionStatus("disconnected")

    // In a real implementation, you would connect to an actual WebSocket server
    // For now, we'll just set the status to disconnected since we're using REST APIs

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      setConnectionStatus("disconnected")
    }
  }, [])

  const sendMessage = (message: any) => {
    // In a real implementation, this would send data through the WebSocket
    console.log("📡 WebSocket message would be sent:", message)
  }

  return (
    <WebSocketContext.Provider value={{ lastMessage, sendMessage, connectionStatus }}>
      {children}
    </WebSocketContext.Provider>
  )
}
