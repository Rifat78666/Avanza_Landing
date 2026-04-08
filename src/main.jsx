import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { LanguageProvider } from './LanguageContext.jsx'
import { StytchProvider } from '@stytch/react'
import { StytchUIClient } from '@stytch/vanilla-js'

// We initialize Stytch with the Public Token. If running locally without one, it uses a placeholder.
const stytchToken = import.meta.env.VITE_STYTCH_PUBLIC_TOKEN || "public-token-test-11111111-1111-1111-1111-111111111111";
const stytch = new StytchUIClient(stytchToken);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StytchProvider stytch={stytch}>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </StytchProvider>
  </StrictMode>,
)
