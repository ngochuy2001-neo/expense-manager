import { formatCurrency } from "./utils/formatCurrency";

// Component thống kê
interface StatCardProps {
  title: string;
  amount: number;
  icon: string;
  color: string;
}

export default function StatCard({
  title,
  amount,
  icon,
  color,
}: StatCardProps) {
  const formattedAmount = formatCurrency(amount);

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-md border border-zinc-200 dark:border-zinc-800">
      <div className="flex items-center justify-between mb-4">
        <div className="text-zinc-600 dark:text-zinc-400 text-sm font-medium">
          {title}
        </div>
        <div className={`text-2xl ${color}`}>{icon}</div>
      </div>
      <div className="text-2xl font-bold text-zinc-900 dark:text-white">
        {formattedAmount}
      </div>
    </div>
  );
}
