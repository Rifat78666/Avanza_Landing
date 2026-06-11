import React from 'react';

const TermsOfService = () => {
  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', padding: '6rem 2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'var(--surface-color)', padding: '3rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '2rem', color: 'var(--text-primary)' }}>
          Terms of Service
        </h1>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '1.5rem' }}>
          Welcome to AVANZA. By accessing our website and using our services, you agree to comply with and be bound by the following terms and conditions of use.
        </p>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginTop: '2rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
          1. Use of Service
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '1.5rem' }}>
          AVANZA provides AI-driven roadmaps and consultation services to assist international professionals with degree recognition in Italy. The information provided is for guidance purposes and should not substitute official legal or administrative advice.
        </p>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginTop: '2rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
          2. User Accounts
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '1.5rem' }}>
          To access certain features, you may be required to register for an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
        </p>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginTop: '2rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
          3. Intellectual Property
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '1.5rem' }}>
          The content, layout, design, data, databases, and graphics on this website are protected by intellectual property laws and are owned by AVANZA unless otherwise stated.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginTop: '3rem', fontSize: '0.9rem' }}>
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default TermsOfService;
