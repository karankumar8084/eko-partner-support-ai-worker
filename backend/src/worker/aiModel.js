const { ChatOllama } = require("@langchain/ollama");

const { tools } = require("./tools");
const { handleToolCalls } = require("./toolHandlers");

// Local Ollama AI Model
const ollama = new ChatOllama({
  baseUrl: "http://localhost:11434",
  model: "qwen2.5:3b",
  temperature: 0.3,
});

const SYSTEM_PROMPT = `
You are Eko Partner Support AI, an intelligent AI assistant for Eko payment partners.

Your responsibilities:
- Help partners understand their transactions and business performance.
- Analyze transaction statistics.
- Explain failed, pending, and successful transactions.
- Provide commission insights.
- Analyze service-wise performance.
- Help partners understand their support tickets.
- Answer questions clearly and professionally.

Rules:
1. Use database tools whenever the user asks for actual transaction, commission, service analytics, or ticket data.
2. Never invent transaction data, amounts, commissions, or statistics.
3. Never claim a transaction is successful, failed, or pending without checking the database when transaction-specific information is requested.
4. Only access the authenticated partner's data.
5. Explain database results in simple and understandable language.
6. If data is unavailable, clearly say so.
7. Never expose passwords, API keys, or confidential information.
8. Never claim to have processed refunds or payments.
9. Be friendly, concise, and professional.
10. Answer general questions directly without unnecessary database calls.
11. If a tool is needed, use the available tools to get accurate information.
12. Never assume a tool result. Use only actual returned data.
`;

async function askAI(messages, partnerId) {
  try {
    // Prepare conversation
    const conversation = [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      ...messages,
    ];

    let iterations = 0;
    const MAX_TOOL_ITERATIONS = 5;

    // Convert OpenAI-style tools to LangChain format
    const formattedTools = tools.map((tool) => ({
      type: "function",
      function: {
        name: tool.function.name,
        description: tool.function.description,
        parameters: tool.function.parameters,
      },
    }));

    // Bind tools to Ollama model
    const modelWithTools = ollama.bindTools(formattedTools);

    // Initial AI response
    let response = await modelWithTools.invoke(conversation);

    while (
      response.tool_calls &&
      response.tool_calls.length > 0 &&
      iterations < MAX_TOOL_ITERATIONS
    ) {
      iterations++;

      // Add AI response containing tool calls
      conversation.push(response);

      // Convert LangChain tool calls to existing handler format
      const openAIToolCalls = response.tool_calls.map((toolCall) => ({
        id: toolCall.id || `tool_${iterations}_${Date.now()}`,
        type: "function",
        function: {
          name: toolCall.name,
          arguments: JSON.stringify(toolCall.args || {}),
        },
      }));

      // Execute existing database tools
      const toolResults = await handleToolCalls(
        openAIToolCalls,
        partnerId
      );

      // Add tool results to conversation
      for (const result of toolResults) {
        conversation.push({
          role: "tool",
          content: result.content,
          tool_call_id: result.tool_call_id,
        });
      }

      // Ask AI to analyze tool results
      response = await modelWithTools.invoke(conversation);
    }

    // Return final AI response
    return (
      response.content ||
      "I'm sorry, I couldn't generate a response. Please try again."
    );
  } catch (error) {
    console.error("AI Model Error:", error);

    throw new Error(
      error.message || "Unable to process your request with AI right now."
    );
  }
}

module.exports = { askAI };