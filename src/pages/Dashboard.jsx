import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileText, Sparkles, Map, BookOpen, Briefcase, CheckCircle } from 'lucide-react';
import { useStytchUser, useStytch } from '@stytch/react';
import { useLanguage } from '../LanguageContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://avanza-backend-h0pm.onrender.com';

const Dashboard = ({ displayName, fullProfile, refreshProfile }) => {
    const { user } = useStytchUser();
    const stytch = useStytch();
    const navigate = useNavigate();
    const { t } = useLanguage();
    
    const [profile, setProfile] = useState(fullProfile?.profile || null);
    
    // Dynamic Data States
    const [jobs, setJobs] = useState([]);
    const [trainingItems, setTrainingItems] = useState([]);
    const [loadingData, setLoadingData] = useState(true);

    const username = displayName || fullProfile?.first_name || 'there';

    const fetchRecommendations = useCallback(async () => {
        try {
            const token = stytch.session.getTokens()?.session_token;
            if (!token) return;

            const res = await fetch(`${API_BASE_URL}/api/dashboard/recommendations`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setJobs(data.jobs || []);
                setTrainingItems(data.training || []);
            }
        } catch (err) {
            console.error("Recommendations fetch error", err);
        } finally {
            // Small delay to ensure state reflects correctly
            setTimeout(() => setLoadingData(false), 500);
        }
    }, [stytch]);

    useEffect(() => {
        // Log API URL for debugging production connectivity
        console.log("Dashboard: API_BASE_URL is", API_BASE_URL);

        if (fullProfile) {
            setProfile(fullProfile.profile);
            if (fullProfile.profile) {
                // ... logic handled here if needed
            }
            fetchRecommendations();
        } else if (user && refreshProfile) {
            // Fallback: If page is loaded directly and App.jsx hasn't finished fetching yet
            console.log("Dashboard: profile missing, triggering refresh...");
            refreshProfile();
        }
    }, [fullProfile, user, refreshProfile, fetchRecommendations]);

    if (!profile || loadingData) {
        return (
            <div className="container" style={{ paddingTop: '10rem', textAlign: 'center', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className="loading-spinner" style={{ 
                    width: '40px', 
                    height: '40px', 
                    border: '3px solid rgba(255,255,255,0.1)', 
                    borderTopColor: 'var(--accent-color)', 
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }}></div>
                <p style={{ marginTop: '1.5rem', color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                    {t('preparingDashboard') || 'Preparing your personalized dashboard...'}
                </p>
            </div>
        );
    }

    const steps = [
        { id: 'cv', title: t('step1Title'), sub: t('step1Sub'), icon: <FileText />, path: '/upload-cv' },
        { id: 'jobs', title: t('step2Title'), sub: t('step2Sub'), icon: <Briefcase />, path: '/generate-cv' },
        { id: 'map', title: t('step3Title'), sub: t('step3Sub'), icon: <Map />, path: '#' }
    ];

    return (
        <div className="container" style={{ paddingBottom: '5rem' }}>
            <div style={{ marginBottom: '3rem', paddingTop: '2rem' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem', letterSpacing: '-1.5px' }}>
                    {t('hello')}, <span style={{ color: 'var(--accent-color)' }}>{username}</span>
                </h1>
                <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px' }}>
                    {t('dashboardIntro')}
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
                {steps.map(step => (
                    <div key={step.id} className="card-hover" style={{ 
                        background: 'var(--surface-color)', 
                        padding: '2.5rem', 
                        borderRadius: '16px', 
                        border: '1px solid var(--border-color)',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.5rem'
                    }} onClick={() => step.path !== '#' && navigate(step.path)}>
                        <div style={{ color: 'var(--accent-color)', width: '40px', height: '40px' }}>
                            {step.icon}
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{step.title}</h3>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{step.sub}</p>
                        </div>
                        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-color)', fontWeight: 'bold' }}>
                            {t('getStarted')} <ChevronRight size={18} />
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth > 992 ? '2fr 1fr' : '1fr', gap: '2.5rem' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Sparkles color="var(--accent-color)" /> {t('jobsTitle')}
                    </h2>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {jobs.length > 0 ? jobs.map((job, idx) => (
                            <div key={idx} style={{ 
                                background: 'var(--surface-color)', 
                                padding: '1.5rem', 
                                borderRadius: '12px', 
                                border: '1px solid var(--border-color)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <h4 style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.25rem' }}>{job.title}</h4>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{job.company} • {job.location}</p>
                                </div>
                                <button className="btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Apply</button>
                            </div>
                        )) : (
                            <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--surface-color)', borderRadius: '12px', border: '1px dashed var(--border-color)' }}>
                                <p style={{ color: 'var(--text-secondary)' }}>Finding the best matches for you...</p>
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <BookOpen color="var(--accent-color)" /> {t('trainingTitle')}
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {trainingItems.length > 0 ? trainingItems.map((course, idx) => (
                            <div key={idx} style={{ 
                                background: 'var(--surface-color)', 
                                padding: '1.5rem', 
                                borderRadius: '12px', 
                                border: '1px solid var(--border-color)'
                            }}>
                                <h4 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{course.title}</h4>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>{course.provider}</p>
                                <a href="#" style={{ color: 'var(--accent-color)', fontWeight: 'bold', fontSize: '0.9rem', textDecoration: 'none' }}>View Course</a>
                            </div>
                        )) : (
                             <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--surface-color)', borderRadius: '12px', border: '1px dashed var(--border-color)' }}>
                                <p style={{ color: 'var(--text-secondary)' }}>Searching for courses...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const ChevronRight = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m9 18 6-6-6-6"/>
    </svg>
);

export default Dashboard;
