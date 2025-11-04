import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ShopGrid from './pages/ShopGrid'
import ProductDetail from './pages/ProductDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import Marketplace from './pages/Marketplace'
import Header from './components/Header'
import Footer from './components/Footer'
import Preloader from './components/Preloader'
import NavigationPreloader from './components/NavigationPreloader'
import JavaScriptIntegration from './components/JavaScriptIntegration'
import './App.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen w-screen">
        <JavaScriptIntegration />
        <Preloader />
        <NavigationPreloader />
        <Header />
        
        <Routes>
          <Route path="/" element={<ShopGrid />} />
          <Route path="/shop" element={<ShopGrid />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/product" element={<ProductDetail />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
        
        {/* <Footer /> */}
      </div>
    </Router>
  )
}

export default App
