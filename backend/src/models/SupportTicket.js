const mongoose = require("mongoose");

const supportTicketSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      required: true,
      unique: true
    },

    partnerId: {
      type: String,
      required: true
    },

    transactionId: {
      type: String,
      default: null
    },

    category: {
      type: String,
      enum: ["COMPLAINT", "HUMAN_SUPPORT", "REFUND_QUERY"],
      required: true
    },

    description: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ["OPEN", "IN_PROGRESS", "RESOLVED"],
      default: "OPEN"
    }
  },
  { timestamps: true }
);

const SupportTicket = mongoose.model(
  "SupportTicket",
  supportTicketSchema
);

module.exports = SupportTicket;