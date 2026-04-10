import React from 'react';
import { useLanguage } from '../LanguageContext';
import { 
  Linkedin, Twitter, Instagram, Facebook, 
  Mail, Phone, MapPin, ExternalLink 
} from 'lucide-react';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer style={{
      background: 'rgba(8, 10, 15, 0.8)',
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid var(--border-color)',
      padding: '5rem 1.5rem 3rem',
      marginTop: '4rem',
      position: 'relative',
      zIndex: 50
    }}>
      <div className="container" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '3rem',
        marginBottom: '4rem'
      }}>
        {/* Branch 1: Branding */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h2 style={{ 
            fontSize: '1.8rem', 
            fontWeight: '900', 
            letterSpacing: '-1.5px',
            color: '#FFFFFF'
          }}>
            AVANZA
          </h2>
          <p style={{ 
            color: 'var(--text-secondary)', 
            lineHeight: '1.6',
            fontSize: '1rem',
            maxWidth: '300px'
          }}>
            {t('heroSub')}
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <a href="#" style={socialIconStyle} aria-label="LinkedIn"><Linkedin size={20} /></a>
            <a href="#" style={socialIconStyle} aria-label="Twitter"><Twitter size={20} /></a>
            <a href="#" style={socialIconStyle} aria-label="Instagram"><Instagram size={20} /></a>
            <a href="#" style={socialIconStyle} aria-label="Facebook"><Facebook size={20} /></a>
          </div>
        </div>

        {/* Column 2: Contact Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3 style={columnTitleStyle}>{t('footerContact')}</h3>
          <div style={contactItemStyle}>
            <Mail size={18} color="#C8F135" />
            <a href="mailto:info@avanza.it" style={contactLinkStyle}>info@avanza.it</a>
          </div>
          <div style={contactItemStyle}>
            <Phone size={18} color="#C8F135" />
            <a href="tel:+39021234567" style={contactLinkStyle}>+39 02 123 4567</a>
          </div>
          <div style={contactItemStyle}>
            <MapPin size={18} color="#C8F135" />
            <span style={contactLinkStyle}>Via Hoepli, 5, 20121 Milano, Italy</span>
          </div>
        </div>

        {/* Column 3: Quick Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3 style={columnTitleStyle}>{t('footerSupport')}</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <li><a href="#" style={footerLinkStyle}>{t('footerAbout')}</a></li>
            <li><a href="#" style={footerLinkStyle}>{t('footerPrivacy')}</a></li>
            <li><a href="#" style={footerLinkStyle}>{t('footerTerms')}</a></li>
            <li><a href="#" style={footerLinkStyle}>FAQ</a></li>
          </ul>
        </div>

        {/* Column 4: Newsletter/CTA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3 style={columnTitleStyle}>{t('footerFollow')}</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
            Stay updated with the latest changes in Italian immigration and labor laws.
          </p>
          <div style={{ position: 'relative' }}>
             <button style={{
               background: 'rgba(200, 241, 53, 0.1)',
               color: '#C8F135',
               border: '1px solid rgba(200, 241, 53, 0.3)',
               padding: '0.8rem 1.25rem',
               borderRadius: '8px',
               fontWeight: 'bold',
               cursor: 'pointer',
               display: 'flex',
               alignItems: 'center',
               gap: '0.5rem',
               width: 'fit-content'
             }}>
               Join our community <ExternalLink size={16} />
             </button>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div style={{ 
        borderTop: '1px solid rgba(255,255,255,0.05)', 
        paddingTop: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
          &copy; {new Date().getFullYear()} AVANZA. All rights reserved. Registered In Italy.
        </p>
        <div style={{ display: 'flex', gap: '1.5rem', fontStyle: 'italic', color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>
          {t('quote')}
        </div>
      </div>
    </footer>
  );
};

const columnTitleStyle = {
  fontSize: '1.1rem',
  fontWeight: 'bold',
  color: '#FFFFFF',
  marginBottom: '0.5rem'
};

const socialIconStyle = {
  width: '38px',
  height: '38px',
  borderRadius: '8px',
  background: 'rgba(255,255,255,0.05)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'var(--text-secondary)',
  transition: 'all 0.3s ease',
  border: '1px solid rgba(255,255,255,0.05)'
};

const contactItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.8rem',
  color: 'var(--text-secondary)'
};

const contactLinkStyle = {
  color: 'var(--text-secondary)',
  textDecoration: 'none',
  fontSize: '0.95rem',
  transition: 'color 0.3s ease'
};

const footerLinkStyle = {
  color: 'var(--text-secondary)',
  textDecoration: 'none',
  fontSize: '0.95rem',
  transition: 'all 0.3s ease'
};

export default Footer;
