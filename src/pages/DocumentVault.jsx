import React, { useState, useEffect, useRef } from 'react';
import { 
    UploadCloud, File, Trash2, CheckCircle, 
    AlertCircle, Loader, Shield, Download, 
    Plus, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import { useStytchUser, useStytch } from '@stytch/react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://avanza-backend-h0pm.onrender.com';

const DocumentVault = () => {
    const { t } = useLanguage();
    const { user } = useStytchUser();
    const stytch = useStytch();
    const navigate = useNavigate();
    
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    
    const [selectedType, setSelectedType] = useState('degree');
    const inputRef = useRef(null);

    const docTypes = [
        { id: 'degree', label: 'Original Degree', icon: '📜' },
        { id: 'transcript', label: 'Academic Transcript', icon: '📊' },
        { id: 'id', label: 'Identity (Passport/ID)', icon: '🆔' },
        { id: 'translation', label: 'Sworn Translation', icon: '🇮🇹' },
        { id: 'apostille', label: 'Apostille / Legalization', icon: '⚖️' }
    ];

    const fetchDocuments = async () => {
        try {
            const token = stytch.session.getTokens()?.session_token;
            if (!token) return;

            const resp = await fetch(`${API_BASE_URL}/api/vault/documents`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (resp.ok) {
                const data = await resp.json();
                setDocuments(data);
            }
        } catch (err) {
            console.error("Fetch docs error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchDocuments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, stytch]);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
        else if (e.type === "dragleave") setDragActive(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            uploadFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            uploadFile(e.target.files[0]);
        }
    };

    const uploadFile = async (file) => {
        setError(null);
        setSuccess(null);
        
        // Validation
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(file.type)) {
            setError("Unsupported file format. Please upload PDF, JPG, PNG or Word.");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setError("File too large. Max 5MB.");
            return;
        }

        setUploading(true);
        try {
            const token = stytch.session.getTokens()?.session_token;
            const formData = new FormData();
            formData.append('file', file);
            formData.append('doc_type', selectedType);

            const resp = await fetch(`${API_BASE_URL}/api/vault/upload?doc_type=${selectedType}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (resp.ok) {
                setSuccess(`${file.name} uploaded successfully!`);
                fetchDocuments();
            } else {
                const errData = await resp.json();
                setError(errData.detail || "Upload failed.");
            }
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const deleteDoc = async (id) => {
        if (!window.confirm("Remove this document from your vault?")) return;
        
        try {
            const token = stytch.session.getTokens()?.session_token;
            const resp = await fetch(`${API_BASE_URL}/api/vault/documents/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (resp.ok) {
                setDocuments(prev => prev.filter(d => d.id !== id));
            }
        } catch (err) {
            console.error("Delete error:", err);
        }
    };

    return (
        <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '1000px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
                <div>
                    <button onClick={() => navigate('/dashboard')} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        &larr; Back to Dashboard
                    </button>
                    <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '0.5rem', letterSpacing: '-1.5px' }}>
                        Document <span style={{ color: '#C8F135' }}>Vault</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
                        Securely store and manage your credentials for the Italian recognition process.
                    </p>
                </div>
                <div style={{ 
                    background: 'rgba(200, 241, 53, 0.1)', 
                    padding: '1rem 1.5rem', 
                    borderRadius: '16px', 
                    border: '1px solid rgba(200, 241, 53, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                }}>
                    <Shield size={24} color="#C8F135" />
                    <span style={{ color: '#C8F135', fontWeight: 'bold', fontSize: '0.9rem' }}>Encrypted & Private</span>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth > 992 ? '350px 1fr' : '1fr', gap: '3rem' }}>
                
                {/* Left: Upload Section */}
                <div>
                    <div style={{ background: 'var(--surface-color)', padding: '2rem', borderRadius: '24px', border: '1px solid var(--border-color)', position: 'sticky', top: '2rem' }}>
                        <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem' }}>Add New Document</h3>
                        
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.75rem' }}>Document Type</label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {docTypes.map(type => (
                                    <button 
                                        key={type.id}
                                        onClick={() => setSelectedType(type.id)}
                                        style={{
                                            padding: '1rem',
                                            borderRadius: '12px',
                                            border: `1px solid ${selectedType === type.id ? '#C8F135' : 'rgba(255,255,255,0.05)'}`,
                                            background: selectedType === type.id ? 'rgba(200, 241, 53, 0.08)' : 'rgba(255,255,255,0.03)',
                                            color: selectedType === type.id ? '#C8F135' : 'var(--text-primary)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '1rem',
                                            cursor: 'pointer',
                                            textAlign: 'left',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        <span style={{ fontSize: '1.2rem' }}>{type.icon}</span>
                                        <span style={{ fontWeight: selectedType === type.id ? 'bold' : 'normal' }}>{type.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div 
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            onClick={() => !uploading && inputRef.current?.click()}
                            style={{
                                border: `2px dashed ${dragActive ? '#C8F135' : 'rgba(255,255,255,0.1)'}`,
                                borderRadius: '16px',
                                padding: '2.5rem 1.5rem',
                                textAlign: 'center',
                                background: dragActive ? 'rgba(200, 241, 53, 0.05)' : 'rgba(0,0,0,0.2)',
                                cursor: uploading ? 'default' : 'pointer',
                                transition: 'all 0.3s ease',
                                opacity: uploading ? 0.6 : 1
                            }}
                        >
                            <input ref={inputRef} type="file" onChange={handleFileChange} style={{ display: 'none' }} />
                            {uploading ? (
                                <Loader className="spinning" size={32} color="#C8F135" style={{ margin: '0 auto' }} />
                            ) : (
                                <>
                                    <Plus size={32} color={dragActive ? "#C8F135" : "var(--text-secondary)"} style={{ marginBottom: '0.5rem' }} />
                                    <p style={{ margin: 0, fontWeight: 'bold' }}>{dragActive ? "Drop here" : "Click to upload"}</p>
                                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>PDF, JPG, PNG or DOCX</p>
                                </>
                            )}
                        </div>

                        {error && <div style={{ marginTop: '1rem', color: '#ff4444', fontSize: '0.9rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}><AlertCircle size={16} /> {error}</div>}
                        {success && <div style={{ marginTop: '1rem', color: '#C8F135', fontSize: '0.9rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}><CheckCircle size={16} /> {success}</div>}
                    </div>
                </div>

                {/* Right: Document List */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.8rem', margin: 0 }}>My Documents</h2>
                        <span style={{ background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '30px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                            {documents.length} Files
                        </span>
                    </div>

                    {loading ? (
                        <div style={{ padding: '4rem', textAlign: 'center' }}><Loader className="spinning" color="#C8F135" /></div>
                    ) : documents.length === 0 ? (
                        <div style={{ 
                            padding: '6rem 2rem', 
                            textAlign: 'center', 
                            background: 'rgba(255,255,255,0.02)', 
                            borderRadius: '32px',
                            border: '1px dashed rgba(255,255,255,0.1)'
                        }}>
                             <File size={48} color="rgba(255,255,255,0.1)" style={{ marginBottom: '1.5rem' }} />
                             <h3 style={{ fontSize: '1.4rem' }}>Your vault is empty</h3>
                             <p style={{ color: 'var(--text-secondary)' }}>Upload your academic degrees and IDs to begin your recognition journey.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {documents.map(doc => (
                                <div key={doc.id} className="card-hover" style={{ 
                                    background: 'var(--surface-color)', 
                                    padding: '1.5rem', 
                                    borderRadius: '20px', 
                                    border: '1px solid var(--border-color)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1.5rem'
                                }}>
                                    <div style={{ 
                                        width: '56px', height: '56px', borderRadius: '14px', 
                                        background: 'rgba(255,255,255,0.03)', 
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '1.5rem'
                                    }}>
                                        {docTypes.find(t => t.id === doc.doc_type)?.icon || '📄'}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                                            <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{doc.file_name}</h4>
                                            <span style={{ 
                                                fontSize: '0.7rem', 
                                                textTransform: 'uppercase', 
                                                letterSpacing: '1px', 
                                                background: 'rgba(200, 241, 53, 0.1)', 
                                                color: '#C8F135', 
                                                padding: '2px 8px', 
                                                borderRadius: '4px',
                                                fontWeight: 'bold'
                                            }}>{doc.doc_type}</span>
                                        </div>
                                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                            Added on {new Date(doc.created_at).toLocaleDateString()} • {(doc.metadata?.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <a href={doc.file_url} target="_blank" rel="noreferrer" style={{ 
                                            width: '40px', height: '40px', borderRadius: '10px', 
                                            background: 'rgba(255,255,255,0.05)', display: 'flex', 
                                            alignItems: 'center', justifyContent: 'center', color: '#fff'
                                        }}>
                                            <Download size={18} />
                                        </a>
                                        <button 
                                            onClick={() => deleteDoc(doc.id)}
                                            style={{ 
                                                width: '40px', height: '40px', borderRadius: '10px', 
                                                background: 'rgba(255, 68, 68, 0.05)', display: 'flex', 
                                                alignItems: 'center', justifyContent: 'center', color: '#ff4444', 
                                                border: 'none', cursor: 'pointer'
                                            }}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div style={{ marginTop: '3rem', padding: '2rem', background: 'linear-gradient(135deg, rgba(200, 241, 53, 0.05), transparent)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.03)' }}>
                        <div style={{ display: 'flex', gap: '1.5rem' }}>
                            <div style={{ color: '#C8F135' }}><AlertCircle size={24} /></div>
                            <div>
                                <h4 style={{ margin: '0 0 0.5rem 0' }}>Why upload these?</h4>
                                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                                    Having your documents ready in the vault allows our AI to verify eligibility for unregulated jobs and pre-fill application forms for the Italian Ministry of University and Research (MUR).
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DocumentVault;
