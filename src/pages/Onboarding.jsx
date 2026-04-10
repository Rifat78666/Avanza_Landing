import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStytchUser, useStytch } from '@stytch/react';
import { CheckCircle } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const Onboarding = () => {
    const { user } = useStytchUser();
    const stytch = useStytch();
    const navigate = useNavigate();
    const { t } = useLanguage();
    
    const [step, setStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingStep, setProcessingStep] = useState(0);
    
    const [profileData, setProfileData] = useState({
        user_type: '',
        degree_level: '',
        degree_country: '',
        degree_field: '',
        time_in_italy: '',
        residence_permit_status: '',
        goals: [],
        language_preference: ''
    });

    // Check if already completed via backend
    useEffect(() => {
        async function checkOnboarding() {
            if (user) {
                try {
                    const token = stytch.session.getTokens()?.session_token;
                    if (!token) return;

                    const resp = await fetch(`${API_BASE_URL}/api/user/profile`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (resp.ok) {
                        const data = await resp.json();
                        if (data.onboarding_completed) {
                            navigate('/dashboard');
                        }
                    }
                } catch (err) {
                    console.error("Check onboarding error:", err);
                }
            }
        }
        checkOnboarding();
    }, [user, stytch, navigate]);

    const handleNext = () => {
        if (step < 5) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleGoalToggle = (goalKey) => {
        const goal = t(goalKey);
        setProfileData(prev => ({
            ...prev,
            goals: prev.goals.includes(goal)
                ? prev.goals.filter(g => g !== goal)
                : [...prev.goals, goal]
        }));
    };

    const handleSubmit = async () => {
        setIsProcessing(true);
        
        if (user) {
            try {
                const token = stytch.session.getTokens()?.session_token;
                if (token) {
                    await fetch(`${API_BASE_URL}/api/onboarding`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(profileData)
                    });
                }
            } catch (err) {
                 console.error("Backend error:", err);
            }
        }

        let currentStep = 0;
        const interval = setInterval(() => {
            currentStep += 1;
            setProcessingStep(currentStep);
            
            if (currentStep >= 4) {
                clearInterval(interval);
                
                // Link language preference to app state
                if (profileData.language_preference) {
                    setLanguage(profileData.language_preference);
                }

                setTimeout(() => {
                    navigate('/dashboard');
                }, 1000);
            }
        }, 2000);
    };

    if (isProcessing) {
        return (
            <div style={{ height: '100vh', width: '100vw', background: '#0F0F0F', position: 'fixed', top: 0, left: 0, zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '2rem' }}>{t('processingTitle')}</h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', maxWidth: '600px' }}>
                    {[
                        `${t('checkingRequirements')} ${profileData.degree_country || '...'}` ,
                        t('identifyingProfession'),
                        t('matchingTraining'),
                        t('generatingGuide')
                    ].map((text, idx) => (
                        <div key={idx} style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '1rem',
                            opacity: processingStep > idx ? 1 : (processingStep === idx ? 0.5 : 0),
                            transition: 'opacity 0.5s ease-in-out'
                        }}>
                            {processingStep > idx && <CheckCircle color="#C8F135" size={24} />}
                            <span style={{ color: 'var(--text-primary)', fontSize: '1.25rem' }}>{text}</span>
                        </div>
                    ))}
                </div>
                
                <p style={{ marginTop: '3rem', color: 'var(--text-secondary)' }}>{t('processingSub')}</p>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: '800px', width: '100%' }}>
            <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                    <span>{t('step')} {step} {t('of')} 5</span>
                    <button 
                        onClick={handleBack} 
                        style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', visibility: step > 1 ? 'visible' : 'hidden' }}
                    >
                        ← {t('prevBtn')}
                    </button>
                </div>
                <div style={{ height: '4px', background: 'var(--surface-color)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: 'var(--accent-color)', width: `${(step / 5) * 100}%`, transition: 'width 0.3s' }} />
                </div>
            </div>

            <div style={{ background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '2rem' }}>
                
                {step === 1 && (
                    <div>
                        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>{t('q1Title')}</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {[
                                { id: 'student', icon: '🎓', labelKey: 'optStudent' },
                                { id: 'recent_grad', icon: '👨‍🎓', labelKey: 'optRecentGrad' },
                                { id: 'working', icon: '💼', labelKey: 'optWorking' },
                                { id: 'job_seeker', icon: '🔍', labelKey: 'optJobSeeker' },
                                { id: 'immigrant', icon: '🌍', labelKey: 'optImmigrant' },
                            ].map(opt => (
                                <button key={opt.id} onClick={() => setProfileData({...profileData, user_type: opt.id})} style={{
                                    display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem', background: profileData.user_type === opt.id ? 'rgba(200, 241, 53, 0.1)' : 'var(--background)',
                                    border: `1px solid ${profileData.user_type === opt.id ? 'var(--accent-color)' : 'var(--border-color)'}`,
                                    borderRadius: '8px', cursor: 'pointer', color: 'var(--text-primary)', fontSize: '1.2rem', transition: 'all 0.2s', width: '100%', textAlign: 'left'
                                }}>
                                    <span style={{ fontSize: '1.5rem' }}>{opt.icon}</span>
                                    <span>{t(opt.labelKey)}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div>
                        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>{t('q2Title')}</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ color: 'var(--text-secondary)' }}>{t('q2Level')}</label>
                                <select 
                                    className="input-field" 
                                    value={profileData.degree_level} 
                                    onChange={e => setProfileData({...profileData, degree_level: e.target.value})}
                                    style={{ background: 'var(--background)', outline: 'none' }}
                                >
                                    <option value="">Select Level</option>
                                    <option value="Bachelor's">Bachelor's</option>
                                    <option value="Master's">Master's</option>
                                    <option value="PhD">PhD</option>
                                    <option value="Professional Certification">Professional Certification</option>
                                    <option value="Vocational Diploma">Vocational Diploma</option>
                                </select>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ color: 'var(--text-secondary)' }}>{t('q2Country')}</label>
                                <input 
                                    type="text" 
                                    className="input-field" 
                                    placeholder={t('q2CountryPlaceholder')} 
                                    value={profileData.degree_country} 
                                    onChange={e => setProfileData({...profileData, degree_country: e.target.value})} 
                                />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ color: 'var(--text-secondary)' }}>{t('q2Field')}</label>
                                <input 
                                    type="text" 
                                    className="input-field" 
                                    placeholder={t('q2FieldPlaceholder')} 
                                    value={profileData.degree_field} 
                                    onChange={e => setProfileData({...profileData, degree_field: e.target.value})} 
                                />
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div>
                        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>{t('q3Title')}</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <span style={{ color: 'var(--text-primary)', fontSize: '1.1rem' }}>1. {t('q3Time')}</span>
                                {[
                                    { key: 'optTime1' }, 
                                    { key: 'optTime2' }, 
                                    { key: 'optTime3' }
                                ].map(opt => (
                                     <button key={opt.key} onClick={() => setProfileData({...profileData, time_in_italy: t(opt.key)})} style={{
                                        padding: '1rem', background: profileData.time_in_italy === t(opt.key) ? 'rgba(200, 241, 53, 0.1)' : 'var(--background)',
                                        border: `1px solid ${profileData.time_in_italy === t(opt.key) ? 'var(--accent-color)' : 'var(--border-color)'}`,
                                        borderRadius: '8px', cursor: 'pointer', color: 'var(--text-primary)', textAlign: 'left'
                                    }}>
                                        {t(opt.key)}
                                    </button>
                                ))}
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <span style={{ color: 'var(--text-primary)', fontSize: '1.1rem' }}>2. {t('q3Permit')}</span>
                                {[
                                    { key: 'optYes' }, 
                                    { key: 'optNo' }, 
                                    { key: 'optInProcess' }
                                ].map(opt => (
                                     <button key={opt.key} onClick={() => setProfileData({...profileData, residence_permit_status: t(opt.key)})} style={{
                                        padding: '1rem', background: profileData.residence_permit_status === t(opt.key) ? 'rgba(200, 241, 53, 0.1)' : 'var(--background)',
                                        border: `1px solid ${profileData.residence_permit_status === t(opt.key) ? 'var(--accent-color)' : 'var(--border-color)'}`,
                                        borderRadius: '8px', cursor: 'pointer', color: 'var(--text-primary)', textAlign: 'left'
                                    }}>
                                        {t(opt.key)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div>
                        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>{t('q4Title')}</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {[
                                'optGoal1',
                                'optGoal2',
                                'optGoal3',
                                'optGoal4',
                                'optGoal5'
                            ].map(goalKey => (
                                 <button key={goalKey} onClick={() => handleGoalToggle(goalKey)} style={{
                                    display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', 
                                    background: profileData.goals.includes(t(goalKey)) ? 'rgba(200, 241, 53, 0.1)' : 'var(--background)',
                                    border: `1px solid ${profileData.goals.includes(t(goalKey)) ? 'var(--accent-color)' : 'var(--border-color)'}`,
                                    borderRadius: '8px', cursor: 'pointer', color: 'var(--text-primary)', textAlign: 'left'
                                }}>
                                    <div style={{ width: '20px', height: '20px', borderRadius: '4px', border: '1px solid var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: profileData.goals.includes(t(goalKey)) ? 'var(--accent-color)' : 'transparent' }}>
                                        {profileData.goals.includes(t(goalKey)) && <CheckCircle size={16} color="#000" />}
                                    </div>
                                    {t(goalKey)}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 5 && (
                    <div>
                        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>{t('q5Title')}</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                            {[
                                { lang: 'English', flag: '🇬🇧', code: 'EN' },
                                { lang: 'Italian', flag: '🇮🇹', code: 'IT' },
                                { lang: 'Spanish', flag: '🇪🇸', code: 'ES' },
                                { lang: 'Arabic', flag: '🇸🇦', code: 'AR' },
                                { lang: 'Hindi', flag: '🇮🇳', code: 'HI' },
                                { lang: 'Bengali', flag: '🇧🇩', code: 'BN' },
                                { lang: 'French', flag: '🇫🇷', code: 'FR' },
                            ].map(opt => (
                                 <button key={opt.code} onClick={() => setProfileData({...profileData, language_preference: opt.code})} style={{
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '1.5rem', 
                                    background: profileData.language_preference === opt.code ? 'rgba(200, 241, 53, 0.1)' : 'var(--background)',
                                    border: `1px solid ${profileData.language_preference === opt.code ? 'var(--accent-color)' : 'var(--border-color)'}`,
                                    borderRadius: '8px', cursor: 'pointer', color: 'var(--text-primary)', textAlign: 'center'
                                }}>
                                    <span style={{ fontSize: '2rem' }}>{opt.flag}</span>
                                    <span>{opt.lang}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                    {step < 5 ? (
                        <button className="btn-primary" onClick={handleNext}>{t('nextBtn')}</button>
                    ) : (
                        <button className="btn-primary" onClick={handleSubmit}>{t('generateGuide')}</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
