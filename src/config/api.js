const rawApiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

const normalizedApiUrl = rawApiUrl
  .trim()
  .replace(/^VITE_API_URL\s*=\s*/, "")
  .replace(/^["']|["']$/g, "")
  .replace(/\/+$/, "");

export const API_BASE_URL =
  normalizedApiUrl && URL.canParse(normalizedApiUrl)
    ? normalizedApiUrl
    : "http://localhost:3000";
