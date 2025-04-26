import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { SnackbarProvider } from 'notistack';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import "@fontsource/open-sans";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <SnackbarProvider>
        <App />
      </SnackbarProvider>
    </BrowserRouter>
  </StrictMode>,
)
