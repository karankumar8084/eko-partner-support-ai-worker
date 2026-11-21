const extractTransactionId = (message) => {
  if (typeof message !== "string" || !message.trim()) {
    return null;
  }

  // Extract transaction ID from user message
  const pattern = /\bTXN[-_]?\d{4,}\b/i;

  const match = message.match(pattern);

  if (!match) {
    return null;
  }

  // Normalize transaction ID
  return match[0]
    .toUpperCase()
    .replace(/[-_]/g, "");
};

module.exports = extractTransactionId;