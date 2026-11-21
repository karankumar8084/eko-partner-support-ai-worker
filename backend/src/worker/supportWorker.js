const classifyIntent = require("./intentClassifier");
const extractTransactionId = require("./transactionExtractor");
const generateResponse = require("./responseGenerator");

const { askAI } = require("./aiModel");

const Transaction = require("../models/Transaction");
const SupportTicket = require("../models/SupportTicket");

// ==========================================
// SUPPORT WORKER
// ==========================================

const supportWorker = async (message, partnerId) => {
  try {
    // 1. Validate message
    if (!message || typeof message !== "string" || !message.trim()) {
      return {
        success: false,
        message: "Please provide a valid support message.",
      };
    }

    // 2. Validate partner authentication
    if (!partnerId) {
      return {
        success: false,
        message: "Authentication required. Please log in again.",
      };
    }

    const cleanMessage = message.trim();
    const intent = classifyIntent(cleanMessage);
    console.log("DEBUG INTENT:", intent, "| MESSAGE:", cleanMessage);
    const transactionId = extractTransactionId(cleanMessage);

    // ==========================================
    // 3. TRANSACTION QUERY
    // ==========================================

    if (intent === "TRANSACTION_QUERY") {
      // Specific transaction ID lookup
      if (transactionId) {
        const transaction = await Transaction.findOne({
          transactionId,
          partnerId,
        }).lean();

        const response = generateResponse(transaction);

        return {
          success: true,
          intent,
          transactionId,
          response,
        };
      }

      // General transaction questions and analytics
      const aiResponse = await askAI(
        [
          {
            role: "user",
            content: cleanMessage,
          },
        ],
        partnerId
      );

      return {
        success: true,
        intent,
        response: aiResponse,
      };
    }

    // ==========================================
    // 4. REFUND QUERY
    // ==========================================

    if (intent === "REFUND_QUERY") {
      if (!transactionId) {
        return {
          success: true,
          intent,
          response:
            "Please provide your transaction ID so I can help with your refund request (example: TXN4002).",
        };
      }

      const transaction = await Transaction.findOne({
        transactionId,
        partnerId,
      }).lean();

      if (!transaction) {
        return {
          success: true,
          intent,
          transactionId,
          response:
            "I could not find this transaction. Please verify the transaction ID and try again.",
        };
      }

      const ticketId = `TKT-${Date.now()}`;

      const ticket = await SupportTicket.create({
        ticketId,
        partnerId,
        transactionId,
        category: "REFUND_QUERY",
        description: cleanMessage,
        status: "OPEN",
      });

      return {
        success: true,
        intent,
        transactionId,
        ticketId: ticket.ticketId,
        ticketStatus: ticket.status,
        response:
          "Your refund request has been recorded for verification. No refund has been initiated.",
      };
    }

    // ==========================================
    // 5. COMPLAINT
    // ==========================================

    if (intent === "COMPLAINT") {
      const ticketId = `TKT-${Date.now()}`;

      const ticket = await SupportTicket.create({
        ticketId,
        partnerId,
        transactionId: transactionId || null,
        category: "COMPLAINT",
        description: cleanMessage,
        status: "OPEN",
      });

      return {
        success: true,
        intent,
        transactionId: transactionId || null,
        ticketId: ticket.ticketId,
        ticketStatus: ticket.status,
        response:
          "We understand your concern. Your complaint has been recorded for support team review.",
      };
    }

    // ==========================================
    // 6. HUMAN SUPPORT
    // ==========================================

    if (intent === "HUMAN_SUPPORT") {
      const ticketId = `TKT-${Date.now()}`;

      const ticket = await SupportTicket.create({
        ticketId,
        partnerId,
        transactionId: transactionId || null,
        category: "HUMAN_SUPPORT",
        description: cleanMessage,
        status: "OPEN",
      });

      return {
        success: true,
        intent,
        transactionId: transactionId || null,
        ticketId: ticket.ticketId,
        ticketStatus: ticket.status,
        response:
          "Your request has been recorded. Our human support team can review it.",
      };
    }

    // ==========================================
    // 7. GENERAL AI ASSISTANT
    // ==========================================

    // Greetings, general questions, and unknown intents
    // are sent to the AI instead of using a fixed response.

    const aiResponse = await askAI(
      [
        {
          role: "user",
          content: cleanMessage,
        },
      ],
      partnerId
    );

    return {
      success: true,
      intent: "AI_ASSISTANT",
      response: aiResponse,
    };
  } catch (error) {
    console.error("Support Worker Error:", error.message);

    return {
      success: false,
      response:
        "We are temporarily unable to process your request. Please try again later or contact human support.",
    };
  }
};

module.exports = supportWorker;