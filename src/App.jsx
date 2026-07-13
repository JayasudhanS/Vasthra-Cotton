import { Routes, Route } from 'react-router-dom';
import Navbar from './components/shared/Navbar';
import Footer from './components/shared/Footer';
import ScrollToTop from './components/shared/ScrollToTop';
import ProtectedRoute from './components/shared/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CategoriesPage from './pages/CategoriesPage';
import WishlistPage from './pages/WishlistPage';
import CartPage from './pages/CartPage';
import SearchPage from './pages/SearchPage';
import ShopsPage from './pages/ShopsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import OrderSummaryPage from './pages/OrderSummaryPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';

// Auth
import PortalPage from './pages/auth/PortalPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// User
import UserLayout from './layouts/UserLayout';
import UserDashboard from './pages/user/UserDashboard';
import UserOrders from './pages/user/UserOrders';
import UserProfile from './pages/user/UserProfile';

// Shopkeeper
import ShopkeeperLayout from './layouts/ShopkeeperLayout';
import ShopkeeperDashboard from './pages/shopkeeper/ShopkeeperDashboard';
import AddProduct from './pages/shopkeeper/AddProduct';
import ShopkeeperProfile from './pages/shopkeeper/ShopkeeperProfile';
import { ShopkeeperProducts } from './pages/shopkeeper/ShopkeeperProducts';
import ShopkeeperOrders from './pages/shopkeeper/ShopkeeperOrders';

// Admin
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import { AdminPendingProducts, AdminApprovedProducts, AdminPendingShops, AdminUsers, AdminCategories, AdminSettings } from './pages/admin/AdminPages';

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main className="min-h-screen w-full max-w-full overflow-x-hidden flex flex-col flex-1">
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/shops" element={<ShopsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Auth */}
          <Route path="/portal" element={<PortalPage />} />
          <Route path="/login/:role" element={<LoginPage />} />
          <Route path="/register/:role" element={<RegisterPage />} />

          {/* Protected: Requires any authenticated user */}
          <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
          <Route path="/order-summary" element={<ProtectedRoute><OrderSummaryPage /></ProtectedRoute>} />
          <Route path="/order-confirmation" element={<ProtectedRoute><OrderConfirmationPage /></ProtectedRoute>} />

          {/* User Dashboard - role: user */}
          <Route path="/user" element={<ProtectedRoute allowedRoles={['user']}><UserLayout /></ProtectedRoute>}>
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="orders" element={<UserOrders />} />
            <Route path="profile" element={<UserProfile />} />
          </Route>

          {/* Shopkeeper Dashboard - role: shopkeeper */}
          <Route path="/shopkeeper" element={<ProtectedRoute allowedRoles={['shopkeeper']}><ShopkeeperLayout /></ProtectedRoute>}>
            <Route path="dashboard" element={<ShopkeeperDashboard />} />
            <Route path="products" element={<ShopkeeperProducts />} />
            <Route path="add-product" element={<AddProduct />} />
            <Route path="orders" element={<ShopkeeperOrders />} />
            <Route path="profile" element={<ShopkeeperProfile />} />
          </Route>

          {/* Admin Dashboard - role: admin */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout /></ProtectedRoute>}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="pending-products" element={<AdminPendingProducts />} />
            <Route path="approved-products" element={<AdminApprovedProducts />} />
            <Route path="pending-shops" element={<AdminPendingShops />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </>
  );
}
