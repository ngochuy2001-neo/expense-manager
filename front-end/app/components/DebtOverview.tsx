import { formatCurrency } from "./utils/formatCurrency";

// Component nợ
interface Debt {
  type: string;
  amount: number;
  count: number;
}

export default function DebtOverview() {
  const debts: Debt[] = [
    { type: "Nợ phải trả", amount: 5000000, count: 2 },
    { type: "Khoản phải thu", amount: 3000000, count: 1 },
  ];

  return (
    <div className="space-y-3">
      {debts.map((debt, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800"
        >
          <div>
            <div className="font-medium text-zinc-900 dark:text-white">
              {debt.type}
            </div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">
              {debt.count} khoản nợ
            </div>
          </div>
          <div
            className={`font-semibold ${
              debt.type === "Nợ phải trả"
                ? "text-red-600 dark:text-red-400"
                : "text-green-600 dark:text-green-400"
            }`}
          >
            {formatCurrency(debt.amount)}
          </div>
        </div>
      ))}
      <button className="w-full mt-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
        Quản lý nợ →
      </button>
    </div>
  );
}
