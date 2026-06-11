import React from 'react';
import { useLanguage } from '../LanguageContext';

const AboutSummary = () => {
    const { t } = useLanguage();

    return (
        <section className="container" style={{ 
            padding: '4rem 2rem', 
            textAlign: 'center',
            background: 'var(--surface-color)',
            borderRadius: '16px',
            margin: '2rem auto',
            maxWidth: '1000px',
            border: '1px solid var(--border-color)'
        }}>
            <h2 style={{ 
                fontSize: '1.2rem', 
                textTransform: 'uppercase', 
                letterSpacing: '2px', 
                color: 'var(--accent-color)',
                marginBottom: '1.5rem',
                fontWeight: '800'
            }}>
                {t('aboutTitle')}
            </h2>
            <p style={{ 
                fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)', 
                lineHeight: '1.6', 
                color: 'var(--text-primary)',
                maxWidth: '800px',
                margin: '0 auto',
                fontWeight: '400',
                textWrap: 'pretty'
            }}>
                {t('aboutDesc')}
            </p>
        </section>
    );
};

export default AboutSummary;
