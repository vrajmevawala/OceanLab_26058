import { config } from 'dotenv';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import dns from 'node:dns';

let isPatched = false;

/**
 * Patches the DNS lookup to bypass potential local DNS blocks for Neon database.
 * Supports both callback-based (dns.lookup) and promise-based (dns.promises.lookup).
 */
export function patchDns() {
  if (isPatched) return;

  const NEON_PROXY_IP = process.env.NEON_PROXY_IP || '13.228.184.177';
  const TARGET_DOMAIN = '.neon.tech';

  // Patch callback-based dns.lookup
  const originalLookup = dns.lookup;
  // @ts-ignore
  dns.lookup = function (hostname: string, options: any, callback?: any) {
    const cb = typeof options === 'function' ? options : callback;
    const opts = typeof options === 'function' ? {} : options;

    if (hostname.endsWith(TARGET_DOMAIN)) {
      const address = NEON_PROXY_IP;
      const family = 4;
      
      if (process.env.DEBUG_DNS) {
        console.info(`[Bootstrap/DNS] Intercepted callback lookup for: ${hostname} -> ${address}`);
      }
      
      if (opts?.all) {
        return cb(null, [{ address, family }]);
      }
      return cb(null, address, family);
    }
    return originalLookup(hostname, options, callback);
  };

  // Patch promise-based dns.promises.lookup if available
  if (dns.promises && dns.promises.lookup) {
    const originalPromisesLookup = dns.promises.lookup;
    // @ts-ignore
    dns.promises.lookup = async function (hostname: string, options: any) {
      if (hostname.endsWith(TARGET_DOMAIN)) {
        const address = NEON_PROXY_IP;
        const family = 4;

        if (process.env.DEBUG_DNS) {
          console.info(`[Bootstrap/DNS] Intercepted promise lookup for: ${hostname} -> ${address}`);
        }

        if (options?.all) {
          return [{ address, family }];
        }
        return { address, family };
      }
      return originalPromisesLookup(hostname, options);
    };
  }

  isPatched = true;
  console.info(`[Bootstrap] DNS patch applied for *${TARGET_DOMAIN} (Proxy: ${NEON_PROXY_IP})`);
}

/**
 * Normalizes environment variables, specifically addressing database URLs that might have been hardcoded for workarounds.
 * We want to use the hostname so TLS verification works, and let the DNS patch handle the resolution.
 */
function normalizeEnv() {
  const DATABASE_URL = process.env.DATABASE_URL;
  if (DATABASE_URL) {
    // If the URL contains an IP address that we know is a Neon proxy, we don't necessarily need to change it,
    // but it's better to use the hostname if we have it.
    // However, the main goal is to avoid ERR_TLS_CERT_ALTNAME_INVALID.
  }
}

/**
 * Initializes the environment and applies patches.
 * Should be called at the very top of each entry point.
 */
export function bootstrap(envPath?: string) {
  // 1. Load Environment Variables
  const __dirname = dirname(fileURLToPath(import.meta.url));
  
  // Try to find .env in root by going up from packages/utils/src
  const possiblePaths = [
    envPath,
    resolve(__dirname, '../../../.env'),
    resolve(__dirname, '../../../../.env'),
    resolve(process.cwd(), '.env'),
    resolve(process.cwd(), '.env.local')
  ].filter(Boolean) as string[];

  for (const path of possiblePaths) {
    config({ path });
  }

  // 2. Apply DNS Patch
  patchDns();
}
