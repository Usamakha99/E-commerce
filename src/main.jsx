import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
// Import all CSS files directly
import './assets/css/vendors/normalize.css'
import './assets/css/vendors/bootstrap.min.css'
import './assets/css/plugins/swiper-bundle.min.css'
import './assets/css/plugins/select2.min.css'
import './assets/css/plugins/slick.css'
import './assets/css/plugins/animate.min.css'
import './assets/css/style.css'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
)
