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
    <section className="section container" style={{ position: 'relative', zIndex: 10 }}>
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
            background: 'rgba(18, 22, 32, 0.7)',
            backdropFilter: 'blur(10px)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '2.5rem 2rem',
            transition: 'transform 0.3s ease, border-color 0.3s ease',
            cursor: 'default'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.borderColor = 'rgba(209, 247, 39, 0.3)';
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
