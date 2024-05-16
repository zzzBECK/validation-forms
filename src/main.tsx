import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { D1ModuleProvider } from './components/moduleProvider.tsx'
import { ThemeProvider } from './components/theme-provider.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <D1ModuleProvider>
        <App />
      </D1ModuleProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
