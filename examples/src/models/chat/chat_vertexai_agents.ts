import { z } from "zod";

import { pull } from "langchain/hub";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { AgentExecutor, createOpenAIToolsAgent } from "langchain/agents";

import type { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatVertexAI } from "@langchain/google-vertexai";
// Uncomment this if you're running inside a web/edge environment.
// import { ChatVertexAI } from "@langchain/google-vertexai-web";

const llm: any = new ChatVertexAI({
  temperature: 0,
  model: "gemini-1.0-pro",
});

// Get the prompt to use - you can modify this!
// If you want to see the prompt in full, you can at:
// https://smith.langchain.com/hub/hwchase17/openai-tools-agent
const prompt = await pull<ChatPromptTemplate>("hwchase17/openai-tools-agent");

const currentWeatherTool = new DynamicStructuredTool({
  name: "get_current_weather",
  description: "Get the current weather in a given location",
  schema: z.object({
    location: z.string().describe("The city and state, e.g. San Francisco, CA"),
  }),
  func: async () => Promise.resolve("28 °C"),
});

const agent = await createOpenAIToolsAgent({
  llm,
  tools: [currentWeatherTool],
  prompt,
});

const agentExecutor = new AgentExecutor({
  agent,
  tools: [currentWeatherTool],
});

const input = "What's the weather like in Paris?";
const { output } = await agentExecutor.invoke({ input });

console.log(output);

/* 
It's 28 degrees Celsius in Paris.
*/
