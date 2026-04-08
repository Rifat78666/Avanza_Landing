import React from 'react';
import { useLanguage } from '../LanguageContext';

const Partners = () => {
  const { t } = useLanguage();

  return (
    <section className="section container" style={{ position: 'relative', zIndex: 10 }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.875rem', marginBottom: '2rem' }}>
          {t('partnersTitle')}
        </p>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: '4rem',
          opacity: 0.6,
          filter: 'grayscale(100%)'
        }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>CAF Offices</h3>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>Patronati</h3>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>Arci</h3>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>Caritas</h3>
        </div>
      </div>
    </section>
  );
};

export default Partners;
