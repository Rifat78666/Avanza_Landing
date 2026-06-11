import React from 'react';
import { useLanguage } from '../LanguageContext';

const About = () => {
  const { t } = useLanguage();

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', paddingBottom: '0' }}>
      
      {/* MISSION SECTION */}
      <section style={{ padding: '6rem 2rem 4rem', textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{
          fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
          fontWeight: '800',
          color: 'var(--text-primary)',
          marginBottom: '2.5rem',
          letterSpacing: '-0.02em'
        }}>
          Our Mission
        </h1>
        <p style={{
          fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)',
          lineHeight: '1.7',
          color: 'var(--text-secondary)',
          fontWeight: '400',
          textWrap: 'balance',
          margin: '0 auto'
        }}>
          Our commitment drives the advancement of global mobility tailored for international professionals and students seeking degree recognition in Italy. We believe that no bureaucratic system should stand in the way of talent. That's why we empower immigrants to confidently build their future by combining our deep, firsthand expertise with our state-of-the-art AI-driven roadmaps.
        </p>
      </section>

      {/* MEET THE TEAM SECTION */}
      <section style={{ 
        backgroundColor: '#0d0d0d', 
        color: '#ffffff',
        padding: '6rem 2rem',
        marginTop: '2rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <div style={{ marginBottom: '4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ width: '4px', height: '24px', backgroundColor: 'var(--accent-red)' }}></div>
              <span style={{ fontSize: '1rem', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>
                The Team
              </span>
            </div>
            <h2 style={{
              fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
              fontWeight: '800',
              letterSpacing: '-0.02em',
              lineHeight: '1.2'
            }}>
              Built by people who lived it.
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem'
          }}>
            
            {/* PALLAB CARD */}
            <div style={{
              backgroundColor: '#161616',
              border: '1px solid #2a2a2a',
              borderRadius: '16px',
              padding: '2.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                <img 
                  src="https://github.com/pallab.png" 
                  alt="Pallab Mondal" 
                  style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '4px solid var(--accent-red)',
                    boxShadow: '0 0 20px rgba(206, 43, 55, 0.2)'
                  }}
                />
                <div>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.25rem' }}>Pallab Mondal</h3>
                  <p style={{ color: 'var(--accent-red)', fontWeight: '600', fontSize: '0.95rem' }}>Founder & AI Specialist</p>
                </div>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.6', fontSize: '1.05rem' }}>
                Navigated Italy's recognition system firsthand and built AVANZA to give every immigrant the guide nobody gave him.
              </p>
            </div>

            {/* RIFATUL CARD */}
            <div style={{
              backgroundColor: '#161616',
              border: '1px solid #2a2a2a',
              borderRadius: '16px',
              padding: '2.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                <img 
                  src="https://github.com/Rifat78666.png" 
                  alt="Rifatul Haque" 
                  style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '4px solid var(--accent-color)',
                    boxShadow: '0 0 20px rgba(0, 146, 70, 0.2)'
                  }}
                />
                <div>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.25rem' }}>Rifatul Haque</h3>
                  <p style={{ color: 'var(--accent-color)', fontWeight: '600', fontSize: '0.95rem' }}>Co-Founder · Systems & AI</p>
                </div>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.6', fontSize: '1.05rem' }}>
                Designs the AI engine and platform infrastructure powering AVANZA's personalised roadmaps at scale.
              </p>
            </div>

          </div>

          <div style={{ marginTop: '5rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
            <span style={{ color: 'var(--accent-red)', fontSize: '4rem', lineHeight: '0.8', fontWeight: '900', fontFamily: 'serif' }}>"</span>
            <h3 style={{ 
              fontSize: 'clamp(1.5rem, 3vw, 2rem)', 
              fontWeight: '600', 
              fontStyle: 'italic', 
              color: '#ffffff',
              letterSpacing: '-0.02em',
              marginTop: '0.5rem'
            }}>
              We didn't study the problem. We lived it.
            </h3>
          </div>

        </div>
      </section>
    </div>
  );
};

export default About;
