import React from 'react';
import { useLanguage } from '../LanguageContext';

const TargetAudience = () => {
  const { t } = useLanguage();
  
  const priorityRoles = [
      { name: t('electricians'), icon: '⚡', priority: true },
      { name: t('nurses'), icon: '🏥', priority: true },
  ];

  const secondaryRoles = [
      { name: t('engineers'), icon: '⚙️' },
      { name: t('teachers'), icon: '📚' },
      { name: t('accountants'), icon: '📊' }
  ];

  return (
    <section className="section container" style={{ position: 'relative', zIndex: 10 }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h2 style={{ 
          fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', 
          marginBottom: '1rem', 
          fontWeight: '700',
          letterSpacing: '-0.5px' 
        }}>Priority Job Categories</h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem', lineHeight: '1.6' }}>
          We specialize in fast-tracking recognition for these high-demand sectors in Italy.
        </p>
      </div>

      <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
          alignItems: 'center'
      }}>
          {/* Priority Row */}
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            justifyContent: 'center', 
            gap: '1.5rem',
            width: '100%'
          }}>
            {priorityRoles.map((role) => (
              <div key={role.name} style={{
                padding: '1.5rem 3rem',
                background: 'var(--bg-color)',
                border: '1px solid var(--accent-color)',
                borderRadius: '10px',
                color: 'var(--text-primary)',
                fontSize: '1.5rem',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                boxShadow: 'none',
                transition: 'all 0.3s ease',
                cursor: 'default'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 14px 0 rgba(0, 146, 70, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                <span style={{ fontSize: '2rem' }}>{role.icon}</span>
                {role.name}
              </div>
            ))}
          </div>

          {/* Secondary Row */}
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            justifyContent: 'center', 
            gap: '1rem' 
          }}>
            {secondaryRoles.map((role) => (
              <div key={role.name} style={{
                padding: '0.75rem 1.5rem',
                background: 'var(--surface-color)',
                border: '1px solid var(--border-color)',
                borderRadius: '30px',
                color: 'var(--text-secondary)',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span>{role.icon}</span>
                {role.name}
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
