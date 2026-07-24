import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { WishlistProvider } from './context/WishlistContext'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { OrderProvider } from './context/OrderContext'
import { ProductProvider } from './context/ProductContext'
import { ShopBrandingProvider } from './context/ShopBrandingContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <OrderProvider>
          <ProductProvider>
            <WishlistProvider>
              <CartProvider>
                <ShopBrandingProvider>
                  <App />
                </ShopBrandingProvider>
              </CartProvider>
            </WishlistProvider>
          </ProductProvider>
        </OrderProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
