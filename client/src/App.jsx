import './App.css';
import MainRouter from './services/Router';
import {useMemo, useState} from 'react';
import {createTheme, CssBaseline, ThemeProvider} from '@mui/material';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

const lightTheme = createTheme({
    palette: {
        mode: 'light',
    },
});



function App() {
    const [mode, setMode] = useState('dark');

    const theme = useMemo(() => {
        return mode === 'dark' ? darkTheme : lightTheme;
    }, [mode]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <MainRouter
                mode={mode}
                onToggleTheme={() => setMode((currentMode) => currentMode === 'dark' ? 'light' : 'dark')}
            />
        </ThemeProvider>

    );
}

export default App;
