import React, { useState, useRef } from 'react';
import { UploadCloud, File, AlertCircle, Loader } from 'lucide-react';
import JobMatches from '../components/JobMatches';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';

const UploadCV = () => {
    const { t } = useLanguage();
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);
    const [uploadState, setUploadState] = useState('idle'); // 'idle' | 'analyzing' | 'complete'
    const inputRef = useRef(null);
    const navigate = useNavigate();

    // Mock Response from FastAPI/NIM/Adzuna pipeline
    const mockJobs = [
        {
            title: 'Infermiere Professionale (Registered Nurse)',
            company: 'Policlinico di Milano',
            location: 'Milan, Italy',
            matchScore: '95%',
            description: 'Looking for a dedicated registered nurse to join our cardiology division. Must have degree validation in progress.',
            skills: ['Patient Care', 'Cardiology', 'Italian B2']
        },
        {
            title: 'Health Care Assistant',
            company: 'Villa Salus Rome',
            location: 'Rome, Italy',
            matchScore: '88%',
            description: 'Provide essential support in our geriatric care facility. Strong communicative skills required.',
            skills: ['Geriatrics', 'Empathy', 'Teamwork']
        }
    ];

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            validateAndSetFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            validateAndSetFile(e.target.files[0]);
        }
    };

    const validateAndSetFile = (selectedFile) => {
        setError(null);
        const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!validTypes.includes(selectedFile.type)) {
            setError(t('invalidFormat'));
            return;
        }
        setFile(selectedFile);
    };

    const triggerUpload = () => {
        if (!file) return;
        setUploadState('analyzing');
        
        // Simulating the delay of sending to FastAPI -> NIM -> Adzuna -> returning
        setTimeout(() => {
            setUploadState('complete');
        }, 3500);
    };

    const resetFlow = () => {
        setFile(null);
        setError(null);
        setUploadState('idle');
    };

    return (
        <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '800px' }}>
            {/* Header with back button */}
            {uploadState !== 'analyzing' && (
                <button onClick={() => navigate('/dashboard')} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    &larr; {t('prevBtn')}
                </button>
            )}

            {uploadState === 'idle' && (
                <div style={{ animation: 'fadeIn 0.3s ease-in' }}>
                    <h1 style={{ fontSize: '2.5rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>{t('uploadCVTitle')}</h1>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem', fontSize: '1.1rem' }}>
                        {t('uploadCVSub')}
                    </p>

                    <div 
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => inputRef.current?.click()}
                        style={{
                            border: `2px dashed ${dragActive ? 'var(--accent-color)' : 'var(--border-color)'}`,
                            borderRadius: '16px',
                            padding: '4rem 2rem',
                            textAlign: 'center',
                            background: dragActive ? 'rgba(212, 255, 0, 0.05)' : 'var(--surface-color)',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '1rem'
                        }}
                    >
                        <input 
                            ref={inputRef}
                            type="file" 
                            accept=".pdf, .doc, .docx" 
                            onChange={handleChange} 
                            style={{ display: 'none' }} 
                        />
                        
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '50%' }}>
                            <UploadCloud size={48} color={dragActive ? "var(--accent-color)" : "var(--text-secondary)"} />
                        </div>
                        
                        <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', margin: 0 }}>
                            {file ? t('clickToChange') : t('dragDrop')}
                        </h3>
                        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                            {t('orClickToBrowse')}
                        </p>
                        <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>
                            {t('supportedFormats')}
                        </p>
                    </div>

                    {error && (
                        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255, 0, 0, 0.1)', border: '1px solid red', borderRadius: '8px', color: '#ff6b6b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <AlertCircle size={20} /> {error}
                        </div>
                    )}

                    {file && !error && (
                        <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', background: 'var(--surface-color)', border: '1px solid var(--accent-color)', borderRadius: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <File color="var(--accent-color)" size={24} />
                                <div>
                                    <p style={{ color: 'var(--text-primary)', margin: 0, fontWeight: 'bold' }}>{file.name}</p>
                                    <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.85rem' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            </div>
                            <button onClick={(e) => { e.stopPropagation(); triggerUpload(); }} className="btn-primary" style={{ padding: '0.5rem 1.5rem' }}>
                                {t('analyzeBtn')}
                            </button>
                        </div>
                    )}
                </div>
            )}

            {uploadState === 'analyzing' && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '50vh', textAlign: 'center' }}>
                    <div className="spinning" style={{ marginBottom: '2rem' }}>
                        <Loader size={64} color="var(--accent-color)" />
                    </div>
                    <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                        {t('analyzingProfile')}
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '400px' }}>
                        {t('analyzingAI')}
                    </p>
                </div>
            )}

            {uploadState === 'complete' && (
                <JobMatches jobs={mockJobs} onRestart={resetFlow} />
            )}
        </div>
    );
};

export default UploadCV;
