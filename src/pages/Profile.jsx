import React, { useState, useEffect, useRef } from 'react';
import { useStytchUser, useStytch } from '@stytch/react';
import { useNavigate } from 'react-router-dom';
import { User, Camera, LogOut, ChevronRight, AlertCircle, CheckCircle, Trash2 } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const Profile = ({ displayName, profileImageUrl, fullProfile, onNameUpdate, onImageUpdate }) => {
    const { user } = useStytchUser();
    const stytch = useStytch();
    const navigate = useNavigate();
    const { t } = useLanguage();
    
    const [profile, setProfile] = useState(fullProfile?.profile || null);
    const [loading, setLoading] = useState(!fullProfile);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    const [localName, setLocalName] = useState(displayName || fullProfile?.first_name || '');
    const [photoPreview, setPhotoPreview] = useState(profileImageUrl || fullProfile?.profile_image_url || null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (fullProfile) {
            setProfile(fullProfile.profile);
            
            // Only sync local states if they are currently empty (first load)
            // or if we aren't in the middle of an update to avoid the "flicker"
            if (!localName) setLocalName(fullProfile.first_name || '');
            
            // Check if the prop's image is different from our current preview (ignoring timestamps)
            const propUrl = fullProfile.profile_image_url || null;
            const currentBaseUrl = photoPreview?.split('?')[0];
            const propBaseUrl = propUrl?.split('?')[0];
            
            if (propUrl && propBaseUrl !== currentBaseUrl) {
                setPhotoPreview(propUrl);
            }
            
            setLoading(false);
        }
    }, [fullProfile]);

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validation
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!validTypes.includes(file.type)) {
            setError(t('invalidImage'));
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            setError(t('imageTooLarge'));
            return;
        }

        setError('');
        setSuccess('');
        
        // Preview
        const reader = new FileReader();
        reader.onloadend = () => setPhotoPreview(reader.result);
        reader.readAsDataURL(file);

        // Upload to backend
        try {
            const token = stytch.session.getTokens()?.session_token;
            const formData = new FormData();
            formData.append('file', file);

            const resp = await fetch(`${API_BASE_URL}/api/user/image`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (resp.ok) {
                const data = await resp.json();
                setPhotoPreview(data.profile_image_url);
                setSuccess("Photo updated successfully!");
                if (onImageUpdate) onImageUpdate(data.profile_image_url);
            } else {
                const errorData = await resp.json().catch(() => ({}));
                setError(errorData.detail || "Failed to upload photo.");
            }
        } catch (err) {
            console.error("Upload error:", err);
            setError("Upload failed.");
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setError('');
        setSuccess('');

        try {
            const token = stytch.session.getTokens()?.session_token;
            const resp = await fetch(`${API_BASE_URL}/api/user/name`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ first_name: localName })
            });

            if (resp.ok) {
                setSuccess(t('saveChanges') + "!");
                if (onNameUpdate) onNameUpdate(localName);
            } else {
                setError("Failed to save name.");
            }
        } catch (err) {
            setError("Something went wrong.");
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        stytch.session.logout();
        navigate('/');
    };

    if (loading) {
        return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Loading...</div>;
    }

    return (
        <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '900px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: 'var(--text-primary)' }}>{t('myProfileTitle')}</h1>

            <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth > 768 ? '1fr 2fr' : '1fr', gap: '2rem' }}>
                
                {/* Left Side: Avatar & Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ 
                        background: 'var(--surface-color)', 
                        padding: '2rem', 
                        borderRadius: '16px', 
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center'
                    }}>
                        <div 
                            style={{ 
                                position: 'relative', 
                                width: '120px', 
                                height: '120px', 
                                borderRadius: '50%', 
                                background: 'var(--background)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                                border: '2px solid var(--accent-color)',
                                marginBottom: '1rem'
                            }}
                            onClick={() => fileInputRef.current.click()}
                        >
                            {photoPreview ? (
                                <img src={photoPreview} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <User size={64} color="var(--text-secondary)" />
                            )}
                            <div style={{ 
                                position: 'absolute', 
                                bottom: 0, 
                                left: 0, 
                                right: 0, 
                                background: 'rgba(0,0,0,0.6)', 
                                padding: '4px 0',
                                cursor: 'pointer',
                                display: 'flex',
                                justifyContent: 'center'
                            }}>
                                <Camera size={18} color="#fff" />
                            </div>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handlePhotoUpload} 
                                style={{ display: 'none' }} 
                                accept="image/*"
                            />
                        </div>
                        <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>{localName || user?.emails?.[0]?.email}</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{user?.emails?.[0]?.email}</p>
                        
                        <button 
                            onClick={handleLogout}
                            style={{ 
                                background: 'transparent', 
                                border: '1px solid #ff4444', 
                                color: '#ff4444', 
                                padding: '0.6rem 1.2rem', 
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                cursor: 'pointer',
                                width: '100%',
                                justifyContent: 'center'
                            }}
                        >
                            <LogOut size={18} /> {t('logout')}
                        </button>
                    </div>

                    <div style={{ background: 'rgba(255, 68, 68, 0.05)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255, 68, 68, 0.1)' }}>
                        <h4 style={{ color: '#ff4444', marginTop: 0, marginBottom: '0.5rem' }}>Danger Zone</h4>
                        <button style={{ background: 'none', border: 'none', color: '#ff4444', textDecoration: 'underline', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Trash2 size={16} /> {t('deleteAccount')}
                        </button>
                    </div>
                </div>

                {/* Right Side: Details & Forms */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    
                    {/* Feedback Alerts */}
                    {error && <div style={{ padding: '1rem', background: 'rgba(255, 0, 0, 0.1)', border: '1px solid red', borderRadius: '8px', color: '#ff6b6b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><AlertCircle size={20} /> {error}</div>}
                    {success && <div style={{ padding: '1rem', background: 'rgba(200, 241, 53, 0.1)', border: '1px solid var(--accent-color)', borderRadius: '8px', color: 'var(--accent-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle size={20} /> {success}</div>}

                    {/* Personal Info */}
                    <div style={{ background: 'var(--surface-color)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                        <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>{t('personalInfo')}</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <label style={{ color: 'var(--text-secondary)' }}>{t('fullName')}</label>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <input 
                                    type="text" 
                                    value={localName}
                                    onChange={(e) => setLocalName(e.target.value)}
                                    style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--background)', color: 'var(--text-primary)' }}
                                />
                                <button className="btn-primary" onClick={handleSave} disabled={saving} style={{ padding: '0.8rem 1.5rem' }}>
                                    {saving ? "Saving..." : t('saveChanges')}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Academic Profile */}
                    <div style={{ background: 'var(--surface-color)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', margin: 0 }}>{t('academicProfile')}</h2>
                            <button onClick={() => navigate('/onboarding')} style={{ background: 'none', border: 'none', color: 'var(--accent-color)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                {t('reRunOnboarding')} <ChevronRight size={16} />
                            </button>
                        </div>
                        
                        {profile?.profile ? (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Level</label>
                                    <p style={{ margin: 0, color: 'var(--text-primary)', fontWeight: 'bold' }}>{profile.profile.degree_level}</p>
                                </div>
                                <div>
                                    <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Country</label>
                                    <p style={{ margin: 0, color: 'var(--text-primary)', fontWeight: 'bold' }}>{profile.profile.degree_country}</p>
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Field of Study</label>
                                    <p style={{ margin: 0, color: 'var(--text-primary)', fontWeight: 'bold' }}>{profile.profile.degree_field}</p>
                                </div>
                            </div>
                        ) : (
                            <p style={{ color: 'var(--text-secondary)' }}>No profile data found. Please complete onboarding.</p>
                        )}
                    </div>

                    {/* Recognition Progress */}
                    <div style={{ background: 'var(--surface-color)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                         <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>{t('recognitionProgress')}</h2>
                         <div style={{ width: '100%', height: '8px', background: 'var(--background)', borderRadius: '4px', overflow: 'hidden', marginBottom: '1rem' }}>
                             <div style={{ width: profile?.onboarding_completed ? '100%' : '10%', height: '100%', background: 'var(--accent-color)' }}></div>
                         </div>
                         <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                            {profile?.onboarding_completed ? "Profile Verified & Personalized Pathway Active" : "Onboarding Incomplete"}
                         </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Profile;
