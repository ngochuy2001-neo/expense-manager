import { formatCurrency } from "./utils/formatCurrency";

// Component hiển thị số tiền tổng nổi bật
export default function TotalBalance({ amount }: { amount: number }) {
  const formattedAmount = formatCurrency(amount);

  return (
    <div className="w-full bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 shadow-2xl mb-6">
      <div className="text-white/80 text-sm font-medium mb-2">
        Tổng số tiền hiện có
      </div>
      <div className="text-white text-5xl font-bold tracking-tight">
        {formattedAmount}
      </div>
    </div>
  );
}
