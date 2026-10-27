import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { PinyinProvider } from './context/PinyinContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PinyinProvider>
      <App />
    </PinyinProvider>
  </StrictMode>,
)
