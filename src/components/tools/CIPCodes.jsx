import React, { useState } from 'react';
import cipData from '../../data/cip_codes_sample.json';
import { BookOpen, ArrowLeft, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CIPCodes = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filtered = cipData.filter(c => 
    c.code.includes(search) || c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container" style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '2rem' }}>
      <button 
        onClick={() => navigate('/tools')} 
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: '1.5rem', fontWeight: 'bold' }}
      >
        <ArrowLeft size={18} /> Back to Tools
      </button>

      <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <BookOpen size={24} color="var(--accent-color)" />
          CIP Codes Search
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Search the US Classification of Instructional Programs (CIP) database.
        </p>

        <div style={{ position: 'relative', marginBottom: '2rem' }}>
          <input 
            type="text" 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className="input-field" 
            placeholder="Search by code or keyword..." 
            style={{ width: '100%', paddingLeft: '2.5rem' }} 
          />
          <Search size={18} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filtered.length > 0 ? filtered.map((item) => (
            <div key={item.code} style={{ padding: '1rem', backgroundColor: 'var(--surface-color)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{item.title}</span>
                <span style={{ backgroundColor: 'rgba(200, 241, 53, 0.1)', color: 'var(--accent-color)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold' }}>{item.code}</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>{item.description}</p>
            </div>
          )) : (
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem 0' }}>No CIP codes found matching your search.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CIPCodes;
