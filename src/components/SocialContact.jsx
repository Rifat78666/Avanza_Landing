import React from 'react';
import { useLanguage } from '../LanguageContext';
import { 
  Mail, Phone, MapPin, ExternalLink 
} from 'lucide-react';

// Premium Social SVGs for better branding and compatibility
const SocialIcons = {
  LinkedIn: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  ),
  Twitter: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
    </svg>
  ),
  Instagram: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  ),
  Facebook: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.1 10.125 24v-8.437H7.078v-3.49h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.1 24 18.1 24 12.073z"/>
    </svg>
  )
};

const SocialContact = () => {
  const { t } = useLanguage();

  return (
    <section style={{
      padding: '5rem 1.5rem',
      marginTop: '4rem',
      borderTop: '1px solid var(--border-color)',
      position: 'relative',
      zIndex: 50
    }}>
      <div className="container" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '3rem',
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
            <a href="#" style={socialIconStyle} aria-label="LinkedIn"><SocialIcons.LinkedIn /></a>
            <a href="#" style={socialIconStyle} aria-label="Twitter"><SocialIcons.Twitter /></a>
            <a href="#" style={socialIconStyle} aria-label="Instagram"><SocialIcons.Instagram /></a>
            <a href="#" style={socialIconStyle} aria-label="Facebook"><SocialIcons.Facebook /></a>
          </div>
        </div>

        {/* Column 2: Contact Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3 style={columnTitleStyle}>{t('footerContact')}</h3>
          <div style={contactItemStyle}>
            <Mail size={18} color="#C8F135" />
            <a href="mailto:info@avanza.it.com" style={contactLinkStyle}>info@avanza.it.com</a>
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
    </section>
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

export default SocialContact;
