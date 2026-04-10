import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './index.css';
import { User } from 'lucide-react';

import NeuralBackground from './components/NeuralBackground';
import AuthModal from './components/AuthModal';

import { useLanguage } from './LanguageContext';
import { useStytch, useStytchUser } from '@stytch/react';

// Pages and Routes
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Onboarding from './pages/Onboarding';
import NameCollection from './pages/NameCollection';
import CVGenerator from './pages/CVGenerator';
import UploadCV from './pages/UploadCV';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';

function AppContent() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authStatus, setAuthStatus] = useState('loading'); // 'idle' | 'authenticating' | 'authenticated' | 'loading'
  const [fullProfileData, setFullProfileData] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [showNameCollection, setShowNameCollection] = useState(false);
  const [profileChecked, setProfileChecked] = useState(false);
  
  const { language, setLanguage, t, isRTL } = useLanguage();
  const stytch = useStytch();
  const { user } = useStytchUser();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle Magic Link redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const tokenType = params.get('stytch_token_type');

    if (token && tokenType === 'magic_links') {
      setAuthStatus('authenticating');
      stytch.magicLinks.authenticate(token, {
        session_duration_minutes: 60
      }).then(() => {
        setAuthStatus('authenticated');
        window.history.replaceState({}, document.title, window.location.pathname);
      }).catch((err) => {
        console.error('Magic Link authentication failed:', err);
        setAuthStatus('idle');
        window.history.replaceState({}, document.title, window.location.pathname);
      });
    }
  }, [stytch]);

  // When user session exists, fetch their profile from the backend
  useEffect(() => {
    if (user) {
      setAuthStatus('authenticated');
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const token = stytch.session.getTokens()?.session_token;
      if (!token) return;

      const resp = await fetch('http://localhost:8000/api/user/full-profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (resp.ok) {
        const data = await resp.json();
        setFullProfileData(data);
        
        // Only update display name if not null
        if (data.first_name) {
          setDisplayName(data.first_name);
        }
        
        // Protect the image URL from being overwritten by a stale 'null' 
        // if we just updated it locally (indicated by a unique filename)
        if (data.profile_image_url) {
          setProfileImageUrl(data.profile_image_url);
        }
        
        setAuthStatus('authenticated');
        
        if (!data.first_name) {
          setShowNameCollection(true);
        } else {
          setShowNameCollection(false);
          if (location.pathname === '/' || location.pathname === '') {
            if (data.onboarding_completed) {
              navigate('/dashboard');
            } else {
              navigate('/onboarding');
            }
          }
        }
      } else {
        navigate('/onboarding');
      }
      setProfileChecked(true);
    } catch (err) {
      console.error('Profile fetch error:', err);
      setProfileChecked(true);
    }
  };

  const handleNameSaved = async (name) => {
    setDisplayName(name);
    setShowNameCollection(false);
    
    // Now check onboarding status to route the user
    try {
      const token = stytch.session.getTokens()?.session_token;
      if (!token) return;

      const resp = await fetch('http://localhost:8000/api/user/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await resp.json();

      if (data.onboarding_completed) {
        navigate('/dashboard');
      } else {
        navigate('/onboarding');
      }
    } catch (err) {
      navigate('/onboarding');
    }
  };

  const [authEmail, setAuthEmail] = useState('');
  
  const openAuth = (mode, email = '') => {
    setAuthMode(mode);
    setAuthEmail(email);
    setIsAuthModalOpen(true);
  };

  const handleLogout = () => {
    stytch.session.revoke();
    setAuthStatus('idle');
    setDisplayName('');
    setProfileImageUrl(null);
    setShowNameCollection(false);
    setProfileChecked(false);
    navigate('/');
  };

  return (
    <div className="app" dir={isRTL ? 'rtl' : 'ltr'}>
      <NeuralBackground />

      {/* Name Collection Overlay */}
      {showNameCollection && authStatus === 'authenticated' && (
        <NameCollection onNameSaved={handleNameSaved} />
      )}
      
      <header className="container" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        padding: '1.5rem 1.5rem', 
        alignItems: 'center',
        position: 'relative',
        zIndex: 50
      }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '-1px', cursor: 'pointer' }} onClick={() => navigate('/')}>
          AVANZA
        </div>
        <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{ 
            background: 'transparent', 
            color: 'var(--text-secondary)', 
            border: 'none', 
            cursor: 'pointer',
            fontSize: '1rem',
            fontFamily: 'inherit',
            outline: 'none'
          }}>
            <option value="IT" style={{background: 'var(--surface-color)'}}>IT</option>
            <option value="EN" style={{background: 'var(--surface-color)'}}>EN</option>
            <option value="ES" style={{background: 'var(--surface-color)'}}>ES</option>
            <option value="AR" style={{background: 'var(--surface-color)'}}>AR</option>
            <option value="HI" style={{background: 'var(--surface-color)'}}>HI</option>
            <option value="FR" style={{background: 'var(--surface-color)'}}>FR</option>
            <option value="BN" style={{background: 'var(--surface-color)'}}>BN</option>
          </select>

          {authStatus === 'authenticated' && user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', display: window.innerWidth > 768 ? 'flex' : 'none' }}>
                 <span style={{ cursor: 'pointer', color: location.pathname === '/dashboard' ? 'var(--accent-color)' : 'var(--text-secondary)', fontWeight: location.pathname === '/dashboard' ? 'bold' : 'normal' }} onClick={() => navigate('/dashboard')}>{t('dashboard')}</span>
                 <span style={{ cursor: 'pointer', color: location.pathname === '/profile' ? 'var(--accent-color)' : 'var(--text-secondary)', fontWeight: location.pathname === '/profile' ? 'bold' : 'normal' }} onClick={() => navigate('/profile')}>{t('myProfile')}</span>
                 <span style={{ cursor: 'pointer', color: location.pathname === '/settings' ? 'var(--accent-color)' : 'var(--text-secondary)', fontWeight: location.pathname === '/settings' ? 'bold' : 'normal' }} onClick={() => navigate('/settings')}>{t('settings')}</span>
                 {user?.emails?.[0]?.email && user.emails[0].email === import.meta.env.VITE_ADMIN_EMAIL && (
                     <span style={{ cursor: 'pointer', color: 'var(--accent-color)', fontWeight: 'bold' }} onClick={() => navigate('/admin')}>{t('admin')}</span>
                 )}
                 <div style={{ borderLeft: '1px solid var(--border-color)', height: '20px' }}></div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-color)', fontWeight: 'bold' }}>
                  {profileImageUrl ? (
                      <img src={profileImageUrl} alt="Profile" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--accent-color)' }} />
                  ) : (
                      <User size={20} />
                  )}
                  <span style={{ marginRight: '1rem' }}>{displayName}</span>
              </div>
              <button 
                onClick={handleLogout} 
                style={{ 
                    background: 'transparent', 
                    color: 'var(--text-secondary)', 
                    border: '1px solid var(--border-color)', 
                    padding: '0.5rem 1rem', 
                    borderRadius: '8px', 
                    cursor: 'pointer' 
                }}>
                  {t('logout')}
              </button>
            </div>
          ) : authStatus === 'authenticating' ? (
            <span style={{ color: 'var(--text-secondary)' }}>Verifying...</span>
          ) : (
            <>
              <button className="btn-outline" onClick={() => openAuth('login')}>{t('loginBtn')}</button>
              <button className="btn-primary" onClick={() => openAuth('register')}>{t('getGuideBtn')}</button>
            </>
          )}
        </nav>
      </header>
      
      <main style={{ position: 'relative', zIndex: 1, minHeight: '60vh' }}>
        <Routes>
          <Route path="/" element={<LandingPage onGetStarted={openAuth} />} />
          <Route path="/onboarding" element={
              <ProtectedRoute>
                  <Onboarding />
              </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
              <ProtectedRoute>
                  <Dashboard 
                    displayName={displayName} 
                    fullProfile={fullProfileData}
                    refreshProfile={fetchUserProfile}
                  />
              </ProtectedRoute>
          } />
          <Route path="/profile" element={
              <ProtectedRoute>
                  <Profile 
                    displayName={displayName}
                    profileImageUrl={profileImageUrl}
                    fullProfile={fullProfileData}
                    onNameUpdate={(name) => {
                      setDisplayName(name);
                      fetchUserProfile();
                    }}
                    onImageUpdate={(url) => {
                      setProfileImageUrl(url);
                      fetchUserProfile();
                    }}
                  />
              </ProtectedRoute>
          } />
          <Route path="/cv-generator" element={
              <ProtectedRoute>
                  <CVGenerator />
              </ProtectedRoute>
          } />
          <Route path="/upload-cv" element={
              <ProtectedRoute>
                  <UploadCV />
              </ProtectedRoute>
          } />
        </Routes>
      </main>

      <footer className="container" style={{
        textAlign: 'center',
        padding: '3rem 0',
        marginTop: '2rem',
        borderTop: '1px solid var(--border-color)',
        position: 'relative',
        zIndex: 10
      }}>
        <p style={{
          fontSize: '1.25rem',
          fontStyle: 'italic',
          color: 'var(--text-secondary)',
        }}>
          {t('quote')}
        </p>
      </footer>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        initialMode={authMode}
        initialEmail={authEmail}
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
