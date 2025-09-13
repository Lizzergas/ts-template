import dotenv from "dotenv";
import z from "zod";

dotenv.config();

const envSchema = z.object({
  OPENAI_API_KEY: z.string({
    required_error: "OPENAI_API_KEY  is required",
  }),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
});

const env = envSchema.parse(process.env);
export default env;
