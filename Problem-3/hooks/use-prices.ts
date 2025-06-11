"use client"

import { useState, useEffect } from "react"

type PriceMap = Record<string, number>

// Mock hook that simulates fetching cryptocurrency prices
export function usePrices(): PriceMap {
  const [prices, setPrices] = useState<PriceMap>({})

  useEffect(() => {
    // Simulate API call with mock price data
    const mockPrices: PriceMap = {
      ETH: 2000.0,
      OSMO: 0.5,
      ARB: 1.2,
      ZIL: 0.02,
      NEO: 12.5,
      BTC: 45000.0,
    }

    // Simulate loading delay
    const timer = setTimeout(() => {
      setPrices(mockPrices)
    }, 150)

    return () => clearTimeout(timer)
  }, [])

  return prices
}
