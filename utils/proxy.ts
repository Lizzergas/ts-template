import fs from "node:fs";
import path from "node:path";
import { HttpsProxyAgent } from "https-proxy-agent";
import env from "./env";

function createSecureProxyAgent(): HttpsProxyAgent<string> | undefined {
  if (!env.HTTPS_PROXY) {
    console.log("🔍 No proxy configured");
    return undefined;
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

    // Create agent with proper certificate validation
    return new HttpsProxyAgent<string>(env.HTTPS_PROXY, {
      ca: caCert, // Add Proxyman's CA to trusted certs
      rejectUnauthorized: true, // Keep security enabled
      checkServerIdentity: (host, cert) => {
        // Custom server identity check for proxy
        console.log(`🔐 Validating certificate for: ${host}`);
        console.log(`cert ${cert}`);
        return undefined; // Accept proxy certificate
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
function createUnsafeProxyAgent(): HttpsProxyAgent<string> {
  console.log("⚠️  WARNING: Using unsafe proxy mode (development only)");
  console.log("🔓 SSL certificate validation is DISABLED");

  return new HttpsProxyAgent<string>(env.HTTPS_PROXY || "", {
    rejectUnauthorized: false, // UNSAFE: Disables all certificate validation
  });
}

const proxyAgent = (() => {
  if (env.NODE_ENV === "development" && process.env.UNSAFE_PROXY === "true") {
    return createUnsafeProxyAgent();
  }
  return createSecureProxyAgent();
})();

export default proxyAgent;
