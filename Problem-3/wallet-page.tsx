"use client"

import type React from "react"
import { useMemo } from "react"
import { useWalletBalances } from "./hooks/use-wallet-balances"
import { usePrices } from "./hooks/use-prices"
import { WalletRow } from "./components/wallet-row"

interface WalletBalance {
  currency: string
  amount: number
  blockchain: string
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string
  usdValue: number
}

interface BoxProps {
  className?: string
  children?: React.ReactNode
}

interface Props extends BoxProps {}

// Mock classes object for styling
const classes = {
  row: "hover:bg-gray-50 transition-colors",
}

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props
  const balances = useWalletBalances()
  const prices = usePrices()

  // Moved outside component or memoize to prevent recreation
  const getPriority = useMemo(
    () =>
      (blockchain: string): number => {
        const priorities: Record<string, number> = {
          Osmosis: 100,
          Ethereum: 50,
          Arbitrum: 30,
          Zilliqa: 20,
          Neo: 20,
        }
        return priorities[blockchain] ?? -99
      },
    [],
  )

  const formattedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain)
        // Fixed logic: keep balances with priority > -99 AND amount > 0
        return balancePriority > -99 && balance.amount > 0
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain)
        const rightPriority = getPriority(rhs.blockchain)

        // Fixed: Complete sort logic with fallback
        if (leftPriority !== rightPriority) {
          return rightPriority - leftPriority // Higher priority first
        }
        // Fallback to currency name for stable sorting
        return lhs.currency.localeCompare(rhs.currency)
      })
      .map((balance: WalletBalance): FormattedWalletBalance => {
        const usdValue = (prices[balance.currency] || 0) * balance.amount
        return {
          ...balance,
          formatted: balance.amount.toFixed(2), // Added decimal places for better formatting
          usdValue,
        }
      })
  }, [balances, prices, getPriority]) // Fixed dependencies

  const rows = formattedBalances.map((balance: FormattedWalletBalance) => {
    return (
      <WalletRow
        className={classes.row}
        key={`${balance.currency}-${balance.blockchain}`} // Better key using unique identifiers
        amount={balance.amount}
        usdValue={balance.usdValue}
        formattedAmount={balance.formatted}
      />
    )
  })

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg" {...rest}>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Wallet Balances</h1>
      {formattedBalances.length > 0 ? (
        <div className="space-y-0 border border-gray-200 rounded-lg overflow-hidden">{rows}</div>
      ) : (
        <div className="text-center py-8 text-gray-500">No wallet balances found or still loading...</div>
      )}
    </div>
  )
}

export default WalletPage
