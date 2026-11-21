const classifyIntent = (message) => {
  const text = message.toLowerCase();

  // Refund intent first
  if (
    text.includes("refund") ||
    text.includes("money back") ||
    text.includes("return my money")
  ) {
    return "REFUND_QUERY";
  }

  // Human support
  if (
    text.includes("agent") ||
    text.includes("human support") ||
    text.includes("support team")
  ) {
    return "HUMAN_SUPPORT";
  }

  // Complaint
  if (
    text.includes("complaint") ||
    text.includes("problem") ||
    text.includes("issue")
  ) {
    return "COMPLAINT";
  }

  // Transaction query
  if (
    text.includes("transaction") ||
    text.includes("payment") ||
    text.includes("pending") ||
    text.includes("failed") ||
    text.includes("success") ||
    text.includes("status")
  ) {
    return "TRANSACTION_QUERY";
  }

  return "UNKNOWN";
};

module.exports = classifyIntent;