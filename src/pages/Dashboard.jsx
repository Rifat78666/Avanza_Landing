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

    // Safety: Force clear the loading screen after 2.5s no matter what
    useEffect(() => {
        const forceClear = setTimeout(() => {
            if (loadingData) setLoadingData(false);
        }, 2500);
        return () => clearTimeout(forceClear);
    }, [loadingData]);

    const username = displayName || fullProfile?.first_name || 'there';

    // Industry Detection Logic
    useEffect(() => {
        if (profile) {
            const field = (profile.degree_field || '').toLowerCase();
            const regulatedKeywords = [
                'medicine', 'medic', 'doctor', 'nurse', 'nurs', 'law', 'legal', 
                'engineer', 'architect', 'psycholog', 'pharmacist', 'vet', 
                'dentist', 'teacher', 'accountant'
            ];
            const isReg = regulatedKeywords.some(keyword => field.includes(keyword));
            setIsRegulated(isReg);
            
            // Generate field-specific placeholder data
            generatePlaceholders(field);
        }
    }, [profile]);

    const generatePlaceholders = (field) => {
        const lowerField = field.toLowerCase();
        
        // Example logic for Courses
        let courses = [];
        if (lowerField.includes('tech') || lowerField.includes('computer') || lowerField.includes('software')) {
            courses = [
                { title: 'Sviluppo Web Full Stack', provider: 'AFOL Metropolitana', duration: '12 weeks', lang: 'IT' },
                { title: 'Google IT Support Certificate', provider: 'Google Activate', duration: '6 months', lang: 'EN' },
                { title: 'Cybersecurity Fundamentals', provider: 'Lombardia Plus', duration: '8 weeks', lang: 'IT' },
                { title: 'Python for Data Science', provider: 'IBM / Coursera', duration: '10 weeks', lang: 'EN' }
            ];
        } else if (lowerField.includes('engineer')) {
            courses = [
                { title: 'Progettazione CAD 3D', provider: 'AFOL Metropolitana', duration: '8 weeks', lang: 'IT' },
                { title: 'AutoCAD Fundamentals', provider: 'Coursera audit', duration: 'Self-paced', lang: 'EN' },
                { title: 'BIM Management', provider: 'Ordine Ingegneri', duration: '4 weeks', lang: 'IT' },
                { title: 'Sustainability in Construction', provider: 'Politecnico', duration: '6 weeks', lang: 'EN' }
            ];
        } else if (lowerField.includes('nurse') || lowerField.includes('medicine') || lowerField.includes('healthcare')) {
            courses = [
                { title: 'Assistente di Studio Odontoiatrico', provider: 'AFOL', duration: '16 weeks', lang: 'IT' },
                { title: 'Healthcare Fundamentals', provider: 'Coursera audit', duration: 'Self-paced', lang: 'EN' },
                { title: 'Primo Soccorso Avanzato', provider: 'Croce Rossa', duration: '2 weeks', lang: 'IT' },
                { title: 'Medical English for Staff', provider: 'British Council', duration: '4 weeks', lang: 'EN' }
            ];
        } else {
            courses = [
                { title: 'Digital Marketing Certificate', provider: 'Google Activate', duration: '3 months', lang: 'EN' },
                { title: 'Excel e Analisi Dati', provider: 'AFOL Metropolitana', duration: '4 weeks', lang: 'IT' },
                { title: 'Project Management Basics', provider: 'Regione Lombardia', duration: '6 weeks', lang: 'IT' },
                { title: 'Business Communication', provider: 'LinkedIn Learn', duration: '3 weeks', lang: 'EN' }
            ];
        }
        setTrainingItems(courses);

        // Example logic for Jobs
        const location = "Milano / Remote";
        const noRecog = "No recognition required";
        let jobList = [];
        if (lowerField.includes('tech') || lowerField.includes('computer')) {
            jobList = [
                { title: 'Frontend Developer', company: 'Bending Spoons — Milano (Hybrid)', salary: '€40k - €50k', match: 'Matches your IT background' },
                { title: 'Data Analyst', company: 'Satispay — Milano', salary: '€35k - €45k', match: 'Matches your Business/Tech profile' },
                { title: 'Junior Software Engineer', company: 'Reply — Turín', salary: '€30k - €38k', match: 'Matches your IT background' },
                { title: 'IT Support Specialist', company: 'Enel — Rome', salary: '€28k - €35k', match: 'Immediate start available' }
            ];
        } else if (lowerField.includes('nurse') || lowerField.includes('healthcare')) {
            jobList = [
                { title: 'Private Care Assistant', company: 'PrivatAssistenza', salary: '€20k - €24k', match: 'Uses clinical experience' },
                { title: 'Health Admin Coordinator', company: 'Gruppo San Donato', salary: '€25k - €29k', match: 'Matches medical background' },
                { title: 'Pharmacy Assistant', company: 'LloydsFarmacia', salary: '€21k - €25k', match: 'Related healthcare role' },
                { title: 'Medical Sales Rep', company: 'Novartis Italia', salary: '€35k + commission', match: 'Leverages medical knowledge' }
            ];
        } else {
            jobList = [
                { title: 'Operations Associate', company: 'Amazon Italia', salary: '€24k - €28k', match: 'Matches your business profile' },
                { title: 'Customer Success Rep', company: 'Salesforce Milan', salary: '€30k - €34k', match: 'Uses communication skills' },
                { title: 'Junior Accountant (Admin)', company: 'PwC Italia', salary: '€27k - €31k', match: 'Matches financial degree' },
                { title: 'Sales Assistant', company: 'Zara / Inditex', salary: '€19k - €22k', match: 'Immediate start available' }
            ];
        }
        setJobs(jobList.map(j => ({ ...j, location, badge: noRecog })));
    };

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

    // Sync local profile state with fullProfile prop
    useEffect(() => {
        if (fullProfile?.profile) {
            setProfile(fullProfile.profile);
            if (loadingData) {
                fetchRecommendations();
            }
        } else if (fullProfile && !fullProfile.profile && !loadingData) {
            // Profile is explicitly missing after a load attempt
            navigate('/onboarding');
        } else if (user && !fullProfile && refreshProfile) {
            refreshProfile();
        }
    }, [fullProfile, user, refreshProfile, fetchRecommendations, loadingData, navigate]);

    if (!fullProfile || (fullProfile.profile && loadingData)) {
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

    const fieldLabel = profile.degree_field || 'your field';
    const countryLabel = profile.degree_country || 'your country';
    const levelLabel = profile.degree_level || 'degree';

    return (
        <div className="container" style={{ paddingBottom: '5rem' }}>
            {/* Header section with profile name */}
            <div style={{ marginBottom: '3rem', paddingTop: '2.5rem' }}>
                <h1 style={{ fontSize: '3.5rem', fontWeight: 'bold', marginBottom: '1rem', letterSpacing: '-2px', lineHeight: '1.1' }}>
                    {t('welcomeBack')}, <span style={{ color: '#C8F135' }}>{username}!</span>
                </h1>
                <p style={{ fontSize: '1.4rem', color: 'var(--text-secondary)', maxWidth: '700px', fontWeight: '500' }}>
                    {t('journeyStart')}
                </p>
            </div>

            {/* DASHBOARD 4-PANEL GRID */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', 
                gap: '2.5rem',
                marginBottom: '4rem'
            }}>
                
                {/* PANEL 1: Situation at a Glance */}
                <div className="card-hover" style={{ 
                    background: 'var(--surface-color)', 
                    padding: '2.5rem', 
                    borderRadius: '24px', 
                    border: '1px solid var(--border-color)',
                    borderLeft: '4px solid #C8F135',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.5rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ background: 'rgba(200, 241, 53, 0.1)', padding: '0.75rem', borderRadius: '12px' }}>
                            <Sparkles color="#C8F135" size={24} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{t('situationTitle')}</h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{t('situationSub')}</p>
                        </div>
                    </div>
                    <p style={{ fontSize: '1.15rem', lineHeight: '1.8', color: 'var(--text-main)', opacity: 0.9 }}>
                        {isRegulated 
                            ? t('regulatedProfessionMsg').replace(/{degree_level}/g, levelLabel).replace(/{degree_field}/g, fieldLabel).replace(/{degree_country}/g, countryLabel)
                            : t('unregulatedProfessionMsg').replace(/{degree_level}/g, levelLabel).replace(/{degree_field}/g, fieldLabel).replace(/{degree_country}/g, countryLabel)
                        }
                    </p>
                </div>

                {/* PANEL 2: Recognition Pathway */}
                <div className="card-hover" style={{ 
                    background: 'var(--surface-color)', 
                    padding: '2.5rem', 
                    borderRadius: '24px', 
                    border: '1px solid var(--border-color)',
                }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Map size={24} color="#C8F135" /> {t('recognitionPathway')}
                    </h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {(isRegulated ? [
                            { id: 1, title: t('pathwayStep1Title'), desc: t('pathwayStep1Desc'), time: '4w', cost: '€50' },
                            { id: 2, title: t('pathwayStep2Title'), desc: t('pathwayStep2Desc'), time: '2w', cost: '€150' },
                            { id: 3, title: t('pathwayStep3Title'), desc: t('pathwayStep3Desc'), time: '6m', cost: '€0' }
                        ] : [
                            { id: 1, title: 'Employer Verification', desc: 'Confirm recognition needs', time: '1w', cost: '€0' },
                            { id: 2, title: 'Direct Job Application', desc: 'Focus on your CV', time: 'Ongoing', cost: '€0' }
                        ]).map(step => (
                            <div key={step.id} style={{ 
                                display: 'flex', gap: '1.25rem', alignItems: 'center', 
                                background: 'rgba(255,255,255,0.02)', padding: '1rem', 
                                borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' 
                            }}>
                                <div style={{ 
                                    width: '28px', height: '28px', borderRadius: '50%', background: '#C8F135', 
                                    color: '#0F0F0F', border: '2px solid #C8F135',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                    fontWeight: 'bold', flexShrink: 0, fontSize: '0.8rem'
                                }}>{step.id}</div>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ fontWeight: 'bold', fontSize: '1rem' }}>{step.title}</h4>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{step.desc}</p>
                                </div>
                                <button className="btn-outline" style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', borderColor: 'rgba(200, 241, 53, 0.4)', color: '#C8F135' }}>{t('markAsDone')}</button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* PANEL 3: Free Training */}
                <div className="card-hover" style={{ 
                    background: 'var(--surface-color)', 
                    padding: '2.5rem', 
                    borderRadius: '24px', 
                    border: '1px solid var(--border-color)',
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <BookOpen size={24} color="#C8F135" /> {t('freeTraining')}
                        </h2>
                        <span style={{ fontSize: '0.8rem', color: '#C8F135', fontWeight: 'bold' }}>{trainingItems.length} COURSES</span>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {trainingItems.slice(0, 3).map((course, idx) => (
                            <div key={idx} style={{ 
                                background: 'rgba(255,255,255,0.02)', padding: '1.25rem', 
                                borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                            }}>
                                <div>
                                    <h4 style={{ fontWeight: 'bold', fontSize: '0.95rem', marginBottom: '0.25rem' }}>{course.title}</h4>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{course.provider} • {course.duration}</p>
                                </div>
                                <ChevronRight size={18} color="rgba(255,255,255,0.3)" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* PANEL 4: Jobs Matching */}
                <div className="card-hover" style={{ 
                    background: 'var(--surface-color)', 
                    padding: '2.5rem', 
                    borderRadius: '24px', 
                    border: '1px solid var(--border-color)',
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Briefcase size={24} color="#C8F135" /> {t('jobsTitle')}
                        </h2>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {jobs.slice(0, 3).map((job, idx) => (
                            <div key={idx} style={{ 
                                background: 'rgba(255,255,255,0.02)', padding: '1.25rem', 
                                borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)',
                                display: 'flex', flexDirection: 'column', gap: '0.5rem'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <h4 style={{ fontWeight: 'bold', fontSize: '1rem' }}>{job.title}</h4>
                                    <span style={{ fontSize: '0.8rem', color: '#C8F135' }}>{job.match.split(' ')[0]} match</span>
                                </div>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{job.company}</p>
                            </div>
                        ))}
                    </div>
                    <button className="btn-primary" style={{ width: '100%', marginTop: '1.5rem', padding: '0.75rem' }}>Explore all 40+ Matches</button>
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
