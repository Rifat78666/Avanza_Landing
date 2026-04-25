import React from 'react';
import { useLanguage } from '../LanguageContext';

const AboutSummary = () => {
    const { t } = useLanguage();

    return (
        <section className="container" style={{ 
            padding: '4rem 1.5rem', 
            textAlign: 'center',
            background: 'rgba(200, 241, 53, 0.02)',
            borderRadius: '24px',
            margin: '2rem auto',
            maxWidth: '1000px',
            border: '1px solid rgba(200, 241, 53, 0.1)'
        }}>
            <h2 style={{ 
                fontSize: '1.2rem', 
                textTransform: 'uppercase', 
                letterSpacing: '2px', 
                color: '#C8F135',
                marginBottom: '1.5rem',
                fontWeight: '700'
            }}>
                {t('aboutTitle')}
            </h2>
            <p style={{ 
                fontSize: '1.8rem', 
                lineHeight: '1.5', 
                color: '#FFFFFF',
                maxWidth: '800px',
                margin: '0 auto',
                fontWeight: '300'
            }}>
                {t('aboutDesc')}
            </p>
        </section>
    );
};

export default AboutSummary;
