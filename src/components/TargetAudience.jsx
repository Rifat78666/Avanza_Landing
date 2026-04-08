import React from 'react';
import { useLanguage } from '../LanguageContext';

const TargetAudience = () => {
  const { t } = useLanguage();
  
  const roles = [t('engineers'), t('nurses'), t('teachers'), t('accountants')];

  return (
    <section className="section container" style={{ position: 'relative', zIndex: 10 }}>
      <div style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '4rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>{t('targetTitle')}</h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', marginBottom: '3rem', fontSize: '1.1rem' }}>
          {t('targetSub')}
        </p>
        
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          justifyContent: 'center', 
          gap: '1rem' 
        }}>
          {roles.map((role) => (
            <div key={role} style={{
              padding: '0.75rem 1.5rem',
              background: 'var(--surface-color)',
              border: '1px solid rgba(209, 247, 39, 0.2)',
              borderRadius: '30px',
              color: 'var(--text-primary)',
              fontWeight: 500,
              boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
            }}>
              {role}
            </div>
          ))}
          <div style={{
            padding: '0.75rem 1.5rem',
            background: 'transparent',
            border: '1px dashed var(--border-color)',
            borderRadius: '30px',
            color: 'var(--text-secondary)',
            fontWeight: 500,
          }}>
            {t('andMore')}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TargetAudience;
