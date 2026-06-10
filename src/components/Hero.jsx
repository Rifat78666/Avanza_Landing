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
      // Typing
      if (displayText.length < currentPhrase.length) {
        return setTimeout(() => {
          setDisplayText(currentPhrase.slice(0, displayText.length + 1));
        }, TYPING_SPEED);
      } else {
        // Finished typing — pause then start deleting
        return setTimeout(() => setIsDeleting(true), PAUSE_AFTER_TYPING);
      }
    } else {
      // Deleting
      if (displayText.length > 0) {
        return setTimeout(() => {
          setDisplayText(currentPhrase.slice(0, displayText.length - 1));
        }, DELETING_SPEED);
      } else {
        // Finished deleting — move to next phrase
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
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      minHeight: '80vh',
      justifyContent: 'center',
      paddingTop: '4rem',
      paddingBottom: '2rem',
      overflow: 'hidden',
    }}>

      {/* Globe — large, centered behind text */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1,
        pointerEvents: 'none',
      }}>
        <ItalianGlobe size={750} />
      </div>

      {/* 3-line animated heading */}
      {isLoggedIn ? (
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
          {t('heroAuthTitle').replace('{{name}}', userName || '')}
        </h1>
      ) : (
        <h1 style={{
          fontSize: 'clamp(2.8rem, 5.5vw, 4.5rem)',
          fontWeight: '800',
          lineHeight: '1.15',
          marginBottom: '1.5rem',
          maxWidth: '900px',
          letterSpacing: '-0.02em',
          color: 'var(--text-primary)',
          position: 'relative',
          zIndex: 2,
        }}>
          {/* Line 1 — static */}
          <span style={{ display: 'block' }}>
            Make Your
          </span>

          {/* Line 2 — animated typewriter */}
          <span style={{
            display: 'block',
            color: '#009246',
            minHeight: '1.2em',
          }}>
            {animatedText}
            <span style={{
              display: 'inline-block',
              width: '3px',
              height: '1em',
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
