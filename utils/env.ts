import dotenv from "dotenv";
import z from "zod";

dotenv.config();

const envSchema = z.object({
  OPENAI_API_KEY: z.string({
    required_error: "OPENAI_API_KEY  is required",
  }),
  HTTPS_PROXY: z.string().optional(),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  PROXY_CERT_PATH: z.string().default("./ca.pem"),
  UNSAFE_PROXY: z.boolean().default(false),
});

const env = envSchema.parse(process.env);
export default env;
