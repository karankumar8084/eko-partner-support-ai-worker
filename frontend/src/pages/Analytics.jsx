
import React, { useMemo, useState } from "react";
import AnalyticsFilters from "../components/AnalyticsFilters";
import StatCard from "../components/StatCard";
import TransactionTrend from "../components/TransactionTrend";
import TransactionStatus from "../components/TransactionStatus";
import ServicePerformance from "../components/ServicePerformance";

function Analytics({ transactions = [] }) {
  const [period, setPeriod] = useState("MONTHLY");

  const analytics = useMemo(() => {
    const totalTransactions = transactions.length;

    const totalAmount = transactions.reduce(
      (sum, transaction) => sum + Number(transaction.amount || 0),
      0
    );

    const successfulTransactions = transactions.filter(
      (transaction) => transaction.status === "SUCCESS"
    );

    const failedTransactions = transactions.filter(
      (transaction) => transaction.status === "FAILED"
    );

    const pendingTransactions = transactions.filter(
      (transaction) => transaction.status === "PENDING"
    );

    const successfulAmount = successfulTransactions.reduce(
      (sum, transaction) => sum + Number(transaction.amount || 0),
      0
    );

    const successRate =
      totalTransactions > 0
        ? (successfulTransactions.length / totalTransactions) * 100
        : 0;

    const totalCommission = transactions.reduce(
      (sum, transaction) => sum + Number(transaction.commission || 0),
      0
    );

    return {
      totalTransactions,
      totalAmount,
      successfulTransactions: successfulTransactions.length,
      failedTransactions: failedTransactions.length,
      pendingTransactions: pendingTransactions.length,
      successfulAmount,
      successRate,
      totalCommission,
    };
  }, [transactions]);

  // Generate trend data based on selected period
  const trendData = useMemo(() => {
    const now = new Date();
    let labels = [];

    if (period === "DAILY") {
      labels = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(now);
        date.setDate(now.getDate() - (6 - i));

        return {
          key: date.toISOString().slice(0, 10),
          label: date.toLocaleDateString("en-IN", {
            weekday: "short",
          }),
        };
      });
    } else if (period === "WEEKLY") {
      labels = Array.from({ length: 8 }, (_, i) => {
        const date = new Date(now);
        date.setDate(now.getDate() - (7 - i) * 7);

        return {
          key: date.toISOString().slice(0, 10),
          label: `Week ${i + 1}`,
        };
      });
    } else if (period === "MONTHLY") {
      labels = Array.from({ length: 6 }, (_, i) => {
        const date = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);

        return {
          key: `${date.getFullYear()}-${date.getMonth()}`,
          label: date.toLocaleDateString("en-IN", {
            month: "short",
          }),
        };
      });
    } else {
      labels = Array.from({ length: 5 }, (_, i) => {
        const year = now.getFullYear() - (4 - i);

        return {
          key: String(year),
          label: String(year),
        };
      });
    }

    return labels.map((item) => {
      const matchingTransactions = transactions.filter((transaction) => {
        const transactionDate = new Date(transaction.createdAt);

        if (Number.isNaN(transactionDate.getTime())) return false;

        if (period === "DAILY") {
          return (
            transactionDate.toISOString().slice(0, 10) === item.key
          );
        }

        if (period === "WEEKLY") {
          const currentDate = new Date(item.key);
          const startDate = new Date(currentDate);
          startDate.setDate(startDate.getDate() - 6);

          return (
            transactionDate >= startDate &&
            transactionDate <= currentDate
          );
        }

        if (period === "MONTHLY") {
          return (
            transactionDate.getFullYear() ===
              Number(item.key.split("-")[0]) &&
            transactionDate.getMonth() ===
              Number(item.key.split("-")[1])
          );
        }

        return transactionDate.getFullYear() === Number(item.key);
      });

      const success = matchingTransactions.filter(
        (transaction) => transaction.status === "SUCCESS"
      ).length;

      const failed = matchingTransactions.filter(
        (transaction) => transaction.status === "FAILED"
      ).length;

      const amount = matchingTransactions.reduce(
        (sum, transaction) => sum + Number(transaction.amount || 0),
        0
      );

      return {
        label: item.label,
        count: matchingTransactions.length,
        success,
        failed,
        amount,
      };
    });
  }, [transactions, period]);

  // Service-wise analytics
  const serviceData = useMemo(() => {
    const serviceMap = {};

    transactions.forEach((transaction) => {
      const serviceType = transaction.serviceType || "OTHER";

      if (!serviceMap[serviceType]) {
        serviceMap[serviceType] = {
          serviceType,
          count: 0,
          amount: 0,
          commission: 0,
          successful: 0,
          failed: 0,
          pending: 0,
        };
      }

      const service = serviceMap[serviceType];

      service.count += 1;
      service.amount += Number(transaction.amount || 0);
      service.commission += Number(transaction.commission || 0);

      if (transaction.status === "SUCCESS") {
        service.successful += 1;
      } else if (transaction.status === "FAILED") {
        service.failed += 1;
      } else if (transaction.status === "PENDING") {
        service.pending += 1;
      }
    });

    return Object.values(serviceMap).sort(
      (a, b) => b.count - a.count
    );
  }, [transactions]);

  // Transaction status analytics
  const statusData = useMemo(() => {
    return {
      SUCCESS: analytics.successfulTransactions,
      FAILED: analytics.failedTransactions,
      PENDING: analytics.pendingTransactions,
    };
  }, [analytics]);

  return (
    <div className="min-h-full space-y-6 bg-slate-50 p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-600">
            REPORTS & INSIGHTS
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Analytics
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Track transactions, business performance and partner earnings.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
          <p className="text-xs text-slate-500">Total Services</p>
          <p className="mt-1 text-lg font-bold text-slate-800">
            {serviceData.length} Active Services
          </p>
        </div>
      </div>

      {/* Analytics Filters */}
      <AnalyticsFilters period={period} setPeriod={setPeriod} />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Transactions"
          value={analytics.totalTransactions.toLocaleString("en-IN")}
          icon="📊"
          iconClass="bg-blue-50 text-blue-600"
          description="Transactions processed"
          descriptionClass="text-slate-500"
        />

        <StatCard
          title="Transaction Volume"
          value={`₹${analytics.totalAmount.toLocaleString("en-IN", {
            maximumFractionDigits: 2,
          })}`}
          icon="💰"
          iconClass="bg-emerald-50 text-emerald-600"
          description="Total transaction value"
          descriptionClass="text-slate-500"
        />

        <StatCard
          title="Successful Transactions"
          value={analytics.successfulTransactions.toLocaleString("en-IN")}
          icon="✅"
          iconClass="bg-green-50 text-green-600"
          description={`${analytics.successRate.toFixed(1)}% success rate`}
          descriptionClass="text-green-600"
        />

        <StatCard
          title="Commission Earned"
          value={`₹${analytics.totalCommission.toLocaleString("en-IN", {
            maximumFractionDigits: 2,
          })}`}
          icon="💸"
          iconClass="bg-violet-50 text-violet-600"
          description="Total commission generated"
          descriptionClass="text-violet-600"
        />
      </div>

      {/* Transaction Trends */}
      <TransactionTrend trendData={trendData} />

      {/* Transaction Status */}
      <TransactionStatus statusData={statusData} />

      {/* Service Performance */}
      <ServicePerformance serviceData={serviceData} />

      {/* Analytics Summary */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5">
          <h3 className="text-lg font-bold text-slate-800">
            Analytics Summary
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Overall transaction performance overview
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Successful */}
          <div className="rounded-xl border border-green-100 bg-green-50 p-4">
            <p className="text-sm font-medium text-green-700">
              Successful Transactions
            </p>
            <p className="mt-2 text-2xl font-bold text-green-800">
              {analytics.successfulTransactions.toLocaleString("en-IN")}
            </p>
            <p className="mt-1 text-xs text-green-600">
              ₹{analytics.successfulAmount.toLocaleString("en-IN")}
            </p>
          </div>

          {/* Failed */}
          <div className="rounded-xl border border-red-100 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-700">
              Failed Transactions
            </p>
            <p className="mt-2 text-2xl font-bold text-red-800">
              {analytics.failedTransactions.toLocaleString("en-IN")}
            </p>
            <p className="mt-1 text-xs text-red-600">
              {analytics.totalTransactions > 0
                ? (
                    (analytics.failedTransactions /
                      analytics.totalTransactions) *
                    100
                  ).toFixed(1)
                : 0}
              % of total transactions
            </p>
          </div>

          {/* Pending */}
          <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
            <p className="text-sm font-medium text-amber-700">
              Pending Transactions
            </p>
            <p className="mt-2 text-2xl font-bold text-amber-800">
              {analytics.pendingTransactions.toLocaleString("en-IN")}
            </p>
            <p className="mt-1 text-xs text-amber-600">
              Awaiting completion
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Analytics;
  