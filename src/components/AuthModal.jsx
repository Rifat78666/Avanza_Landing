import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { useStytch } from '@stytch/react';

const AuthModal = ({ isOpen, onClose, initialMode = 'login', initialEmail = '' }) => {
  const { t } = useLanguage();
  const stytch = useStytch();

  const [mode, setMode] = useState(initialMode); 
  const [email, setEmail] = useState(initialEmail);
  const [status, setStatus] = useState('idle'); 

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus('loading');
    
    try {
      const redirectURL = window.location.origin;
      // Stytch API Call to actually send the magic link to the inbox!
      await stytch.magicLinks.email.loginOrCreate(email, {
        login_magic_link_url: redirectURL,
        signup_magic_link_url: redirectURL
      });
      setStatus('success');
    } catch (error) {
      console.error("Stytch Auth Error:", error);
      alert(`Stytch Error: ${error.message || error.error_message || "Check console"}. Ensure your Token is correct and 'http://localhost:5173' (or your current port) is added to your Login URLs in Stytch Dashboard.`);
      setStatus('idle');
    }
  };

  const resetAndClose = () => {
    setStatus('idle');
    setEmail('');
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'var(--surface-color)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '400px',
        position: 'relative',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        <button 
          onClick={resetAndClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            color: 'var(--text-secondary)',
            fontSize: '1.5rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          &times;
        </button>

        {status === 'success' ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✨</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{t('checkEmail')}</h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              {t('magicLinkSent')} <strong>{email}</strong>. {t('clickIt')} {mode === 'login' ? t('logInTo') : t('create')} your account.
            </p>
          </div>
        ) : (
          <>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', textAlign: 'center' }}>
              {mode === 'login' ? t('welcomeBack') : t('createAccount')}
            </h2>
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '2rem' }}>
              {t('authDesc')}
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                  {t('emailTitle')}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'rgba(0,0,0,0.2)',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    fontSize: '1rem'
                  }}
                />
              </div>
              
              <button 
                type="submit" 
                className="btn-primary" 
                style={{ width: '100%', marginTop: '0.5rem' }}
                disabled={status === 'loading'}
              >
                {status === 'loading' ? t('sending') : t('sendLink')}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem' }}>
              <button 
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                style={{ color: 'var(--text-secondary)', textDecoration: 'underline' }}
                type="button"
              >
                {mode === 'login' ? t('switchToSign') : t('switchToLog')}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
