import { formatCurrency } from "./utils/formatCurrency";

// Component giao dịch gần đây
interface Transaction {
  id: number;
  description: string;
  amount: number;
  date: string;
  category: string;
}

export default function RecentTransactions() {
  const transactions: Transaction[] = [
    {
      id: 1,
      description: "Mua đồ ăn",
      amount: -50000,
      date: "Hôm nay",
      category: "Chi tiêu",
    },
    {
      id: 2,
      description: "Lương tháng",
      amount: 10000000,
      date: "Hôm qua",
      category: "Thu nhập",
    },
    {
      id: 3,
      description: "Tiền điện",
      amount: -200000,
      date: "2 ngày trước",
      category: "Chi tiêu",
    },
  ];

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
        >
          <div className="flex-1">
            <div className="font-medium text-zinc-900 dark:text-white">
              {transaction.description}
            </div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">
              {transaction.category} • {transaction.date}
            </div>
          </div>
          <div
            className={`font-semibold ${
              transaction.amount > 0
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {transaction.amount > 0 ? "+" : ""}
            {formatCurrency(transaction.amount)}
          </div>
        </div>
      ))}
      <button className="w-full mt-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
        Xem tất cả giao dịch →
      </button>
    </div>
  );
}
