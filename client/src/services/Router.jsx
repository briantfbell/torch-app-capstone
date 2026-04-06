import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import SplashPage from '../pages/SplashPage';
import EquipmentPage from '../pages/EquipmentPage.jsx';
import SHRViewPage from '../pages/SHRViewPage.jsx';


export default function MainRouter() {
    return(
        <Router>
            <Routes>
                <Route path = '/' element={<SplashPage />} />
                <Route path="/" element={<EquipmentPage />} />
                <Route path="/shr-viewer" element={<SHRViewPage />} />
            </Routes>
        </Router>
    )
}