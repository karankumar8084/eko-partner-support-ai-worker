const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Partner = require("../models/Partner");

// ==============================
// PARTNER REGISTRATION
// ==============================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required."
      });
    }

    // Validate field types
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields must be text."
      });
    }

    // Trim input
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    // Validate name
    if (cleanName.length < 2 || cleanName.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Name must be between 2 and 100 characters."
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address."
      });
    }

    // Validate password
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 8 characters."
      });
    }

    // Check existing email
    const existingPartner = await Partner.findOne({
      email: cleanEmail
    });

    if (existingPartner) {
      return res.status(409).json({
        success: false,
        message: "Email already registered."
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate unique partner ID
    const partnerId = `PARTNER-${Date.now()}`;

    // Create partner
    const partner = await Partner.create({
      partnerId,
      name: cleanName,
      email: cleanEmail,
      password: hashedPassword,
      role: "PARTNER"
    });

    // Successful response
    return res.status(201).json({
      success: true,
      message: "Partner registered successfully.",
      partner: {
        partnerId: partner.partnerId,
        name: partner.name,
        email: partner.email,
        role: partner.role
      }
    });

  } catch (error) {
    console.error("Registration Error:", error.message);

    // Handle duplicate email error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email or Partner ID already exists."
      });
    }

    return res.status(500).json({
      success: false,
      message: "Registration failed."
    });
  }
});


// ==============================
// PARTNER LOGIN
// ==============================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required."
      });
    }

    // Validate field types
    if (typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({
        success: false,
        message: "Email and password must be text."
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Find partner
    const partner = await Partner.findOne({
      email: cleanEmail
    });

    if (!partner) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(
      password,
      partner.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    // Ensure JWT secret exists
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing in environment variables.");

      return res.status(500).json({
        success: false,
        message: "Server configuration error."
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        partnerId: partner.partnerId,
        role: partner.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h"
      }
    );

    // Successful response
    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      partner: {
        partnerId: partner.partnerId,
        name: partner.name,
        email: partner.email,
        role: partner.role
      }
    });

  } catch (error) {
    console.error("Login Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Login failed."
    });
  }
});

module.exports = router;