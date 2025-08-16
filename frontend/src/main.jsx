import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// If you already have Redux setup, keep your Provider/store imports.
// For now we’ll just add CSRF helpers:
import { restoreCSRF, csrfFetch } from './store/csrf'

if (import.meta.env.MODE !== 'production') {
  restoreCSRF() // sets the XSRF-TOKEN cookie
  window.csrfFetch = csrfFetch // handy for console testing
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
