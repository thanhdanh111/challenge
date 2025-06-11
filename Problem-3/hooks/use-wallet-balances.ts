"use client"

import { useState, useEffect } from "react"

interface WalletBalance {
  currency: string
  amount: number
  blockchain: string
}

// Mock hook that simulates fetching wallet balances
export function useWalletBalances(): WalletBalance[] {
  const [balances, setBalances] = useState<WalletBalance[]>([])

  useEffect(() => {
    // Simulate API call with mock data
    const mockBalances: WalletBalance[] = [
      { currency: "ETH", amount: 2.5, blockchain: "Ethereum" },
      { currency: "OSMO", amount: 100.0, blockchain: "Osmosis" },
      { currency: "ARB", amount: 0, blockchain: "Arbitrum" },
      { currency: "ZIL", amount: 1000.5, blockchain: "Zilliqa" },
      { currency: "NEO", amount: 15.2, blockchain: "Neo" },
      { currency: "BTC", amount: 0.1, blockchain: "Bitcoin" }, // Low priority blockchain
    ]

    // Simulate loading delay
    const timer = setTimeout(() => {
      setBalances(mockBalances)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  return balances
}
