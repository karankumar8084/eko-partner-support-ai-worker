
import React from "react";

// Components
import Sidebar from "../components/Sidebar";
import AnalyticsFilters from "../components/AnalyticsFilters";
import StatCard from "../components/StatCard";
import TransactionTrend from "../components/TransactionTrend";
import TransactionStatus from "../components/TransactionStatus";
import ServicePerformance from "../components/ServicePerformance";
import RecentTransactions from "../components/RecentTransactions";
import SupportTickets from "../components/SupportTickets";
import AIChat from "../components/AIChat";

function Dashboard({
    partner,
    activePage,
    setActivePage,
    handleLogout,

    // Analytics
    period,
    setPeriod,
    stats,
    trendData,
    statusData,
    serviceData,

    // Transactions
    transactions = [],
    allTransactions = [],
    filteredTransactions = [],

    // Tickets
    tickets = [],

    // Loading
    dataLoading = false,

    // AI Chat
    chatOpen,
    setChatOpen,
    messages = [],
    onSendMessage,
    chatLoading,
}) {
    // =========================================
    // HELPERS
    // =========================================

    const openAIWorker = () => {
        setChatOpen?.(false);
        setActivePage("AI Support Worker");
    };

    const formatCurrency = (value) => {
        return `₹${(Number(value) || 0).toLocaleString("en-IN", {
            maximumFractionDigits: 2,
        })}`;
    };

    const pageDescriptions = {
        Dashboard: "Monitor your partner business at a glance.",
        Transactions: "View and manage all your transaction activity.",
        Analytics: "Analyze transaction performance and business metrics.",
        "Support Tickets": "Manage your support requests and issues.",
        Settings: "Manage your partner account information.",
        "AI Support Worker": "Your intelligent partner business assistant.",
        Notifications: "Stay updated with your latest alerts.",
    };

    // =========================================
    // PAGE HEADER
    // =========================================

    const renderPageHeader = () => (
        <div className="mb-1 text-center">
            <div className="mb-1 flex items-center justify-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-600" />

                <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
                    Eko Partner Portal
        </p>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {activePage === "Dashboard"
                    ? `Welcome back, ${partner?.name || "Partner"} 👋`
                    : activePage}
            </h1>

            <p className="mt-0.5 text-sm text-slate-500">
                {pageDescriptions[activePage] ||
                    "Manage your partner activities from one place."}
            </p>
        </div>
    );

    // =========================================
    // PAGE CONTAINER
    // =========================================

    const pageContainer = (content) => (
        <div className="mx-auto w-full max-w-[1800px] space-y-5 p-5 sm:p-7 lg:p-8">
            {renderPageHeader()}
            {content}
        </div>
    );

    // =========================================
    // DASHBOARD OVERVIEW
    // =========================================

    const renderDashboard = () =>
        pageContainer(
            <>
                {/* Main Statistics */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 2xl:grid-cols-4">
                    <StatCard
                        title="Total Transactions"
                        value={stats?.totalTransactions?.toLocaleString("en-IN") || "0"}
                        icon="↗"
                        iconClass="bg-blue-50 text-blue-600"
                        description="Transactions processed"
                        descriptionClass="text-slate-500"
                    />

                    <StatCard
                        title="Transaction Volume"
                        value={formatCurrency(stats?.totalVolume)}
                        icon="₹"
                        iconClass="bg-emerald-50 text-emerald-600"
                        description="Total transaction value"
                        descriptionClass="text-slate-500"
                    />

                    <StatCard
                        title="Successful Volume"
                        value={formatCurrency(stats?.successfulVolume)}
                        icon="✓"
                        iconClass="bg-green-50 text-green-600"
                        description="Successfully processed"
                        descriptionClass="text-slate-500"
                    />

                    <StatCard
                        title="Total Commission"
                        value={formatCurrency(stats?.totalCommission)}
                        icon="₹"
                        iconClass="bg-violet-50 text-violet-600"
                        description="Your earnings"
                        descriptionClass="text-slate-500"
                    />
                </div>

                {/* Recent Transactions */}
                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                        <div>
                            <h2 className="text-lg font-bold text-slate-800">
                                Recent Transactions
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Your latest transaction activity
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setActivePage("Transactions")}
                            className="w-fit rounded-xl bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-100"
                        >
                            View All Transactions →
                        </button>
                    </div>

                    <TransactionStatus statusData={statusData || {}} />
                </section>

                {/* Quick Actions */}
                <section>
                    <div className="mb-4">
                        <h2 className="text-lg font-bold text-slate-800">
                            Quick Actions
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Access your frequently used tools
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                        {[
                            {
                                title: "View Transactions",
                                description: "Check transaction history",
                                icon: "↗",
                                bg: "bg-blue-50",
                                color: "text-blue-600",
                                hover: "hover:border-blue-200",
                                action: () => setActivePage("Transactions"),
                            },
                            {
                                title: "Support Tickets",
                                description: "View your support requests",
                                icon: "🎫",
                                bg: "bg-violet-50",
                                color: "text-violet-600",
                                hover: "hover:border-violet-200",
                                action: () => setActivePage("Support Tickets"),
                            },
                            {
                                title: "AI Support Worker",
                                description: "Get intelligent AI assistance",
                                icon: "🤖",
                                bg: "bg-emerald-50",
                                color: "text-emerald-600",
                                hover: "hover:border-emerald-200",
                                action: openAIWorker,
                            },
                        ].map((item) => (
                            <button
                                key={item.title}
                                type="button"
                                onClick={item.action}
                                className={`group flex min-w-0 items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md ${item.hover}`}
                            >
                                <span
                                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl ${item.bg} ${item.color}`}
                                >
                                    {item.icon}
                                </span>

                                <span className="min-w-0 flex-1">
                                    <strong className="block text-sm font-semibold text-slate-800">
                                        {item.title}
                                    </strong>

                                    <small className="mt-1 block text-xs text-slate-500">
                                        {item.description}
                                    </small>
                                </span>

                                <span className="text-slate-400 transition group-hover:translate-x-1">
                                    →
                                </span>
                            </button>
                        ))}
                    </div>
                </section>
            </>
        );

    // =========================================
    // TRANSACTIONS PAGE
    // =========================================

    const renderTransactions = () =>
        pageContainer(
            <>
                {/* Transaction Summary */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                    {[
                        {
                            title: "Total Transactions",
                            value: allTransactions.length.toLocaleString("en-IN"),
                            color: "text-slate-800",
                            bg: "bg-white",
                        },
                        {
                            title: "Filtered Transactions",
                            value: filteredTransactions.length.toLocaleString("en-IN"),
                            color: "text-blue-600",
                            bg: "bg-white",
                        },
                        {
                            title: "Successful",
                            value: allTransactions.filter((t) => t.status === "SUCCESS").length,
                            color: "text-green-700",
                            bg: "bg-green-50",
                        },
                        {
                            title: "Failed",
                            value: allTransactions.filter((t) => t.status === "FAILED").length,
                            color: "text-red-700",
                            bg: "bg-red-50",
                        },
                    ].map((item) => (
                        <div
                            key={item.title}
                            className={`rounded-2xl border border-slate-200 p-5 shadow-sm ${item.bg}`}
                        >
                            <p className="text-sm text-slate-500">{item.title}</p>

                            <p className={`mt-2 text-2xl font-bold ${item.color}`}>
                                {item.value}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Transaction History */}
                <div className="overflow-x-auto">
                    <RecentTransactions transactions={allTransactions} />
                </div>
            </>
        );

    // =========================================
    // ANALYTICS PAGE
    // =========================================

    const renderAnalytics = () =>
        pageContainer(
            <>
                <AnalyticsFilters period={period} setPeriod={setPeriod} />

                {/* Analytics KPIs */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 2xl:grid-cols-4">
                    <StatCard
                        title="Total Transactions"
                        value={stats?.totalTransactions?.toLocaleString("en-IN") || "0"}
                        icon="↗"
                        iconClass="bg-blue-50 text-blue-600"
                        description="Transactions processed"
                        descriptionClass="text-slate-500"
                    />

                    <StatCard
                        title="Transaction Volume"
                        value={formatCurrency(stats?.totalVolume)}
                        icon="₹"
                        iconClass="bg-emerald-50 text-emerald-600"
                        description="Total processed value"
                        descriptionClass="text-slate-500"
                    />

                    <StatCard
                        title="Successful Volume"
                        value={formatCurrency(stats?.successfulVolume)}
                        icon="✓"
                        iconClass="bg-green-50 text-green-600"
                        description="Successfully processed"
                        descriptionClass="text-slate-500"
                    />

                    <StatCard
                        title="Total Commission"
                        value={formatCurrency(stats?.totalCommission)}
                        icon="₹"
                        iconClass="bg-violet-50 text-violet-600"
                        description="Partner earnings"
                        descriptionClass="text-slate-500"
                    />
                </div>

                {/* Analytics Charts */}
                <div className="grid grid-cols-1 gap-5">
                    <TransactionTrend trendData={trendData || []} />

                    <TransactionStatus statusData={statusData || {}} />

                    <ServicePerformance serviceData={serviceData || []} />
                </div>
            </>
        );
       // =========================================
    // SUPPORT TICKETS PAGE
    // =========================================

    const renderTickets = () =>
        pageContainer(
            <>
                {/* Ticket Summary */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">Total Tickets</p>

                        <p className="mt-2 text-2xl font-bold text-slate-800">
                            {tickets.length}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">Open Tickets</p>

                        <p className="mt-2 text-2xl font-bold text-amber-600">
                            {
                                tickets.filter(
                                    (ticket) =>
                                        ticket.status === "OPEN" ||
                                        ticket.status === "PENDING"
                                ).length
                            }
                        </p>
                    </div>

                    <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">Resolved Tickets</p>

                        <p className="mt-2 text-2xl font-bold text-green-600">
                            {tickets.filter((ticket) => ticket.status === "RESOLVED").length}
                        </p>
                    </div>
                </div>

                <SupportTickets tickets={tickets} />
            </>
        );

    // =========================================
    // SETTINGS PAGE
    // =========================================

    const renderSettings = () =>
        pageContainer(
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-slate-800">
                        Partner Profile
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Your account information
                    </p>
                </div>

                {/* Partner Profile */}
                <div className="mb-6 flex flex-wrap items-center gap-4 rounded-xl bg-slate-50 p-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-700">
                        {partner?.name?.charAt(0)?.toUpperCase() || "P"}
                    </div>

                    <div className="min-w-0">
                        <h3 className="font-semibold text-slate-800">
                            {partner?.name || "Partner"}
                        </h3>

                        <p className="break-all text-sm text-slate-500">
                            {partner?.email || "Partner Account"}
                        </p>
                    </div>
                </div>

                {/* Account Details */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {[
                        {
                            title: "Partner ID",
                            value: partner?.partnerId || "N/A",
                        },
                        {
                            title: "Account Role",
                            value: partner?.role || "PARTNER",
                        },
                        {
                            title: "Platform",
                            value: "Eko Partner Support",
                            full: true,
                        },
                    ].map((item) => (
                        <div
                            key={item.title}
                            className={`rounded-xl border border-slate-200 p-4 ${
                                item.full ? "sm:col-span-2" : ""
                            }`}
                        >
                            <p className="text-xs font-medium text-slate-500">
                                {item.title}
                            </p>

                            <p className="mt-2 break-all font-semibold text-slate-800">
                                {item.value}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        );

    // =========================================
    // NOTIFICATIONS PAGE
    // =========================================

    const renderNotifications = () =>
        pageContainer(
            <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
                    🔔
                </div>

                <h2 className="text-lg font-bold text-slate-800">
                    No new notifications
                </h2>

                <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                    Your notifications and important updates will appear here.
                </p>
            </div>
        );

    // =========================================
    // AI SUPPORT WORKER - FULL PAGE
    // =========================================

    const renderAIWorker = () => (
        <div className="flex h-full min-h-[calc(100vh-0px)] flex-col bg-slate-50">
            <AIChat
                partner={partner}
                messages={messages}
                loading={chatLoading}
                onSendMessage={onSendMessage}
                onClose={() => {
                    // New Conversation
                    setChatOpen?.(false);
                }}
            />
        </div>
    );

    // =========================================
    // PAGE ROUTER
    // =========================================

    const renderActivePage = () => {
        switch (activePage) {
            case "AI Support Worker":
                return renderAIWorker();

            case "Dashboard":
                return renderDashboard();

            case "Transactions":
                return renderTransactions();

            case "Analytics":
                return renderAnalytics();

            case "Support Tickets":
                return renderTickets();

            case "Settings":
                return renderSettings();

            case "Notifications":
                return renderNotifications();

            default:
                return renderAIWorker();
        }
    };

    // =========================================
    // MAIN LAYOUT
    // =========================================

    return (
        <div className="min-h-screen w-full overflow-hidden bg-slate-50">
            {/* Fixed Sidebar */}
            <Sidebar
                partner={partner}
                activePage={activePage}
                setActivePage={setActivePage}
                openChat={openAIWorker}
                handleLogout={handleLogout}
            />

            {/* Main Content */}
            <main className="ml-[260px] h-screen w-[calc(100%-260px)] overflow-x-hidden overflow-y-auto bg-slate-50">
                {dataLoading ? (
                    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

                        <p className="text-sm font-medium text-slate-500">
                            Loading your partner workspace...
                        </p>
                    </div>
                ) : (
                    renderActivePage()
                )}
            </main>
        </div>
    );
}

export default Dashboard;
  