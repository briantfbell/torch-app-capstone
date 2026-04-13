import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Ingest from '../components/Ingest.jsx';
import MiniDrawer from '../components/ui/MiniDrawer.jsx';
import { AuthProvider } from '../contexts/AuthContext.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import EndItemPage from '../pages/EndItemPage.jsx';
import EquipmentPage from '../pages/EquipmentPage.jsx';
import InventoryTable from '../pages/InventoryTable';
import SHRViewPage from '../pages/SHRViewPage.jsx';
import ShortageTrackerPage from '../pages/ShortageTrackerPage';
import SplashPage from '../pages/SplashPage';
import UserSettings from '../pages/UserSettings.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';

export default function MainRouter({ mode, onToggleTheme }) {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<SplashPage />} />

                <Route path='/*' element={
                    <ProtectedRoute>
                        <MiniDrawer mode={mode} onToggleTheme={onToggleTheme}>
                            <Routes>
                                <Route path="/equipment" element={<EquipmentPage/>}/>
                                <Route path="/equipment/sub-hand-receipt" element={<SHRViewPage/>}/>
                                <Route path="/shortages" element={<ShortageTrackerPage/>}/>
                                <Route path="/InventoryTable" element={<InventoryTable/>}/>
                                <Route path="/equipment/:id" element={<EndItemPage/>}/>
                                <Route path="/user-settings" element={<UserSettings/>}/>
                                <Route path="/dashboard" element={<Dashboard/>}/>
                                <Route path="/ingest" element={<Ingest/>}/>
                            </Routes>
                        </MiniDrawer>
                    </ProtectedRoute>
                }/>
            </Routes>
        </Router>
        </AuthProvider>
        );
}
