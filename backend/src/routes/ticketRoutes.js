const express = require("express");
const router = express.Router();

const SupportTicket = require("../models/SupportTicket");
const authMiddleware = require("../middleware/authMiddleware");

// ==========================================
// GET ALL TICKETS (Authenticated Partner Only)
// ==========================================
router.get("/", authMiddleware, async (req, res) => {
  try {
    const tickets = await SupportTicket.find({
      partnerId: req.partner.partnerId
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tickets.length,
      tickets
    });

  } catch (error) {
    console.error("Get All Tickets Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to retrieve support tickets."
    });
  }
});

// ==========================================
// GET TICKET BY TICKET ID
// (Authenticated Partner's Own Ticket Only)
// ==========================================
router.get("/:ticketId", authMiddleware, async (req, res) => {
  try {
    const { ticketId } = req.params;

    const ticket = await SupportTicket.findOne({
      ticketId,
      partnerId: req.partner.partnerId
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Support ticket not found."
      });
    }

    res.status(200).json({
      success: true,
      ticket
    });

  } catch (error) {
    console.error("Ticket API Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to retrieve support ticket."
    });
  }
});

// ==========================================
// UPDATE TICKET STATUS
// (Authenticated Partner's Own Ticket Only)
// ==========================================
router.patch("/:ticketId", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = ["OPEN", "IN_PROGRESS", "RESOLVED"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ticket status."
      });
    }

    const ticket = await SupportTicket.findOneAndUpdate(
      {
        ticketId: req.params.ticketId,
        partnerId: req.partner.partnerId
      },
      { status },
      { new: true, runValidators: true }
    );

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Support ticket not found."
      });
    }

    res.status(200).json({
      success: true,
      message: "Ticket status updated successfully.",
      ticket
    });

  } catch (error) {
    console.error("Update Ticket Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to update ticket status."
    });
  }
});

module.exports = router;