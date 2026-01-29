import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import ShopGrid from './pages/ShopGrid'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentCancel from './pages/PaymentCancel'
import Login from './pages/Login'
import Register from './pages/Register'
import VerifyEmail from './pages/VerifyEmail'
import Marketplace from './pages/Marketplace'
import MarketplaceProductDetail from './pages/MarketplaceProductDetail'
import Header from './components/Header'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import Preloader from './components/Preloader'
import NavigationPreloader from './components/NavigationPreloader'
import JavaScriptIntegration from './components/JavaScriptIntegration'
import { ftpProductService } from './services/ftpProduct.service'
import './App.css'

function App() {
  // Auto-authenticate with FTP API on app start
  useEffect(() => {
    const initFtpApi = async () => {
      try {
        // Check if token already exists
        const existingToken = localStorage.getItem('ftpApiToken');
        if (existingToken) return;

        // Get credentials from environment variables
        const email = import.meta.env.VITE_FTP_API_EMAIL;
        const password = import.meta.env.VITE_FTP_API_PASSWORD;
        const apiUrl = import.meta.env.VITE_FTP_API_BASE_URL || 'https://test.vcloudtech.net/api';

        if (!email || !password) return;

        await ftpProductService.authenticate(email, password);
      } catch (_error) {
        // FTP API unavailable or auth failed; app continues without FTP products
      }
    };

    // Small delay to ensure app is fully loaded
    const timer = setTimeout(() => {
      initFtpApi();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <CartProvider>
        <div className="min-h-screen w-screen">
          <JavaScriptIntegration />
          <Preloader />
          <NavigationPreloader />
          <Header />
          
          <Routes>
            <Route path="/" element={<ShopGrid />} />
            <Route path="/shop" element={<ShopGrid />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/marketplace/:id" element={<MarketplaceProductDetail />} />
            <Route path="/product" element={<ProductDetail />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-cancel" element={<PaymentCancel />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
          </Routes>
          
          <Footer />
        </div>
      </CartProvider>
    </Router>
  )
}

export default App
