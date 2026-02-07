"use client";

import DashboardHeader from "./components/DashboardHeader";
import TotalBalance from "./components/TotalBalance";
import StatCard from "./components/StatCard";
import Widget from "./components/Widget";
import RecentTransactions from "./components/RecentTransactions";
import BudgetOverview from "./components/BudgetOverview";
import GoalsOverview from "./components/GoalsOverview";
import DebtOverview from "./components/DebtOverview";

export default function Dashboard() {
  // Dữ liệu mẫu - sẽ được thay thế bằng API call sau
  const totalBalance = 25000000;
  const totalIncome = 15000000;
  const totalExpense = 5000000;
  const accountBalance = 20000000;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TotalBalance amount={totalBalance} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Tổng thu nhập"
            amount={totalIncome}
            icon="💰"
            color="text-green-500"
          />
          <StatCard
            title="Tổng chi tiêu"
            amount={totalExpense}
            icon="💸"
            color="text-red-500"
          />
          <StatCard
            title="Số dư tài khoản"
            amount={accountBalance}
            icon="💳"
            color="text-blue-500"
          />
          <StatCard
            title="Tiết kiệm"
            amount={totalIncome - totalExpense}
            icon="🎯"
            color="text-purple-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Widget title="Giao dịch gần đây">
            <RecentTransactions />
          </Widget>

          <Widget title="Ngân sách">
            <BudgetOverview />
          </Widget>

          <Widget title="Mục tiêu tiết kiệm">
            <GoalsOverview />
          </Widget>

          <Widget title="Quản lý nợ">
            <DebtOverview />
          </Widget>
        </div>
      </main>
    </div>
  );
}
