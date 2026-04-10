import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import TargetAudience from '../components/TargetAudience';
import Partners from '../components/Partners';

const LandingPage = ({ onGetStarted }) => {
  return (
    <>
      <Hero onGetStarted={onGetStarted} />
      <Features />
      <TargetAudience />
      <Partners />
    </>
  );
};

export default LandingPage;
