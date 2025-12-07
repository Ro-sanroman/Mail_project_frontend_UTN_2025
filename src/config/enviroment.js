const VITE_URL = import.meta.env.VITE_APP_API_URL;

let API_URL = null;

if (VITE_URL && typeof VITE_URL === "string" && VITE_URL.trim()) {
  API_URL = VITE_URL.trim();
} else if (
  typeof window !== "undefined" &&
  window.location.hostname.includes("vercel.app")
) {
  API_URL = window.location.origin.replace(
    "mail-project-frontend",
    "mail-project"
  );
} else {
  API_URL = "mail-project-utn-2025.vercel.app";
}

if (import.meta.env.DEV) {
  console.log("[ENVIRONMENT] VITE_APP_API_URL:", VITE_URL);
  console.log(
    "[ENVIRONMENT] Hostname:",
    typeof window !== "undefined" ? window.location.hostname : "server"
  );
  console.log("[ENVIRONMENT] API_URL resuelto a:", API_URL);
}

const ENVIRONMENT = {
  URL_API: API_URL,
};

export default ENVIRONMENT;