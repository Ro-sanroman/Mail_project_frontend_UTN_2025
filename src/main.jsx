import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router'
import AuthContextProvider from './context/authContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </BrowserRouter>
)
// Global error handlers to surface runtime errors in the console
if (typeof window !== 'undefined'){
  window.addEventListener('error', (evt) => {
    console.error('[GLOBAL ERROR]', evt.message, evt.error)
  })
  window.addEventListener('unhandledrejection', (evt) => {
    console.error('[UNHANDLED REJECTION]', evt.reason)
  })
}