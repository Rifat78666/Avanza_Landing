import React, { useState, useEffect } from 'react';
import { useStytchUser, useStytch } from '@stytch/react';
import { 
    CheckCircle, Clock, ExternalLink, Globe, 
    FileText, ShieldCheck, ArrowRight, AlertCircle
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://avanza-backend-h0pm.onrender.com';

const CIMEAHub = () => {
    const stytch = useStytch();
    
    const [status, setStatus] = useState('not_started'); // not_started, pending, approved, rejected
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const token = stytch.session.getTokens()?.session_token;
                if (!token) return;
                
                const res = await fetch(`${API_BASE_URL}/api/user/cimea-status`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (res.ok) {
                    const data = await res.json();
                    setStatus(data.cimea_status || 'not_started');
                }
            } catch (err) {
                console.error("CIMEA Status fetch error", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStatus();
    }, [stytch]);

    const updateStatus = async (newStatus) => {
        setStatus(newStatus); // Optimistic generic update
        try {
            const token = stytch.session.getTokens()?.session_token;
            await fetch(`${API_BASE_URL}/api/user/cimea-status`, {
                method: 'PATCH',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ cimea_status: newStatus })
            });
        } catch (err) {
            console.error("Failed to update CIMEA status", err);
        }
    };

    if (isLoading) {
        return (
            <div className="container" style={{ paddingTop: '10rem', textAlign: 'center', minHeight: '80vh' }}>
                <div className="loading-spinner"></div>
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingBottom: '5rem' }}>
            <div style={{ marginBottom: '3rem', paddingTop: '2.5rem' }}>
                <h1 style={{ fontSize: '3.2rem', fontWeight: '800', marginBottom: '1rem', letterSpacing: '-1px' }}>
                    Smart <span style={{ color: '#C8F135' }}>CIMEA</span> Hub
                </h1>
                <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.6)', maxWidth: '800px', lineHeight: '1.6' }}>
                    Track your Statement of Comparability process directly from your Avanza dashboard. Apply on the official portal and update your status here.
                </p>
            </div>

            {/* Status Card */}
            <div style={{ 
                background: '#121212', 
                padding: '2.5rem', 
                borderRadius: '24px', 
                border: '1px solid rgba(255,255,255,0.08)',
                marginBottom: '3rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '2rem'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ 
                        width: '64px', height: '64px', borderRadius: '16px',
                        background: status === 'approved' ? 'rgba(200, 241, 53, 0.15)' : 
                                  status === 'pending' ? 'rgba(255, 165, 0, 0.15)' : 
                                  status === 'rejected' ? 'rgba(255, 82, 82, 0.15)' : 'rgba(255,255,255,0.05)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        {status === 'approved' && <ShieldCheck size={32} color="#C8F135" />}
                        {status === 'pending' && <Clock size={32} color="orange" />}
                        {status === 'rejected' && <AlertCircle size={32} color="#ff5252" />}
                        {status === 'not_started' && <FileText size={32} color="rgba(255,255,255,0.5)" />}
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Current Action Status</h2>
                        <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '0.2rem' }}>
                            {status === 'approved' ? "Done! You have your Comparability Statement." :
                             status === 'pending' ? "Your application is under review by CIMEA." :
                             status === 'rejected' ? "There was an issue with your application." :
                             "You have not started the application process yet."}
                        </p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    {status === 'not_started' && (
                        <button onClick={() => updateStatus('pending')} className="btn-primary" style={{ padding: '0.8rem 1.5rem' }}>
                            Mark as Applied
                        </button>
                    )}
                    {status === 'pending' && (
                        <>
                            <button onClick={() => updateStatus('approved')} className="btn-primary" style={{ padding: '0.8rem 1.5rem', background: '#C8F135', color: '#000' }}>
                                Mark as Received
                            </button>
                            <button onClick={() => updateStatus('rejected')} className="btn-outline" style={{ padding: '0.8rem 1.5rem', borderColor: '#ff5252', color: '#ff5252' }}>
                                Application Rejected
                            </button>
                        </>
                    )}
                    {(status === 'approved' || status === 'rejected') && (
                        <button onClick={() => updateStatus('not_started')} className="btn-outline" style={{ padding: '0.8rem 1.5rem' }}>
                            Reset Status
                        </button>
                    )}
                </div>
            </div>

            {/* Application Section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                
                {/* How to Apply */}
                <div style={{ background: '#1A1A1A', padding: '2.5rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Globe color="#C8F135" /> Apply on DiploMe
                    </h3>
                    <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: '1.6', marginBottom: '2rem' }}>
                        CIMEA uses the DiploMe portal to process applications for the Statement of Comparability. You must create an account there to officially submit your dossier.
                    </p>
                    
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <li style={{ display: 'flex', gap: '1rem', color: 'rgba(255,255,255,0.8)' }}>
                            <span style={{ color: '#C8F135', fontWeight: 'bold' }}>1.</span> Gather your legalized documents & verified translations from your Avanza Vault.
                        </li>
                        <li style={{ display: 'flex', gap: '1rem', color: 'rgba(255,255,255,0.8)' }}>
                            <span style={{ color: '#C8F135', fontWeight: 'bold' }}>2.</span> Create a DiploMe account (CIMEA portal).
                        </li>
                        <li style={{ display: 'flex', gap: '1rem', color: 'rgba(255,255,255,0.8)' }}>
                            <span style={{ color: '#C8F135', fontWeight: 'bold' }}>3.</span> Upload documents and pay the evaluation fee (€150).
                        </li>
                    </ul>

                    <a href="https://diplome.eu/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                        <button className="btn-outline" style={{ width: '100%', padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', fontWeight: 'bold' }}>
                            Visit DiploMe Portal <ExternalLink size={18} />
                        </button>
                    </a>
                </div>

                {/* ARDI Verification Fast Track */}
                <div style={{ background: 'rgba(200, 241, 53, 0.03)', padding: '2.5rem', borderRadius: '24px', border: '1px solid rgba(200, 241, 53, 0.2)' }}>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <CheckCircle color="#C8F135" /> The ARDI Fast-Track
                    </h3>
                    <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: '1.6', marginBottom: '2rem' }}>
                        If your degree is from a country signed to the Lisbon Recognition Convention, you may qualify for Automatic Recognition (ARDI), allowing you to skip the full CIMEA fee.
                    </p>
                    
                    <div style={{ background: '#121212', padding: '1.5rem', borderRadius: '16px', marginBottom: '2rem' }}>
                        <h4 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Eligible Countries include:</h4>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                            France, Germany, UK, Spain, US, Canada, Australia, and many others.
                        </p>
                    </div>

                    <a href="https://ardi.cimea.it/en" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                        <button className="btn-primary" style={{ width: '100%', padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', fontWeight: 'bold' }}>
                            Check ARDI Eligibility <ArrowRight size={18} />
                        </button>
                    </a>
                </div>

            </div>
        </div>
    );
};

export default CIMEAHub;
