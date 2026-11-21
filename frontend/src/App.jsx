
import "./App.css";
import { useEffect, useMemo, useState } from "react";
import API from "./api";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

function App() {
  // =========================================
  // AUTH STATES
  // =========================================

  const [token, setToken] = useState(localStorage.getItem("token"));

  const [partner, setPartner] = useState(
    JSON.parse(localStorage.getItem("partner") || "null")
  );

  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // =========================================
  // DATA STATES
  // =========================================

  const [transactions, setTransactions] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);

  // =========================================
  // NAVIGATION
  // AI SUPPORT WORKER DEFAULT PAGE
  // =========================================

  const [activePage, setActivePage] = useState("AI Support Worker");
  const [period, setPeriod] = useState("MONTHLY");

  // =========================================
  // AI CHAT STATES
  // =========================================

  const [chatLoading, setChatLoading] = useState(false);

  const [chatMessages, setChatMessages] = useState([
    {
      sender: "assistant",
      text: "Hello! 👋 Welcome to Eko Partner Support. How can I help you today? You can ask me about transactions, payments, refunds, or support requests.",
    },
  ]);

  // =========================================
  // LOGIN
  // =========================================

  const handleLogin = async ({ email, password }) => {
    setLoginError("");
    setLoginLoading(true);

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      const receivedToken = res.data.token;
      const partnerData = res.data.partner;

      localStorage.setItem("token", receivedToken);
      localStorage.setItem("partner", JSON.stringify(partnerData));

      setToken(receivedToken);
      setPartner(partnerData);

      // Open AI Support Worker after login
      setActivePage("AI Support Worker");

      // Reset chat for new login
      setChatMessages([
        {
          sender: "assistant",
          text: `Hello${partnerData?.name ? ` ${partnerData.name}` : ""}! 👋

Welcome to Eko Partner AI Support Worker.

I can help you with:

• Transaction analysis
• Failed and pending payments
• Financial summaries
• Commission information
• Support tickets
• Payment-related queries

How can I help you today?`,
        },
      ]);
    } catch (error) {
      setLoginError(
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoginLoading(false);
    }
  };

  // =========================================
  // LOGOUT
  // =========================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("partner");

    setToken(null);
    setPartner(null);

    setTransactions([]);
    setTickets([]);

    setChatLoading(false);
    setChatMessages([]);

    setActivePage("AI Support Worker");
    setPeriod("MONTHLY");

    setLoginError("");
  };

  // =========================================
  // NEW CONVERSATION
  // =========================================

  const handleNewConversation = () => {
    setChatMessages([
      {
        sender: "assistant",
        text: `Hello${partner?.name ? ` ${partner.name}` : ""}! 👋

Welcome to Eko Partner AI Support Worker.

I can help you with transactions, payments, refunds, commission, financial summaries, and support tickets.

What would you like to know today?`,
      },
    ]);

    setChatLoading(false);
    setActivePage("AI Support Worker");
  };

  // =========================================
  // FETCH TRANSACTIONS & SUPPORT TICKETS
  // =========================================

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    const fetchData = async () => {
      setDataLoading(true);

      try {
        const [transactionResult, ticketResult] = await Promise.allSettled([
          API.get("/transactions"),
          API.get("/tickets"),
        ]);

        if (cancelled) return;

        // -------------------------------
        // TRANSACTIONS
        // -------------------------------

        if (transactionResult.status === "fulfilled") {
          setTransactions(transactionResult.value.data.data || []);
        } else {
          console.error(
            "Transaction fetch error:",
            transactionResult.reason
          );

          if (transactionResult.reason?.response?.status === 401) {
            handleLogout();
            return;
          }
        }

        // -------------------------------
        // SUPPORT TICKETS
        // -------------------------------

        if (ticketResult.status === "fulfilled") {
          setTickets(ticketResult.value.data.tickets || []);
        } else {
          console.error("Ticket fetch error:", ticketResult.reason);

          if (ticketResult.reason?.response?.status === 401) {
            handleLogout();
            return;
          }
        }
      } catch (error) {
        console.error("Data loading error:", error);
      } finally {
        if (!cancelled) {
          setDataLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [token]);

  // =========================================
  // PERIOD FILTER
  // =========================================

  const filteredTransactions = useMemo(() => {
    const now = new Date();

    return transactions.filter((txn) => {
      const txnDate = new Date(txn.createdAt);

      if (isNaN(txnDate.getTime())) return false;

      // DAILY
      if (period === "DAILY") {
        return txnDate.toDateString() === now.toDateString();
      }

      // WEEKLY
      if (period === "WEEKLY") {
        const startOfWeek = new Date(now);

        startOfWeek.setDate(now.getDate() - 6);
        startOfWeek.setHours(0, 0, 0, 0);

        return txnDate >= startOfWeek && txnDate <= now;
      }

      // MONTHLY
      if (period === "MONTHLY") {
        return (
          txnDate.getMonth() === now.getMonth() &&
          txnDate.getFullYear() === now.getFullYear()
        );
      }

      // YEARLY
      if (period === "YEARLY") {
        return txnDate.getFullYear() === now.getFullYear();
      }

      return true;
    });
  }, [transactions, period]);

  // =========================================
  // ANALYTICS CALCULATIONS
  // =========================================

  const analytics = useMemo(() => {
    const successfulTransactions = filteredTransactions.filter(
      (txn) => txn.status === "SUCCESS"
    );

    const failedTransactions = filteredTransactions.filter(
      (txn) => txn.status === "FAILED"
    );

    const pendingTransactions = filteredTransactions.filter(
      (txn) => txn.status === "PENDING"
    );

    // TOTAL VOLUME
    const totalVolume = filteredTransactions.reduce(
      (sum, txn) => sum + (Number(txn.amount) || 0),
      0
    );

    // SUCCESS VOLUME
    const successfulVolume = successfulTransactions.reduce(
      (sum, txn) => sum + (Number(txn.amount) || 0),
      0
    );

    // FAILED VOLUME
    const failedVolume = failedTransactions.reduce(
      (sum, txn) => sum + (Number(txn.amount) || 0),
      0
    );

    // PENDING VOLUME
    const pendingVolume = pendingTransactions.reduce(
      (sum, txn) => sum + (Number(txn.amount) || 0),
      0
    );

    // COMMISSION
    const totalCommission = successfulTransactions.reduce(
      (sum, txn) => sum + (Number(txn.commission) || 0),
      0
    );

    // SUCCESS RATE
    const successRate =
      filteredTransactions.length > 0
        ? (
            (successfulTransactions.length / filteredTransactions.length) *
            100
          ).toFixed(1)
        : "0.0";

    return {
      totalTransactions: filteredTransactions.length,

      totalVolume,
      successfulVolume,
      failedVolume,
      pendingVolume,

      totalCommission,
      successRate,

      failedTransactions: failedTransactions.length,
      pendingTransactions: pendingTransactions.length,

      success: successfulTransactions.length,
      failed: failedTransactions.length,
      pending: pendingTransactions.length,
    };
  }, [filteredTransactions]);

  // =========================================
  // SERVICE ANALYTICS
  // =========================================

  const serviceData = useMemo(() => {
    const services = [
      "MONEY_TRANSFER",
      "UPI_PAYMENT",
      "CASH_WITHDRAWAL",
      "CASH_DEPOSIT",
      "BILL_PAYMENT",
      "MOBILE_RECHARGE",
      "DTH_RECHARGE",
    ];

    return services.map((serviceType) => {
      const serviceTransactions = filteredTransactions.filter(
        (txn) => txn.serviceType === serviceType
      );

      const amount = serviceTransactions.reduce(
        (sum, txn) => sum + (Number(txn.amount) || 0),
        0
      );

      const successCount = serviceTransactions.filter(
        (txn) => txn.status === "SUCCESS"
      ).length;

      const failedCount = serviceTransactions.filter(
        (txn) => txn.status === "FAILED"
      ).length;

      const pendingCount = serviceTransactions.filter(
        (txn) => txn.status === "PENDING"
      ).length;

      return {
        serviceType,
        count: serviceTransactions.length,
        amount,
        success: successCount,
        failed: failedCount,
        pending: pendingCount,
      };
    });
  }, [filteredTransactions]);

  // =========================================
  // TRANSACTION TREND DATA
  // =========================================

  const trendData = useMemo(() => {
    const now = new Date();
    const result = [];

    // DAILY - HOURLY DATA
    if (period === "DAILY") {
      for (let i = 0; i < 24; i++) {
        result.push({
          label: `${i}:00`,
          amount: 0,
          count: 0,
        });
      }

      filteredTransactions.forEach((txn) => {
        const date = new Date(txn.createdAt);
        const hour = date.getHours();

        if (result[hour]) {
          result[hour].amount += Number(txn.amount) || 0;
          result[hour].count += 1;
        }
      });

      return result;
    }

    // WEEKLY - LAST 7 DAYS
    if (period === "WEEKLY") {
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(now.getDate() - i);

        result.push({
          label: date.toLocaleDateString("en-IN", {
            weekday: "short",
          }),
          dateKey: date.toDateString(),
          amount: 0,
          count: 0,
        });
      }

      filteredTransactions.forEach((txn) => {
        const date = new Date(txn.createdAt);

        const item = result.find(
          (day) => day.dateKey === date.toDateString()
        );

        if (item) {
          item.amount += Number(txn.amount) || 0;
          item.count += 1;
        }
      });

      return result;
    }

    // MONTHLY - LAST 30 DAYS
    if (period === "MONTHLY") {
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(now.getDate() - i);

        result.push({
          label: date.getDate().toString(),
          dateKey: date.toDateString(),
          amount: 0,
          count: 0,
        });
      }

      filteredTransactions.forEach((txn) => {
        const date = new Date(txn.createdAt);

        const item = result.find(
          (day) => day.dateKey === date.toDateString()
        );

        if (item) {
          item.amount += Number(txn.amount) || 0;
          item.count += 1;
        }
      });

      return result;
    }

    // YEARLY - 12 MONTHS
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);

      result.push({
        label: date.toLocaleDateString("en-IN", {
          month: "short",
        }),
        month: date.getMonth(),
        year: date.getFullYear(),
        amount: 0,
        count: 0,
      });
    }

    filteredTransactions.forEach((txn) => {
      const date = new Date(txn.createdAt);

      const item = result.find(
        (month) =>
          month.month === date.getMonth() &&
          month.year === date.getFullYear()
      );

      if (item) {
        item.amount += Number(txn.amount) || 0;
        item.count += 1;
      }
    });

    return result;
  }, [filteredTransactions, period]);

  // =========================================
  // RECENT TRANSACTIONS
  // =========================================

  const recentTransactions = useMemo(() => {
    return [...filteredTransactions]
      .sort(
        (a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)
      )
      .slice(0, 5);
  }, [filteredTransactions]);

  // =========================================
  // AI SUPPORT WORKER
  // =========================================

  const handleSendMessage = async (message) => {
    if (!message?.trim() || chatLoading) return;

    const userMessage = {
      sender: "user",
      text: message.trim(),
    };

    // Add user message
    setChatMessages((prev) => [...prev, userMessage]);

    setChatLoading(true);

    try {
      const res = await API.post("/worker/chat", {
        message: message.trim(),
      });

      const reply =
        res.data?.reply ||
        res.data?.response ||
        res.data?.message ||
        "I received your message, but couldn't generate a response.";

      // Add AI response
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "assistant",
          text: reply,
        },
      ]);
    } catch (error) {
      console.error("AI Worker Error:", error);

      const errorMessage =
        error.response?.data?.message ||
        "Unable to connect to AI Support Worker. Please try again.";

      setChatMessages((prev) => [
        ...prev,
        {
          sender: "assistant",
          text: errorMessage,
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // =========================================
  // OPEN AI SUPPORT WORKER
  // =========================================

  const openChat = () => {
    setActivePage("AI Support Worker");
  };

  // =========================================
  // LOGIN PAGE
  // =========================================

  if (!token) {
    return (
      <Login
        onLogin={handleLogin}
        loading={loginLoading}
        error={loginError}
      />
    );
  }

  // =========================================
  // MAIN APPLICATION
  // =========================================

  return (
    <Dashboard
      partner={partner}
      activePage={activePage}
      setActivePage={setActivePage}
      handleLogout={handleLogout}
      openChat={openChat}

      // Analytics
      period={period}
      setPeriod={setPeriod}
      stats={analytics}
      trendData={trendData}
      statusData={analytics}
      serviceData={serviceData}

      // Transactions
      transactions={recentTransactions}
      allTransactions={transactions}
      filteredTransactions={filteredTransactions}
      recentTransactions={recentTransactions}

      // Tickets
      tickets={tickets}

      // Loading
      dataLoading={dataLoading}

      // AI Worker
      messages={chatMessages}
      onSendMessage={handleSendMessage}
      chatLoading={chatLoading}
      onNewConversation={handleNewConversation}
    />
  );
}

export default App;
  