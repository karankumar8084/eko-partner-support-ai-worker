const mongoose = require("mongoose");

const partnerSchema = new mongoose.Schema(
  {
    partnerId: {
      type: String,
      required: true,
      unique: true
    },

    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["PARTNER", "ADMIN"],
      default: "PARTNER"
    }
  },
  { timestamps: true }
);

const Partner = mongoose.model("Partner", partnerSchema);

module.exports = Partner;