import React from "react";

function StatCard({
  title,
  value,
  icon,
  iconClass = "",
  description,
  descriptionClass = "",
}) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md sm:p-6">
      {/* Top Section */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-slate-500">{title}</p>

          <h2 className="mt-3 break-words text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
            {value}
          </h2>
        </div>

        {/* Icon */}
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl transition-transform duration-200 group-hover:scale-105 ${iconClass}`}
        >
          {icon}
        </div>
      </div>

      {/* Description */}
      {description && (
        <p
          className={`mt-4 text-xs leading-5 text-slate-500 ${descriptionClass}`}
        >
          {description}
        </p>
      )}
    </div>
  );
}

export default StatCard;