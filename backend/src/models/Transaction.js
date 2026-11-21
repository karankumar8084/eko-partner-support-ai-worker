const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true
    },

    partnerId: {
      type: String,
      required: true
    },

    // Service Category
    serviceType: {
      type: String,
      enum: [
        "MONEY_TRANSFER",
        "UPI_PAYMENT",
        "CASH_WITHDRAWAL",
        "CASH_DEPOSIT",
        "BILL_PAYMENT",
        "MOBILE_RECHARGE",
        "DTH_RECHARGE"
      ],
      default: "UPI_PAYMENT",
      required: true
    },

    // Transaction Amount
    amount: {
      type: Number,
      required: true,
      min: 0
    },

    // Transaction Status
    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      required: true
    },

    // Payment Method
    paymentMethod: {
      type: String,
      default: "UPI"
    },

    // Partner Commission / Earnings
    commission: {
      type: Number,
      default: 0,
      min: 0
    },

    // Additional transaction details
    description: {
      type: String,
      default: ""
    },

    customerReference: {
      type: String,
      default: null
    },

    // Bill payment details (if applicable)
    billType: {
      type: String,
      default: null
    },

    // Recharge details (if applicable)
    operatorName: {
      type: String,
      default: null
    },

    failureReason: {
      type: String,
      default: null
    },

    // Transaction date
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Indexes for dashboard analytics
transactionSchema.index({ partnerId: 1, createdAt: -1 });
transactionSchema.index({ partnerId: 1, serviceType: 1, status: 1 });
transactionSchema.index({ partnerId: 1, status: 1, createdAt: -1 });

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;