import React, { useState } from 'react';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import { useStytch } from '@stytch/react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://avanza-backend-h0pm.onrender.com';

const CVResult = ({ formData, aiData, onEdit }) => {
    const stytch = useStytch();
    const [isDownloading, setIsDownloading] = useState(false);

    // Form data provides personal info
    const { personal = {}, education = {} } = formData;
    
    // AI data provides the rewritten experience, summary, and skills
    const { 
        professional_summary = "", 
        experience = [], 
        skills = [] 
    } = aiData || {};
    
    const handleDownloadPDF = async () => {
        setIsDownloading(true);
        try {
            const token = stytch.session.getTokens()?.session_token;
            if (!token) return;

            const res = await fetch(`${API_BASE_URL}/api/cv/download-pdf`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({
                    personal: personal,
                    professional_summary: professional_summary,
                    experience: experience,
                    skills: skills
                })
            });
            
            if (res.ok) {
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `CV_${personal.fullName || 'User'}.pdf`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            } else {
                console.error("PDF generation failed");
            }
        } catch (err) {
            console.error("PDF error", err);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', background: '#fff', color: '#333', padding: '3rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            
            {/* Header / Personal Data */}
            <div style={{ borderBottom: '2px solid #D4FF00', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1a1a1a', marginBottom: '0.5rem' }}>
                    {personal.fullName || 'User Name'}
                </h1>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', fontSize: '0.9rem', color: '#555', marginTop: '1rem' }}>
                    {personal.email && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Mail size={16} /> {personal.email}
                        </div>
                    )}
                    {personal.phone && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Phone size={16} /> {personal.phone}
                        </div>
                    )}
                    {personal.linkedin && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Globe size={16} /> {personal.linkedin}
                        </div>
                    )}
                </div>
            </div>

            {/* Abstract / Summary */}
            {professional_summary && (
                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1a1a1a', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Professional Summary</h3>
                    <p style={{ lineHeight: '1.6', color: '#444' }}>{professional_summary}</p>
                </div>
            )}

            {/* Experience */}
            <div style={{ marginBottom: '2rem' }}>
                 <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1a1a1a', marginBottom: '1rem', textTransform: 'uppercase' }}>Professional Experience</h3>
                 
                 {experience.map((exp, idx) => (
                    <div key={idx} style={{ marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem' }}>
                            <h4 style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#222' }}>{exp.title}</h4>
                            <span style={{ color: '#666', fontSize: '0.9rem' }}>{exp.dates}</span>
                        </div>
                        <p style={{ color: '#555', fontStyle: 'italic', marginBottom: '0.5rem' }}>{exp.company}</p>
                        <p style={{ lineHeight: '1.6', color: '#444' }}>{exp.description}</p>
                    </div>
                 ))}
                 
                 {experience.length === 0 && (
                     <p style={{ color: '#888', fontStyle: 'italic' }}>No experience listed.</p>
                 )}
            </div>

            {/* Education */}
            <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1a1a1a', marginBottom: '1rem', textTransform: 'uppercase' }}>Education</h3>
                
                {education.degree ? (
                     <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem' }}>
                            <h4 style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#222' }}>{education.degree}</h4>
                            <span style={{ color: '#666', fontSize: '0.9rem' }}>{education.graduationYear}</span>
                        </div>
                        <p style={{ color: '#555' }}>{education.university}, {education.country}</p>
                    </div>
                ) : (
                    <p style={{ color: '#888', fontStyle: 'italic' }}>No education listed.</p>
                )}
            </div>

            {/* Skills */}
            <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1a1a1a', marginBottom: '1rem', textTransform: 'uppercase' }}>Skills & Competencies</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {skills.map((skill, idx) => (
                        <span key={idx} style={{ background: '#f0f0f0', padding: '0.4rem 0.8rem', borderRadius: '4px', fontSize: '0.9rem', color: '#333' }}>
                            {skill}
                        </span>
                    ))}
                    {skills.length === 0 && <p style={{ color: '#888', fontStyle: 'italic' }}>No skills listed.</p>}
                </div>
            </div>

            {/* Editing Controls */}
            <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button onClick={onEdit} className="btn-outline" style={{ borderColor: '#ccc', color: '#333', padding: '0.6rem 1.2rem', borderRadius: '8px', cursor: 'pointer' }}>Edit Information</button>
                <button onClick={handleDownloadPDF} disabled={isDownloading} className="btn-primary" style={{ background: '#D4FF00', color: '#000', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '8px', cursor: isDownloading ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
                    {isDownloading ? 'Generating PDF...' : 'Download PDF'}
                </button>
            </div>
        </div>
    );
};

export default CVResult;
