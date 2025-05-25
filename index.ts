import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  MY_KEY: z.string({
    required_error: "MY_KEY is required",
  }),
});

console.log(process.env.MY_KEY);
const parsed = envSchema.parse(process.env);
console.log("PARSED: ", parsed);

let num = 5;
num++;

function add(a: number, b: number) {
  const test = 1;
  return a + b + test;
}

add(num, num);
console.log(num);
