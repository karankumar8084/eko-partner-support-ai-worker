import React from "react";

function TransactionTrend({ trendData = [] }) {
  const safeData = trendData.map((item) => ({
    label: item.label ?? "",
    count: Number(item.count) || 0,
    success: Number(item.success) || 0,
    failed: Number(item.failed) || 0,
    amount: Number(item.amount) || 0,
  }));

  // =========================
  // Statistics
  // =========================
  const totalTransactions = safeData.reduce(
    (sum, item) => sum + item.count,
    0
  );

  const average = safeData.length
    ? Math.round(totalTransactions / safeData.length)
    : 0;

  const peak = safeData.reduce(
    (max, item) => (item.count > max.count ? item : max),
    { count: 0, label: "-" }
  );

  const maxValue = Math.max(...safeData.map((item) => item.count), 1);

  // =========================
  // Chart Configuration
  // =========================
  const chartWidth = 1000;
  const chartHeight = 220;
  const topPadding = 15;
  const bottomPadding = 10;
  const usableHeight = chartHeight - topPadding - bottomPadding;

  // =========================
  // Chart Points
  // =========================
  const points = safeData.map((item, index) => {
    const x =
      safeData.length === 1
        ? chartWidth / 2
        : (index / (safeData.length - 1)) * chartWidth;

    const y =
      chartHeight -
      bottomPadding -
      (item.count / maxValue) * usableHeight;

    return {
      x,
      y,
      ...item,
    };
  });

  // =========================
  // Smooth Trend Line
  // =========================
  const linePath = points
    .map((point, index) => {
      if (index === 0) {
        return `M ${point.x} ${point.y}`;
      }

      const previous = points[index - 1];
      const midX = (previous.x + point.x) / 2;

      return `C ${midX} ${previous.y}, ${midX} ${point.y}, ${point.x} ${point.y}`;
    })
    .join(" ");

  // =========================
  // Format Number
  // =========================
  const formatNumber = (value) =>
    new Intl.NumberFormat("en-IN").format(value);

  return (
    <section className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-lg font-bold tracking-tight text-slate-800">
              Transaction Trends
            </h3>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              Analytics
            </span>
          </div>

          <p className="mt-1.5 text-sm text-slate-500">
            Monitor transaction activity and performance over time
          </p>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-500">
          <span>◷</span>
          Selected Period
        </div>
      </div>

      {/* KPI Cards */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {/* Total Transactions */}
        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              Total Transactions
            </span>

            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 text-lg text-purple-600">
              ↗
            </span>
          </div>

          <h2 className="mt-3 text-2xl font-bold text-slate-800">
            {formatNumber(totalTransactions)}
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Across selected period
          </p>
        </div>

        {/* Average */}
        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              Average Activity
            </span>

            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-lg text-blue-600">
              ◈
            </span>
          </div>

          <h2 className="mt-3 text-2xl font-bold text-slate-800">
            {formatNumber(average)}
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Transactions per interval
          </p>
        </div>

        {/* Peak */}
        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 sm:col-span-2 xl:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              Peak Activity
            </span>

            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-lg text-emerald-600">
              ⚡
            </span>
          </div>

          <h2 className="mt-3 text-2xl font-bold text-slate-800">
            {formatNumber(peak.count)}
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Highest · {peak.label || "-"}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="mt-7">
        {safeData.length > 0 ? (
          <>
            {/* Legend */}
            <div className="mb-5 flex flex-wrap items-center gap-5">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="h-3 w-3 rounded-sm bg-indigo-500" />
                Transactions
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="h-0.5 w-5 bg-purple-500" />
                Activity Trend
              </div>
            </div>

            {/* Chart Wrapper */}
            <div className="flex h-[280px] w-full min-w-0">
              {/* Y Axis */}
              <div className="flex w-12 shrink-0 flex-col justify-between pb-8 pt-2 text-right text-[11px] text-slate-400">
                {[100, 75, 50, 25, 0].map((percentage) => (
                  <span key={percentage}>
                    {Math.round((maxValue * percentage) / 100)}
                  </span>
                ))}
              </div>

              {/* Plot Area */}
              <div className="relative min-w-0 flex-1">
                {/* Grid Lines */}
                <div className="pointer-events-none absolute inset-x-0 bottom-8 top-2 flex flex-col justify-between">
                  {[0, 25, 50, 75, 100].map((line) => (
                    <div
                      key={line}
                      className="w-full border-t border-dashed border-slate-200"
                    />
                  ))}
                </div>

                {/* Bars */}
                <div className="absolute inset-x-0 bottom-8 top-2 flex items-end justify-around gap-1 sm:gap-3">
                  {safeData.map((item, index) => {
                    const height = (item.count / maxValue) * 100;

                    return (
                      <div
                        key={index}
                        className="group relative flex h-full min-w-0 flex-1 flex-col items-center justify-end"
                      >
                        {/* Tooltip */}
                        <div className="pointer-events-none absolute bottom-full z-20 mb-2 scale-95 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-2 text-xs text-white opacity-0 shadow-lg transition-all group-hover:scale-100 group-hover:opacity-100">
                          <p className="font-semibold">{item.label}</p>
                          <p>{formatNumber(item.count)} transactions</p>
                        </div>

                        {/* Bar */}
                        <div
                          className="relative w-full max-w-[42px] overflow-hidden rounded-t-md bg-indigo-500 transition-all duration-500 hover:bg-indigo-600"
                          style={{
                            height: `${height}%`,
                            minHeight: item.count > 0 ? "4px" : "0px",
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-indigo-600 to-indigo-400 opacity-90" />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Trend Line SVG */}
                <svg
                  className="pointer-events-none absolute inset-x-0 top-2 bottom-8 h-auto w-full overflow-visible"
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient
                      id="trendLineGradient"
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="0"
                    >
                      <stop offset="0%" stopColor="#a78bfa" />
                      <stop offset="50%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#38bdf8" />
                    </linearGradient>
                  </defs>

                  {/* Line */}
                  {linePath && (
                    <path
                      d={linePath}
                      fill="none"
                      stroke="url(#trendLineGradient)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      vectorEffect="non-scaling-stroke"
                    />
                  )}

                  {/* Points */}
                  {points.map((point, index) => (
                    <circle
                      key={index}
                      cx={point.x}
                      cy={point.y}
                      r="6"
                      fill="#ffffff"
                      stroke="#6366f1"
                      strokeWidth="3"
                      vectorEffect="non-scaling-stroke"
                    />
                  ))}
                </svg>

                {/* X Axis Labels */}
                <div className="absolute inset-x-0 bottom-0 flex justify-around gap-1">
                  {safeData.map((item, index) => (
                    <span
                      key={index}
                      className="min-w-0 flex-1 truncate text-center text-[10px] font-medium text-slate-400 sm:text-xs"
                      title={item.label}
                    >
                      {item.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex min-h-[260px] flex-col items-center justify-center rounded-xl bg-slate-50">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-2xl text-indigo-500">
              ▥
            </div>

            <h4 className="mt-4 font-semibold text-slate-700">
              No transaction data
            </h4>

            <p className="mt-1 text-sm text-slate-400">
              Transactions will appear here once data is available.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Data visualization
        </div>

        <span className="text-xs text-slate-400">
          {safeData.length} data points
        </span>
      </div>
    </section>
  );
}

export default TransactionTrend;