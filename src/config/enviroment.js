// Importar la URL de entorno Vite
const VITE_URL = import.meta.env.VITE_APP_API_URL

// Resolver URL con validación múltiple
let API_URL = null

// Prioridad 1: Variable de entorno Vite (si está configurada)
if (VITE_URL && typeof VITE_URL === 'string' && VITE_URL.trim()) {
  API_URL = VITE_URL.trim()
}
// Prioridad 2: En Vercel, si no está configurada, usa el mismo domain
else if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
  API_URL = window.location.origin.replace('mail-project-frontend', 'mail-project')
}
// Prioridad 3: Fallback a localhost para desarrollo
else {
  API_URL = 'http://localhost:8080'
}

// Log en desarrollo
if (import.meta.env.DEV) {
  console.log('[ENVIRONMENT] VITE_APP_API_URL:', VITE_URL)
  console.log('[ENVIRONMENT] Hostname:', typeof window !== 'undefined' ? window.location.hostname : 'server')
  console.log('[ENVIRONMENT] API_URL resuelto a:', API_URL)
}

const ENVIRONMENT = {
    URL_API: API_URL
}

export default ENVIRONMENT