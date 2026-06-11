import React from 'react';
import Hero from '../components/Hero';
import AboutSummary from '../components/AboutSummary';
import Features from '../components/Features';
import TargetAudience from '../components/TargetAudience';
import { useLanguage } from '../LanguageContext';

const LandingPage = ({ onGetStarted, isLoggedIn, userName, onboardingCompleted }) => {
  const { t } = useLanguage();
  return (
    <>
      <Hero
        onGetStarted={onGetStarted}
        isLoggedIn={isLoggedIn}
        userName={userName}
        onboardingCompleted={onboardingCompleted}
      />
      
      <AboutSummary />

      <div id="features">
        <Features 
          isLoggedIn={isLoggedIn} 
          onGetStarted={onGetStarted} 
        />
      </div>
      <div id="target-audience">
        <TargetAudience />
      </div>
      
      {/* Premium Mission Slogan Section */}
      <section style={{
        padding: '4rem 1.5rem',
        textAlign: 'center',
        background: 'radial-gradient(circle at center, rgba(0, 146, 70, 0.04) 0%, transparent 70%)',
        position: 'relative'
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            width: '60px',
            height: '3px',
            background: 'var(--accent-color)',
            margin: '0 auto 2.5rem',
            opacity: 0.8
          }}></div>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
            fontWeight: '700',
            color: 'var(--text-primary)',
            lineHeight: '1.4',
            maxWidth: '900px',
            margin: '0 auto',
            letterSpacing: '-0.5px',
            textWrap: 'balance'
          }}>
            "{t('quote')}"
          </h2>
          <div style={{
            width: '60px',
            height: '3px',
            background: 'var(--accent-color)',
            margin: '2.5rem auto 0',
            opacity: 0.8
          }}></div>
        </div>
      </section>
    </>
  );
};

export default LandingPage;
