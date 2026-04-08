import React, { useState, useEffect } from 'react';
import './index.css';

import NeuralBackground from './components/NeuralBackground';
import Hero from './components/Hero';
import Features from './components/Features';
import TargetAudience from './components/TargetAudience';
import Partners from './components/Partners';
import AuthModal from './components/AuthModal';

import { useLanguage } from './LanguageContext';
import { useStytch, useStytchUser } from '@stytch/react';

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authStatus, setAuthStatus] = useState('idle'); // 'idle' | 'authenticating' | 'authenticated'
  
  const { language, setLanguage, t } = useLanguage();
  const stytch = useStytch();
  const { user } = useStytchUser();

  // Handle Magic Link redirect — when the user clicks the link in their email,
  // Stytch redirects back here with ?token=xxx&stytch_token_type=magic_links
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const tokenType = params.get('stytch_token_type');

    if (token && tokenType === 'magic_links') {
      setAuthStatus('authenticating');
      stytch.magicLinks.authenticate(token, {
        session_duration_minutes: 60
      }).then(() => {
        setAuthStatus('authenticated');
        // Clean the URL so the token doesn't linger
        window.history.replaceState({}, document.title, window.location.pathname);
      }).catch((err) => {
        console.error('Magic Link authentication failed:', err);
        setAuthStatus('idle');
        window.history.replaceState({}, document.title, window.location.pathname);
      });
    }
  }, [stytch]);

  // If the user is already authenticated (session exists)
  useEffect(() => {
    if (user) {
      setAuthStatus('authenticated');
    }
  }, [user]);

  const openAuth = (mode) => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleLogout = () => {
    stytch.session.revoke();
    setAuthStatus('idle');
  };

  return (
    <div className="app">
      <NeuralBackground />
      
      <header className="container" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        padding: '1.5rem 1.5rem', 
        alignItems: 'center',
        position: 'relative',
        zIndex: 50
      }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '-1px' }}>
          AVANZA
        </div>
        <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{ 
            background: 'transparent', 
            color: 'var(--text-secondary)', 
            border: 'none', 
            cursor: 'pointer',
            fontSize: '1rem',
            fontFamily: 'inherit',
            outline: 'none'
          }}>
            <option value="IT" style={{background: 'var(--surface-color)'}}>IT</option>
            <option value="EN" style={{background: 'var(--surface-color)'}}>EN</option>
            <option value="AR" style={{background: 'var(--surface-color)'}}>AR</option>
            <option value="HI" style={{background: 'var(--surface-color)'}}>HI</option>
            <option value="FR" style={{background: 'var(--surface-color)'}}>FR</option>
          </select>

          {authStatus === 'authenticated' && user ? (
            <>
              <span style={{ color: 'var(--accent-color)', fontSize: '0.875rem' }}>
                ✓ {user.emails?.[0]?.email || 'Logged in'}
              </span>
              <button className="btn-outline" onClick={handleLogout}>Logout</button>
            </>
          ) : authStatus === 'authenticating' ? (
            <span style={{ color: 'var(--text-secondary)' }}>Verifying...</span>
          ) : (
            <>
              <button className="btn-outline" onClick={() => openAuth('login')}>{t('loginBtn')}</button>
              <button className="btn-primary" onClick={() => openAuth('register')}>{t('getGuideBtn')}</button>
            </>
          )}
        </nav>
      </header>
      
      <main>
        <Hero />
        <Features />
        <TargetAudience />
        <Partners />
      </main>

      <footer className="container" style={{
        textAlign: 'center',
        padding: '3rem 0',
        marginTop: '2rem',
        borderTop: '1px solid var(--border-color)',
        position: 'relative',
        zIndex: 10
      }}>
        <p style={{
          fontSize: '1.25rem',
          fontStyle: 'italic',
          color: 'var(--text-secondary)',
        }}>
          {t('quote')}
        </p>
      </footer>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        initialMode={authMode}
      />
    </div>
  );
}

export default App;
