import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    UploadCloud, FileText, Sparkles, Map, BookOpen, 
    Briefcase, CheckCircle, ChevronRight, Info, AlertCircle 
} from 'lucide-react';
import { useStytchUser, useStytch } from '@stytch/react';
import { useLanguage } from '../LanguageContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://avanza-backend-h0pm.onrender.com';

const Dashboard = ({ displayName, fullProfile, refreshProfile }) => {
    const { user } = useStytchUser();
    const stytch = useStytch();
    const navigate = useNavigate();
    const { t } = useLanguage();
    
    const [profile, setProfile] = useState(fullProfile?.profile || null);
    const [isRegulated, setIsRegulated] = useState(false);
    
    // Dynamic Data States
    const [jobs, setJobs] = useState([]);
    const [trainingItems, setTrainingItems] = useState([]);
    const [loadingData, setLoadingData] = useState(true);

    const fieldLabel = profile?.degree_field || 'your field';
    const countryLabel = profile?.degree_country || 'your country';
    const levelLabel = profile?.degree_level || 'degree';

    // Helper for safe translation replacement
    const getSummaryText = (key) => {
        let text = t(key);
        if (typeof text !== 'string') return '';
        return text
            .replace(/{degree_level}/g, levelLabel)
            .replace(/{degree_field}/g, fieldLabel)
            .replace(/{field}/g, fieldLabel) // Handle Italian 'field' placeholder
            .replace(/{degree_country}/g, countryLabel);
    };

    // Safety: Force clear the loading screen after 2.5s no matter what
    useEffect(() => {
        const forceClear = setTimeout(() => {
            if (loadingData) setLoadingData(false);
        }, 2500);
        return () => clearTimeout(forceClear);
    }, [loadingData]);

    const username = displayName || fullProfile?.first_name || 'there';

    const [roadmap, setRoadmap] = useState(null);

    // Initial load for roadmap
    const fetchRoadmap = useCallback(async () => {
        try {
            const token = stytch.session.getTokens()?.session_token;
            if (!token) return;

            const res = await fetch(`${API_BASE_URL}/api/validation/roadmap`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setRoadmap(data);
                setIsRegulated(data.is_regulated);
            }
        } catch (err) {
            console.error("Roadmap fetch error", err);
        }
    }, [stytch]);

    const fetchRecommendations = useCallback(async () => {
        try {
            const token = stytch.session.getTokens()?.session_token;
            if (!token) return;

            const res = await fetch(`${API_BASE_URL}/api/dashboard/recommendations`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                if (data.jobs && data.jobs.length > 0) setJobs(data.jobs);
                if (data.training && data.training.length > 0) setTrainingItems(data.training);
            }
        } catch (err) {
            console.error("Recommendations fetch error", err);
        } finally {
            setTimeout(() => setLoadingData(false), 800);
        }
    }, [stytch]);

    const [journeySteps, setJourneySteps] = useState([]);
    
    const fetchJourney = useCallback(async () => {
        try {
            const token = stytch.session.getTokens()?.session_token;
            if (!token) return;

            const res = await fetch(`${API_BASE_URL}/api/recognition/journey`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setJourneySteps(data);
            }
        } catch (err) {
            console.error("Journey fetch error", err);
        }
    }, [stytch]);

    const toggleStep = async (stepKey, status) => {
        try {
            const token = stytch.session.getTokens()?.session_token;
            if (!token) return;

            const res = await fetch(`${API_BASE_URL}/api/recognition/journey`, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ step_key: stepKey, status: status })
            });

            if (res.ok) {
                fetchJourney();
            }
        } catch (err) {
            console.error("Toggle step error", err);
        }
    };

    const handleDownloadDossier = async () => {
        try {
            const token = stytch.session.getTokens()?.session_token;
            if (!token) return;

            const res = await fetch(`${API_BASE_URL}/api/recognition/dossier`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (res.ok) {
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Avanza_Dossier_${username}.pdf`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            } else {
                console.error("Dossier generation failed");
            }
        } catch (err) {
            console.error("Dossier error", err);
        }
    };

    // Initial load
    useEffect(() => {
        if (user) {
            fetchJourney();
            fetchRoadmap();
        }
    }, [user, fetchJourney, fetchRoadmap]);

    // Sync local profile state with fullProfile prop
    useEffect(() => {
        if (fullProfile?.profile) {
            setProfile(fullProfile.profile);
            if (loadingData) {
                fetchRecommendations();
            }
        } else if (fullProfile && !fullProfile.profile && !loadingData) {
            // Check if we are recently finished with onboarding
            navigate('/onboarding');
        } else if (user && !fullProfile && refreshProfile) {
            refreshProfile();
        }
    }, [fullProfile, user, refreshProfile, fetchRecommendations, loadingData, navigate]);

    if (!fullProfile || !profile || loadingData) {
        return (
            <div className="container" style={{ paddingTop: '10rem', textAlign: 'center', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className="loading-spinner" style={{ 
                    width: '40px', height: '40px', 
                    border: '3px solid rgba(255,255,255,0.1)', 
                    borderTopColor: '#C8F135', borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }}></div>
                <p style={{ marginTop: '1.5rem', color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                    {t('preparingDashboard')}
                </p>
            </div>
        );
    }


    return (
        <div className="container" style={{ paddingBottom: '5rem' }}>
            {/* Header section with profile name */}
            <div style={{ marginBottom: '3rem', paddingTop: '2.5rem' }}>
                <h1 style={{ fontSize: '3.2rem', fontWeight: '800', marginBottom: '1rem', letterSpacing: '-2px', lineHeight: '1.1' }}>
                    {t('welcomeBack')}, <span style={{ color: '#C8F135' }}>{username}!</span>
                </h1>
                <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.6)', maxWidth: '800px', fontWeight: '500' }}>
                    {t('journeyStart')}
                </p>
            </div>

            {/* SECTION 1: YOUR SITUATION (Validation Status) */}
            <div style={{ 
                background: '#121212', 
                padding: '2.2rem 2.8rem', 
                borderRadius: '24px', 
                border: '1px solid rgba(255,255,255,0.08)',
                borderLeft: roadmap?.is_regulated ? '8px solid #FF5252' : '8px solid #C8F135',
                marginBottom: '3.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.8rem',
                boxShadow: '0 30px 60px rgba(0,0,0,0.5)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                    <div style={{ background: roadmap?.is_regulated ? 'rgba(255, 82, 82, 0.12)' : 'rgba(200, 241, 53, 0.12)', padding: '0.8rem', borderRadius: '14px' }}>
                        <Sparkles color={roadmap?.is_regulated ? "#FF5252" : "#C8F135"} size={28} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#FFFFFF' }}>{roadmap?.is_regulated ? "Formal Recognition Required" : "Labor Market Access Ready"}</h2>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem' }}>Based on your {roadmap?.degree_field} degree from {roadmap?.country}</p>
                    </div>
                </div>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.7', color: '#FFFFFF', fontWeight: '400', opacity: 0.9 }}>
                    {roadmap?.profession_notes}
                </p>
                {roadmap?.is_regulated && (
                   <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                       <span style={{ background: 'rgba(255,255,255,0.1)', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.9rem' }}>
                           <strong>Ministry:</strong> {roadmap.competent_ministry}
                       </span>
                       <span style={{ background: 'rgba(255,255,255,0.1)', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.9rem' }}>
                           <strong>Albo:</strong> {roadmap.professional_board || 'N/A'}
                       </span>
                       <span style={{ background: 'rgba(255,255,255,0.1)', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.9rem' }}>
                           <strong>Language:</strong> {roadmap.language_requirement || 'Not specified'}
                       </span>
                   </div>
                )}
            </div>

            {/* SECTION 2: DYNAMIC RECOGNITION PATHWAY */}
            <div style={{ 
                background: '#121212', 
                padding: '2.5rem 2.8rem', 
                borderRadius: '24px', 
                border: '1px solid rgba(255,255,255,0.08)',
                marginBottom: '3.5rem'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Map size={28} color="#C8F135" />
                        <h2 style={{ fontSize: '1.6rem', fontWeight: 'bold' }}>Your Personalized Validation Roadmap</h2>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button 
                            onClick={handleDownloadDossier}
                            style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                color: '#FFFFFF',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                padding: '0.6rem 1.2rem',
                                borderRadius: '12px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            <FileText size={18} /> Download Dossier (PDF)
                        </button>
                        <button 
                            onClick={() => navigate('/vault')}
                            style={{
                                background: 'rgba(200, 241, 53, 0.1)',
                                color: '#C8F135',
                                border: '1px solid rgba(200, 241, 53, 0.2)',
                                padding: '0.6rem 1.2rem',
                                borderRadius: '12px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            <UploadCloud size={18} /> {t('uploadDocumentsTitle')}
                        </button>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {roadmap?.steps?.map(step => {
                        const isDone = journeySteps.some(js => js.step_key === step.key && js.status === 'completed');
                        return (
                            <div key={step.step_number} style={{ 
                                display: 'flex', gap: '1.5rem', alignItems: 'center', 
                                background: isDone ? 'rgba(200, 241, 53, 0.03)' : 'rgba(255,255,255,0.03)', 
                                padding: '1.25rem 1.8rem', 
                                borderRadius: '20px', 
                                border: `1px solid ${isDone ? 'rgba(200, 241, 53, 0.2)' : 'rgba(255,255,255,0.05)'}`,
                                opacity: isDone ? 0.8 : 1
                            }}>
                                <div style={{ 
                                    width: '32px', height: '32px', borderRadius: '50%', 
                                    background: isDone ? '#C8F135' : 'transparent', 
                                    color: isDone ? '#0F0F0F' : '#C8F135', 
                                    border: '2px solid #C8F135',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                    fontWeight: 'bold', flexShrink: 0, fontSize: '0.95rem'
                                }}>
                                    {isDone ? <CheckCircle size={18} /> : step.step_number}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.15rem', color: isDone ? 'rgba(255,255,255,0.6)' : '#fff' }}>{step.title}</h4>
                                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>{step.description}</p>
                                    
                                    {step.action_url && !isDone && (
                                        <button 
                                            onClick={() => {
                                                if (step.action_url.startsWith('/')) navigate(step.action_url);
                                                else window.open(step.action_url, '_blank');
                                            }}
                                            style={{
                                                background: 'transparent',
                                                border: 'none',
                                                color: '#C8F135',
                                                fontSize: '0.85rem',
                                                marginTop: '0.5rem',
                                                padding: '0',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.2rem'
                                            }}
                                        >
                                            {step.action_label} <ChevronRight size={14} />
                                        </button>
                                    )}
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <span style={{ background: 'rgba(255,255,255,0.1)', padding: '0.4rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem' }}>{step.estimated_time}</span>
                                    <span style={{ background: 'rgba(255,255,255,0.1)', padding: '0.4rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem' }}>{step.estimated_cost}</span>
                                </div>
                                <button 
                                    onClick={() => toggleStep(step.key, isDone ? 'not_started' : 'completed')}
                                    className="btn-outline" 
                                    style={{ 
                                        borderColor: isDone ? 'rgba(255,255,255,0.2)' : '#C8F135', 
                                        color: isDone ? 'rgba(255,255,255,0.5)' : '#C8F135', 
                                        fontSize: '0.9rem', 
                                        padding: '0.4rem 0.8rem', 
                                        borderRadius: '8px' 
                                    }}
                                >
                                    {isDone ? t('done') : t('markAsDone')}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* SECTION 3: FREE TRAINING (Full-Width Photo Match) */}
            <div style={{ 
                background: '#121212', 
                padding: '2.5rem 2.8rem', 
                borderRadius: '24px', 
                border: '1px solid rgba(255,255,255,0.08)',
                marginBottom: '3.5rem'
            }}>
                <div style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.4rem' }}>
                        <BookOpen size={28} color="#C8F135" />
                        <h2 style={{ fontSize: '1.6rem', fontWeight: 'bold' }}>{t('freeTraining')}</h2>
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem' }}>{t('freeTrainingSub')}</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {trainingItems.map((course, idx) => (
                        <div key={idx} style={{ 
                            background: '#1A1A1A', 
                            padding: '1.8rem', 
                            borderRadius: '20px', 
                            border: '1px solid rgba(255,255,255,0.05)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1.2rem',
                            height: '100%'
                        }}>
                            <div style={{ flex: 1 }}>
                                <h4 style={{ fontSize: '1.15rem', fontWeight: 'bold', marginBottom: '0.4rem' }}>{course.title}</h4>
                                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>{course.provider}</p>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                <span style={{ background: 'rgba(255,255,255,0.1)', padding: '0.3rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem' }}>{course.duration}</span>
                                <span style={{ background: '#C8F135', color: '#000', padding: '0.3rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '800' }}>{t('free')}</span>
                                <span style={{ background: 'rgba(255,255,255,0.1)', padding: '0.3rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem' }}>{course.lang === 'IT' ? 'Italian' : 'English'}</span>
                            </div>
                            <button className="btn-outline" style={{ width: '100%', padding: '0.6rem', fontSize: '0.9rem', fontWeight: 'bold', borderColor: 'rgba(255,255,255,0.15)', color: '#FFFFFF' }}>View Course →</button>
                        </div>
                    ))}
                </div>
            </div>

            {/* SECTION 4: JOBS (Full-Width Photo Match) */}
            <div style={{ 
                background: '#121212', 
                padding: '2.5rem 2.8rem', 
                borderRadius: '24px', 
                border: '1px solid rgba(255,255,255,0.08)',
                marginBottom: '3.5rem'
            }}>
                <div style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.4rem' }}>
                        <Briefcase size={28} color="#C8F135" />
                        <h2 style={{ fontSize: '1.6rem', fontWeight: 'bold' }}>{t('jobsTitle')}</h2>
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem' }}>{t('jobsSub')}</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {jobs.map((job, idx) => (
                        <div key={idx} style={{ 
                            background: '#1A1A1A', 
                            padding: '1.8rem', 
                            borderRadius: '20px', 
                            border: '1px solid rgba(255,255,255,0.05)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1.2rem',
                            height: '100%'
                        }}>
                            <div style={{ flex: 1 }}>
                                <h4 style={{ fontSize: '1.15rem', fontWeight: 'bold', marginBottom: '0.4rem' }}>{job.title || "Job Title"}</h4>
                                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>{job.company || "Company"} • {job.location || "Location"}</p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <span style={{ color: '#C8F135', fontSize: '1.1rem', fontWeight: 'bold' }}>{job.salary}</span>
                                {job.tags && job.tags.map(tag => (
                                    <div key={tag} style={{ alignSelf: 'flex-start', background: 'rgba(200, 241, 53, 0.1)', color: '#C8F135', padding: '0.3rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold', border: '1px solid rgba(200, 241, 53, 0.3)' }}>
                                        {tag}
                                    </div>
                                ))}
                                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>{job.match}</p>
                            </div>
                            {job.url ? (
                                <a href={job.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                                    <button className="btn-outline" style={{ width: '100%', padding: '0.6rem', fontSize: '0.9rem', fontWeight: 'bold', borderColor: 'rgba(255,255,255,0.15)', color: '#FFFFFF', cursor: 'pointer' }}>View Job →</button>
                                </a>
                            ) : (
                                <button className="btn-outline" style={{ width: '100%', padding: '0.6rem', fontSize: '0.9rem', fontWeight: 'bold', borderColor: 'rgba(255,255,255,0.15)', color: '#FFFFFF', cursor: 'pointer' }}>View Job →</button>
                            )}
                        </div>
                    ))}
                </div>
                
                <div style={{ marginTop: '2rem', textAlign: 'right' }}>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>
                        Job listings provided by <a href="https://www.adzuna.it" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "underline" }}>Adzuna</a>
                    </p>
                </div>
            </div>

            {/* AI Career Tools Section */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '4rem' }}>
                <div style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{t('uploadDocumentsTitle')}</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>{t('uploadDocumentsSub')}</p>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                    <div className="card-hover" style={{ 
                        background: 'var(--surface-color)', padding: '2.5rem', 
                        borderRadius: '24px', border: '1px solid var(--border-color)',
                        cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '1.5rem'
                    }} onClick={() => navigate('/upload-cv')}>
                        <div style={{ color: '#C8F135', width: '48px', height: '48px', background: 'rgba(200, 241, 53, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <UploadCloud size={24} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{t('uploadCVTitle')}</h3>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{t('uploadCVSub')}</p>
                        </div>
                        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#C8F135', fontWeight: 'bold' }}>
                            {t('getStarted')} <ChevronRight size={18} />
                        </div>
                    </div>

                    <div className="card-hover" style={{ 
                        background: 'var(--surface-color)', padding: '2.5rem', 
                        borderRadius: '24px', border: '1px solid var(--border-color)',
                        cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '1.5rem'
                    }} onClick={() => navigate('/cv-generator')}>
                        <div style={{ color: '#C8F135', width: '48px', height: '48px', background: 'rgba(200, 241, 53, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Sparkles size={24} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{t('cvGenTitle')}</h3>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{t('cvGenSub')}</p>
                        </div>
                        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#C8F135', fontWeight: 'bold' }}>
                            {t('getStarted')} <ChevronRight size={18} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
