const Transaction = require("../models/Transaction");
const SupportTicket = require("../models/SupportTicket");

// Tool definitions for OpenAI
const tools = [
  {
    type: "function",
    function: {
      name: "getTransactionSummary",
      description:
        "Get overall transaction statistics including total count, total amount, successful, failed, and pending transactions.",
      parameters: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getRecentTransactions",
      description:
        "Get the most recent transactions of the authenticated partner.",
      parameters: {
        type: "object",
        properties: {
          limit: {
            type: "integer",
            description: "Number of recent transactions to retrieve. Maximum 20.",
          },
        },
        required: ["limit"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "searchTransaction",
      description:
        "Find a specific transaction using its transaction ID.",
      parameters: {
        type: "object",
        properties: {
          transactionId: {
            type: "string",
            description: "The transaction ID to search for.",
          },
        },
        required: ["transactionId"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getServiceAnalytics",
      description:
        "Get transaction statistics grouped by service type.",
      parameters: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getCommissionSummary",
      description:
        "Calculate total commission earned from successful transactions.",
      parameters: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getSupportTicketSummary",
      description:
        "Get support ticket statistics including total, open, in progress, and resolved tickets.",
      parameters: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: false,
      },
    },
  },
];

// Execute tool calls safely using authenticated partnerId
async function executeTool(name, args, partnerId) {
  try {
    if (!partnerId) {
      throw new Error("Authenticated partner ID is missing.");
    }

    switch (name) {
      // Transaction summary
      case "getTransactionSummary": {
        const summary = await Transaction.aggregate([
          {
            $match: {
              partnerId: partnerId,
            },
          },
          {
            $group: {
              _id: null,
              totalTransactions: { $sum: 1 },
              totalAmount: { $sum: "$amount" },
              successfulTransactions: {
                $sum: {
                  $cond: [{ $eq: ["$status", "SUCCESS"] }, 1, 0],
                },
              },
              failedTransactions: {
                $sum: {
                  $cond: [{ $eq: ["$status", "FAILED"] }, 1, 0],
                },
              },
              pendingTransactions: {
                $sum: {
                  $cond: [{ $eq: ["$status", "PENDING"] }, 1, 0],
                },
              },
            },
          },
        ]);

        return (
          summary[0] || {
            totalTransactions: 0,
            totalAmount: 0,
            successfulTransactions: 0,
            failedTransactions: 0,
            pendingTransactions: 0,
          }
        );
      }

      // Recent transactions
      case "getRecentTransactions": {
        const limit = Math.min(Math.max(Number(args.limit) || 5, 1), 20);

        const transactions = await Transaction.find({ partnerId })
          .sort({ createdAt: -1 })
          .limit(limit)
          .select(
            "transactionId serviceType amount status paymentMethod commission description createdAt failureReason"
          )
          .lean();

        return transactions;
      }

      // Search transaction by ID
      case "searchTransaction": {
        if (!args.transactionId) {
          return { error: "Transaction ID is required." };
        }

        const transactionId = String(args.transactionId)
          .trim()
          .toUpperCase()
          .replace(/[-_]/g, "");

        const transaction = await Transaction.findOne({
          partnerId,
          transactionId,
        })
          .select(
            "transactionId serviceType amount status paymentMethod commission description createdAt failureReason"
          )
          .lean();

        return transaction || { message: "Transaction not found." };
      }

      // Service analytics
      case "getServiceAnalytics": {
        const analytics = await Transaction.aggregate([
          {
            $match: { partnerId },
          },
          {
            $group: {
              _id: "$serviceType",
              totalTransactions: { $sum: 1 },
              totalAmount: { $sum: "$amount" },
              successful: {
                $sum: {
                  $cond: [{ $eq: ["$status", "SUCCESS"] }, 1, 0],
                },
              },
              failed: {
                $sum: {
                  $cond: [{ $eq: ["$status", "FAILED"] }, 1, 0],
                },
              },
              pending: {
                $sum: {
                  $cond: [{ $eq: ["$status", "PENDING"] }, 1, 0],
                },
              },
              totalCommission: { $sum: "$commission" },
            },
          },
          {
            $sort: { totalTransactions: -1 },
          },
        ]);

        return analytics;
      }

      // Commission summary
      case "getCommissionSummary": {
        const commission = await Transaction.aggregate([
          {
            $match: {
              partnerId,
              status: "SUCCESS",
            },
          },
          {
            $group: {
              _id: null,
              totalCommission: { $sum: "$commission" },
              successfulTransactions: { $sum: 1 },
              totalTransactionAmount: { $sum: "$amount" },
            },
          },
        ]);

        return (
          commission[0] || {
            totalCommission: 0,
            successfulTransactions: 0,
            totalTransactionAmount: 0,
          }
        );
      }

      // Support ticket summary
      case "getSupportTicketSummary": {
        const ticketSummary = await SupportTicket.aggregate([
          {
            $match: { partnerId },
          },
          {
            $group: {
              _id: null,
              totalTickets: { $sum: 1 },
              openTickets: {
                $sum: {
                  $cond: [{ $eq: ["$status", "OPEN"] }, 1, 0],
                },
              },
              inProgressTickets: {
                $sum: {
                  $cond: [{ $eq: ["$status", "IN_PROGRESS"] }, 1, 0],
                },
              },
              resolvedTickets: {
                $sum: {
                  $cond: [{ $eq: ["$status", "RESOLVED"] }, 1, 0],
                },
              },
            },
          },
        ]);

        return (
          ticketSummary[0] || {
            totalTickets: 0,
            openTickets: 0,
            inProgressTickets: 0,
            resolvedTickets: 0,
          }
        );
      }

      default:
        return { error: `Unknown tool: ${name}` };
    }
  } catch (error) {
    console.error(`Tool execution error (${name}):`, error.message);

    return {
      error: "Unable to retrieve the requested data.",
    };
  }
}

module.exports = {
  tools,
  executeTool,
};