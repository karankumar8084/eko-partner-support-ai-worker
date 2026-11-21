import React from "react";

function Header({ title = "Dashboard", subtitle = "Workspace" }) {
  return (
    <header className="flex w-full items-center justify-between border-b border-slate-200 bg-white px-8 py-5">
      <div className="flex flex-col gap-1">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <span>{subtitle}</span>
          <span className="text-slate-300">/</span>
          <span className="text-blue-600">{title}</span>
        </div>

        {/* Page Title */}
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {title}
        </h1>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3">
        {/* Workspace Status */}
        <div className="hidden items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 sm:flex">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />

          <span className="text-xs font-medium text-emerald-700">
            Workspace Active
          </span>
        </div>
      </div>
    </header>
  );
}

export default Header;