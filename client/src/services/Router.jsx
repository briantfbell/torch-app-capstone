import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SplashPage from "../pages/SplashPage";
import EquipmentPage from "../pages/EquipmentPage.jsx";
import SHRViewPage from "../pages/SHRViewPage.jsx";
import ShortageTrackerPage from "../pages/ShortageTrackerPage";
import InventoryTable from "../InventoryTable";

export default function MainRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashPage />} />
        <Route path="/equipment" element={<EquipmentPage />} />
        <Route path="/shr-viewer" element={<SHRViewPage />} />
        <Route path="/shortages" element={<ShortageTrackerPage />} />
        <Route path="/InventoryTable" element={<InventoryTable />} />
      </Routes>
    </Router>
  );
}
