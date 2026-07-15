import { BrowserRouter, Routes, Route } from "react-router-dom";
import MedicineList from "./pages/MedicineList";
import MedicineDetail from "./pages/MedicineDetail";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MedicineList />} />
        <Route path="/medicine/:id" element={<MedicineDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
