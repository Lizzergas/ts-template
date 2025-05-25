import OpenAI from "openai";
import env from "./utils/env";
import proxyAgent from "./utils/proxy";

const client = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
  httpAgent: proxyAgent,
});

const response = await client.responses.create({
  model: "gpt-4o-mini",
  input: "Hello, how are you?",
});

console.log(`Response: ${response.output_text}`);
