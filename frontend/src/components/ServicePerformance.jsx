import React from "react";

function ServicePerformance({ serviceData = [] }) {
  const maxCount = Math.max(
    ...serviceData.map((service) => Number(service.count) || 0),
    1
  );

  const serviceIcons = {
    MONEY_TRANSFER: "💸",
    UPI_PAYMENT: "📱",
    CASH_WITHDRAWAL: "🏧",
    CASH_DEPOSIT: "💰",
    BILL_PAYMENT: "🧾",
    MOBILE_RECHARGE: "📲",
    DTH_RECHARGE: "📺",
  };

  const serviceNames = {
    MONEY_TRANSFER: "Money Transfer",
    UPI_PAYMENT: "UPI Payment",
    CASH_WITHDRAWAL: "Cash Withdrawal",
    CASH_DEPOSIT: "Cash Deposit",
    BILL_PAYMENT: "Bill Payment",
    MOBILE_RECHARGE: "Mobile Recharge",
    DTH_RECHARGE: "DTH Recharge",
  };

  const formatNumber = (value) =>
    Number(value || 0).toLocaleString("en-IN");

  return (
    <section className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold tracking-tight text-slate-800">
            Service Performance
          </h3>
          <p className="mt-0.5 text-xs text-slate-500">
            Performance across business services
          </p>
        </div>

        {serviceData.length > 0 && (
          <span className="shrink-0 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600">
            {serviceData.length} Services
          </span>
        )}
      </div>

      {/* Services Grid */}
      {serviceData.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 2xl:grid-cols-2">
          {serviceData.map((service) => {
            const count = Number(service.count) || 0;
            const amount = Number(service.amount) || 0;
            const percentage = Math.min((count / maxCount) * 100, 100);

            const serviceName =
              serviceNames[service.serviceType] || service.serviceType;

            return (
              <div
                key={service.serviceType}
                className="flex min-w-0 flex-col rounded-xl border border-slate-200 bg-slate-50/70 p-3 transition-all duration-200 hover:border-blue-200 hover:bg-white hover:shadow-sm"
              >
                {/* Service Header */}
                <div className="flex min-w-0 items-center gap-2.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-white text-xl shadow-sm">
                    {serviceIcons[service.serviceType] || "📊"}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4
                      className="break-words text-sm font-semibold leading-5 text-slate-800"
                      title={serviceName}
                    >
                      {serviceName}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Service overview
                    </p>
                  </div>
                </div>

                {/* Transaction Count */}
                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                      {formatNumber(count)}
                    </h2>
                    <p className="text-xs text-slate-500">
                      Total Transactions
                    </p>
                  </div>

                  <span className="rounded-lg bg-blue-50 px-2 py-1 text-xs font-bold text-blue-600">
                    {percentage.toFixed(0)}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>

                {/* Transaction Volume */}
                <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-200 pt-3">
                  <span className="text-xs text-slate-500">
                    Transaction Volume
                  </span>

                  <strong
                    className="break-words text-right text-sm font-bold text-slate-800"
                    title={`₹${formatNumber(amount)}`}
                  >
                    ₹{formatNumber(amount)}
                  </strong>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
            📊
          </div>

          <h4 className="text-sm font-semibold text-slate-700">
            No Service Data
          </h4>

          <p className="mt-1 max-w-xs text-xs leading-5 text-slate-500">
            No service performance data is available yet.
          </p>
        </div>
      )}
    </section>
  );
}

export default ServicePerformance;