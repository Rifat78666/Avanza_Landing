import React, { useState } from 'react';
import { useStytchUser, useStytch } from '@stytch/react';
import { ArrowLeft, ArrowRight, CheckCircle, Loader } from 'lucide-react';
import CVResult from '../components/CVResult';
import { useLanguage } from '../LanguageContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://avanza-backend-h0pm.onrender.com';

const CVGenerator = () => {
    const { user } = useStytchUser();
    const stytch = useStytch();
    const { t } = useLanguage();
    const defaultEmail = user?.emails?.[0]?.email || '';

    const [step, setStep] = useState(1);
    const [isFinished, setIsFinished] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedCV, setGeneratedCV] = useState(null);

    // Form Data State spanning all 4 steps
    const [formData, setFormData] = useState({
        personal: { fullName: '', email: defaultEmail, phone: '', linkedin: '', abstract: '' },
        education: { degree: '', university: '', country: '', graduationYear: '' },
        experience: { jobTitle: '', company: '', yearsOfExperience: '', description: '', skills: '', languages: '' },
        goal: { targetProfession: '' }
    });

    const handleNestedChange = (category, field, value) => {
        setFormData(prev => ({
            ...prev,
            [category]: { ...prev[category], [field]: value }
        }));
    };

    const submitToAI = async () => {
        setIsGenerating(true);
        try {
            const token = stytch.session.getTokens()?.session_token;
            const res = await fetch(`${API_BASE_URL}/api/cv/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                const data = await res.json();
                setGeneratedCV(data);
                setIsFinished(true);
            } else {
                console.error("AI Generation failed");
            }
        } catch (error) {
            console.error("Error generating CV:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    const nextStep = () => {
        if (step < 4) setStep(step + 1);
        else submitToAI();
    };

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    // --- Render Form Steps ---
    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>{t('step1Title')}</h2>
                        
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>{t('fullName')}</label>
                            <input 
                                type="text" 
                                value={formData.personal.fullName}
                                onChange={(e) => handleNestedChange('personal', 'fullName', e.target.value)}
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--surface-color)', color: 'var(--text-primary)' }} 
                                placeholder={t('fullNamePlaceholder')}
                            />
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>{t('email')}</label>
                                <input 
                                    type="email" 
                                    value={formData.personal.email}
                                    onChange={(e) => handleNestedChange('personal', 'email', e.target.value)}
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--surface-color)', color: 'var(--text-primary)' }} 
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>{t('phone')}</label>
                                <input 
                                    type="tel" 
                                    value={formData.personal.phone}
                                    onChange={(e) => handleNestedChange('personal', 'phone', e.target.value)}
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--surface-color)', color: 'var(--text-primary)' }} 
                                    placeholder={t('phonePlaceholder')}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>{t('linkedin')}</label>
                            <input 
                                type="url" 
                                value={formData.personal.linkedin}
                                onChange={(e) => handleNestedChange('personal', 'linkedin', e.target.value)}
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--surface-color)', color: 'var(--text-primary)' }} 
                                placeholder={t('linkedinPlaceholder')}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>{t('summary')}</label>
                            <textarea 
                                value={formData.personal.abstract}
                                onChange={(e) => handleNestedChange('personal', 'abstract', e.target.value)}
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--surface-color)', color: 'var(--text-primary)', minHeight: '100px', resize: 'vertical' }} 
                                placeholder={t('summaryPlaceholder')}
                            />
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>{t('step2Title')}</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>{t('step2Sub')}</p>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>{t('degree')}</label>
                            <input 
                                type="text" 
                                value={formData.education.degree}
                                onChange={(e) => handleNestedChange('education', 'degree', e.target.value)}
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--surface-color)', color: 'var(--text-primary)' }} 
                                placeholder={t('degreePlaceholder')}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>{t('university')}</label>
                            <input 
                                type="text" 
                                value={formData.education.university}
                                onChange={(e) => handleNestedChange('education', 'university', e.target.value)}
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--surface-color)', color: 'var(--text-primary)' }} 
                                placeholder={t('universityPlaceholder')}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>{t('countryOfStudy')}</label>
                                <input 
                                    type="text" 
                                    value={formData.education.country}
                                    onChange={(e) => handleNestedChange('education', 'country', e.target.value)}
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--surface-color)', color: 'var(--text-primary)' }} 
                                    placeholder={t('countryPlaceholder2')}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>{t('gradYear')}</label>
                                <input 
                                    type="text" 
                                    value={formData.education.graduationYear}
                                    onChange={(e) => handleNestedChange('education', 'graduationYear', e.target.value)}
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--surface-color)', color: 'var(--text-primary)' }} 
                                    placeholder={t('gradYearPlaceholder')}
                                />
                            </div>
                        </div>

                    </div>
                );
            case 3:
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>{t('step3Title')}</h2>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>{t('recentJob')}</label>
                                <input 
                                    type="text" 
                                    value={formData.experience.jobTitle}
                                    onChange={(e) => handleNestedChange('experience', 'jobTitle', e.target.value)}
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--surface-color)', color: 'var(--text-primary)' }} 
                                    placeholder={t('recentJobPlaceholder')}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>{t('yearsExp')}</label>
                                <input 
                                    type="number" 
                                    value={formData.experience.yearsOfExperience}
                                    onChange={(e) => handleNestedChange('experience', 'yearsOfExperience', e.target.value)}
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--surface-color)', color: 'var(--text-primary)' }} 
                                    placeholder={t('yearsPlaceholder')}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>{t('company')}</label>
                            <input 
                                type="text" 
                                value={formData.experience.company}
                                onChange={(e) => handleNestedChange('experience', 'company', e.target.value)}
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--surface-color)', color: 'var(--text-primary)' }} 
                                placeholder={t('companyPlaceholder')}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>{t('jobDesc')}</label>
                            <textarea 
                                value={formData.experience.description}
                                onChange={(e) => handleNestedChange('experience', 'description', e.target.value)}
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--surface-color)', color: 'var(--text-primary)', minHeight: '80px', resize: 'vertical' }} 
                                placeholder={t('jobDescPlaceholder')}
                            />
                        </div>
                        
                         <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>{t('skills')}</label>
                            <input 
                                value={formData.experience.skills}
                                onChange={(e) => handleNestedChange('experience', 'skills', e.target.value)}
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--surface-color)', color: 'var(--text-primary)' }} 
                                placeholder={t('skillsPlaceholder')}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>{t('languages')}</label>
                            <input 
                                value={formData.experience.languages}
                                onChange={(e) => handleNestedChange('experience', 'languages', e.target.value)}
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--surface-color)', color: 'var(--text-primary)' }} 
                                placeholder={t('languagesPlaceholder')}
                            />
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center', textAlign: 'center', padding: '2rem 0' }}>
                        <div style={{ background: 'rgba(212, 255, 0, 0.1)', padding: '1.5rem', borderRadius: '50%', marginBottom: '1rem' }}>
                            <CheckCircle size={48} color="var(--accent-color)" />
                        </div>
                        <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>{t('step4Title')}</h2>
                        <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 2rem auto', lineHeight: '1.5' }}>
                            {t('step4Sub')}
                        </p>

                        <div style={{ width: '100%', maxWidth: '500px', textAlign: 'left' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>{t('targetProfession')}</label>
                            <input 
                                type="text" 
                                value={formData.goal.targetProfession}
                                onChange={(e) => handleNestedChange('goal', 'targetProfession', e.target.value)}
                                style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '2px solid var(--accent-color)', background: 'var(--surface-color)', color: 'var(--text-primary)', fontSize: '1.2rem' }} 
                                placeholder={t('targetProfessionPlaceholder')}
                            />
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    // If Finished, render the composed result
    if (isFinished && generatedCV) {
        return (
             <div className="container" style={{ padding: '3rem 1.5rem' }}>
                 <button onClick={() => setIsFinished(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '2rem' }}>
                     <ArrowLeft size={16} /> {t('backToEditor')}
                 </button>
                 <CVResult formData={formData} aiData={generatedCV} onEdit={() => { setIsFinished(false); setStep(1); }} />
             </div>
        );
    }

    if (isGenerating) {
        return (
            <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Loader size={64} color="var(--accent-color)" style={{ animation: 'spin 2s linear infinite', marginBottom: '2rem' }} />
                <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Structuring your CV...</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>Our AI is translating and formatting your experience for the European market.</p>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '800px' }}>
            
            {/* Header Progress Indicators */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '50%', left: '0', right: '0', height: '2px', background: 'var(--border-color)', zIndex: 0 }}></div>
                {[1, 2, 3, 4].map(num => (
                    <div key={num} style={{ 
                        width: '40px', 
                        height: '40px', 
                        borderRadius: '50%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        background: step >= num ? 'var(--accent-color)' : 'var(--surface-color)',
                        color: step >= num ? '#000' : 'var(--text-secondary)',
                        border: `2px solid ${step >= num ? 'var(--accent-color)' : 'var(--border-color)'}`,
                        zIndex: 1,
                        fontWeight: 'bold',
                        transition: 'all 0.3s ease'
                    }}>
                        {num}
                    </div>
                ))}
            </div>

            {/* Form Section */}
             <div style={{ background: 'rgba(255,255,255,0.03)', padding: '3rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                {renderStepContent()}

                {/* Footer Controls */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
                    <button 
                        onClick={prevStep} 
                        disabled={step === 1}
                        className="btn-outline"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: step === 1 ? 0.3 : 1, cursor: step === 1 ? 'not-allowed' : 'pointer' }}
                    >
                        <ArrowLeft size={18} /> {t('prevBtn')}
                    </button>
                    
                    <button 
                        onClick={nextStep} 
                        className="btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        {step === 4 ? t('generateCV') : t('nextBtn')} <ArrowRight size={18} />
                    </button>
                </div>
             </div>

        </div>
    );
};

export default CVGenerator;
