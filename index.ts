import OpenAI from "openai";
import env from "./utils/env";
import proxyAgent from "./utils/proxy";

const client = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
  fetchOptions: {
    // dispatcher: proxyAgent,
  },
});

const response = await client.responses.create({
  model: "gpt-4o-mini",
  input: [
    {
      role: "user",
      content: "Helloooo, WHAT IS UP? write me a poem about it",
    },
  ],
  stream: true,
});

let tokenWritten = 0;

for await (const chunk of response) {
  // Check if this is a text delta event
  if (chunk.type === "response.output_text.delta") {
    tokenWritten++;
    process.stdout.write(`${chunk.delta}`);

    if (tokenWritten >= 15) {
      console.log("");
      tokenWritten = 0;
    }
  }

  if (chunk.type === "response.completed") {
    console.log(chunk.response);
  }
}
