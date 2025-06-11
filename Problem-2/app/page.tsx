"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpDown, Loader2, AlertCircle, TrendingUp, TrendingDown } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

interface Token {
  currency: string
  date: string
  price: number
}

interface TokenInfo {
  symbol: string
  name: string
  price: number
  iconUrl: string
}

export default function CurrencySwapForm() {
  const [tokens, setTokens] = useState<TokenInfo[]>([])
  const [fromToken, setFromToken] = useState<string>("")
  const [toToken, setToToken] = useState<string>("")
  const [fromAmount, setFromAmount] = useState<string>("")
  const [toAmount, setToAmount] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [swapping, setSwapping] = useState(false)
  const [error, setError] = useState<string>("")
  const [exchangeRate, setExchangeRate] = useState<number>(0)
  const [priceImpact, setPriceImpact] = useState<number>(0)

  // Fetch token prices and create token list
  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await fetch("https://interview.switcheo.com/prices.json")
        const data: Token[] = await response.json()

        // Get latest prices for each token
        const tokenMap = new Map<string, Token>()
        data.forEach((token) => {
          const existing = tokenMap.get(token.currency)
          if (!existing || new Date(token.date) > new Date(existing.date)) {
            tokenMap.set(token.currency, token)
          }
        })

        // Create token info with icons
        const tokenList: TokenInfo[] = Array.from(tokenMap.values())
          .filter((token) => token.price > 0)
          .map((token) => ({
            symbol: token.currency,
            name: getTokenName(token.currency),
            price: token.price,
            iconUrl: `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${token.currency}.svg`,
          }))
          .sort((a, b) => a.symbol.localeCompare(b.symbol))

        setTokens(tokenList)

        // Set default tokens
        if (tokenList.length >= 2) {
          setFromToken(tokenList[0].symbol)
          setToToken(tokenList[1].symbol)
        }
      } catch (err) {
        setError("Failed to fetch token data")
      } finally {
        setLoading(false)
      }
    }

    fetchTokens()
  }, [])

  // Calculate exchange rate and to amount
  useEffect(() => {
    if (fromToken && toToken && fromAmount && tokens.length > 0) {
      const fromTokenData = tokens.find((t) => t.symbol === fromToken)
      const toTokenData = tokens.find((t) => t.symbol === toToken)

      if (fromTokenData && toTokenData) {
        const rate = fromTokenData.price / toTokenData.price
        setExchangeRate(rate)

        const amount = Number.parseFloat(fromAmount)
        if (!isNaN(amount)) {
          const calculatedAmount = amount * rate
          setToAmount(calculatedAmount.toFixed(6))

          // Calculate price impact (simulated)
          const impact = Math.random() * 2 - 1 // Random between -1% and 1%
          setPriceImpact(impact)
        }
      }
    }
  }, [fromToken, toToken, fromAmount, tokens])

  const getTokenName = (symbol: string): string => {
    const names: Record<string, string> = {
      SWTH: "Switcheo",
      ETH: "Ethereum",
      BTC: "Bitcoin",
      USDC: "USD Coin",
      USDT: "Tether",
      BNB: "Binance Coin",
      WBTC: "Wrapped Bitcoin",
      ATOM: "Cosmos",
      NEO: "Neo",
      GAS: "Gas",
      BUSD: "Binance USD",
      DAI: "Dai",
      LUNA: "Terra Luna",
      UST: "TerraUSD",
    }
    return names[symbol] || symbol
  }

  const handleSwapTokens = () => {
    const tempToken = fromToken
    const tempAmount = fromAmount

    setFromToken(toToken)
    setToToken(tempToken)
    setFromAmount(toAmount)
    setToAmount(tempAmount)
  }

  const handleSwap = async () => {
    if (!fromAmount || !fromToken || !toToken) {
      setError("Please fill in all fields")
      return
    }

    const amount = Number.parseFloat(fromAmount)
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount")
      return
    }

    setError("")
    setSwapping(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setSwapping(false)

    // Show success message (in a real app, this would redirect or show confirmation)
    alert(`Successfully swapped ${fromAmount} ${fromToken} for ${toAmount} ${toToken}!`)
  }

  const validateAmount = (value: string) => {
    const num = Number.parseFloat(value)
    if (isNaN(num) || num <= 0) {
      setError("Amount must be greater than 0")
    } else {
      setError("")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading tokens...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto pt-8">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Currency Swap
            </CardTitle>
            <CardDescription>Swap your tokens instantly with the best rates</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* From Token */}
            <div className="space-y-2">
              <Label htmlFor="from-amount">From</Label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    id="from-amount"
                    type="number"
                    placeholder="0.00"
                    value={fromAmount}
                    onChange={(e) => {
                      setFromAmount(e.target.value)
                      validateAmount(e.target.value)
                    }}
                    className="text-lg font-semibold"
                  />
                </div>
                <Select value={fromToken} onValueChange={setFromToken}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tokens.map((token) => (
                      <SelectItem key={token.symbol} value={token.symbol}>
                        <div className="flex items-center gap-2">
                          <img
                            src={token.iconUrl || "/placeholder.svg"}
                            alt={token.symbol}
                            className="w-5 h-5"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.svg?height=20&width=20&text=" + token.symbol
                            }}
                          />
                          <span className="font-medium">{token.symbol}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {fromToken && (
                <div className="text-sm text-muted-foreground">
                  Balance: ${tokens.find((t) => t.symbol === fromToken)?.price.toFixed(4)} per {fromToken}
                </div>
              )}
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="icon"
                onClick={handleSwapTokens}
                className="rounded-full border-2 hover:bg-blue-50 transition-colors"
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>

            {/* To Token */}
            <div className="space-y-2">
              <Label htmlFor="to-amount">To</Label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    id="to-amount"
                    type="number"
                    placeholder="0.00"
                    value={toAmount}
                    readOnly
                    className="text-lg font-semibold bg-gray-50"
                  />
                </div>
                <Select value={toToken} onValueChange={setToToken}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tokens.map((token) => (
                      <SelectItem key={token.symbol} value={token.symbol}>
                        <div className="flex items-center gap-2">
                          <img
                            src={token.iconUrl || "/placeholder.svg"}
                            alt={token.symbol}
                            className="w-5 h-5"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.svg?height=20&width=20&text=" + token.symbol
                            }}
                          />
                          <span className="font-medium">{token.symbol}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {toToken && (
                <div className="text-sm text-muted-foreground">
                  Balance: ${tokens.find((t) => t.symbol === toToken)?.price.toFixed(4)} per {toToken}
                </div>
              )}
            </div>

            {/* Exchange Rate Info */}
            {exchangeRate > 0 && fromToken && toToken && (
              <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Exchange Rate</span>
                  <span className="text-sm">
                    1 {fromToken} = {exchangeRate.toFixed(6)} {toToken}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Price Impact</span>
                  <div className="flex items-center gap-1">
                    {priceImpact > 0 ? (
                      <TrendingUp className="h-3 w-3 text-red-500" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-green-500" />
                    )}
                    <Badge variant={priceImpact > 0 ? "destructive" : "default"} className="text-xs">
                      {priceImpact > 0 ? "+" : ""}
                      {priceImpact.toFixed(2)}%
                    </Badge>
                  </div>
                </div>
              </div>
            )}

            {/* Swap Button */}
            <Button
              onClick={handleSwap}
              disabled={swapping || !fromAmount || !fromToken || !toToken || !!error}
              className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {swapping ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Swapping...
                </>
              ) : (
                "Swap Tokens"
              )}
            </Button>

            {/* Additional Info */}
            <div className="text-xs text-muted-foreground text-center space-y-1">
              <p>Powered by Switcheo Network</p>
              <p>Best rates guaranteed • No hidden fees</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
