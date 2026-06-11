import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './index.css';
import { User, CheckCircle, Calendar } from 'lucide-react';

import AuthModal from './components/AuthModal';

import { useLanguage } from './LanguageContext';
import { useStytch, useStytchUser } from '@stytch/react';

// Pages and Routes
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import PublicQuiz from './pages/PublicQuiz';
import NameCollection from './pages/NameCollection';
import CVGenerator from './pages/CVGenerator';
import UploadCV from './pages/UploadCV';
import Profile from './pages/Profile';
import DocumentVault from './pages/DocumentVault';
import AdminPortal from './pages/AdminPortal';
import TranslatorDirectory from './pages/TranslatorDirectory';
import CIMEAHub from './pages/CIMEAHub';
import BookConsultation from './pages/BookConsultation';
import About from './pages/About';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import FAQ from './pages/FAQ';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer';
import SocialContact from './components/SocialContact';

function AppContent() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authStatus, setAuthStatus] = useState('loading'); // 'idle' | 'authenticating' | 'authenticated' | 'loading'
  
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://avanza-backend-h0pm.onrender.com';
  const [fullProfileData, setFullProfileData] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [showNameCollection, setShowNameCollection] = useState(false);
  const [onboardingJustFinished, _setOnboardingJustFinished] = useState(false);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  
  const { language, setLanguage, t, isRTL } = useLanguage();
  const stytch = useStytch();
  const { user, isLoaded } = useStytchUser();
  const navigate = useNavigate();
  const location = useLocation();

  const fetchUserProfile = useCallback(async () => {
    try {
      const token = stytch.session.getTokens()?.session_token;
      if (!token) return;

      const resp = await fetch(`${API_BASE_URL}/api/user/full-profile`, {
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
        
        // Process any stored quiz data from before they logged in
        if (!data.onboarding_completed) {
            const saved = localStorage.getItem('avanza_onboarding_data');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    if (parsed.data) {
                        await fetch(`${API_BASE_URL}/api/onboarding`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify(parsed.data)
                        });
                        localStorage.removeItem('avanza_onboarding_data');
                        data.onboarding_completed = true; // Automatically mark complete in memory
                    }
                } catch(e) { console.error("Error saving quiz", e); }
            }
        }

        setAuthStatus('authenticated');
        
        if (!data.first_name) {
          setShowNameCollection(true);
        } else {
          setShowNameCollection(false);
          
          // Safety: If user is on dashboard but onboarding is incomplete, redirect them
          // EXCEPT if they just finished it (bypass loop)
          if (location.pathname === '/dashboard' && !data.onboarding_completed && !onboardingJustFinished) {
            navigate('/quiz');
            return;
          }

          if (location.pathname === '/' || location.pathname === '' || location.pathname === '/quiz') {
            if (data.onboarding_completed) {
              navigate('/dashboard');
            } else {
              navigate('/quiz');
            }
          }
        }
      }
    } catch (err) {
      console.error('Profile fetch error:', err);
    }
  }, [stytch, API_BASE_URL, navigate, location.pathname, onboardingJustFinished]);

  // Handle Magic Link redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const tokenType = params.get('stytch_token_type');

    if (token && tokenType === 'magic_links' && authStatus !== 'authenticating') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAuthStatus('authenticating');
      stytch.magicLinks.authenticate(token, {
        session_duration_minutes: 60
      }).then(() => {
        setAuthStatus('authenticated');
        setShowSuccessOverlay(true);
        setTimeout(() => setShowSuccessOverlay(false), 3500);
        window.history.replaceState({}, document.title, window.location.pathname);
        // Promptly fetch profile to trigger name collection if needed
        fetchUserProfile();
      }).catch((err) => {
        console.error('Magic Link authentication failed:', err);
        setAuthStatus('idle');
        window.history.replaceState({}, document.title, window.location.pathname);
      });
    }
  }, [stytch, authStatus, fetchUserProfile]);

  // When user session exists, fetch their profile from the backend
  useEffect(() => {
    // Safety timeout: if Stytch takes too long (>800ms), assume guest or error
    const timer = setTimeout(() => {
      if (authStatus === 'loading' || authStatus === 'authenticating') {
        setAuthStatus('idle');
      }
    }, 800);

    if (isLoaded) {
      if (user) {
        if (authStatus !== 'authenticated') {
          console.log("App: User session detected. API URL:", API_BASE_URL);
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setAuthStatus('authenticated');
          fetchUserProfile();
        }
      } else {
        // No user found, definitely idle
        if (authStatus !== 'idle') setAuthStatus('idle');
      }
    } else {
        // If not loaded yet, we can show a brief 'authenticating' state
        // but since we default to idle, we only set it if we expect a user
        const params = new URLSearchParams(window.location.search);
        if (params.get('token')) {
            setAuthStatus('authenticating');
        }
    }
    
    return () => clearTimeout(timer);
  }, [user, isLoaded, API_BASE_URL, authStatus, fetchUserProfile]);

  const handleNameSaved = async (name) => {
    setDisplayName(name);
    setShowNameCollection(false);
    
    // Now check onboarding status to route the user
    try {
      const token = stytch.session.getTokens()?.session_token;
      if (!token) return;

      const resp = await fetch(`${API_BASE_URL}/api/user/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await resp.json();

      // IMPORTANT: Refresh full profile so App state is ready for Dashboard
      await fetchUserProfile();

      if (data.onboarding_completed) {
        navigate('/dashboard');
      } else {
        navigate('/quiz');
      }
    } catch (err) {
      console.error('handleNameSaved error:', err);
      navigate('/quiz');
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
    // setProfileChecked(false);
    navigate('/');
  };

  return (
    <div className="app" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Name Collection Overlay */}
      {showNameCollection && authStatus === 'authenticated' && (
        <NameCollection onNameSaved={handleNameSaved} />
      )}
      
      <header className="container" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        padding: '1rem 1.5rem', 
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        backgroundColor: 'var(--bg-color)',
        borderBottom: '1px solid var(--border-color)',
        zIndex: 100
      }}>
        <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => navigate('/')}>
          <img src="/avanza_logo.png" alt="AVANZA" style={{ height: '65px', objectFit: 'contain', transform: 'scale(2)', transformOrigin: 'left center' }} />
        </div>
        <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <span 
            style={{ 
              cursor: 'pointer', 
              color: location.pathname === '/about' ? 'var(--accent-color)' : 'var(--text-secondary)', 
              fontWeight: location.pathname === '/about' ? 'bold' : 'normal', 
              fontSize: '1rem',
              display: window.innerWidth > 768 ? 'block' : 'none'
            }} 
            onClick={() => navigate('/about')}
          >
            About Us
          </span>
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
              <div style={{ gap: '1.5rem', alignItems: 'center', display: window.innerWidth > 768 ? 'flex' : 'none' }}>
                 <span style={{ cursor: 'pointer', color: location.pathname === '/dashboard' ? 'var(--accent-color)' : 'var(--text-secondary)', fontWeight: location.pathname === '/dashboard' ? 'bold' : 'normal' }} onClick={() => navigate('/dashboard')}>{t('dashboard')}</span>
                 <span style={{ cursor: 'pointer', color: location.pathname === '/profile' ? 'var(--accent-color)' : 'var(--text-secondary)', fontWeight: location.pathname === '/profile' ? 'bold' : 'normal' }} onClick={() => navigate('/profile')}>{t('myProfile')}</span>
                 <span style={{ cursor: 'pointer', color: location.pathname === '/settings' ? 'var(--accent-color)' : 'var(--text-secondary)', fontWeight: location.pathname === '/settings' ? 'bold' : 'normal' }} onClick={() => navigate('/settings')}>{t('settings')}</span>
                 {user?.emails?.[0]?.email && (import.meta.env.VITE_ADMIN_EMAILS || '').split(',').includes(user.emails[0].email) && (
                     <span style={{ cursor: 'pointer', color: 'var(--accent-color)', fontWeight: 'bold' }} onClick={() => navigate('/admin')}>{t('admin')}</span>
                 )}
                 <div style={{ borderLeft: '1px solid var(--border-color)', height: '20px' }}></div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-color)', fontWeight: '800', fontSize: '1.1rem' }}>
                  {profileImageUrl ? (
                      <img src={profileImageUrl} alt="Profile" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-color)' }} />
                  ) : (
                      <User size={22} color="var(--accent-color)" />
                  )}
                  <span style={{ marginLeft: '0.25rem', letterSpacing: '-0.5px' }}>{displayName}</span>
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
          ) : (authStatus === 'authenticating' || authStatus === 'loading') ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                <div className="mini-spinner" style={{ width: '14px', height: '14px', border: '2px solid rgba(0,0,0,0.1)', borderTopColor: 'var(--accent-color)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <span style={{ fontSize: '0.9rem' }}>Verifying...</span>
            </div>
          ) : (
            <>
              <button className="btn-outline" onClick={() => openAuth('login')}>{t('loginBtn')}</button>
              <button className="btn-primary" onClick={() => navigate('/book-consultation')} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Calendar size={16} />
                Book a Consultation
              </button>
            </>
          )}
        </nav>
      </header>
      
      <main style={{ position: 'relative', zIndex: 1, minHeight: '60vh' }}>
        <Routes>
          <Route path="/" element={
            <LandingPage 
              onGetStarted={() => navigate('/quiz')} 
              isLoggedIn={authStatus === 'authenticated'} 
              userName={displayName}
              onboardingCompleted={fullProfileData?.onboarding_completed}
            />
          } />
          <Route path="/about" element={
              <About />
          } />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/quiz" element={
              <PublicQuiz />
          } />
          <Route path="/book-consultation" element={
              <BookConsultation />
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
                    onLogout={handleLogout}
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
          <Route path="/vault" element={
              <ProtectedRoute>
                  <DocumentVault user_id={user?.id} />
              </ProtectedRoute>
          } />
          <Route path="/translators" element={
              <ProtectedRoute>
                  <TranslatorDirectory />
              </ProtectedRoute>
          } />
          <Route path="/cimea" element={
              <ProtectedRoute>
                  <CIMEAHub />
              </ProtectedRoute>
          } />
          <Route path="/admin" element={
              <ProtectedRoute>
                  {user?.emails?.[0]?.email && (import.meta.env.VITE_ADMIN_EMAILS || '').split(',').includes(user.emails[0].email) ? (
                      <AdminPortal />
                  ) : (
                      <div className="container" style={{ paddingTop: '10rem', textAlign: 'center' }}>
                          <h1 style={{ color: '#FF5555' }}>Access Denied</h1>
                          <p style={{ color: 'var(--text-secondary)' }}>You do not have administrative privileges to access this page.</p>
                      </div>
                  )}
              </ProtectedRoute>
          } />
        </Routes>
      </main>

      <SocialContact />
      <Footer />

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        initialMode={authMode}
        initialEmail={authEmail}
      />

      {/* Success Overlay Celebration */}
      {showSuccessOverlay && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(8,10,15,0.92)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(12px)', animation: 'fadeIn 0.4s ease-out forwards', padding: '2rem'
        }}>
          <div style={{ animation: 'popIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.25) forwards' }}>
            <div style={{ 
              width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(200, 241, 53, 0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid #C8F135',
              marginBottom: '2.5rem', boxShadow: '0 0 60px rgba(200, 241, 53, 0.25)'
            }}>
              <CheckCircle size={64} color="#C8F135" />
            </div>
          </div>
          <h1 style={{ fontSize: '4rem', fontWeight: '900', color: '#FFFFFF', marginBottom: '1.25rem', textAlign: 'center', letterSpacing: '-2px' }}>
            Congratulations!
          </h1>
          <p style={{ fontSize: '1.6rem', color: 'rgba(255,255,255,0.7)', textAlign: 'center', maxWidth: '600px', fontWeight: '500' }}>
            Welcome back to <span style={{ color: '#C8F135', fontWeight: '800' }}>AVANZA</span>. <br/>You are now securely logged in.
          </p>
        </div>
      )}
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
