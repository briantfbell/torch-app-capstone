<<<<<<< HEAD
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
=======
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import {CssBaseline} from '@mui/material';

createRoot(document.getElementById('root')).render(
        <StrictMode>
            <CssBaseline />
            <App />
        </StrictMode>
>>>>>>> 9a231875b7f8324264461f40bee46c33e51c4432
)
