import React from 'react';

const Footer = () => {

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
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
          &copy; {new Date().getFullYear()} AVANZA. All rights reserved. Registered In Italy.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
