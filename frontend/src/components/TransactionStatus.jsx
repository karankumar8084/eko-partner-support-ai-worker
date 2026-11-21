
import React from "react";

function TransactionStatus({ statusData = {} }) {
  const success = Number(statusData.success) || 0;
  const failed = Number(statusData.failed) || 0;
  const pending = Number(statusData.pending) || 0;

  const total = success + failed + pending;

  const getPercentage = (value) => {
    return total > 0 ? (value / total) * 100 : 0;
  };

  const successPercentage = getPercentage(success);
  const failedPercentage = getPercentage(failed);
  const pendingPercentage = getPercentage(pending);

  const successAngle = successPercentage * 3.6;
  const failedAngle = failedPercentage * 3.6;

  const donutStyle = {
    background:
      total === 0
        ? "#e9edf5"
        : `conic-gradient(
            #16a34a 0deg ${successAngle}deg,
            #ef4444 ${successAngle}deg ${
              successAngle + failedAngle
            }deg,
            #f59e0b ${
              successAngle + failedAngle
            }deg 360deg
          )`,
  };

  const formatNumber = (value) =>
    new Intl.NumberFormat("en-IN").format(value);

  const statuses = [
    {
      label: "Successful",
      description: "Transactions completed successfully",
      value: success,
      percentage: successPercentage,
      icon: "✓",
      color: "#16a34a",
      lightColor: "bg-green-50",
      textColor: "text-green-600",
      borderColor: "border-green-200",
      barColor: "bg-green-500",
    },
    {
      label: "Failed",
      description: "Transactions could not be completed",
      value: failed,
      percentage: failedPercentage,
      icon: "✕",
      color: "#ef4444",
      lightColor: "bg-red-50",
      textColor: "text-red-600",
      borderColor: "border-red-200",
      barColor: "bg-red-500",
    },
    {
      label: "Pending",
      description: "Transactions awaiting confirmation",
      value: pending,
      percentage: pendingPercentage,
      icon: "◷",
      color: "#f59e0b",
      lightColor: "bg-amber-50",
      textColor: "text-amber-600",
      borderColor: "border-amber-200",
      barColor: "bg-amber-500",
    },
  ];

  return (
    <section className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-md sm:p-6 lg:p-7">

      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-xl text-indigo-600">
            ◈
          </div>

          <div>
            <h3 className="text-lg font-bold tracking-tight text-slate-800">
              Transaction Status
            </h3>
            <p className="mt-0.5 text-sm text-slate-500">
              Transaction outcome overview
            </p>
          </div>
        </div>

        <div className="rounded-full border border-slate-100 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-600">
          {formatNumber(total)} Transactions
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

        {/* Donut Chart */}
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white px-4 py-7 sm:px-6">

          {/* Donut Wrapper */}
          <div className="relative flex h-[300px] w-[300px] max-w-full items-center justify-center">

            {/* Percentage Badges */}
            {total > 0 && (
              <>
                <div className="absolute right-1 top-5 z-10 rounded-full border border-green-100 bg-white px-3 py-1.5 text-xs font-bold text-green-600 shadow-md sm:right-0">
                  {successPercentage.toFixed(1)}%
                </div>

                <div className="absolute bottom-5 left-1 z-10 rounded-full border border-red-100 bg-white px-3 py-1.5 text-xs font-bold text-red-600 shadow-md sm:left-0">
                  {failedPercentage.toFixed(1)}%
                </div>

                <div className="absolute bottom-5 right-1 z-10 rounded-full border border-amber-100 bg-white px-3 py-1.5 text-xs font-bold text-amber-600 shadow-md sm:right-0">
                  {pendingPercentage.toFixed(1)}%
                </div>
              </>
            )}

            {/* Donut */}
            <div
              className="relative flex h-[260px] w-[260px] items-center justify-center rounded-full p-[20px] shadow-lg transition-transform duration-300 hover:scale-[1.04]"
              style={donutStyle}
            >
              {/* Inner Circle */}
              <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-white shadow-inner">

                <span className="mb-1 text-lg text-indigo-500">
                  ◈
                </span>

                <h2 className="text-5xl font-extrabold tracking-tight text-slate-900">
                  {formatNumber(total)}
                </h2>

                <p className="mt-2 text-sm font-semibold text-slate-500">
                  Total Transactions
                </p>

                <div className="mt-3 h-1 w-12 rounded-full bg-indigo-100" />
              </div>
            </div>
          </div>

          {/* Status Legend Cards */}
          <div className="mt-5 grid w-full grid-cols-3 gap-3">
            {statuses.map((status) => (
              <div
                key={status.label}
                className="rounded-xl border border-slate-100 bg-white p-3 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mb-2 flex items-center justify-center gap-1.5">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: status.color }}
                  />

                  <span className="text-xs font-medium text-slate-500">
                    {status.label}
                  </span>
                </div>

                <p className={`text-xl font-extrabold ${status.textColor}`}>
                  {formatNumber(status.value)}
                </p>

                <p className="mt-1 text-[11px] font-medium text-slate-400">
                  {status.percentage.toFixed(1)}%
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Status Details */}
        <div className="flex flex-col justify-center gap-4">

          {statuses.map((status) => (
            <div
              key={status.label}
              className={`rounded-2xl border ${status.borderColor} ${status.lightColor} p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:p-6`}
            >
              {/* Status Header */}
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ${status.textColor}`}
                  >
                    <span className="text-xl font-bold">
                      {status.icon}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <p className="text-base font-bold text-slate-800">
                      {status.label}
                    </p>

                    <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                      {status.description}
                    </p>
                  </div>
                </div>

                {/* Count & Percentage */}
                <div className="shrink-0 text-right">
                  <h3 className="text-2xl font-extrabold tracking-tight text-slate-900">
                    {formatNumber(status.value)}
                  </h3>

                  <span className={`text-sm font-bold ${status.textColor}`}>
                    {status.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-3 w-full overflow-hidden rounded-full bg-white/90 shadow-inner">
                <div
                  className={`h-full rounded-full ${status.barColor} transition-all duration-1000 ease-out`}
                  style={{ width: `${status.percentage}%` }}
                />
              </div>
            </div>
          ))}

          {/* Total Summary */}
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm transition-all duration-200 hover:shadow-md">
            <div>
              <p className="text-sm font-semibold text-slate-500">
                Total Transactions
              </p>
              <p className="mt-1 text-xs text-slate-400">
                All transaction statuses combined
              </p>
            </div>

            <span className="text-2xl font-extrabold tracking-tight text-slate-900">
              {formatNumber(total)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TransactionStatus;
  