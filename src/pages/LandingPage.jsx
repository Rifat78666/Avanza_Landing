import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import TargetAudience from '../components/TargetAudience';
import Partners from '../components/Partners';

const LandingPage = ({ onGetStarted, isLoggedIn, userName, onboardingCompleted }) => {
  return (
    <>
      <Hero
        onGetStarted={onGetStarted}
        isLoggedIn={isLoggedIn}
        userName={userName}
        onboardingCompleted={onboardingCompleted}
      />
      <Features />
      <TargetAudience />
      <Partners />
    </>
  );
};

export default LandingPage;
