import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Ful2winContextProvider from './context/ful2winContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Ful2winContextProvider>
      <App />
    </Ful2winContextProvider>
  </StrictMode>,
)
