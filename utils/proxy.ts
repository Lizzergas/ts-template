import fs from "node:fs";
import path from "node:path";
import { Agent, ProxyAgent } from "undici";
import env from "./env";

function createSecureProxyDispatcher(): ProxyAgent | Agent {
  if (!env.HTTPS_PROXY) {
    console.log("🔍 No proxy configured - using default dispatcher");
    return new Agent(); // Return default agent when no proxy
  }

  console.log(`🔍 Configuring proxy: ${env.HTTPS_PROXY}`);
  // Path to the proxy certificate
  const certPath = env.PROXY_CERT_PATH || path.join(process.cwd(), "proxyman-root-ca.pem");

  if (!fs.existsSync(certPath)) {
    console.error(`❌ Certificate not found at: ${certPath}`);
    console.log("📋 Steps to fix:");
    console.log("1. Open Proxyman");
    console.log("2. Certificate → Export Root Certificate as PEM");
    console.log(`3. Save as: ${certPath}`);
    process.exit(1);
  }

  try {
    // Read the certificate
    const caCert = fs.readFileSync(certPath);
    console.log("✅ Proxy certificate loaded successfully");

    // Create ProxyAgent with proper certificate validation
    return new ProxyAgent({
      uri: env.HTTPS_PROXY,
      proxyTls: {
        ca: caCert, // Add Proxyman's CA to trusted certs
      },
    });
  } catch (error) {
    console.error("❌ Failed to load certificate:", error);
    process.exit(1);
  }
}

/**
 * Development-only unsafe mode
 * Use ONLY for debugging, NEVER in production
 */
function createUnsafeProxyDispatcher(): ProxyAgent {
  console.log("⚠️  WARNING: Using unsafe proxy mode (development only)");
  console.log("🔓 SSL certificate validation is DISABLED");

  return new ProxyAgent({
    uri: env.HTTPS_PROXY || "",
    proxyTls: {
      rejectUnauthorized: false, // UNSAFE: Disables all certificate validation
    },
  });
}

const proxyDispatcher = (() => {
  if (env.NODE_ENV === "development" && process.env.UNSAFE_PROXY === "true") {
    return createUnsafeProxyDispatcher();
  }
  return createSecureProxyDispatcher();
})();

export default proxyDispatcher;
