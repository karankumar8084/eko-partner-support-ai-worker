const generateResponse = (transaction) => {
  if (!transaction) {
    return "Sorry, we could not find this transaction. Please check your transaction ID.";
  }

  const { transactionId, amount, status, failureReason } = transaction;

  // PENDING TRANSACTION
  if (status === "PENDING") {
    return `Your transaction ${transactionId} of ₹${amount} is currently pending. Please wait for the transaction to be processed. If the amount has been debited but the transaction remains pending, contact support for investigation.`;
  }

  // FAILED TRANSACTION
  if (status === "FAILED") {
    return `Your transaction ${transactionId} of ₹${amount} has failed. Reason: ${failureReason || "Not available"}. Please check your balance and transaction details. If the amount was debited, raise a support request for investigation.`;
  }

  // SUCCESSFUL TRANSACTION
  if (status === "SUCCESS") {
    return `Your transaction ${transactionId} of ₹${amount} was successful. If you still have an issue regarding this payment, please let us know so we can assist you.`;
  }

  // UNKNOWN STATUS
  return "We could not determine the transaction status. Please contact support for further assistance.";
};

module.exports = generateResponse;