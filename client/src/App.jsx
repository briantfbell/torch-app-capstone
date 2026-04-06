import { BrowserRouter, Routes, Route } from "react-router-dom";
import EquipmentPage from "./pages/EquipmentPage";
import SHRViewPage from "./pages/SHRViewPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EquipmentPage />} />
        <Route path="/shr-viewer" element={<SHRViewPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
