import React from 'react';
import { useLanguage } from '../LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Phone, MessageSquare } from 'lucide-react';
import ItalianGlobe from './ItalianGlobe';

const Hero = ({ onGetStarted, isLoggedIn, userName, onboardingCompleted }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleAuthCTA = () => {
    if (onboardingCompleted) {
      navigate('/dashboard');
    } else {
      navigate('/onboarding');
    }
  };

  return (
    <section className="container" style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: '80vh',
      paddingTop: '3rem',
      paddingBottom: '3rem',
      gap: '2rem',
      flexWrap: 'wrap',
    }}>

      {/* LEFT — text content */}
      <div style={{
        flex: '1 1 420px',
        maxWidth: '580px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        textAlign: 'left',
      }}>
        {/* Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'rgba(0,146,70,0.12)',
          border: '1px solid rgba(0,146,70,0.3)',
          color: '#009246',
          borderRadius: '999px',
          padding: '0.35rem 1rem',
          fontSize: '0.82rem',
          fontWeight: '700',
          marginBottom: '1.75rem',
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
        }}>
          <span style={{ fontSize: '1rem' }}>🇮🇹</span>
          Your Italian Career Navigator
        </div>

        <h1 style={{
          fontSize: 'clamp(2.6rem, 5vw, 4.2rem)',
          fontWeight: '900',
          lineHeight: '1.08',
          marginBottom: '1.5rem',
          letterSpacing: '-0.03em',
          color: 'var(--text-primary)',
        }}>
          {isLoggedIn
            ? t('heroAuthTitle').replace('{{name}}', userName || '')
            : t('heroTitle')}
        </h1>

        <p style={{
          fontSize: '1.15rem',
          color: 'var(--text-secondary)',
          maxWidth: '520px',
          marginBottom: '2.5rem',
          lineHeight: '1.7',
        }}>
          {isLoggedIn ? t('heroAuthSub') : t('heroSub')}
        </p>

        {isLoggedIn ? (
          <button
            className="btn-primary"
            style={{
              padding: '1.1rem 2.75rem',
              fontSize: '1.1rem',
              borderRadius: '10px',
              boxShadow: '0 8px 30px rgba(0,146,70,0.25)',
            }}
            onClick={handleAuthCTA}
          >
            {onboardingCompleted ? t('heroAuthCTA') : t('continueJourney')}
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a
              href="tel:+393520266387"
              className="btn-primary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '1rem 2rem',
                fontSize: '1rem',
                textDecoration: 'none',
                color: '#FFFFFF',
                borderRadius: '8px',
              }}
            >
              <Phone size={18} />
              Contact Us
            </a>
            <button
              className="btn-outline"
              style={{
                padding: '1rem 2rem',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                borderRadius: '8px',
              }}
              onClick={() => onGetStarted('register')}
            >
              <MessageSquare size={18} />
              Enquire Us
            </button>
          </div>
        )}

        <p style={{
          marginTop: '1.5rem',
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
          opacity: 0.7,
        }}>
          {isLoggedIn ? '' : t('socialProof')}
        </p>
      </div>

      {/* RIGHT — Italian wireframe globe */}
      <div style={{
        flex: '0 0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}>
        {/* Soft glow behind globe */}
        <div style={{
          position: 'absolute',
          width: '420px',
          height: '420px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,146,70,0.08) 0%, rgba(206,43,55,0.04) 50%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <ItalianGlobe size={440} />
      </div>

    </section>
  );
};

export default Hero;
