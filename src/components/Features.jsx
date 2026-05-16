import React from 'react';
import { useLanguage } from '../LanguageContext';

const Features = () => {
  const { t } = useLanguage();

  const steps = [
    {
      problem: t('prob1'),
      solution: t('sol1'),
      icon: "📜"
    },
    {
      problem: t('prob2'),
      solution: t('sol2'),
      icon: "🎓"
    },
    {
      problem: t('prob3'),
      solution: t('sol3'),
      icon: "💼"
    }
  ];

  return (
    <section className="container" style={{ position: 'relative', zIndex: 10, paddingTop: '2rem', paddingBottom: '6rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{t('featuresTitle')}</h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          {t('featuresSub')}
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        marginTop: '2rem'
      }}>
        {steps.map((step, idx) => (
          <div key={idx} style={{
            background: 'var(--surface-color)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '2.5rem 2rem',
            transition: 'all 0.3s ease',
            cursor: 'default',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.borderColor = 'var(--accent-color)';
              e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'var(--border-color)';
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>{step.icon}</div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--accent-color)' }}>
              {step.problem}
            </h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7' }}>
              {step.solution}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
