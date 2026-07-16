import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { AuthProvider } from "./context/AuthContext";
import MedicineList from "./pages/MedicineList";
import MedicineDetail from "./pages/MedicineDetail";
import CheckoutPage from "./pages/Checkout";
import TrackOrderPage from "./pages/TrackOrder";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import AiChatPage from "./pages/AiChat";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminDashboard from "./pages/AdminDashboard";
import LandingPage from "./pages/LandingPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Routes>
              <Route path="/" element={<MedicineList />} />
              <Route path="/medicine/:id" element={<MedicineDetail />} />
              <Route path="/checkout/:id" element={<CheckoutPage />} />
              <Route path="/orders/track" element={<TrackOrderPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/ai-chat" element={<AiChatPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/landing" element={<LandingPage />} />
            </Routes>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
