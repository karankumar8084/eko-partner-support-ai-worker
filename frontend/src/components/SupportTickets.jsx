import React from "react";

function SupportTickets({ tickets = [] }) {
  const formatDate = (date) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "N/A";

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatus = (status) => {
    const normalized = (status || "OPEN").toUpperCase();

    const statusStyles = {
      OPEN: "bg-blue-50 text-blue-700 ring-blue-200",
      PENDING: "bg-amber-50 text-amber-700 ring-amber-200",
      IN_PROGRESS: "bg-violet-50 text-violet-700 ring-violet-200",
      RESOLVED: "bg-emerald-50 text-emerald-700 ring-emerald-200",
      CLOSED: "bg-slate-100 text-slate-600 ring-slate-200",
    };

    const statusIcons = {
      OPEN: "●",
      PENDING: "◷",
      IN_PROGRESS: "↻",
      RESOLVED: "✓",
      CLOSED: "✓",
    };

    return {
      label: normalized.replace(/_/g, " "),
      style: statusStyles[normalized] || statusStyles.OPEN,
      icon: statusIcons[normalized] || "●",
    };
  };

  const getPriority = (priority) => {
    const normalized = (priority || "NORMAL").toUpperCase();

    const styles = {
      HIGH: "text-red-600 bg-red-50",
      URGENT: "text-red-700 bg-red-100",
      MEDIUM: "text-amber-600 bg-amber-50",
      NORMAL: "text-slate-500 bg-slate-100",
      LOW: "text-emerald-600 bg-emerald-50",
    };

    return {
      label: normalized,
      style: styles[normalized] || styles.NORMAL,
    };
  };

  const openCount = tickets.filter((ticket) =>
    ["OPEN"].includes((ticket.status || "OPEN").toUpperCase())
  ).length;

  const pendingCount = tickets.filter((ticket) =>
    ["PENDING", "IN_PROGRESS"].includes(
      (ticket.status || "").toUpperCase()
    )
  ).length;

  const resolvedCount = tickets.filter((ticket) =>
    ["RESOLVED", "CLOSED"].includes(
      (ticket.status || "").toUpperCase()
    )
  ).length;

  return (
    <div className="space-y-5">

      {/* =================================
          HEADER
      ================================= */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl">
              🎫
            </div>

            <div>
              <h2 className="text-lg font-bold tracking-tight text-slate-800">
                Support Tickets
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Track your support requests and complaints
              </p>
            </div>
          </div>

          {/* Total Count */}
          <div className="flex items-center gap-2 self-start rounded-xl border border-blue-100 bg-blue-50 px-4 py-2.5 sm:self-center">
            <span className="h-2 w-2 rounded-full bg-blue-500" />

            <span className="text-sm font-semibold text-blue-700">
              {tickets.length} Total Tickets
            </span>
          </div>
        </div>
      </section>

      {/* =================================
          SUMMARY CARDS
      ================================= */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* Total */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">
              Total Tickets
            </p>

            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              🎫
            </span>
          </div>

          <h3 className="mt-3 text-2xl font-bold text-slate-800">
            {tickets.length}
          </h3>

          <p className="mt-1 text-xs text-slate-400">
            All support requests
          </p>
        </div>

        {/* Open */}
        <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">
              Open Tickets
            </p>

            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              ●
            </span>
          </div>

          <h3 className="mt-3 text-2xl font-bold text-blue-600">
            {openCount}
          </h3>

          <p className="mt-1 text-xs text-slate-400">
            Awaiting assistance
          </p>
        </div>

        {/* Pending */}
        <div className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">
              In Progress
            </p>

            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              ◷
            </span>
          </div>

          <h3 className="mt-3 text-2xl font-bold text-amber-600">
            {pendingCount}
          </h3>

          <p className="mt-1 text-xs text-slate-400">
            Being handled by support
          </p>
        </div>

        {/* Resolved */}
        <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">
              Resolved
            </p>

            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              ✓
            </span>
          </div>

          <h3 className="mt-3 text-2xl font-bold text-emerald-600">
            {resolvedCount}
          </h3>

          <p className="mt-1 text-xs text-slate-400">
            Successfully completed
          </p>
        </div>
      </div>

      {/* =================================
          TICKET LIST
      ================================= */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* List Header */}
        <div className="flex flex-col gap-2 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-semibold text-slate-800">
              All Requests
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Your submitted support requests
            </p>
          </div>

          <span className="text-xs font-medium text-slate-400">
            {tickets.length} records
          </span>
        </div>

        {/* Tickets */}
        <div className="space-y-0 divide-y divide-slate-100">
          {tickets.length > 0 ? (
            tickets.map((ticket, index) => {
              const status = getStatus(ticket.status);
              const priority = getPriority(ticket.priority);

              return (
                <article
                  key={ticket._id || ticket.ticketId || index}
                  className="p-5 transition hover:bg-slate-50/80 sm:p-6"
                >
                  {/* Top Row */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex min-w-0 items-start gap-3">
                      {/* Ticket Icon */}
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-lg">
                        🎫
                      </div>

                      {/* Title and ID */}
                      <div className="min-w-0">
                        <h4 className="break-words text-sm font-semibold text-slate-800">
                          {ticket.subject ||
                            ticket.title ||
                            "Support Request"}
                        </h4>

                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          <span className="font-mono text-[11px] text-slate-400">
                            #{ticket.ticketId || ticket._id || "N/A"}
                          </span>

                          <span className="text-slate-300">•</span>

                          <span className="text-[11px] text-slate-500">
                            {formatDate(ticket.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status + Priority */}
                    <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ring-1 ring-inset ${status.style}`}
                      >
                        <span>{status.icon}</span>
                        {status.label}
                      </span>

                      {ticket.priority && (
                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${priority.style}`}
                        >
                          {priority.label} Priority
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="mt-4 break-words text-sm leading-6 text-slate-600">
                    {ticket.description ||
                      ticket.message ||
                      "No description available."}
                  </p>

                  {/* Bottom Info */}
                  <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <span>📂</span>

                      <span>
                        {ticket.type ||
                          ticket.category ||
                          "General"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <span>📅</span>

                      <span>
                        Created {formatDate(ticket.createdAt)}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-3xl">
                🎫
              </div>

              <h3 className="text-base font-semibold text-slate-800">
                No support tickets yet
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                You haven't submitted any support requests yet. When you create
                one, it will appear here.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer Note */}
      <div className="flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50/70 px-4 py-3">
        <span className="text-sm">ℹ️</span>

        <p className="text-xs leading-5 text-blue-700">
          Need additional assistance? Contact support or use the AI Support Worker
          for instant help.
        </p>
      </div>
    </div>
  );
}

export default SupportTickets;