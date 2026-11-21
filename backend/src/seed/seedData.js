
require("dotenv").config();

const connectDB = require("../config/database");
const Transaction = require("../models/Transaction");

// Registered Partner ID
const partnerId = "PARTNER-1795077381603";

// Generate random date within the last 365 days
const getRandomDate = (daysAgo) => {
  const date = new Date();

  date.setDate(date.getDate() - daysAgo);

  date.setHours(
    Math.floor(Math.random() * 24),
    Math.floor(Math.random() * 60),
    Math.floor(Math.random() * 60),
    0
  );

  return date;
};

// Transaction data
const transactions = [];

const services = [
  {
    serviceType: "MONEY_TRANSFER",
    paymentMethod: "AEPS",
    descriptions: [
      "Customer money transfer",
      "Domestic money transfer",
      "Money transfer service",
      "Instant money transfer",
      "Bank account transfer",
    ],
    commissionRate: 0.005,
  },
  {
    serviceType: "UPI_PAYMENT",
    paymentMethod: "UPI",
    descriptions: [
      "Merchant UPI payment",
      "Customer digital payment",
      "UPI transaction",
      "Online merchant payment",
      "QR code payment",
    ],
    commissionRate: 0.005,
  },
  {
    serviceType: "CASH_WITHDRAWAL",
    paymentMethod: "AEPS",
    descriptions: [
      "Customer cash withdrawal",
      "Aadhaar banking cash withdrawal",
      "Cash withdrawal service",
      "Retail cash withdrawal",
      "Customer banking withdrawal",
    ],
    commissionRate: 0.005,
  },
  {
    serviceType: "CASH_DEPOSIT",
    paymentMethod: "BANKING",
    descriptions: [
      "Customer cash deposit",
      "Bank account cash deposit",
      "Cash deposit service",
      "Retail cash deposit",
      "Customer bank deposit",
    ],
    commissionRate: 0.005,
  },
  {
    serviceType: "BILL_PAYMENT",
    paymentMethod: "WALLET",
    descriptions: [
      "Electricity bill payment",
      "Water bill payment",
      "Gas bill payment",
      "Utility bill payment",
      "Monthly bill payment",
    ],
    commissionRate: 0.007,
  },
  {
    serviceType: "MOBILE_RECHARGE",
    paymentMethod: "WALLET",
    descriptions: [
      "Mobile prepaid recharge",
      "Mobile recharge service",
      "Customer mobile recharge",
      "Prepaid mobile top-up",
      "Mobile plan recharge",
    ],
    commissionRate: 0.01,
  },
  {
    serviceType: "DTH_RECHARGE",
    paymentMethod: "WALLET",
    descriptions: [
      "DTH subscription recharge",
      "DTH recharge service",
      "Television recharge",
      "DTH monthly plan",
      "Customer DTH top-up",
    ],
    commissionRate: 0.01,
  },
];

const billTypes = ["ELECTRICITY", "WATER", "GAS"];

const mobileOperators = ["Jio", "Airtel", "Vi", "BSNL"];

const dthOperators = [
  "Tata Play",
  "Dish TV",
  "Airtel Digital TV",
  "Sun Direct",
];

const failureReasons = [
  "Bank server unavailable",
  "Insufficient balance",
  "Transaction declined",
  "Service temporarily unavailable",
  "Network timeout",
  "Bank connection failed",
  "Transaction limit exceeded",
  "Technical error",
];

let transactionCounter = 1001;

// ==========================================
// GENERATE 3X TRANSACTION DATA
// 12 Months × 45 = 540 Transactions
// ==========================================

