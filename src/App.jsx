import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ShopGrid from './pages/ShopGrid'
import ProductDetail from './pages/ProductDetail'
import Login from './pages/Login'
import Header from './components/Header'
import Footer from './components/Footer'
import Preloader from './components/Preloader'
import LeftSidebar from './components/LeftSidebar'
import JavaScriptIntegration from './components/JavaScriptIntegration'
import './App.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen w-screen">
        <JavaScriptIntegration />
        <Preloader />
        <Header />
        <LeftSidebar />
        
        <Routes>
          <Route path="/" element={<ShopGrid />} />
          <Route path="/shop" element={<ShopGrid />} />
          <Route path="/product" element={<ProductDetail />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
        </Routes>
        
        <Footer />
      </div>
    </Router>
  )
}

export default App
