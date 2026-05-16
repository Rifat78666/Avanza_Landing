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
        padding: '3rem 1.5rem',
        textAlign: 'center',
        background: 'radial-gradient(circle at center, rgba(200, 241, 53, 0.03) 0%, transparent 70%)',
        position: 'relative'
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            width: '40px',
            height: '2px',
            background: '#C8F135',
            margin: '0 auto 2rem',
            opacity: 0.5
          }}></div>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '400',
            fontStyle: 'italic',
            color: 'var(--text-primary)',
            lineHeight: '1.4',
            maxWidth: '1000px',
            margin: '0 auto',
            letterSpacing: '-1px'
          }}>
            "{t('quote')}"
          </h2>
          <div style={{
            width: '40px',
            height: '2px',
            background: '#C8F135',
            margin: '2rem auto 0',
            opacity: 0.5
          }}></div>
        </div>
      </section>
    </>
  );
};

export default LandingPage;
