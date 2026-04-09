import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStytch, useStytchUser } from '@stytch/react';
import { useLanguage } from '../LanguageContext';

const NameCollection = ({ onNameSaved }) => {
    const [firstName, setFirstName] = useState('');
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);
    const stytch = useStytch();
    const navigate = useNavigate();
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

            const resp = await fetch('http://localhost:8000/api/user/name', {
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
            background: '#0F0F0F', zIndex: 9999, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', padding: '2rem'
        }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '-1px', marginBottom: '3rem', color: '#F5F5F0' }}>
                AVANZA
            </div>

            <div style={{
                background: '#1A1A2E', borderRadius: '16px', padding: '3rem', maxWidth: '480px', width: '100%',
                border: '1px solid rgba(200, 241, 53, 0.15)', textAlign: 'center'
            }}>
                <h1 style={{ fontSize: '2rem', color: '#F5F5F0', marginBottom: '0.75rem' }}>
                    {t('nameTitle')}
                </h1>
                <p style={{ color: '#999', marginBottom: '2rem', fontSize: '1rem' }}>
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
                        border: error ? '1px solid #ff4444' : '1px solid rgba(200, 241, 53, 0.3)',
                        background: '#0F0F0F', color: '#F5F5F0', outline: 'none',
                        transition: 'border-color 0.2s', boxSizing: 'border-box'
                    }}
                />

                {error && (
                    <p style={{ color: '#ff4444', fontSize: '0.85rem', marginTop: '0.5rem', textAlign: 'left' }}>{error}</p>
                )}

                <button
                    onClick={handleSubmit}
                    disabled={saving}
                    style={{
                        width: '100%', marginTop: '1.5rem', padding: '1rem', fontSize: '1.1rem',
                        fontWeight: 'bold', borderRadius: '8px', border: 'none', cursor: saving ? 'wait' : 'pointer',
                        background: '#C8F135', color: '#000', transition: 'opacity 0.2s',
                        opacity: saving ? 0.6 : 1
                    }}
                >
                    {saving ? t('sending') : t('continueBtn')}
                </button>
            </div>
        </div>
    );
};

export default NameCollection;
