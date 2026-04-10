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
    const [isRegulated, setIsRegulated] = useState(false);
    const [doneSteps, setDoneSteps] = useState([]);
    
    // Dynamic Data States
    const [jobs, setJobs] = useState([]);
    const [trainingItems, setTrainingItems] = useState([]);
    const [loadingData, setLoadingData] = useState(true);

    const username = displayName || fullProfile?.first_name || 'there';

    useEffect(() => {
        // Log API URL for debugging production connectivity
        console.log("Dashboard: API_BASE_URL is", API_BASE_URL);

        if (fullProfile) {
            setProfile(fullProfile.profile);
            if (fullProfile.profile) {
                const field = (fullProfile.profile.degree_field || '').toLowerCase();
                const regulatedKeywords = ['medicine', 'medic', 'doctor', 'nurs', 'law', 'legal', 'engineer', 'architect', 'psycholog', 'pharmacist', 'vet', 'dentist', 'teacher', 'accountant'];
                setIsRegulated(regulatedKeywords.some(keyword => field.includes(keyword)));
            }
            fetchRecommendations();
        } else if (user && refreshProfile) {
            // Fallback: If page is loaded directly and App.jsx hasn't finished fetching yet
            console.log("Dashboard: profile missing, triggering refresh...");
            refreshProfile();
        }
    }, [fullProfile, user, refreshProfile, fetchRecommendations]);

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
            setLoadingData(false);
        }
    }, [stytch]);

    if (!profile) {
        return (
            <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
                <div className="loader" style={{ color: 'var(--accent-color)', fontSize: '1.2rem' }}>
                    {t('loading')}...
                </div>
            </div>
        );
    }

    const toggleStep = (step) => {
        if (doneSteps.includes(step)) {
            setDoneSteps(doneSteps.filter(s => s !== step));
        } else {
            setDoneSteps([...doneSteps, step]);
        }
    };

    return (
        <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                {t('welcome')}, <span style={{ color: 'var(--accent-color)' }}>{username}</span>!
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem', fontSize: '1.25rem' }}>
                {t('heroSub')}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                
                {/* PANEL 1 — "Your Situation at a Glance" */}
                <div style={{
                    background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderLeft: '4px solid var(--accent-color)',
                    borderRadius: '12px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Sparkles color="var(--accent-color)" size={28} />
                        <div>
                            <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', margin: 0 }}>{t('situationSummary')}</h2>
                            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>{t('socialProof')}</p>
                        </div>
                    </div>
                    <p style={{ color: 'var(--text-primary)', lineHeight: '1.6', fontSize: '1.1rem' }}>
                        {(() => {
                            let template = isRegulated ? t('summaryRegulated') : (profile.degree_level && profile.degree_field ? t('summaryUnregulated') : t('summaryGeneric'));
                            return template
                                .replace('{degree_level}', profile.degree_level || 'degree')
                                .replace('{degree_field}', profile.degree_field || 'your field')
                                .replace('{degree_country}', profile.degree_country || 'your country')
                                .replaceAll('{degree_field}', profile.degree_field || 'your field');
                        })()}
                    </p>
                </div>

                {/* PANEL 2 — "Your Recognition Pathway" */}
                <div style={{
                    background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Map color="var(--accent-color)" size={28} />
                        <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', margin: 0 }}>{t('recognitionPathway')}</h2>
                    </div>

                    {!isRegulated ? (
                        <>
                            <div style={{ background: 'rgba(200, 241, 53, 0.1)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--accent-color)', display: 'flex', gap: '1rem' }}>
                                <CheckCircle color="var(--accent-color)" />
                                <p style={{ color: 'var(--text-primary)', margin: 0, lineHeight: '1.5' }}>
                                    Good news — you likely do not need formal degree recognition for most private sector roles in {profile.degree_field}. You can apply to jobs directly. We have found roles suited to your background below.
                                </p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                                {[
                                    { title: 'Verify with employer', desc: 'Ask potential employers if they require recognition.', time: '~1 week', cost: '€0' },
                                    { title: 'Optional: CIMEA Statement', desc: 'Get a statement of comparability for negotiating salary.', time: '~4 weeks', cost: '€150' }
                                ].map((step, idx) => (
                                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--background)', borderRadius: '8px', border: '1px solid var(--border-color)', flexWrap: 'wrap', gap: '1rem' }}>
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', background: 'var(--accent-color)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{idx + 1}</div>
                                            <div>
                                                <div style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{step.title}</div>
                                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{step.desc}</div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <span style={{ padding: '0.2rem 0.5rem', background: '#333', borderRadius: '4px', fontSize: '0.8rem', color: '#ccc' }}>{step.time}</span>
                                            <span style={{ padding: '0.2rem 0.5rem', background: '#333', borderRadius: '4px', fontSize: '0.8rem', color: '#ccc' }}>{step.cost}</span>
                                            <button onClick={() => toggleStep(idx)} style={{ padding: '0.5rem 1rem', background: doneSteps.includes(idx) ? 'var(--accent-color)' : 'transparent', color: doneSteps.includes(idx) ? '#000' : 'var(--accent-color)', border: '1px solid var(--accent-color)', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s', width: '120px' }}>
                                                {doneSteps.includes(idx) ? t('done') + ' ✓' : t('markAsDone')}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {[
                                { title: 'Get your degree Apostilled', desc: 'Contact your home country embassy in Italy', time: '~3–8 weeks', cost: 'varies' },
                                { title: 'Certified Italian translation', desc: 'Find a perito giurato sworn translator', time: '~1 week', cost: '~€80–150' },
                                { title: 'Submit application to MUR', desc: 'Via your nearest Italian university international desk', time: '~6–18 months', cost: '€16' },
                                { title: 'Complete free training courses', desc: 'Matched to your field while you wait', time: 'Ongoing', cost: '€0' }
                            ].map((step, idx) => (
                                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--background)', borderRadius: '8px', border: '1px solid var(--border-color)', flexWrap: 'wrap', gap: '1rem' }}>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', background: 'var(--accent-color)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', minWidth: '2rem' }}>{idx + 1}</div>
                                        <div>
                                            <div style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{step.title}</div>
                                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{step.desc}</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <span style={{ padding: '0.2rem 0.5rem', background: '#333', borderRadius: '4px', fontSize: '0.8rem', color: '#ccc', whiteSpace: 'nowrap' }}>{step.time}</span>
                                        <span style={{ padding: '0.2rem 0.5rem', background: '#333', borderRadius: '4px', fontSize: '0.8rem', color: '#ccc', whiteSpace: 'nowrap' }}>{step.cost}</span>
                                        <button onClick={() => toggleStep(idx)} style={{ padding: '0.5rem 1rem', background: doneSteps.includes(idx) ? 'var(--accent-color)' : 'transparent', color: doneSteps.includes(idx) ? '#000' : 'var(--accent-color)', border: '1px solid var(--accent-color)', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s', width: '120px' }}>
                                            {doneSteps.includes(idx) ? t('done') + ' ✓' : t('markAsDone')}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* PANEL 3 — "Free Training Near You" */}
                <div style={{
                    background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem'
                }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <BookOpen color="var(--accent-color)" size={28} />
                            <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', margin: 0 }}>{t('freeTraining')}</h2>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '0.9rem' }}>{t('freeTrainingSub')}</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                        {loadingData ? (
                            <div style={{ color: 'var(--text-secondary)', padding: '2rem' }}>{t('loading')}...</div>
                        ) : trainingItems.length > 0 ? (
                            trainingItems.map((course) => (
                                <div key={course.id} style={{ background: 'var(--background)', borderRadius: '8px', border: '1px solid var(--border-color)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', margin: 0 }}>{course.title}</h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>{course.provider}</p>
                                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                        <span style={{ padding: '0.2rem 0.5rem', background: '#333', borderRadius: '4px', fontSize: '0.8rem', color: '#ccc' }}>{course.duration}</span>
                                        <span style={{ padding: '0.2rem 0.5rem', background: 'var(--accent-color)', borderRadius: '4px', fontSize: '0.8rem', color: '#000', fontWeight: 'bold' }}>{course.price}</span>
                                        <span style={{ padding: '0.2rem 0.5rem', background: '#333', borderRadius: '4px', fontSize: '0.8rem', color: '#ccc' }}>{course.type}</span>
                                    </div>
                                    <button className="btn-outline" style={{ marginTop: 'auto', width: '100%', padding: '0.5rem' }}>{t('viewCourse')} →</button>
                                </div>
                            ))
                        ) : (
                            <p style={{ color: 'var(--text-secondary)' }}>No training courses found for your area.</p>
                        )}
                    </div>
                    <a href="#" style={{ color: 'var(--accent-color)', textDecoration: 'none', alignSelf: 'flex-start', marginTop: '0.5rem' }}>{t('loadMore')} →</a>
                </div>

                {/* PANEL 4 — "Jobs You Can Apply For Right Now" */}
                <div style={{
                    background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem'
                }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <Briefcase color="var(--accent-color)" size={28} />
                            <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', margin: 0 }}>{t('jobsTitle')}</h2>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '0.9rem' }}>{t('jobsSub')}</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                        {loadingData ? (
                            <div style={{ color: 'var(--text-secondary)', padding: '2rem' }}>{t('loading')}...</div>
                        ) : jobs.length > 0 ? (
                            jobs.map((job) => (
                                <div key={job.id} style={{ background: 'var(--background)', borderRadius: '8px', border: '1px solid var(--border-color)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', margin: 0 }}>{job.title}</h3>
                                    <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem', margin: 0 }}>{job.company} — <span style={{ color: 'var(--text-secondary)' }}>{job.location}</span></p>
                                    <p style={{ color: 'var(--accent-color)', margin: '0.5rem 0', fontSize: '0.9rem' }}>{job.match}</p>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                        {job.tags?.map((tag, i) => (
                                            <div key={i} style={{ display: 'inline-block', padding: '0.2rem 0.5rem', background: 'rgba(200, 241, 53, 0.1)', color: 'var(--accent-color)', borderRadius: '4px', fontSize: '0.7rem', border: '1px solid var(--accent-color)' }}>
                                                {tag}
                                            </div>
                                        ))}
                                    </div>
                                    <button className="btn-outline" style={{ marginTop: 'auto', width: '100%', padding: '0.5rem' }}>{t('viewCourse')} →</button>
                                </div>
                            ))
                        ) : (
                            <p style={{ color: 'var(--text-secondary)' }}>No jobs matches found yet.</p>
                        )}
                    </div>
                    <a href="#" style={{ color: 'var(--accent-color)', textDecoration: 'none', alignSelf: 'flex-start', marginTop: '0.5rem' }}>{t('loadMore')} →</a>
                </div>

                {/* KEEP EXISTING: CV Upload and CV Generate cards */}
                <div style={{ marginTop: '3rem' }}>
                    <h2 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Upload Your Documents</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Add your CV to unlock personalised job matching and AI analysis</p>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        <div style={{ background: 'var(--surface-color)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' }}>
                            <div style={{ background: 'rgba(212, 255, 0, 0.1)', padding: '1rem', borderRadius: '50%' }}>
                                <UploadCloud size={32} color="var(--accent-color)" />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', margin: 0 }}>Upload your CV</h3>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                                Upload your existing CV in PDF or Word format. We will store it securely for future analysis and matching.
                            </p>
                            <button onClick={() => navigate('/upload-cv')} className="btn-primary" style={{ marginTop: 'auto', width: '100%' }}>
                                Upload CV
                            </button>
                        </div>

                        <div style={{ background: 'var(--surface-color)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' }}>
                            <div style={{ background: 'rgba(212, 255, 0, 0.1)', padding: '1rem', borderRadius: '50%' }}>
                                <FileText size={32} color="var(--accent-color)" />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', margin: 0 }}>CV Generate</h3>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                                Provide information about your academic background and experience. Our AI will analyze data and generate an optimized CV.
                            </p>
                            <button onClick={() => navigate('/cv-generator')} className="btn-primary" style={{ marginTop: 'auto', width: '100%' }}>
                                Start Generator
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
