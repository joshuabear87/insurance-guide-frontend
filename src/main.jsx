import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { SnackbarProvider } from 'notistack'; 
import App from './App.jsx';
import AuthProvider from './context/AuthContexts';

import './index.css'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import "@fontsource/open-sans"; 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <SnackbarProvider maxSnack={3}>
        <AuthProvider>
        <App />
        </AuthProvider>
      </SnackbarProvider>
    </BrowserRouter>
  </StrictMode>
);
