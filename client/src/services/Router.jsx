import React from "react";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import SplashPage from "../pages/SplashPage";


export default function MainRouter() {
    return(
        <Router>
            <Routes>
                <Route path = '/' element={<SplashPage />} />
            </Routes>
        </Router>
    )
}