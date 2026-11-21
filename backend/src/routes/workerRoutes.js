const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const supportWorker = require("../worker/supportWorker");

// ==========================================
// AI WORKER CHAT ROUTE
// POST /api/worker/chat
// ==========================================

router.post("/chat", authMiddleware, async (req, res) => {
  try {
    const { message } = req.body || {};

    // Validate message exists
    if (message === undefined || message === null) {
      return res.status(400).json({
        success: false,
        message: "Please provide a message.",
      });
    }

    // Validate message type
    if (typeof message !== "string") {
      return res.status(400).json({
        success: false,
        message: "Message must be a text string.",
      });
    }

    // Validate empty message
    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      return res.status(400).json({
        success: false,
        message: "Message cannot be empty.",
      });
    }

    // Validate message length
    if (trimmedMessage.length > 1000) {
      return res.status(400).json({
        success: false,
        message: "Message is too long. Maximum 1000 characters allowed.",
      });
    }

    // Ensure authenticated partner exists
    const partnerId = req.partner?.partnerId;

    if (!partnerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please log in again.",
      });
    }

    // Send message to AI Support Worker
    const result = await supportWorker(trimmedMessage, partnerId);

    return res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    console.error("Worker API Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
});

module.exports = router;