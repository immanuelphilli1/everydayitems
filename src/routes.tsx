import { Routes, Route } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import ProductsPage from '@/pages/ProductsPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import CartPage from '@/pages/CartPage';
import CheckoutPage from '@/pages/CheckoutPage';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import ProductsManagement from '@/pages/admin/ProductsManagement';
import OrdersManagement from '@/pages/admin/OrdersManagement';
import CategoriesPage from '@/pages/CategoriesPage';
import ContactUs from '@/pages/ContactUs';
import CreateProductPage from '@/pages/admin/CreateProductPage';
import PrivacyPage from '@/pages/PrivacyPage';
import FAQPage from '@/pages/FAQPage';
import TermsPage from '@/pages/TermsPage';
import ProfilePage from '@/pages/ProfilePage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import OrdersPage from '@/pages/OrdersPage';
import Sitemap from '@/pages/Sitemap';
import AboutUs from './pages/AboutUs';
import CustomerList from '@/pages/admin/CustomerList';
import Analytics from '@/pages/admin/Analytics';
import CustomerDetails from '@/pages/admin/CustomerDetails';
import OrderDetails from '@/pages/admin/OrderDetails';
import EditProduct from '@/pages/admin/EditProduct';
import PaymentStatus from '@/pages/PaymentStatus';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/products/:id" element={<ProductDetailPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/faq" element={<FAQPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/sitemap" element={<Sitemap />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/orders" element={<OrdersPage />} />
      <Route path="/payment-status" element={<PaymentStatus />} />

      {/* Admin routes */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/products" element={<ProductsManagement />} />
      <Route path="/admin/products/edit/:id" element={<EditProduct />} />
      <Route path="/admin/orders" element={<OrdersManagement />} />
      <Route path="/admin/orders/:id" element={<OrderDetails />} />
      <Route path="/admin/products/new" element={<CreateProductPage />} />
      <Route path="/admin/customers" element={<CustomerList />} />
      <Route path="/admin/customers/:id" element={<CustomerDetails />} />
      <Route path="/admin/analytics" element={<Analytics />} />
    </Routes>
  );
}