import React, { useMemo } from "react";

function RecentTransactions({ transactions = [], compact = false }) {
  const serviceNames = {
    MONEY_TRANSFER: "Money Transfer",
    UPI_PAYMENT: "UPI Payment",
    CASH_WITHDRAWAL: "Cash Withdrawal",
    CASH_DEPOSIT: "Cash Deposit",
    BILL_PAYMENT: "Bill Payment",
    MOBILE_RECHARGE: "Mobile Recharge",
    DTH_RECHARGE: "DTH Recharge",
  };

  const formatService = (service) => serviceNames[service] || service || "Other";

  const formatCurrency = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;

  const formatDate = (date) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "N/A";

    return parsedDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusStyles = (status) => {
    switch (status?.toUpperCase()) {
      case "SUCCESS":
        return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
      case "FAILED":
        return "bg-red-50 text-red-700 ring-1 ring-red-200";
      case "PENDING":
        return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
      default:
        return "bg-slate-100 text-slate-600 ring-1 ring-slate-200";
    }
  };

  const getServiceIcon = (service) => {
    switch (service) {
      case "MONEY_TRANSFER":
        return "↗";
      case "UPI_PAYMENT":
        return "₹";
      case "CASH_WITHDRAWAL":
        return "↓";
      case "CASH_DEPOSIT":
        return "↑";
      case "BILL_PAYMENT":
        return "📄";
      case "MOBILE_RECHARGE":
        return "📱";
      case "DTH_RECHARGE":
        return "📺";
      default:
        return "💳";
    }
  };

  // =========================
  // SERVICE ANALYTICS
  // =========================

  const serviceAnalytics = useMemo(() => {
    const grouped = {};

    transactions.forEach((transaction) => {
      const service = transaction.serviceType || "OTHER";

      if (!grouped[service]) {
        grouped[service] = {
          service,
          count: 0,
          amount: 0,
          commission: 0,
          successfulCount: 0,
          failedCount: 0,
          pendingCount: 0,
        };
      }

      const amount = Number(transaction.amount || 0);
      const commission = Number(transaction.commission || 0);
      const status = transaction.status?.toUpperCase();

      grouped[service].count += 1;
      grouped[service].amount += amount;
      grouped[service].commission += commission;

      if (status === "SUCCESS") {
        grouped[service].successfulCount += 1;
      } else if (status === "FAILED") {
        grouped[service].failedCount += 1;
      } else if (status === "PENDING") {
        grouped[service].pendingCount += 1;
      }
    });

    return Object.values(grouped).sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  // =========================
  // SUMMARY
  // =========================

  const summary = useMemo(() => {
    const totalAmount = transactions.reduce(
      (sum, transaction) => sum + Number(transaction.amount || 0),
      0
    );

    const totalCommission = transactions.reduce(
      (sum, transaction) => sum + Number(transaction.commission || 0),
      0
    );

    const successful = transactions.filter(
      (transaction) => transaction.status?.toUpperCase() === "SUCCESS"
    ).length;

    const failed = transactions.filter(
      (transaction) => transaction.status?.toUpperCase() === "FAILED"
    ).length;

    const pending = transactions.filter(
      (transaction) => transaction.status?.toUpperCase() === "PENDING"
    ).length;

    const successRate =
      transactions.length > 0
        ? ((successful / transactions.length) * 100).toFixed(1)
        : "0.0";

    return {
      totalTransactions: transactions.length,
      totalAmount,
      totalCommission,
      successful,
      failed,
      pending,
      successRate,
    };
  }, [transactions]);

  const maxAmount = Math.max(
    ...serviceAnalytics.map((service) => service.amount),
    1
  );

  const maxCommission = Math.max(
    ...serviceAnalytics.map((service) => service.commission),
    1
  );

  const maxComparison = Math.max(maxAmount, maxCommission, 1);

  // =========================
  // SUMMARY CARDS
  // =========================

  const summaryCards = [
    {
      title: "Transaction Volume",
      value: formatCurrency(summary.totalAmount),
      description: "Total processed value",
      icon: "₹",
      iconStyle: "bg-violet-50 text-violet-600",
    },
    {
      title: "Commission Generated",
      value: formatCurrency(summary.totalCommission),
      description: "Total partner earnings",
      icon: "✦",
      iconStyle: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Success Rate",
      value: `${summary.successRate}%`,
      description: `${summary.successful} successful transactions`,
      icon: "✓",
      iconStyle: "bg-green-50 text-green-600",
    },
  ];

  // =========================
  // SERVICE BAR
  // =========================

  const ServiceBar = ({ label, value, percentage, type = "amount" }) => (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-[150px_minmax(0,1fr)_100px] sm:items-center sm:gap-4">
      <span className="truncate text-sm font-medium text-slate-600">
        {label}
      </span>

      <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            type === "amount"
              ? "bg-gradient-to-r from-blue-500 to-indigo-500"
              : "bg-gradient-to-r from-emerald-400 to-green-500"
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

      <span className="text-sm font-semibold text-slate-800 sm:text-right">
        {formatCurrency(value)}
      </span>
    </div>
  );

  // =========================
  // TRANSACTION TABLE
  // =========================

  const TransactionTable = ({ data, compactView = false }) => (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[750px] text-left">
        <thead className="bg-slate-50">
          <tr>
            {[
              "Transaction ID",
              "Service",
              "Amount",
              "Status",
              "Commission",
              "Date",
            ].map((heading) => (
              <th
                key={heading}
                className="whitespace-nowrap px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500"
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {data.map((transaction, index) => (
            <tr
              key={transaction.transactionId || transaction._id || index}
              className="transition-colors hover:bg-slate-50"
            >
              {/* Transaction ID */}
              <td className="px-5 py-4">
                <span className="font-mono text-xs font-medium text-slate-700">
                  {transaction.transactionId || transaction._id || "N/A"}
                </span>
              </td>

              {/* Service */}
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm">
                    {getServiceIcon(transaction.serviceType)}
                  </span>

                  <span className="whitespace-nowrap text-sm font-medium text-slate-700">
                    {formatService(transaction.serviceType)}
                  </span>
                </div>
              </td>

              {/* Amount */}
              <td className="whitespace-nowrap px-5 py-4 text-sm font-bold text-slate-800">
                {formatCurrency(transaction.amount)}
              </td>

              {/* Status */}
              <td className="px-5 py-4">
                <span
                  className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyles(
                    transaction.status
                  )}`}
                >
                  {transaction.status || "UNKNOWN"}
                </span>
              </td>

              {/* Commission */}
              <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-emerald-700">
                {formatCurrency(transaction.commission)}
              </td>

              {/* Date */}
              <td className="whitespace-nowrap px-5 py-4 text-xs text-slate-500">
                {formatDate(transaction.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // =========================
  // COMPACT DASHBOARD VIEW
  // =========================

  if (compact) {
    return (
      <div className="w-full">
        {transactions.length > 0 ? (
          <TransactionTable data={transactions.slice(0, 5)} compactView />
        ) : (
          <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-xl">
              💳
            </div>

            <h4 className="font-semibold text-slate-700">
              No recent transactions
            </h4>

            <p className="mt-1 text-sm text-slate-400">
              Recent transactions will appear here.
            </p>
          </div>
        )}
      </div>
    );
  }

  // =========================
  // FULL TRANSACTIONS VIEW
  // =========================

  return (
    <div className="w-full space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-600" />
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
              Transaction Management
            </span>
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Transactions
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Monitor transaction activity, service performance and earnings.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600">
          {transactions.length.toLocaleString("en-IN")} Records
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {summaryCards.map((card) => (
          <div
            key={card.title}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-slate-500">{card.title}</p>

              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xl ${card.iconStyle}`}
              >
                {card.icon}
              </span>
            </div>

            <h3 className="mt-4 break-words text-2xl font-bold tracking-tight text-slate-900">
              {card.value}
            </h3>

            <p className="mt-1 text-xs text-slate-500">{card.description}</p>
          </div>
        ))}
      </div>

      {/* SERVICE ANALYTICS */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* Transaction Volume */}
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Transaction Volume by Service
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Amount processed across different services
              </p>
            </div>

            <span className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
              Volume
            </span>
          </div>

          {serviceAnalytics.length > 0 ? (
            <div className="space-y-5">
              {serviceAnalytics.map((service) => (
                <ServiceBar
                  key={service.service}
                  label={formatService(service.service)}
                  value={service.amount}
                  percentage={(service.amount / maxAmount) * 100}
                  type="amount"
                />
              ))}
            </div>
          ) : (
            <div className="flex min-h-[160px] items-center justify-center rounded-lg bg-slate-50 text-sm text-slate-400">
              No transaction data available
            </div>
          )}
        </section>

        {/* Commission */}
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Commission by Service
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Earnings generated from each service
              </p>
            </div>

            <span className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              Commission
            </span>
          </div>

          {serviceAnalytics.length > 0 ? (
            <div className="space-y-5">
              {serviceAnalytics.map((service) => (
                <ServiceBar
                  key={service.service}
                  label={formatService(service.service)}
                  value={service.commission}
                  percentage={(service.commission / maxCommission) * 100}
                  type="commission"
                />
              ))}
            </div>
          ) : (
            <div className="flex min-h-[160px] items-center justify-center rounded-lg bg-slate-50 text-sm text-slate-400">
              No commission data available
            </div>
          )}
        </section>
      </div>

      {/* SERVICE PERFORMANCE COMPARISON */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5">
          <h3 className="text-base font-bold text-slate-800">
            Service Performance Comparison
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Transaction volume vs commission generated
          </p>
        </div>

        {serviceAnalytics.length > 0 ? (
          <div className="space-y-4">
            {serviceAnalytics.map((service) => (
              <div
                key={service.service}
                className="rounded-lg border border-slate-100 bg-slate-50 p-4"
              >
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm">
                    {getServiceIcon(service.service)}
                  </span>

                  <h4 className="font-semibold text-slate-800">
                    {formatService(service.service)}
                  </h4>

                  <span className="ml-auto rounded-full bg-white px-3 py-1 text-xs text-slate-500 shadow-sm">
                    {service.count} Txns
                  </span>
                </div>

                <div className="space-y-4">
                  <ServiceBar
                    label="Transaction Volume"
                    value={service.amount}
                    percentage={(service.amount / maxComparison) * 100}
                    type="amount"
                  />

                  <ServiceBar
                    label="Commission"
                    value={service.commission}
                    percentage={(service.commission / maxComparison) * 100}
                    type="commission"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-10 text-center text-sm text-slate-400">
            No service comparison data available.
          </div>
        )}

        {/* Legend */}
        <div className="mt-5 flex flex-wrap gap-5 border-t border-slate-100 pt-4">
          <span className="flex items-center gap-2 text-xs text-slate-500">
            <span className="h-3 w-3 rounded-full bg-blue-500" />
            Transaction Volume
          </span>

          <span className="flex items-center gap-2 text-xs text-slate-500">
            <span className="h-3 w-3 rounded-full bg-emerald-500" />
            Commission Generated
          </span>
        </div>
      </section>

      {/* STATUS CARDS */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          {
            label: "Successful Transactions",
            value: summary.successful,
            icon: "✓",
            color: "text-emerald-700",
            bg: "bg-emerald-50",
            border: "border-emerald-100",
          },
          {
            label: "Failed Transactions",
            value: summary.failed,
            icon: "×",
            color: "text-red-700",
            bg: "bg-red-50",
            border: "border-red-100",
          },
          {
            label: "Pending Transactions",
            value: summary.pending,
            icon: "◷",
            color: "text-amber-700",
            bg: "bg-amber-50",
            border: "border-amber-100",
          },
        ].map((item) => (
          <div
            key={item.label}
            className={`flex items-center justify-between rounded-xl border ${item.border} ${item.bg} p-5`}
          >
            <div>
              <p className="text-sm font-medium text-slate-600">{item.label}</p>
              <p className={`mt-2 text-2xl font-bold ${item.color}`}>
                {item.value}
              </p>
            </div>

            <span
              className={`flex h-10 w-10 items-center justify-center rounded-lg bg-white text-xl ${item.color}`}
            >
              {item.icon}
            </span>
          </div>
        ))}
      </section>

      {/* ALL TRANSACTIONS TABLE */}
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800">
              All Transactions
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Complete transaction history
            </p>
          </div>

          <span className="w-fit rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
            {transactions.length} Transactions
          </span>
        </div>

        {transactions.length > 0 ? (
          <TransactionTable data={transactions} />
        ) : (
          <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-2xl">
              💳
            </div>

            <h4 className="font-semibold text-slate-700">
              No transactions found
            </h4>

            <p className="mt-1 text-sm text-slate-400">
              Transaction records will appear here when available.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

export default RecentTransactions;