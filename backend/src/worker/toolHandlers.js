const { executeTool } = require("./tools");

/**
 * Handles OpenAI tool calls.
 *
 * @param {Array} toolCalls - Tool calls requested by the AI
 * @param {string} partnerId - Authenticated partner ID
 * @returns {Promise<Array>} Tool execution results
 */
async function handleToolCalls(toolCalls, partnerId) {
  if (!Array.isArray(toolCalls) || toolCalls.length === 0) {
    return [];
  }

  const results = [];

  for (const toolCall of toolCalls) {
    try {
      const toolName = toolCall.function.name;

      let args = {};

      try {
        args = JSON.parse(toolCall.function.arguments || "{}");
      } catch (parseError) {
        results.push({
          tool_call_id: toolCall.id,
          role: "tool",
          content: JSON.stringify({
            error: "Invalid tool arguments provided by AI.",
          }),
        });

        continue;
      }

      const result = await executeTool(toolName, args, partnerId);

      results.push({
        tool_call_id: toolCall.id,
        role: "tool",
        content: JSON.stringify(result),
      });
    } catch (error) {
      console.error("Tool handler error:", error.message);

      results.push({
        tool_call_id: toolCall.id,
        role: "tool",
        content: JSON.stringify({
          error: "Tool execution failed.",
        }),
      });
    }
  }

  return results;
}

module.exports = { handleToolCalls };