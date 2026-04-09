import React from 'react';
import { Briefcase, MapPin, CheckCircle, ExternalLink } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

const JobMatches = ({ jobs, onRestart }) => {
    const { t } = useLanguage();

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', animation: 'fadeIn 0.5s ease-in' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <div style={{ display: 'inline-flex', background: 'rgba(212, 255, 0, 0.1)', padding: '1rem', borderRadius: '50%', marginBottom: '1rem' }}>
                    <CheckCircle size={48} color="var(--accent-color)" />
                </div>
                <h2 style={{ fontSize: '2.5rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>
                    {t('analysisComplete')}
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                    {t('analysisSub')}
                </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {jobs.map((job, index) => (
                    <div key={index} style={{
                        background: 'var(--surface-color)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        transition: 'transform 0.2s',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{ 
                            position: 'absolute', 
                            top: '1.5rem', 
                            right: '1.5rem', 
                            background: 'rgba(212, 255, 0, 0.15)', 
                            color: 'var(--accent-color)', 
                            padding: '0.25rem 0.75rem', 
                            borderRadius: '16px',
                            fontWeight: 'bold',
                            fontSize: '0.9rem'
                        }}>
                            {job.matchScore} {t('match')}
                        </div>
                        
                        <div>
                            <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '0.5rem', paddingRight: '5rem' }}>
                                {job.title}
                            </h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Briefcase size={16} /> {job.company}</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={16} /> {job.location}</span>
                            </div>
                        </div>

                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                            {job.description}
                        </p>
                        
                        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                {job.skills.map((skill, i) => (
                                    <span key={i} style={{ background: 'rgba(255,255,255,0.05)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem', color: '#ccc' }}>
                                        {skill}
                                    </span>
                                ))}
                            </div>
                            
                            <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
                                {t('applyNow')} <ExternalLink size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                 <button onClick={onRestart} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', textDecoration: 'underline', cursor: 'pointer', fontSize: '1rem' }}>
                     {t('uploadDifferent')}
                 </button>
            </div>
        </div>
    );
};

export default JobMatches;
