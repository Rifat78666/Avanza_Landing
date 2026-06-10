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
    <section style={{
      position: 'relative',
      minHeight: '88vh',
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden',
      background: 'var(--bg-color)',
    }}>

      {/* Globe — absolute right, centered vertically, behind text */}
      <div style={{
        position: 'absolute',
        right: '-40px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 1,
        pointerEvents: 'none',
        opacity: 0.92,
      }}>
        <ItalianGlobe size={560} />
      </div>

      {/* Text content — sits above the globe */}
      <div className="container" style={{
        position: 'relative',
        zIndex: 2,
        paddingTop: '3rem',
        paddingBottom: '3rem',
      }}>

        {/* Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'rgba(0,146,70,0.08)',
          border: '1px solid rgba(0,146,70,0.25)',
          color: '#009246',
          borderRadius: '999px',
          padding: '0.35rem 1.1rem',
          fontSize: '0.78rem',
          fontWeight: '700',
          marginBottom: '2rem',
          letterSpacing: '0.8px',
          textTransform: 'uppercase',
        }}>
          <span>🇮🇹</span> Your Italian Career Navigator
        </div>

        {/* Main heading — large, left-aligned, wraps naturally */}
        <h1 style={{
          fontSize: 'clamp(3rem, 6.5vw, 5.2rem)',
          fontWeight: '900',
          lineHeight: '1.06',
          letterSpacing: '-0.03em',
          color: 'var(--text-primary)',
          marginBottom: '1.5rem',
          maxWidth: '780px',
        }}>
          {isLoggedIn
            ? t('heroAuthTitle').replace('{{name}}', userName || '')
            : (
              <>
                {t('heroTitle').split(' ').slice(0, 2).join(' ')}{' '}
                <span style={{ color: '#009246' }}>
                  {t('heroTitle').split(' ').slice(2, 4).join(' ')}
                </span>{' '}
                {t('heroTitle').split(' ').slice(4).join(' ')}
              </>
            )
          }
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: '1.15rem',
          color: 'var(--text-secondary)',
          maxWidth: '540px',
          marginBottom: '2.75rem',
          lineHeight: '1.75',
          fontWeight: '400',
        }}>
          {isLoggedIn ? t('heroAuthSub') : t('heroSub')}
        </p>

        {/* CTAs */}
        {isLoggedIn ? (
          <button
            className="btn-primary"
            style={{ padding: '1.1rem 2.75rem', fontSize: '1.05rem', borderRadius: '10px' }}
            onClick={handleAuthCTA}
          >
            {onboardingCompleted ? t('heroAuthCTA') : t('continueJourney')}
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <a
              href="tel:+393520266387"
              className="btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '1rem 2.25rem',
                fontSize: '1rem',
                textDecoration: 'none',
                color: '#fff',
                borderRadius: '8px',
                fontWeight: '600',
              }}
            >
              <Phone size={18} />
              Contact Us
            </a>
            <button
              className="btn-outline"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '1rem 2.25rem',
                fontSize: '1rem',
                borderRadius: '8px',
                fontWeight: '500',
              }}
              onClick={() => onGetStarted('register')}
            >
              <MessageSquare size={18} />
              Enquire Us
            </button>
          </div>
        )}

        {!isLoggedIn && (
          <p style={{
            marginTop: '1.5rem',
            fontSize: '0.82rem',
            color: 'var(--text-secondary)',
            opacity: 0.65,
          }}>
            {t('socialProof')}
          </p>
        )}
      </div>
    </section>
  );
};

export default Hero;
