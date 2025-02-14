import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY, // 환경 변수 추가
  },
};

console.log("Loaded API Key:", process.env.OPENAI_API_KEY ? "✅ Loaded" : "❌ Not Found");

export default nextConfig;