for (let month = 0; month < 12; month++) {
  for (let i = 0; i < 45; i++) {
    const service = services[Math.floor(Math.random() * services.length)];

    // Amount based on service type
    let amount;

    switch (service.serviceType) {
      case "MONEY_TRANSFER":
        amount = Math.floor(Math.random() * 9000) + 1000;
        break;

      case "UPI_PAYMENT":
        amount = Math.floor(Math.random() * 4500) + 100;
        break;

      case "CASH_WITHDRAWAL":
        amount = Math.floor(Math.random() * 5000) + 500;
        break;

      case "CASH_DEPOSIT":
        amount = Math.floor(Math.random() * 10000) + 1000;
        break;

      case "BILL_PAYMENT":
        amount = Math.floor(Math.random() * 4000) + 200;
        break;

      case "MOBILE_RECHARGE":
        amount = [149, 199, 299, 399, 599, 799][
          Math.floor(Math.random() * 6)
        ];
        break;

      case "DTH_RECHARGE":
        amount = [200, 250, 350, 500, 700, 1000][
          Math.floor(Math.random() * 6)
        ];
        break;

      default:
        amount = 1000;
    }

    // Transaction status distribution
    const statusRandom = Math.random();
    let status;

    if (statusRandom < 0.80) {
      status = "SUCCESS";
    } else if (statusRandom < 0.92) {
      status = "FAILED";
    } else {
      status = "PENDING";
    }

    // Commission only on successful transactions
    const commission =
      status === "SUCCESS"
        ? Number((amount * service.commissionRate).toFixed(2))
        : 0;

    // Random transaction date within last 365 days
    const daysAgo = Math.floor(Math.random() * 365);
    const createdAt = getRandomDate(daysAgo);

    // Description
    const description =
      service.descriptions[
        Math.floor(Math.random() * service.descriptions.length)
      ];

    // Main transaction object
    const transaction = {
      transactionId: `EKO-${partnerId}-${transactionCounter++}`,
      partnerId,
      serviceType: service.serviceType,
      amount,
      commission,
      status,
      paymentMethod: service.paymentMethod,
      description,
      customerReference: `CUST${Math.floor(Math.random() * 900000) + 100000}`,
      createdAt,
    };

    // Bill payment metadata
    if (service.serviceType === "BILL_PAYMENT") {
      transaction.billType =
        billTypes[Math.floor(Math.random() * billTypes.length)];
    }

    // Mobile recharge metadata
    if (service.serviceType === "MOBILE_RECHARGE") {
      transaction.operatorName =
        mobileOperators[Math.floor(Math.random() * mobileOperators.length)];
    }

    // DTH recharge metadata
    if (service.serviceType === "DTH_RECHARGE") {
      transaction.operatorName =
        dthOperators[Math.floor(Math.random() * dthOperators.length)];
    }

    // Failed transaction details
    if (status === "FAILED") {
      transaction.failureReason =
        failureReasons[Math.floor(Math.random() * failureReasons.length)];
    }

    transactions.push(transaction);
  }
}

// ==========================================
// DATABASE SEED FUNCTION
// ==========================================

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log("Connected to database...");

    // Delete existing transactions for this partner
    await Transaction.deleteMany({ partnerId });

    console.log("Old partner transactions removed...");

    // Insert 540 new transactions
    await Transaction.insertMany(transactions);

    console.log("\n========================================");
    console.log("   DEMO DATA INSERTED SUCCESSFULLY");
    console.log("========================================");

    console.log(`Partner ID: ${partnerId}`);
    console.log(`Total Transactions: ${transactions.length}`);
    console.log("Services: 7");
    console.log("Data Period: Last 12 Months");

    // ==========================================
    // SERVICE-WISE SUMMARY
    // ==========================================

    console.log("\nSERVICE-WISE TRANSACTION SUMMARY\n");

    for (const service of services) {
      const serviceTransactions = transactions.filter(
        (t) => t.serviceType === service.serviceType
      );

      const count = serviceTransactions.length;

      const totalAmount = serviceTransactions.reduce(
        (sum, t) => sum + t.amount,
        0
      );

      const successCount = serviceTransactions.filter(
        (t) => t.status === "SUCCESS"
      ).length;

      console.log(
        `${service.serviceType.padEnd(22)} | Transactions: ${String(count).padStart(3)} | Success: ${String(successCount).padStart(3)} | Volume: ₹${totalAmount.toLocaleString("en-IN")}`
      );
    }

    // ==========================================
    // STATUS SUMMARY
    // ==========================================

    const successTransactions = transactions.filter(
      (t) => t.status === "SUCCESS"
    );

    const failedTransactions = transactions.filter(
      (t) => t.status === "FAILED"
    );

    const pendingTransactions = transactions.filter(
      (t) => t.status === "PENDING"
    );

    console.log("\nTRANSACTION STATUS SUMMARY");

    console.log(`SUCCESS : ${successTransactions.length}`);
    console.log(`FAILED  : ${failedTransactions.length}`);
    console.log(`PENDING : ${pendingTransactions.length}`);

    // ==========================================
    // FINANCIAL SUMMARY
    // ==========================================

    const totalVolume = transactions.reduce(
      (sum, t) => sum + t.amount,
      0
    );

    const successfulVolume = successTransactions.reduce(
      (sum, t) => sum + t.amount,
      0
    );

    const failedVolume = failedTransactions.reduce(
      (sum, t) => sum + t.amount,
      0
    );

    const pendingVolume = pendingTransactions.reduce(
      (sum, t) => sum + t.amount,
      0
    );

    const totalCommission = transactions.reduce(
      (sum, t) => sum + t.commission,
      0
    );

    console.log("\nFINANCIAL SUMMARY");

    console.log(`Total Volume      : ₹${totalVolume.toLocaleString("en-IN")}`);
    console.log(`Successful Volume  : ₹${successfulVolume.toLocaleString("en-IN")}`);
    console.log(`Failed Volume     : ₹${failedVolume.toLocaleString("en-IN")}`);
    console.log(`Pending Volume    : ₹${pendingVolume.toLocaleString("en-IN")}`);
    console.log(`Total Commission  : ₹${totalCommission.toLocaleString("en-IN")}`);

    console.log("\n========================================");
    console.log("Seed process completed!");
    console.log("========================================\n");

    process.exit(0);
  } catch (error) {
    console.error("\nSeed data error:", error.message);
    process.exit(1);
  }
};

// Run seed
seedDatabase();
  