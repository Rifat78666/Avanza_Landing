import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStytch } from '@stytch/react';
import { CheckCircle, Mail, ArrowRight } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

const PublicQuiz = () => {
    const stytch = useStytch();
    const navigate = useNavigate();
    const { t, setLanguage } = useLanguage();
    
    const [step, setStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    
    const [profileData, setProfileData] = useState({
        user_type: '',
        profession: '',
        degree_country: '',
        degree_level: '',
        years_of_experience: '',
        time_in_italy: '',
        residence_permit_status: '',
        goals: [],
        language_preference: 'EN'
    });

    // Load partial progress from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem('avanza_onboarding_data');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setProfileData(parsed.data);
                if (parsed.step < 8) {
                    setStep(parsed.step);
                }
            } catch (e) {
                console.error('Could not load saved quiz data', e);
            }
        }
    }, []);

    // Save progress to local storage on every step change
    useEffect(() => {
        localStorage.setItem('avanza_onboarding_data', JSON.stringify({
            data: profileData,
            step: step
        }));
    }, [profileData, step]);

    const handleNext = () => {
        if (step < 8) setStep(step + 1);
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
        if (!email || !email.includes('@')) {
            setEmailError('Please enter a valid email address');
            return;
        }
        
        setIsProcessing(true);
        
        try {
            // Trigger Stytch Magic Link
            await stytch.magicLinks.email.loginOrCreate(email, {
                login_magic_link_url: `${window.location.origin}/`,
                signup_magic_link_url: `${window.location.origin}/`
            });
            
            // The data is already saved in localStorage.
            // App.jsx will handle submitting it to the backend once they click the link.
        } catch (err) {
            console.error("Magic link error:", err);
            setEmailError('Failed to send login link. Please try again.');
            setIsProcessing(false);
        }
    };

    if (isProcessing) {
        return (
            <div style={{ height: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                <div style={{ 
                  width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(200, 241, 53, 0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #C8F135',
                  marginBottom: '2rem'
                }}>
                  <Mail size={40} color="#C8F135" />
                </div>
                <h2 style={{ fontSize: '2.5rem', color: 'var(--text-primary)', marginBottom: '1rem', textAlign: 'center' }}>Check Your Email</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', textAlign: 'center', maxWidth: '500px', lineHeight: '1.6' }}>
                    We've sent a secure login link to <strong>{email}</strong>. <br/><br/>
                    Click the link in the email to instantly see your personalized recognition roadmap!
                </p>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: '800px', width: '100%', minHeight: '80vh' }}>
            <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                    <span>Step {step} of 8</span>
                    <button 
                        onClick={handleBack} 
                        style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', visibility: step > 1 ? 'visible' : 'hidden' }}
                    >
                        ← Back
                    </button>
                </div>
                <div style={{ height: '4px', background: 'var(--surface-color)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: 'var(--accent-color)', width: `${(step / 8) * 100}%`, transition: 'width 0.3s' }} />
                </div>
            </div>

            <div style={{ background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '3rem' }}>
                
                {step === 1 && (
                    <div>
                        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Which best describes you?</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {[
                                { id: 'student', icon: '🎓', label: 'Student (studying in Italy)' },
                                { id: 'recent_grad', icon: '👨‍🎓', label: 'Recent Graduate (graduated abroad)' },
                                { id: 'working', icon: '💼', label: 'Working Professional' },
                                { id: 'job_seeker', icon: '🔍', label: 'Job Seeker (looking for work in Italy)' },
                                { id: 'immigrant', icon: '🌍', label: 'Immigrant / Refugee (newly arrived)' },
                            ].map(opt => (
                                <button key={opt.id} onClick={() => { setProfileData({...profileData, user_type: opt.id}); setTimeout(handleNext, 300); }} style={{
                                    display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem', background: profileData.user_type === opt.id ? 'rgba(200, 241, 53, 0.1)' : 'var(--background)',
                                    border: `1px solid ${profileData.user_type === opt.id ? 'var(--accent-color)' : 'var(--border-color)'}`,
                                    borderRadius: '12px', cursor: 'pointer', color: 'var(--text-primary)', fontSize: '1.2rem', transition: 'all 0.2s', width: '100%', textAlign: 'left'
                                }}>
                                    <span style={{ fontSize: '1.5rem' }}>{opt.icon}</span>
                                    <span>{opt.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="fade-in">
                        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>What is your profession or field of study?</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>E.g. Civil Engineer, Registered Nurse, Graphic Designer</p>
                        <input 
                            type="text" 
                            className="input-field" 
                            placeholder="Type your profession..." 
                            value={profileData.profession} 
                            onChange={e => setProfileData({...profileData, profession: e.target.value})} 
                            onKeyDown={e => e.key === 'Enter' && profileData.profession && handleNext()}
                            autoFocus
                        />
                    </div>
                )}

                {step === 3 && (
                    <div className="fade-in">
                        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Where did you get your qualifications?</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>This determines which international agreements apply to your case.</p>
                        <input 
                            type="text" 
                            className="input-field" 
                            placeholder="Enter country name..." 
                            value={profileData.degree_country} 
                            onChange={e => setProfileData({...profileData, degree_country: e.target.value})} 
                            onKeyDown={e => e.key === 'Enter' && profileData.degree_country && handleNext()}
                            autoFocus
                        />
                    </div>
                )}

                {step === 4 && (
                    <div className="fade-in">
                        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>What is your highest level of education?</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {[
                                "High School Diploma",
                                "Vocational Certificate",
                                "Bachelor's Degree",
                                "Master's Degree",
                                "PhD",
                                "Other"
                            ].map(level => (
                                <button key={level} onClick={() => { setProfileData({...profileData, degree_level: level}); setTimeout(handleNext, 300); }} style={{
                                    padding: '1.5rem', background: profileData.degree_level === level ? 'rgba(200, 241, 53, 0.1)' : 'var(--background)',
                                    border: `1px solid ${profileData.degree_level === level ? 'var(--accent-color)' : 'var(--border-color)'}`,
                                    borderRadius: '12px', cursor: 'pointer', color: 'var(--text-primary)', fontSize: '1.1rem', textAlign: 'left'
                                }}>
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 5 && (
                    <div className="fade-in">
                        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>How many years of professional experience do you have?</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            {[
                                "None yet",
                                "Less than 1 year",
                                "1 - 3 years",
                                "4 - 7 years",
                                "8 - 15 years",
                                "More than 15 years"
                            ].map(exp => (
                                <button key={exp} onClick={() => { setProfileData({...profileData, years_of_experience: exp}); setTimeout(handleNext, 300); }} style={{
                                    padding: '1.5rem', background: profileData.years_of_experience === exp ? 'rgba(200, 241, 53, 0.1)' : 'var(--background)',
                                    border: `1px solid ${profileData.years_of_experience === exp ? 'var(--accent-color)' : 'var(--border-color)'}`,
                                    borderRadius: '12px', cursor: 'pointer', color: 'var(--text-primary)', fontSize: '1.1rem', textAlign: 'center'
                                }}>
                                    {exp}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 6 && (
                    <div className="fade-in">
                        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Your status in Italy</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <span style={{ color: 'var(--text-primary)', fontSize: '1.1rem' }}>How long have you been in Italy?</span>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    {['Just arrived', 'Less than 2 years', 'More than 2 years'].map(time => (
                                        <button key={time} onClick={() => setProfileData({...profileData, time_in_italy: time})} style={{
                                            flex: 1, padding: '1rem', background: profileData.time_in_italy === time ? 'rgba(200, 241, 53, 0.1)' : 'var(--background)',
                                            border: `1px solid ${profileData.time_in_italy === time ? 'var(--accent-color)' : 'var(--border-color)'}`,
                                            borderRadius: '8px', cursor: 'pointer', color: 'var(--text-primary)'
                                        }}>
                                            {time}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <span style={{ color: 'var(--text-primary)', fontSize: '1.1rem' }}>Do you have a valid residence permit? (Permesso di Soggiorno)</span>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    {['Yes', 'No', 'In Process'].map(permit => (
                                        <button key={permit} onClick={() => setProfileData({...profileData, residence_permit_status: permit})} style={{
                                            flex: 1, padding: '1rem', background: profileData.residence_permit_status === permit ? 'rgba(200, 241, 53, 0.1)' : 'var(--background)',
                                            border: `1px solid ${profileData.residence_permit_status === permit ? 'var(--accent-color)' : 'var(--border-color)'}`,
                                            borderRadius: '8px', cursor: 'pointer', color: 'var(--text-primary)'
                                        }}>
                                            {permit}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 7 && (
                    <div className="fade-in">
                        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>What are your primary goals?</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Select all that apply</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {[
                                'optGoal1', // Get degree recognised
                                'optGoal2', // Find a job
                                'optGoal3', // Find free training
                                'optGoal4', // Understand what jobs I qualify for
                                'optGoal5'  // Continue studying
                            ].map(goalKey => (
                                 <button key={goalKey} onClick={() => handleGoalToggle(goalKey)} style={{
                                    display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', 
                                    background: profileData.goals.includes(t(goalKey)) ? 'rgba(200, 241, 53, 0.1)' : 'var(--background)',
                                    border: `1px solid ${profileData.goals.includes(t(goalKey)) ? 'var(--accent-color)' : 'var(--border-color)'}`,
                                    borderRadius: '12px', cursor: 'pointer', color: 'var(--text-primary)', textAlign: 'left', fontSize: '1.1rem'
                                }}>
                                    <div style={{ width: '24px', height: '24px', borderRadius: '6px', border: '2px solid var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: profileData.goals.includes(t(goalKey)) ? 'var(--accent-color)' : 'transparent' }}>
                                        {profileData.goals.includes(t(goalKey)) && <CheckCircle size={18} color="#000" />}
                                    </div>
                                    {t(goalKey)}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 8 && (
                    <div className="fade-in" style={{ textAlign: 'center' }}>
                        <div style={{ 
                            width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(200, 241, 53, 0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto'
                        }}>
                            <CheckCircle size={32} color="#C8F135" />
                        </div>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Your roadmap is ready!</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.1rem' }}>
                            Enter your email below to instantly receive your personalized recognition pathway and access your dashboard.
                        </p>
                        
                        <div style={{ maxWidth: '400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <input 
                                type="email" 
                                className="input-field" 
                                placeholder="name@example.com" 
                                value={email} 
                                onChange={e => {setEmail(e.target.value); setEmailError('');}} 
                                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                                style={{ textAlign: 'center', fontSize: '1.1rem', padding: '1.25rem' }}
                                autoFocus
                            />
                            {emailError && <p style={{ color: '#FF5252', fontSize: '0.9rem', margin: 0 }}>{emailError}</p>}
                            <button className="btn-primary" onClick={handleSubmit} style={{ width: '100%', padding: '1.25rem', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                                Get My Roadmap <ArrowRight size={20} />
                            </button>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '1.5rem', opacity: 0.7 }}>
                            By continuing, you agree to our Terms of Service and Privacy Policy. No spam, ever.
                        </p>
                    </div>
                )}

                <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'space-between' }}>
                    {step > 1 ? (
                        <button className="btn-outline" onClick={handleBack} style={{ padding: '0.8rem 2rem' }}>Back</button>
                    ) : <div></div>}
                    {step < 8 && (
                        <button className="btn-primary" onClick={handleNext} style={{ padding: '0.8rem 2rem' }}>Next</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PublicQuiz;
