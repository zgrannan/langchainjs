import { z } from "zod";

import { pull } from "langchain/hub";
import { ChatMistralAI } from "@langchain/mistralai";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { AgentExecutor, createOpenAIToolsAgent } from "langchain/agents";

import type { ChatPromptTemplate } from "@langchain/core/prompts";

const llm: any = new ChatMistralAI({
  temperature: 0,
  model: "mistral-large-latest",
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
  The current weather in Paris is 28 °C.
*/
