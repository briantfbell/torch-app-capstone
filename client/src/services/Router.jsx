import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SplashPage from "../pages/SplashPage";
import EquipmentPage from "../pages/EquipmentPage.jsx";
import SHRViewPage from "../pages/SHRViewPage.jsx";
import ShortageTrackerPage from "../pages/ShortageTrackerPage";
import InventoryTable from "../pages/InventoryTable";
import EndItemPage from "../pages/EndItemPage.jsx";
import MiniDrawer from "../components/ui/MiniDrawer.jsx";
import UserSettings from "../pages/UserSettings.jsx";
import Ingest from "../components/Ingest.jsx";

export default function MainRouter() {
  return (
    <Router>
      <MiniDrawer>
        <Routes>
          <Route path="/" element={<SplashPage />} />
          <Route path="/equipment" element={<EquipmentPage />} />
          <Route path="/equipment/shr-viewer" element={<SHRViewPage />} />
          <Route path="/shortages" element={<ShortageTrackerPage />} />
          <Route path="/InventoryTable" element={<InventoryTable />} />
          <Route path="/enditem/:id" element={<EndItemPage />} />
          <Route path="/user-settings" element={<UserSettings />} />
          <Route path="/ingest" element={<Ingest />} />
        </Routes>
      </MiniDrawer>
    </Router>
  );
}
