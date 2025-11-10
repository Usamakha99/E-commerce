import React from 'react'
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
import Preloader from './components/Preloader'
import NavigationPreloader from './components/NavigationPreloader'
import JavaScriptIntegration from './components/JavaScriptIntegration'
import './App.css'

function App() {
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
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-cancel" element={<PaymentCancel />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
          </Routes>
          
          {/* <Footer /> */}
        </div>
      </CartProvider>
    </Router>
  )
}

export default App
