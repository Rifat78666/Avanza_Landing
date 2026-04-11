import React, { useState, useEffect, useCallback } from 'react';
import { 
    Users, FileCheck, Shield, Search, 
    Filter, CheckCircle, XCircle, Clock,
    ChevronRight, ExternalLink, Mail, MapPin
} from 'lucide-react';
import { useStytch } from '@stytch/react';
import { useLanguage } from '../LanguageContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://avanza-backend-h0pm.onrender.com';

const AdminPortal = () => {
    const stytch = useStytch();
    const { t } = useLanguage();
    
    const [activeTab, setActiveTab] = useState('documents'); // 'users' | 'documents'
    const [users, setUsers] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const token = stytch.session.getTokens()?.session_token;
            if (!token) return;

            const [usersRes, docsRes] = await Promise.all([
                fetch(`${API_BASE_URL}/api/admin/users`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${API_BASE_URL}/api/admin/documents`, { headers: { 'Authorization': `Bearer ${token}` } })
            ]);

            if (usersRes.ok) setUsers(await usersRes.json());
            if (docsRes.ok) setDocuments(await docsRes.json());
            
        } catch (err) {
            console.error("Admin fetch error", err);
        } finally {
            setLoading(false);
        }
    }, [stytch]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const updateDocStatus = async (docId, status, notes = '') => {
        try {
            const token = stytch.session.getTokens()?.session_token;
            const res = await fetch(`${API_BASE_URL}/api/admin/documents/${docId}`, {
                method: 'PATCH',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ verification_status: status, admin_notes: notes })
            });

            if (res.ok) {
                // Optimistic UI update
                setDocuments(prev => prev.map(d => d.id === docId ? { ...d, verification_status: status, admin_notes: notes } : d));
            }
        } catch (err) {
            console.error("Update status error", err);
        }
    };

    const filteredDocs = documents.filter(doc => {
        const matchesStatus = filterStatus === 'all' || doc.verification_status === filterStatus;
        const matchesSearch = doc.file_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             doc.users?.first_name?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    if (loading) {
        return (
            <div className="container" style={{ paddingTop: '10rem', textAlign: 'center' }}>
                <div className="loading-spinner"></div>
                <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Accessing Administrative Vault...</p>
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingBottom: '5rem', paddingTop: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#C8F135', marginBottom: '0.5rem' }}>
                        <Shield size={20} />
                        <span style={{ fontWeight: 'bold', letterSpacing: '1px', fontSize: '0.9rem' }}>ADMINISTRATIVE PORTAL</span>
                    </div>
                    <h1 style={{ fontSize: '3rem', fontWeight: '800', letterSpacing: '-2px' }}>Control <span style={{ color: '#C8F135' }}>Center</span></h1>
                </div>
                
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button 
                        onClick={() => setActiveTab('users')}
                        style={{ 
                            background: activeTab === 'users' ? '#C8F135' : 'rgba(255,255,255,0.05)',
                            color: activeTab === 'users' ? '#000' : '#FFF',
                            padding: '0.8rem 1.5rem', borderRadius: '12px', border: 'none', fontWeight: 'bold', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s'
                        }}
                    >
                        <Users size={18} /> Users ({users.length})
                    </button>
                    <button 
                        onClick={() => setActiveTab('documents')}
                        style={{ 
                            background: activeTab === 'documents' ? '#C8F135' : 'rgba(255,255,255,0.05)',
                            color: activeTab === 'documents' ? '#000' : '#FFF',
                            padding: '0.8rem 1.5rem', borderRadius: '12px', border: 'none', fontWeight: 'bold', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s'
                        }}
                    >
                        <FileCheck size={18} /> Documents ({documents.length})
                    </button>
                </div>
            </div>

            {/* Sub-header with search and filters */}
            <div style={{ 
                background: 'rgba(255,255,255,0.03)', 
                padding: '1.5rem', 
                borderRadius: '20px', 
                border: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem'
            }}>
                <div style={{ position: 'relative', width: '400px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                    <input 
                        type="text" 
                        placeholder={activeTab === 'users' ? "Search users by name or email..." : "Search files or owners..."}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ 
                            width: '100%', padding: '0.8rem 1rem 0.8rem 3rem', borderRadius: '12px',
                            background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)',
                            color: '#FFF', fontSize: '0.95rem'
                        }}
                    />
                </div>

                {activeTab === 'documents' && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {['all', 'pending', 'verified', 'rejected'].map(status => (
                            <button 
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                style={{
                                    padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)',
                                    background: filterStatus === status ? 'rgba(200, 241, 53, 0.15)' : 'transparent',
                                    color: filterStatus === status ? '#C8F135' : 'var(--text-secondary)',
                                    fontSize: '0.85rem', cursor: 'pointer', textTransform: 'capitalize'
                                }}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {activeTab === 'users' ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                    {users.filter(u => u.first_name?.toLowerCase().includes(searchQuery.toLowerCase())).map(user => (
                        <div key={user.user_id} className="card-hover" style={{ 
                            background: 'rgba(255,255,255,0.03)', padding: '1.8rem', 
                            borderRadius: '24px', border: '1px solid var(--border-color)',
                            display: 'flex', flexDirection: 'column', gap: '1.2rem'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(200, 241, 53, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Users size={24} color="#C8F135" />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{user.first_name || 'Anonymous User'}</h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{user.user_id}</p>
                                </div>
                                {user.onboarding_completed ? (
                                    <span style={{ fontSize: '0.7rem', background: 'rgba(200, 241, 53, 0.1)', color: '#C8F135', padding: '0.3rem 0.6rem', borderRadius: '6px', fontWeight: 'bold' }}>ACTIVE</span>
                                ) : (
                                    <span style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.1)', color: 'var(--text-secondary)', padding: '0.3rem 0.6rem', borderRadius: '6px' }}>PENDING</span>
                                )}
                            </div>

                            {user.profile && (
                                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '14px', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', color: 'rgba(255,255,255,0.6)' }}>
                                        <MapPin size={14} /> <span>{user.profile.degree_country}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                        <ChevronRight size={14} color="#C8F135" /> <strong>{user.profile.degree_field}</strong>
                                    </div>
                                    <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>Level: {user.profile.degree_level}</div>
                                </div>
                            )}

                            <button className="btn-outline" style={{ border: '1px solid rgba(255,255,255,0.1)', width: '100%', padding: '0.7rem' }}>View Full History →</button>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {filteredDocs.map(doc => (
                        <div key={doc.id} style={{ 
                            background: 'rgba(255,255,255,0.03)', 
                            padding: '1.2rem 1.8rem', 
                            borderRadius: '20px', 
                            border: '1px solid var(--border-color)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '2rem'
                        }}>
                             <div style={{ 
                                width: '40px', height: '40px', borderRadius: '10px', 
                                background: 'rgba(255,255,255,0.05)', display: 'flex', 
                                alignItems: 'center', justifyContent: 'center', flexShrink: 0 
                            }}>
                                <FileCheck size={20} color={doc.verification_status === 'verified' ? '#C8F135' : (doc.verification_status === 'rejected' ? '#FF5555' : '#FFF')} />
                            </div>

                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', marginBottom: '0.2rem' }}>
                                    <h4 style={{ fontWeight: 'bold', fontSize: '1.05rem' }}>{doc.file_name}</h4>
                                    <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px', textTransform: 'uppercase' }}>{doc.doc_type}</span>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                    <span>Owner: <strong>{doc.users?.first_name || 'User'}</strong></span>
                                    <span>Uploaded: {new Date(doc.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <div style={{ textAlign: 'right', minWidth: '100px' }}>
                                    <div style={{ 
                                        display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'flex-end',
                                        color: doc.verification_status === 'verified' ? '#C8F135' : (doc.verification_status === 'rejected' ? '#FF5555' : 'rgba(255,255,255,0.4)'),
                                        fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase'
                                    }}>
                                        {doc.verification_status === 'verified' && <CheckCircle size={14} />}
                                        {doc.verification_status === 'rejected' && <XCircle size={14} />}
                                        {doc.verification_status === 'pending' && <Clock size={14} />}
                                        {doc.verification_status}
                                    </div>
                                </div>

                                <div style={{ height: '30px', borderLeft: '1px solid var(--border-color)' }}></div>

                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <a href={doc.file_url} target="_blank" rel="noreferrer" className="btn-icon" title="View Document" style={{ borderRadius: '8px', padding: '0.5rem', background: 'rgba(255,255,255,0.1)' }}>
                                        <ExternalLink size={18} />
                                    </a>
                                    <button 
                                        onClick={() => updateDocStatus(doc.id, 'verified')}
                                        disabled={doc.verification_status === 'verified'}
                                        style={{ background: '#C8F135', color: '#000', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', opacity: doc.verification_status === 'verified' ? 0.4 : 1 }}
                                    >
                                        Approve
                                    </button>
                                    <button 
                                        onClick={() => updateDocStatus(doc.id, 'rejected')}
                                        disabled={doc.verification_status === 'rejected'}
                                        style={{ background: 'rgba(255,0,0,0.1)', color: '#FF5555', border: '1px solid rgba(255,0,0,0.2)', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', opacity: doc.verification_status === 'rejected' ? 0.4 : 1 }}
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredDocs.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px dashed var(--border-color)' }}>
                            <p style={{ color: 'var(--text-secondary)' }}>No documents found matching your filters.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminPortal;
