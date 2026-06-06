/** @type {import('next').NextConfig} */
const originHosts = [
  "localhost:3000",
  "127.0.0.1:3000",
  "localhost",
  "127.0.0.1",
];

if (process.env.APP_URL) {
  try {
    originHosts.push(new URL(process.env.APP_URL).host);
  } catch (error) {
    // ignore invalid APP_URL values
  }
}

const extraOrigins = [
  process.env.VERCEL_URL,
  process.env.NEXT_PUBLIC_VERCEL_URL,
  process.env.URL,
].filter(Boolean);

originHosts.push(...extraOrigins);

const envOrigins = (process.env.SERVER_ACTIONS_ALLOWED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

originHosts.push(...envOrigins);

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      allowedOrigins: originHosts,
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
