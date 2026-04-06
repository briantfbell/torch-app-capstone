import { useState } from 'react'
import './App.css'
import MainRouter from './services/Router'
import './App.css';
import MiniDrawer from './components/ui/MiniDrawer.jsx';
import InventoryTable from './InventoryTable';

function App() {
    return (
        <MiniDrawer>
            <MainRouter/>
            <InventoryTable/>
        </MiniDrawer>


    );
}

export default App;
