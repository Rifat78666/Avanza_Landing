import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Phone, MessageSquare } from 'lucide-react';
import ItalianGlobe from './ItalianGlobe';

const ROTATING_PHRASES = [
  'Foreign Degree',
  'International Diploma',
  'Professional License',
  'Academic Credentials',
];

const TYPING_SPEED = 80;
const DELETING_SPEED = 40;
const PAUSE_AFTER_TYPING = 2000;
const PAUSE_AFTER_DELETING = 400;

const useTypewriter = (phrases) => {
  const [displayText, setDisplayText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const tick = useCallback(() => {
    const currentPhrase = phrases[phraseIndex];

    if (!isDeleting) {
      if (displayText.length < currentPhrase.length) {
        return setTimeout(() => {
          setDisplayText(currentPhrase.slice(0, displayText.length + 1));
        }, TYPING_SPEED);
      } else {
        return setTimeout(() => setIsDeleting(true), PAUSE_AFTER_TYPING);
      }
    } else {
      if (displayText.length > 0) {
        return setTimeout(() => {
          setDisplayText(currentPhrase.slice(0, displayText.length - 1));
        }, DELETING_SPEED);
      } else {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
        return setTimeout(() => {}, PAUSE_AFTER_DELETING);
      }
    }
  }, [displayText, phraseIndex, isDeleting, phrases]);

  useEffect(() => {
    const timer = tick();
    return () => clearTimeout(timer);
  }, [tick]);

  return displayText;
};

const Hero = ({ onGetStarted, isLoggedIn, userName, onboardingCompleted }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const animatedText = useTypewriter(ROTATING_PHRASES);

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
      alignItems: 'center',
      minHeight: '85vh',
      overflow: 'hidden',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '3rem 2rem',
    }}>

      {/* LEFT column — text content */}
      <div style={{
        flex: '1 1 500px',
        maxWidth: '600px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        textAlign: 'left',
        position: 'relative',
        zIndex: 2,
      }}>

        {/* 3-line heading with typewriter */}
        {isLoggedIn ? (
          <h1 style={{
            fontSize: 'clamp(2.8rem, 5vw, 4.2rem)',
            fontWeight: '800',
            lineHeight: '1.12',
            marginBottom: '1.5rem',
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)',
          }}>
            {t('heroAuthTitle').replace('{{name}}', userName || '')}
          </h1>
        ) : (
          <h1 style={{
            fontSize: 'clamp(1.8rem, 8vw, 4.2rem)',
            fontWeight: '800',
            lineHeight: '1.12',
            marginBottom: '1.5rem',
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)',
          }}>
            {/* Line 1 — static */}
            <span style={{ display: 'block' }}>
              Make Your
            </span>

            {/* Line 2 — animated typewriter in Italian green */}
            <span style={{
              display: 'block',
              color: '#009246',
              minHeight: '1.2em',
              whiteSpace: 'nowrap',
            }}>
              {animatedText}
              <span style={{
                display: 'inline-block',
                width: '3px',
                height: '0.9em',
                background: '#009246',
                marginLeft: '4px',
                verticalAlign: 'text-bottom',
                animation: 'cursorBlink 1s step-end infinite',
              }} />
            </span>

            {/* Line 3 — static */}
            <span style={{ display: 'block' }}>
              Work in Italy
            </span>
          </h1>
        )}

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
          <div className="hero-buttons-wrapper" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a
              href="tel:+393520266387"
              className="btn-primary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '1rem 2rem',
                fontSize: '1.1rem',
                textDecoration: 'none',
                color: '#FFFFFF',
                borderRadius: '8px',
              }}
            >
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
                borderColor: '#CE2B37',
                color: '#CE2B37',
              }}
              onClick={() => onGetStarted('register')}
            >
              <MessageSquare size={20} />
              Get Your Guide
            </button>
          </div>
        )}

        <p style={{
          marginTop: '1.5rem',
          fontSize: '0.875rem',
          color: 'var(--text-secondary)',
          opacity: 0.7,
        }}>
          {isLoggedIn ? '' : t('socialProof')}
        </p>
      </div>

      {/* Globe — positioned right on desktop, centered on mobile via CSS */}
      <div className="hero-globe-wrapper" style={{
        position: 'absolute',
        right: '5%',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 0,
        pointerEvents: 'none',
      }}>
        <ItalianGlobe size={550} />
      </div>

      {/* Cursor blink animation */}
      <style>{`
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </section>
  );
};

export default Hero;
