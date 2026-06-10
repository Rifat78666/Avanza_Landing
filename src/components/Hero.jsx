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
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      minHeight: '60vh',
      justifyContent: 'center',
      paddingTop: '4rem',
      paddingBottom: '2rem',
      overflow: 'hidden',
    }}>

      {/* Globe — absolute background, behind centered text */}
      <div style={{
        position: 'absolute',
        right: '-40px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 1,
        pointerEvents: 'none',
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,146,70,0.08) 0%, rgba(206,43,55,0.04) 50%, transparent 70%)',
        }} />
        <ItalianGlobe size={560} />
      </div>

      <h1 style={{
        fontSize: 'clamp(3rem, 5vw, 4.5rem)',
        fontWeight: '800',
        lineHeight: '1.1',
        marginBottom: '1.5rem',
        maxWidth: '850px',
        letterSpacing: '-0.02em',
        color: 'var(--text-primary)',
        position: 'relative',
        zIndex: 2,
      }}>
        {isLoggedIn ? t('heroAuthTitle').replace('{{name}}', userName || '') : t('heroTitle')}
      </h1>

      <p style={{
        fontSize: '1.25rem',
        color: 'var(--text-secondary)',
        maxWidth: '650px',
        marginBottom: '3rem',
        lineHeight: '1.6',
        position: 'relative',
        zIndex: 2,
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
              boxShadow: '0 8px 30px rgba(200, 241, 53, 0.3)',
            }}
            onClick={handleAuthCTA}
          >
            {onboardingCompleted ? t('heroAuthCTA') : t('continueJourney')}
          </button>
        </div>
      ) : (
        <div style={{
          display: 'flex',
          gap: '1rem',
          width: '100%',
          maxWidth: '500px',
          position: 'relative',
          zIndex: 50,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
          <a href="tel:+393520266387" className="btn-primary" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '1rem 2rem',
            fontSize: '1.1rem',
            textDecoration: 'none',
            color: '#FFFFFF',
            borderRadius: '8px',
          }}>
            <Phone size={20} />
            Contact Us
          </a>
          <button
            className="btn-outline"
            style={{
              padding: '1rem 2rem',
              fontSize: '1.1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '8px',
            }}
            onClick={() => onGetStarted('register')}
          >
            <MessageSquare size={20} />
            Enquire Us
          </button>
        </div>
      )}

      <p style={{
        marginTop: '1.5rem',
        fontSize: '0.875rem',
        color: 'var(--text-secondary)',
        position: 'relative',
        zIndex: 2,
      }}>
        {isLoggedIn ? '' : t('socialProof')}
      </p>
    </section>
  );
};

export default Hero;
