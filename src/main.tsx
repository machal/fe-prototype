import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'

const rootElement = document.getElementById('root')!;

// Pro SSG: pokud už existuje obsah, použijeme hydration
// Pro dev mode: normální renderování
if (rootElement.hasChildNodes()) {
  // SSG mode - obsah už je v HTML, hydratujeme
  const { hydrateRoot } = ReactDOM;
  hydrateRoot(
    rootElement,
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
} else {
  // Dev mode - normální renderování
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
}
