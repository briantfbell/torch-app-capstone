import { BrowserRouter, Routes, Route } from "react-router-dom";
import EquipmentPage from "./pages/EquipmentPage";
import SHRViewPage from "./pages/SHRViewPage";
import { useState } from 'react'
import './App.css';
import MainRouter from './services/Router'
import MiniDrawer from './components/ui/MiniDrawer.jsx';

function App() {
  return (
    <MainRouter />
    <MiniDrawer/>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EquipmentPage />} />
        <Route path="/shr-viewer" element={<SHRViewPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
