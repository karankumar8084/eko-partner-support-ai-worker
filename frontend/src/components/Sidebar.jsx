
import React from "react";

function Sidebar({
  partner,
  activePage,
  setActivePage,
  openChat,
  handleLogout,
}) {
  const aiItem = {
    label: "AI Support Worker",
    icon: "🤖",
  };

  const workspaceItems = [
    { label: "Dashboard", icon: "📊" },
    { label: "Transactions", icon: "💳" },
    { label: "Analytics", icon: "📈" },
    { label: "Support Tickets", icon: "🎫" },
  ];

  const navigate = (page) => {
    setActivePage?.(page);

    // AI Worker will open as a dedicated page
    if (page === "AI Support Worker") {
      // Close floating chat if it was previously opened
      // The AI page will be the primary workspace
    }
  };

  const renderMenuItems = (items) =>
    items.map((item) => {
      const isActive = activePage === item.label;

      return (
        <button
          key={item.label}
          type="button"
          onClick={() => navigate(item.label)}
          className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 ${
            isActive
              ? "bg-blue-600 text-white shadow-md shadow-blue-900/20"
              : "text-slate-300 hover:bg-[#263650] hover:text-white"
          }`}
        >
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-base transition ${
              isActive
                ? "bg-white/15"
                : "bg-[#202d43] group-hover:bg-[#30415d]"
            }`}
          >
            {item.icon}
          </span>

          <span className="flex-1 truncate text-left font-medium">
            {item.label}
          </span>

          {isActive && (
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
          )}
        </button>
      );
    });

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex h-screen w-[260px] min-w-[260px] flex-col border-r border-slate-700/60 bg-[#151f32] text-white">

      {/* BRAND */}
      <div className="shrink-0 border-b border-slate-700/60 px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 text-lg font-extrabold shadow-lg shadow-emerald-900/20">
            E
            <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-[#151f32] bg-emerald-400" />
          </div>

          <div>
            <h2 className="text-lg font-bold leading-tight tracking-wide">
              Eko
            </h2>
            <p className="text-[10px] tracking-[0.12em] text-slate-400">
              PARTNER SUPPORT
            </p>
          </div>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-5">

        {/* AI SECTION */}
        <div className="mb-6">
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
            AI Workspace
          </p>

          <button
            type="button"
            onClick={() => navigate(aiItem.label)}
            className={`group relative flex w-full items-center gap-3 overflow-hidden rounded-xl border p-3 text-left transition-all duration-200 ${
              activePage === aiItem.label
                ? "border-blue-400/30 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-900/20"
                : "border-indigo-400/10 bg-gradient-to-r from-[#202d48] to-[#1d2940] text-slate-200 hover:border-indigo-400/30 hover:from-[#293a5c] hover:to-[#25334e]"
            }`}
          >
            {/* AI Icon */}
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl ${
                activePage === aiItem.label
                  ? "bg-white/15"
                  : "bg-indigo-500/15"
              }`}
            >
              🤖
            </span>

            {/* AI Label */}
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-bold">
                AI Support Worker
              </span>

              <span
                className={`mt-0.5 block text-[10px] ${
                  activePage === aiItem.label
                    ? "text-blue-100"
                    : "text-indigo-300"
                }`}
              >
                Intelligent Assistant
              </span>
            </span>

            {/* Status */}
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </span>
          </button>
        </div>

        {/* WORKSPACE SECTION */}
        <div>
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
            Financial Workspace
          </p>

          <div className="flex flex-col gap-1">
            {renderMenuItems(workspaceItems)}
          </div>
        </div>
      </nav>

      {/* USER PROFILE - FIXED BOTTOM */}
      <div className="shrink-0 border-t border-slate-700/60 bg-[#151f32] p-3">

        {/* Profile Card */}
        <div className="flex items-center gap-3 rounded-xl bg-[#202d43] p-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold shadow-sm">
            {partner?.name?.charAt(0)?.toUpperCase() || "P"}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-white">
              {partner?.name || "Partner"}
            </p>

            <p className="truncate text-[10px] text-slate-400">
              {partner?.businessName || "Partner Portal"}
            </p>
          </div>

          <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-400" />
        </div>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-300 transition hover:bg-red-500/10 hover:text-red-400"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#202d43]">
            ↪
          </span>

          <span className="font-medium">Logout</span>
        </button>

        {/* Version */}
        <p className="pt-3 text-center text-[9px] tracking-wide text-slate-500">
          EKO PARTNER PORTAL · VERSION 1.0
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;
  