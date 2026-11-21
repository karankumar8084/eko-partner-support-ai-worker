import React from "react";

function AnalyticsFilters({ period, setPeriod }) {
  const filters = ["DAILY", "WEEKLY", "MONTHLY", "YEARLY"];

  return (
    <section className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
      {/* Section Information */}
      <div>
        <h3 className="text-lg font-bold tracking-tight text-slate-800">
          Business Analytics
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Analyze your transactions and earnings
        </p>
      </div>

      {/* Period Filters */}
      <div className="flex w-full rounded-xl bg-slate-100 p-1 sm:w-fit">
        {filters.map((item) => {
          const isActive = period === item;

          return (
            <button
              key={item}
              type="button"
              onClick={() => setPeriod(item)}
              className={`flex-1 rounded-lg px-4 py-2.5 text-xs font-semibold transition-all duration-200 sm:flex-none sm:px-5 ${
                isActive
                  ? "bg-white text-blue-600 shadow-sm ring-1 ring-slate-200"
                  : "text-slate-500 hover:bg-white/70 hover:text-slate-700"
              }`}
            >
              {item.charAt(0) + item.slice(1).toLowerCase()}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default AnalyticsFilters;