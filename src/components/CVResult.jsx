import React from 'react';

import { Mail, Phone, MapPin, Globe } from 'lucide-react';

const CVResult = ({ data, onEdit }) => {
    
    // De-structure default values to prevent breaking if fields are empty
    const {
        personal = {},
        education = {},
        experience = {},
        goal = {}
    } = data;
    
    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', background: '#fff', color: '#333', padding: '3rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            
            {/* Header / Personal Data */}
            <div style={{ borderBottom: '2px solid #D4FF00', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1a1a1a', marginBottom: '0.5rem' }}>
                    {personal.fullName || 'User Name'}
                </h1>
                <h2 style={{ fontSize: '1.25rem', color: '#666', marginBottom: '1rem' }}>
                    {goal.targetProfession || 'Target Profession'}
                </h2>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', fontSize: '0.9rem', color: '#555' }}>
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
            {personal.abstract && (
                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1a1a1a', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Professional Summary</h3>
                    <p style={{ lineHeight: '1.6', color: '#444' }}>{personal.abstract}</p>
                </div>
            )}

            {/* Experience & Skills (Combined Section conceptually) */}
            <div style={{ marginBottom: '2rem' }}>
                 <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1a1a1a', marginBottom: '1rem', textTransform: 'uppercase' }}>Professional Experience</h3>
                 
                 {experience.jobTitle ? (
                    <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem' }}>
                            <h4 style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#222' }}>{experience.jobTitle}</h4>
                            <span style={{ color: '#666', fontSize: '0.9rem' }}>{experience.yearsOfExperience ? `${experience.yearsOfExperience} years` : ''}</span>
                        </div>
                        <p style={{ color: '#555', fontStyle: 'italic', marginBottom: '0.5rem' }}>{experience.company}</p>
                        <p style={{ lineHeight: '1.6', color: '#444' }}>{experience.description}</p>
                    </div>
                 ) : (
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

            {/* Skills & Languages */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                 <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1a1a1a', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Skills</h3>
                    <p style={{ lineHeight: '1.6', color: '#444' }}>
                        {experience.skills ? experience.skills : <span style={{ color: '#888', fontStyle: 'italic' }}>No skills listed.</span>}
                    </p>
                 </div>
                 <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1a1a1a', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Languages</h3>
                    <p style={{ lineHeight: '1.6', color: '#444' }}>
                        {experience.languages ? experience.languages : <span style={{ color: '#888', fontStyle: 'italic' }}>No languages listed.</span>}
                    </p>
                 </div>
            </div>

            {/* Editing Controls */}
            <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button onClick={onEdit} className="btn-outline" style={{ borderColor: '#ccc', color: '#333' }}>Edit Information</button>
                <button className="btn-primary" style={{ background: '#D4FF00', color: '#000', border: 'none' }}>Download PDF</button>
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '1.5rem', color: '#888', fontSize: '0.8rem' }}>
                *This is a preview mockup. Full AI generation formatting will be handled in Phase 3.
            </div>

        </div>
    );
};

export default CVResult;
