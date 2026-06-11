import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', padding: '6rem 2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'var(--surface-color)', padding: '3rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '2rem', color: 'var(--text-primary)' }}>
          Privacy Policy
        </h1>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '1.5rem' }}>
          At AVANZA, we take your privacy seriously. This Privacy Policy outlines the types of personal information we receive and collect when you use our services, as well as some of the steps we take to safeguard information.
        </p>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginTop: '2rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
          Information Collection
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '1.5rem' }}>
          We collect information to provide better services to all our users. This may include your name, email address, educational background, and other details necessary to assist with degree recognition and professional licensing in Italy.
        </p>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginTop: '2rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
          How We Use Your Information
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '1.5rem' }}>
          The information we collect is used to personalize your roadmap, improve our AI recommendations, and communicate with you about your progress and relevant services. We do not sell your personal information to third parties.
        </p>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginTop: '2rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
          Data Security
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '1.5rem' }}>
          We implement appropriate technical and organizational measures to protect your personal data against unauthorized or unlawful processing, accidental loss, destruction, or damage.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginTop: '3rem', fontSize: '0.9rem' }}>
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
