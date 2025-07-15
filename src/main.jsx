import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Ful2winContextProvider from './context/ful2winContext.jsx'

// Register service worker for image caching
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('Service Worker registered successfully:', registration);
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  });
};
import { ImageContextProvider } from './context/ImageContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Ful2winContextProvider>
      <ImageContextProvider>
        <App />
      </ImageContextProvider>
    </Ful2winContextProvider>
  </StrictMode>,
)
