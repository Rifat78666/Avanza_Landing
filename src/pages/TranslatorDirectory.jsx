import React, { useState, useEffect } from 'react';
import { useStytch } from '@stytch/react';
import { MapPin, Search, Star, MessageSquare, Loader, UserCheck } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://avanza-backend-h0pm.onrender.com';

const TranslatorDirectory = () => {
    const stytch = useStytch();
    
    const [translators, setTranslators] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [cityFilter, setCityFilter] = useState('');

    useEffect(() => {
        const fetchTranslators = async () => {
            try {
                const token = stytch.session.getTokens()?.session_token;
                let url = `${API_BASE_URL}/api/partners/translators`;
                if (cityFilter) url += `?city=${encodeURIComponent(cityFilter)}`;
                
                const res = await fetch(url, {
                    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
                });
                
                if (res.ok) {
                    const data = await res.json();
                    setTranslators(data);
                }
            } catch (err) {
                console.error("Translators fetch error", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTranslators();
    }, [cityFilter, stytch]);

    const filteredTranslators = translators.filter(t => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (t.name?.toLowerCase().includes(q) || 
                t.city?.toLowerCase().includes(q) || 
                t.specialties?.some(s => s.toLowerCase().includes(q)));
    });

    return (
        <div className="container" style={{ paddingBottom: '5rem' }}>
            <div style={{ marginBottom: '3rem', paddingTop: '2.5rem' }}>
                <h1 style={{ fontSize: '3.2rem', fontWeight: '800', marginBottom: '1rem', letterSpacing: '-1px' }}>
                    Sworn Translator <span style={{ color: '#C8F135' }}>Directory</span>
                </h1>
                <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.6)', maxWidth: '800px', lineHeight: '1.6' }}>
                    Find certified translators (Traduttori Giurati) who have been verified by the Italian court system to translate your official documents.
                </p>
            </div>

            {/* Search and Filter */}
            <div style={{ 
                display: 'flex', gap: '1rem', marginBottom: '3rem',
                flexWrap: 'wrap'
            }}>
                <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
                    <Search color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                    <input 
                        type="text" 
                        placeholder="Search by name, language, or city..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ 
                            width: '100%', padding: '1rem 1rem 1rem 3rem', 
                            borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', 
                            background: 'rgba(255,255,255,0.03)', color: '#fff' 
                        }}
                    />
                </div>
                <select 
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                    style={{ 
                        padding: '1rem', borderRadius: '12px', 
                        border: '1px solid rgba(255,255,255,0.1)', 
                        background: '#1A1A1A', color: '#fff', 
                        minWidth: '150px' 
                    }}
                >
                    <option value="">All Cities</option>
                    <option value="Milano">Milano</option>
                    <option value="Roma">Roma</option>
                    <option value="Torino">Torino</option>
                    <option value="Napoli">Napoli</option>
                </select>
            </div>

            {/* Content Array */}
            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '4rem' }}>
                    <Loader size={48} color="#C8F135" style={{ animation: 'spin 2s linear infinite' }} />
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
                    {filteredTranslators.map((translator, idx) => (
                        <div key={translator.id || idx} style={{ 
                            background: '#121212', borderRadius: '24px', 
                            padding: '2rem', border: '1px solid rgba(255,255,255,0.08)',
                            display: 'flex', flexDirection: 'column', gap: '1.5rem'
                        }}>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>{translator.name}</h3>
                                    {translator.verified && (
                                        <div style={{ background: 'rgba(200, 241, 53, 0.1)', color: '#C8F135', padding: '0.3rem 0.6rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                            <UserCheck size={14} /> Verified
                                        </div>
                                    )}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.5rem' }}>
                                    <MapPin size={16} /> {translator.city}
                                </div>
                            </div>

                            <div>
                                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Specialties</p>
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    {translator.specialties?.map((spec, i) => (
                                        <span key={i} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.9rem' }}>
                                            {spec}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <a href={`mailto:${translator.contact}`} style={{ textDecoration: 'none', marginTop: 'auto' }}>
                                <button className="btn-outline" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '0.8rem' }}>
                                    <MessageSquare size={18} /> Contact Translator
                                </button>
                            </a>
                        </div>
                    ))}
                    {filteredTranslators.length === 0 && (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.5)' }}>
                            <Search size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                            <p>No translators found matching your criteria.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TranslatorDirectory;
