import { useState } from 'react'
import './App.css'
import MainRouter from './services/Router'
import './App.css';
import MiniDrawer from './components/ui/MiniDrawer.jsx';

function App() {

  return (
    <>
        <MainRouter />
        <MiniDrawer/>
    </>
  )
}

export default App