import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import router from './router.jsx'
import RouterWrapper from './router';
import { ContextProvider } from './contexts/ContexProvider.jsx'
import 'leaflet/dist/leaflet.css';

// ✅ Apply theme on app load BEFORE React renders
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ContextProvider>
      <RouterWrapper />
    </ContextProvider>
  </StrictMode>,
)
