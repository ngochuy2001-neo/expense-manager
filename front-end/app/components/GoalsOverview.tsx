import { formatCurrency } from "./utils/formatCurrency";

// Component mục tiêu
interface Goal {
  name: string;
  current: number;
  target: number;
  percentage: number;
}

export default function GoalsOverview() {
  const goals: Goal[] = [
    {
      name: "Mua xe máy",
      current: 5000000,
      target: 20000000,
      percentage: 25,
    },
    {
      name: "Du lịch",
      current: 2000000,
      target: 10000000,
      percentage: 20,
    },
  ];

  return (
    <div className="space-y-4">
      {goals.map((goal, index) => (
        <div key={index} className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium text-zinc-900 dark:text-white">
              {goal.name}
            </span>
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              {goal.percentage}%
            </span>
          </div>
          <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2 mb-2">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${goal.percentage}%` }}
            ></div>
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            {formatCurrency(goal.current)} / {formatCurrency(goal.target)}
          </div>
        </div>
      ))}
      <button className="w-full mt-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
        Xem tất cả mục tiêu →
      </button>
    </div>
  );
}
