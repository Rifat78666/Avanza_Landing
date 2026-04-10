import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { useNavigate } from 'react-router-dom';

const Hero = ({ onGetStarted, isLoggedIn, userName, onboardingCompleted }) => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleAuthCTA = () => {
    if (onboardingCompleted) {
      navigate('/dashboard');
    } else {
      navigate('/onboarding');
    }
  };

  return (
    <section className="section container" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      textAlign: 'center', 
      minHeight: '80vh',
      justifyContent: 'center',
      marginTop: '-5rem'
    }}>
      <h1 style={{
        fontSize: 'clamp(3rem, 5vw, 4.5rem)',
        fontWeight: '700',
        lineHeight: '1.1',
        marginBottom: '1.5rem',
        maxWidth: '850px',
        letterSpacing: '-0.02em',
        background: 'linear-gradient(to right, #fff, #a1a6b4)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        {isLoggedIn ? t('heroAuthTitle').replace('{{name}}', userName || '') : t('heroTitle')}
      </h1>
      
      <p style={{
        fontSize: '1.25rem',
        color: 'var(--text-secondary)',
        maxWidth: '650px',
        marginBottom: '3rem',
        lineHeight: '1.6'
      }}>
        {isLoggedIn ? t('heroAuthSub') : t('heroSub')}
      </p>
      
      {isLoggedIn ? (
          <div style={{ position: 'relative', zIndex: 50 }}>
              <button 
                className="btn-primary" 
                style={{ 
                    padding: '1.25rem 3rem', 
                    fontSize: '1.25rem', 
                    borderRadius: '12px',
                    boxShadow: '0 8px 30px rgba(200, 241, 53, 0.3)'
                }}
                onClick={handleAuthCTA}
              >
                {onboardingCompleted ? t('heroAuthCTA') : t('continueJourney')}
              </button>
          </div>
      ) : (
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            width: '100%',
            maxWidth: '450px',
            position: 'relative',
            zIndex: 50
          }}>
            <input 
              type="email" 
              placeholder={t('emailPlaceholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                flex: 1,
                padding: '1rem 1.5rem',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                background: 'var(--surface-color)',
                color: 'var(--text-primary)',
                fontSize: '1rem',
                outline: 'none',
              }}
            />
            <button 
              className="btn-primary" 
              style={{ whiteSpace: 'nowrap' }}
              onClick={() => onGetStarted('register', email)}
            >
              {t('getGuide')}
            </button>
          </div>
      )}
      
      <p style={{
        marginTop: '1.5rem',
        fontSize: '0.875rem',
        color: 'var(--text-secondary)'
      }}>
        {isLoggedIn ? "" : t('socialProof')}
      </p>
    </section>
  );
};

export default Hero;
