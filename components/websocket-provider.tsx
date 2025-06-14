"use client"

import React, { createContext, useContext, useEffect, useRef, useState, useCallback, useMemo } from "react"

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

interface WebSocketProviderProps {
  children: React.ReactNode
  url: string
}

export function WebSocketProvider({ children, url }: WebSocketProviderProps) {
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "disconnected">("disconnected")
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    setConnectionStatus("connecting")
    const ws = new WebSocket(url)
    wsRef.current = ws

    ws.onopen = () => setConnectionStatus("connected")
    ws.onclose = () => setConnectionStatus("disconnected")
    ws.onerror = () => setConnectionStatus("disconnected")
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        setLastMessage(data)
      } catch (e) {
        // handle non-JSON message
      }
    }

    return () => {
      ws.close()
      wsRef.current = null
      setConnectionStatus("disconnected")
    }
  }, [url])

  const sendMessage = useCallback((message: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message))
    } else {
      console.warn("WebSocket not connected, message not sent:", message)
    }
  }, [])

  const contextValue = useMemo(() => ({
    lastMessage,
    sendMessage,
    connectionStatus,
  }), [lastMessage, sendMessage, connectionStatus])

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  )
}
