import { BrowserRouter, Routes, Route } from "react-router-dom";
import MedicineList from "./pages/MedicineList";
import MedicineDetail from "./pages/MedicineDetail";
import CheckoutPage from "./pages/Checkout";
import TrackOrderPage from "./pages/TrackOrder";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MedicineList />} />
        <Route path="/medicine/:id" element={<MedicineDetail />} />
        <Route path="/checkout/:id" element={<CheckoutPage />} />
        <Route path="/orders/track" element={<TrackOrderPage />} />
      </Routes>
    </BrowserRouter>
  );
}
