import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router'
import ENVIRONMENT from './config/enviroment'

// Log global al iniciar la app
console.log('[MAIN] App iniciando...')
console.log('[MAIN] VITE_APP_API_URL:', import.meta.env.VITE_APP_API_URL)
console.log('[MAIN] ENVIRONMENT.URL_API:', ENVIRONMENT.URL_API)
console.log('[MAIN] import.meta.env:', Object.keys(import.meta.env))

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
)
