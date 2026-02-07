import { formatCurrency } from "./utils/formatCurrency";

// Component ngân sách
interface Budget {
  category: string;
  used: number;
  limit: number;
  percentage: number;
}

export default function BudgetOverview() {
  const budgets: Budget[] = [
    { category: "Ăn uống", used: 500000, limit: 1000000, percentage: 50 },
    { category: "Mua sắm", used: 200000, limit: 500000, percentage: 40 },
    { category: "Giải trí", used: 100000, limit: 300000, percentage: 33 },
  ];

  return (
    <div className="space-y-4">
      {budgets.map((budget, index) => (
        <div key={index}>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-zinc-700 dark:text-zinc-300">
              {budget.category}
            </span>
            <span className="text-zinc-600 dark:text-zinc-400">
              {formatCurrency(budget.used)} / {formatCurrency(budget.limit)}
            </span>
          </div>
          <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                budget.percentage >= 90
                  ? "bg-red-500"
                  : budget.percentage >= 70
                    ? "bg-yellow-500"
                    : "bg-green-500"
              }`}
              style={{ width: `${budget.percentage}%` }}
            ></div>
          </div>
        </div>
      ))}
      <button className="w-full mt-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
        Quản lý ngân sách →
      </button>
    </div>
  );
}
