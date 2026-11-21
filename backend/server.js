require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./src/config/database");
const transactionRoutes = require("./src/routes/transactionRoutes");
const workerRoutes = require("./src/routes/workerRoutes");
const ticketRoutes = require("./src/routes/ticketRoutes");
const authRoutes = require("./src/routes/authRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "100kb" }));

// Transaction API
app.use("/api/transactions", transactionRoutes);

// AI Worker API
app.use("/api/worker", workerRoutes);

app.use("/api/tickets", ticketRoutes);
app.use("/api/auth", authRoutes);

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "Eko Partner Support AI Worker API is running!",
    status: "success",
    database: "MongoDB"
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  if (err.type === "entity.too.large") {
    return res.status(413).json({
      success: false,
      message: "Request payload is too large. Maximum allowed size is 100KB."
    });
  }

  console.error("Server Error:", err.message);

  res.status(500).json({
    success: false,
    message: "Internal server error."
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();