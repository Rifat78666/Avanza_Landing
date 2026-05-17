import React, { useState } from 'react';

import { useStytch } from '@stytch/react';
import { useLanguage } from '../LanguageContext';

const NameCollection = ({ onNameSaved }) => {
    const [firstName, setFirstName] = useState('');
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    const stytch = useStytch();
    // const navigate = useNavigate();
    const { t } = useLanguage();

    const handleSubmit = async () => {
        const trimmed = firstName.trim();
        if (!trimmed) {
            setError('Please enter your name.');
            return;
        }
        if (trimmed.length > 50) {
            setError('Name must be 50 characters or fewer.');
            return;
        }

        setSaving(true);
        setError('');

        try {
            const token = stytch.session.getTokens()?.session_token;
            if (!token) {
                setError('Session expired. Please log in again.');
                setSaving(false);
                return;
            }

            const resp = await fetch(`${API_BASE_URL}/api/user/name`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ first_name: trimmed })
            });

            if (!resp.ok) {
                setError('Failed to save your name. Please try again.');
                setSaving(false);
                return;
            }

            // Notify parent that name was saved
            if (onNameSaved) {
                onNameSaved(trimmed);
            }

        } catch (err) {
            console.error('Name save error:', err);
            setError('Something went wrong. Please try again.');
            setSaving(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'var(--bg-color)', zIndex: 9999, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', padding: '2rem'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '3rem' }}>
                <img src="/avanza_Logo.jpeg" alt="AVANZA" style={{ height: '48px', objectFit: 'contain' }} />
            </div>

            <div style={{
                background: 'var(--surface-color)', borderRadius: '16px', padding: '3rem', maxWidth: '480px', width: '100%',
                border: '1px solid var(--border-color)', textAlign: 'center',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)'
            }}>
                <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '0.75rem', fontWeight: '800' }}>
                    {t('nameTitle')}
                </h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1rem' }}>
                    {t('nameSub')}
                </p>

                <input
                    type="text"
                    placeholder={t('namePlaceholder')}
                    value={firstName}
                    onChange={(e) => { setFirstName(e.target.value); setError(''); }}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    maxLength={50}
                    autoFocus
                    style={{
                        width: '100%', padding: '1rem', fontSize: '1.2rem', borderRadius: '8px',
                        border: error ? '1px solid var(--error-color)' : '1px solid var(--border-color)',
                        background: '#ffffff', color: 'var(--text-primary)', outline: 'none',
                        transition: 'all 0.2s', boxSizing: 'border-box'
                    }}
                    onFocus={(e) => {
                        if (!error) e.target.style.borderColor = 'var(--accent-color)';
                    }}
                    onBlur={(e) => {
                        if (!error) e.target.style.borderColor = 'var(--border-color)';
                    }}
                />

                {error && (
                    <p style={{ color: 'var(--error-color)', fontSize: '0.85rem', marginTop: '0.5rem', textAlign: 'left' }}>{error}</p>
                )}

                <button
                    onClick={handleSubmit}
                    disabled={saving}
                    style={{
                        width: '100%', marginTop: '1.5rem', padding: '1rem', fontSize: '1.1rem',
                        fontWeight: 'bold', borderRadius: '8px', border: 'none', cursor: saving ? 'wait' : 'pointer',
                        background: 'var(--accent-color)', color: '#FFFFFF', transition: 'all 0.2s',
                        opacity: saving ? 0.6 : 1,
                        boxShadow: '0 4px 14px rgba(241, 89, 42, 0.2)'
                    }}
                    onMouseEnter={(e) => {
                        if (!saving) e.target.style.background = 'var(--accent-hover)';
                    }}
                    onMouseLeave={(e) => {
                        if (!saving) e.target.style.background = 'var(--accent-color)';
                    }}
                >
                    {saving ? t('sending') : t('continueBtn')}
                </button>
            </div>
        </div>
    );
};

export default NameCollection;
