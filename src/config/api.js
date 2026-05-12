const rawApiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const API_BASE_URL = rawApiUrl
  .trim()
  .replace(/^["']|["']$/g, "")
  .replace(/\/+$/, "");
