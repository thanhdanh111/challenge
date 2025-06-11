interface WalletRowProps {
  className?: string
  amount: number
  usdValue: number
  formattedAmount: string
}

export function WalletRow({ className, amount, usdValue, formattedAmount }: WalletRowProps) {
  return (
    <div className={`flex justify-between items-center p-4 border-b border-gray-200 ${className || ""}`}>
      <div className="flex flex-col">
        <span className="font-medium text-gray-900">{formattedAmount}</span>
        <span className="text-sm text-gray-500">Amount</span>
      </div>
      <div className="flex flex-col text-right">
        <span className="font-medium text-gray-900">${usdValue.toFixed(2)}</span>
        <span className="text-sm text-gray-500">USD Value</span>
      </div>
    </div>
  )
}
