import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { SnackbarProvider } from 'notistack'; 
import App from './App.jsx';
import AuthProvider from './context/AuthContexts';
import { FacilityProvider } from './context/FacilityContext';

import './styles/_index.css'; 
import './styles/_buttons.css'; 
import './styles/_auth.css'
import './styles/_cards.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import "@fontsource/open-sans"; 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <SnackbarProvider maxSnack={3}>
        <AuthProvider>
          <FacilityProvider>
            <App />
          </FacilityProvider>
        </AuthProvider>
      </SnackbarProvider>
    </BrowserRouter>
  </StrictMode>
);
