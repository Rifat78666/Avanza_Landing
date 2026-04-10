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
                // If backend provides real data, use it. Otherwise keep our placeholders.
                if (data.jobs && data.jobs.length > 0) setJobs(data.jobs);
                if (data.training && data.training.length > 0) setTrainingItems(data.training);
            }
        } catch (err) {
            console.error("Recommendations fetch error", err);
        } finally {
            setTimeout(() => setLoadingData(false), 800);
        }
    }, [stytch]);

    useEffect(() => {
        if (fullProfile) {
            setProfile(fullProfile.profile);
            fetchRecommendations();
        } else if (user && refreshProfile) {
            refreshProfile();
        }
    }, [fullProfile, user, refreshProfile, fetchRecommendations]);

    if (!profile || loadingData) {
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
            {/* Header */}
            <div style={{ marginBottom: '3rem', paddingTop: '2.5rem' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem', letterSpacing: '-1.5px' }}>
                    {t('hello')}, <span style={{ color: '#C8F135' }}>{username}</span>
                </h1>
                <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px' }}>
                    {t('dashboardIntro')}
                </p>
            </div>

            {/* PANEL 1: Situation at a Glance */}
            <div className="card-hover" style={{ 
                background: 'var(--surface-color)', 
                padding: '2rem', 
                borderRadius: '16px', 
                border: '1px solid var(--border-color)',
                borderLeft: '4px solid #C8F135',
                marginBottom: '2.5rem'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <Sparkles color="#C8F135" size={24} />
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{t('situationTitle')}</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{t('situationSub')}</p>
                    </div>
                </div>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: 'var(--text-main)' }}>
                    {isRegulated 
                        ? t('summaryRegulated').replace(/{degree_level}/g, levelLabel).replace(/{degree_field}/g, fieldLabel).replace(/{degree_country}/g, countryLabel)
                        : t('summaryUnregulated').replace(/{degree_level}/g, levelLabel).replace(/{degree_field}/g, fieldLabel).replace(/{degree_country}/g, countryLabel)
                    }
                </p>
            </div>

            {/* PANEL 2: Recognition Pathway */}
            <div style={{ marginBottom: '4rem' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Map size={24} color="#C8F135" /> {t('recognitionPathway')}
                </h2>

                {!isRegulated ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ 
                            background: 'rgba(200, 241, 53, 0.05)', 
                            border: '1px solid rgba(200, 241, 53, 0.2)', 
                            padding: '1.5rem', 
                            borderRadius: '12px',
                            display: 'flex',
                            gap: '1rem',
                            alignItems: 'flex-start'
                        }}>
                            <CheckCircle color="#C8F135" size={24} style={{ flexShrink: 0 }} />
                            <p style={{ color: '#C8F135', fontWeight: '500' }}>
                                {t('unregulatedProfessionMsg').replace(/{field}/g, fieldLabel)}
                            </p>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                            <div className="card-hover" style={{ background: 'var(--surface-color)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <span style={{ background: '#C8F135', color: '#0F0F0F', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>1</span>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>~1 week</span>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>€0</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <h4 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Verify with employer</h4>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Ask potential employers if they require recognition.</p>
                                    </div>
                                    <button className="btn-outline" style={{ fontSize: '0.8rem', borderColor: '#C8F135', color: '#C8F135' }}>Mark as done</button>
                                </div>
                            </div>
                            <div className="card-hover" style={{ background: 'var(--surface-color)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <span style={{ background: '#C8F135', color: '#0F0F0F', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>2</span>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>~4 weeks</span>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>€150</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <h4 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Optional: CIMEA Statement</h4>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Get a statement of comparability for negotiating salary.</p>
                                    </div>
                                    <button className="btn-outline" style={{ fontSize: '0.8rem', borderColor: '#C8F135', color: '#C8F135' }}>Mark as done</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {[
                            { id: 1, title: t('pathwayStep1Title'), desc: t('pathwayStep1Desc'), time: '3-8 weeks', cost: 'Varies' },
                            { id: 2, title: t('pathwayStep2Title'), desc: t('pathwayStep2Desc'), time: '1 week', cost: '€80-150' },
                            { id: 3, title: t('pathwayStep3Title'), desc: t('pathwayStep3Desc'), time: '6-18 months', cost: '€0' },
                            { id: 4, title: t('pathwayStep4Title'), desc: t('pathwayStep4Desc'), time: 'Ongoing', cost: '€0' }
                        ].map(step => (
                            <div key={step.id} style={{ 
                                display: 'flex', gap: '1.5rem', alignItems: 'center', 
                                background: 'var(--surface-color)', padding: '1.5rem', 
                                borderRadius: '12px', border: '1px solid var(--border-color)' 
                            }}>
                                <div style={{ 
                                    width: '32px', height: '32px', borderRadius: '50%', background: '#C8F135', 
                                    color: '#0F0F0F', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                    fontWeight: 'bold', flexShrink: 0 
                                }}>{step.id}</div>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ fontWeight: 'bold' }}>{step.title}</h4>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{step.desc}</p>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8rem' }}>
                                    <span style={{ padding: '0.3rem 0.6rem', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>{step.time}</span>
                                    <span style={{ padding: '0.3rem 0.6rem', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>{step.cost}</span>
                                </div>
                                <button className="btn-outline" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>{t('markAsDone')}</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* PANEL 3: Free Training */}
            <div style={{ marginBottom: '4rem' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <BookOpen size={24} color="#C8F135" /> {t('freeTraining')}
                </h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>{t('freeTrainingSub')}</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {trainingItems.map((course, idx) => (
                        <div key={idx} className="card-hover" style={{ 
                            background: 'var(--surface-color)', padding: '1.5rem', 
                            borderRadius: '16px', border: '1px solid var(--border-color)',
                            display: 'flex', flexDirection: 'column', gap: '1rem'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <span style={{ background: 'rgba(200, 241, 53, 0.1)', color: '#C8F135', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>FREE</span>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{course.duration}</span>
                            </div>
                            <h4 style={{ fontWeight: 'bold', fontSize: '1.1rem', lineHeight: '1.4' }}>{course.title}</h4>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{course.provider}</p>
                            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{course.lang}</span>
                                <button style={{ background: 'transparent', border: 'none', color: '#C8F135', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    {t('viewCourse')} <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* PANEL 4: Available Jobs */}
            <div style={{ marginBottom: '5rem' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Briefcase size={24} color="#C8F135" /> {t('jobsTitle')}
                </h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>{t('jobsSub')}</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {jobs.map((job, idx) => (
                        <div key={idx} className="card-hover" style={{ 
                            background: 'var(--surface-color)', padding: '1.5rem', 
                            borderRadius: '16px', border: '1px solid var(--border-color)',
                            display: 'flex', flexDirection: 'column', gap: '1rem'
                        }}>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                    <h4 style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{job.title}</h4>
                                    <span style={{ border: '1px solid #C8F135', color: '#C8F135', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem' }}>N/A required</span>
                                </div>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{job.company} • {job.location}</p>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem' }}>
                                <p style={{ color: '#C8F135', fontWeight: 'bold', marginBottom: '0.25rem' }}>{job.salary || 'Competitive'}</p>
                                <div style={{ background: 'rgba(200, 241, 53, 0.1)', color: '#C8F135', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', display: 'inline-block', marginBottom: '0.5rem' }}>
                                    No recognition required
                                </div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{job.match}</p>
                            </div>
                            <button className="btn-outline" style={{ width: '100%', marginTop: '0.5rem', borderColor: '#C8F135', color: '#C8F135' }}>View Job →</button>
                        </div>
                    ))}
                </div>
            </div>

            {/* SECTION: Upload Your Documents */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '4rem' }}>
                <div style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{t('uploadDocumentsTitle')}</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>{t('uploadDocumentsSub')}</p>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                    <div className="card-hover" style={{ 
                        background: 'var(--surface-color)', padding: '2.5rem', 
                        borderRadius: '20px', border: '1px solid var(--border-color)',
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
                        borderRadius: '20px', border: '1px solid var(--border-color)',
                        cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '1.5rem'
                    }} onClick={() => navigate('/generate-cv')}>
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
