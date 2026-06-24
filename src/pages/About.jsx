import React from 'react';
import { useLanguage } from '../LanguageContext';

const About = () => {
  const { t } = useLanguage();

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', paddingBottom: '0' }}>
      
      {/* MISSION SECTION */}
      <section style={{ padding: '6rem 2rem 4rem', textAlign: 'center', maxWidth: '1000px', margin: '0 auto' }}>
        <h2 style={{
          fontSize: 'clamp(2.2rem, 4vw, 3rem)',
          fontWeight: '800',
          color: '#000000',
          marginBottom: '1.5rem'
        }}>
          Our Mission
        </h2>

        <p style={{
          maxWidth: '1000px',
          margin: '0 auto',
          fontSize: '1.1rem',
          lineHeight: '1.8',
          color: '#333333',
          fontWeight: '400'
        }}>
          Our commitment drives the advancement of global mobility tailored for international professionals and students seeking degree recognition in Italy. We believe that no bureaucratic system should stand in the way of talent. That's why we empower immigrants to confidently build their future by combining our deep, firsthand expertise with our state-of-the-art AI-driven roadmaps.
        </p>
      </section>

      {/* MEET THE TEAM SECTION */}
      <section style={{ backgroundColor: '#ffffff', paddingBottom: '6rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem', paddingTop: '2rem', paddingLeft: '2rem', paddingRight: '2rem' }}>
          <h2 style={{
            fontSize: 'clamp(2.2rem, 4vw, 3rem)',
            fontWeight: '800',
            color: '#000000',
            marginBottom: '1.5rem'
          }}>
            Meet The Team
          </h2>
          <p style={{
            maxWidth: '1000px',
            margin: '0 auto',
            fontSize: '1.1rem',
            lineHeight: '1.8',
            color: '#333333'
          }}>
            AVANZA team believes in the vision of enabling seamless global mobility for international professionals. We are gathered around a mutual purpose, which is not only to transform immigrants' experiences into a structured roadmap, but also to create a sustainable and fair recognition system for the upcoming generations.
          </p>
        </div>

        <div style={{ position: 'relative' }}>
          {/* Background stripe */}
          <div style={{
            position: 'absolute',
            top: '20%',
            bottom: '30%',
            left: 0,
            right: 0,
            background: 'linear-gradient(to right, rgba(0, 146, 70, 0.15) 0%, rgba(255, 255, 255, 0) 50%, rgba(206, 43, 55, 0.15) 100%)',
            zIndex: 1
          }}></div>

          <div style={{
            position: 'relative',
            zIndex: 2,
            maxWidth: '900px',
            margin: '0 auto',
            padding: '0 2rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '3rem',
            justifyContent: 'center'
          }}>
            
            {/* PALLAB CARD */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <img 
                src="/pallab.png" 
                alt="Pallab Mondal" 
                style={{
                  width: '100%',
                  aspectRatio: '1 / 1',
                  borderRadius: '12px',
                  objectFit: 'cover',
                  marginBottom: '1rem',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
                }}
              />
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#000000', marginBottom: '0.25rem' }}>Pallab Mondal</h3>
              <p style={{ color: '#555555', fontSize: '0.95rem', marginBottom: '1rem' }}>Founder & AI Specialist</p>
              <div style={{ background: '#ffffff', borderRadius: '8px', padding: '0.5rem', display: 'inline-block' }}>
                <img src="/university_logos.png" alt="University of Milan, Bicocca, Pavia" style={{ width: '100%', maxWidth: '220px', display: 'block', mixBlendMode: 'multiply' }} onError={(e) => e.target.style.display = 'none'} />
              </div>
            </div>

            {/* RIFATUL CARD */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <img 
                src="https://github.com/Rifat78666.png" 
                alt="Rifatul Haque" 
                style={{
                  width: '100%',
                  aspectRatio: '1 / 1',
                  borderRadius: '12px',
                  objectFit: 'cover',
                  marginBottom: '1rem',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
                }}
              />
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#000000', marginBottom: '0.25rem' }}>Rifatul Haque</h3>
              <p style={{ color: '#555555', fontSize: '0.95rem', marginBottom: '1rem' }}>Co-Founder · Systems & AI</p>
              <div style={{ background: '#ffffff', borderRadius: '8px', padding: '0.5rem', display: 'inline-block' }}>
                <img src="/university_logos.png" alt="University of Milan, Bicocca, Pavia" style={{ width: '100%', maxWidth: '220px', display: 'block', mixBlendMode: 'multiply' }} onError={(e) => e.target.style.display = 'none'} />
              </div>
            </div>

          </div>
          
          <div style={{ position: 'relative', zIndex: 2, marginTop: '5rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-start', justifyContent: 'center' }}>
            <span style={{ color: 'var(--accent-red)', fontSize: '4rem', lineHeight: '0.8', fontWeight: '900', fontFamily: 'serif' }}>"</span>
            <h3 style={{ 
              fontSize: 'clamp(1.5rem, 3vw, 2rem)', 
              fontWeight: '600', 
              fontStyle: 'italic', 
              color: '#000000',
              letterSpacing: '-0.02em',
              marginTop: '0.5rem',
              maxWidth: '800px'
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
