/** @type {import('next').NextConfig} */
const normalizeOriginHost = (origin) => {
  if (!origin) return undefined;
  const trimmed = origin.trim();
  if (!trimmed) return undefined;

  if (trimmed.includes("*")) {
    return trimmed.toLowerCase();
  }

  try {
    return new URL(trimmed).host.toLowerCase();
  } catch {
    try {
      return new URL(`http://${trimmed}`).host.toLowerCase();
    } catch {
      return trimmed.toLowerCase();
    }
  }
};

const originHosts = new Set([
  "localhost",
  "127.0.0.1",
  "::1",
]);

const addDevPortVariants = (host) => {
  if (!host) return;
  originHosts.add(host);
  if (process.env.NODE_ENV !== "production") {
    const devPort = process.env.PORT || "3000";
    if (host.startsWith("[::1]")) {
      originHosts.add(`[::1]:${devPort}`);
      return;
    }
    if (!host.includes(":")) {
      originHosts.add(`${host}:${devPort}`);
    }
  }
};
if (process.env.APP_URL) {
  const hostname = normalizeOriginHost(process.env.APP_URL);
  if (hostname) originHosts.add(hostname);
}

const extraOrigins = [
  process.env.VERCEL_URL,
  process.env.NEXT_PUBLIC_VERCEL_URL,
  process.env.URL,
].map(normalizeOriginHost).filter(Boolean);

for (const origin of extraOrigins) {
  addDevPortVariants(origin);
}

const envOrigins = (process.env.SERVER_ACTIONS_ALLOWED_ORIGINS || "")
  .split(",")
  .map((origin) => normalizeOriginHost(origin.trim()))
  .filter(Boolean);

for (const origin of envOrigins) {
  addDevPortVariants(origin);
}

if (process.env.NODE_ENV !== "production") {
  const devPort = process.env.PORT || "3000";
  originHosts.add("*.localhost");
  originHosts.add("*.local");
  originHosts.add(`localhost:${devPort}`);
  originHosts.add(`127.0.0.1:${devPort}`);
  originHosts.add(`[::1]:${devPort}`);
}

const nextConfig = {
  reactStrictMode: true,
  images: {
    // Vercel's image optimizer returns 402 (payment required) on our plan,
    // so serve the pre-optimized JPGs from /public directly.
    // Remove this once the account has image optimization credits.
    unoptimized: true
  },
  experimental: {
    serverActions: {
      allowedOrigins: [...originHosts],
    },
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
