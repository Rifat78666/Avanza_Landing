import React from 'react';
import { useLanguage } from '../LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer style={{
      background: 'rgba(8, 10, 15, 0.8)',
      backdropFilter: 'blur(20px)',
      padding: '2rem 1.5rem',
      position: 'relative',
      zIndex: 50
    }}>
      <div className="container" style={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
          &copy; {new Date().getFullYear()} AVANZA. All rights reserved. Registered In Italy.
        </p>
        <div style={{ display: 'flex', gap: '1.5rem', fontStyle: 'italic', color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>
          {t('quote')}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
