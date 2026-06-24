import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import alboTables from '../../data/albo_profession_table.json';
import { ShieldCheck, ArrowRight, FileText, Clock, ArrowLeft } from 'lucide-react';

const AlboCheck = () => {
  const navigate = useNavigate();
  const [profession, setProfession] = useState(Object.keys(alboTables)[0]);
  const [result, setResult] = useState(null);

  const handleCheck = () => {
    setResult(alboTables[profession]);
  };

  return (
        <>
      <div style={{
        width: '100%',
        position: 'relative',
        backgroundImage: 'url("https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1920&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '5rem 1rem',
        textAlign: 'center',
        color: 'white',
        borderBottom: '4px solid #009246'
      }}>
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 40, 20, 0.7)',
          zIndex: 1
        }}></div>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: 'bold' }}>Albo Check</h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>Check if your profession is regulated in Italy.</p>
        </div>
      </div>
<div className="container" style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '2rem' }}>
      <button 
        onClick={() => navigate('/tools')} 
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: '1.5rem', fontWeight: 'bold' }}
      >
        <ArrowLeft size={18} /> Back to Tools
      </button>

      <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <ShieldCheck size={24} color="var(--accent-color)" />
        Albo Check (Professional Orders)
      </h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
        Find out which Italian Professional Order you need to join and the key documents required.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Your Profession</label>
          <select 
            value={profession} 
            onChange={(e) => {
              setProfession(e.target.value);
              setResult(null);
            }} 
            className="input-field" 
            style={{ width: '100%' }}
          >
            {Object.keys(alboTables).map(key => (
              <option key={key} value={key}>{alboTables[key].english} ({alboTables[key].italian})</option>
            ))}
          </select>
        </div>
      </div>

      <button className="btn-primary" onClick={handleCheck} style={{ width: '100%', marginBottom: '1.5rem', justifyContent: 'center' }}>
        Check Requirements
      </button>

      {result && (
        <div style={{ padding: '1.5rem', backgroundColor: 'var(--surface-color)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--accent-color)' }}>Italian Recognition Pathway:</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.85rem', marginBottom: '0.2rem' }}>Professional Order (Albo):</span>
              <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{result.albo}</span>
            </div>
            
            <div>
              <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.85rem', marginBottom: '0.2rem' }}>Responsible Ministry:</span>
              <span>{result.ministry}</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={18} color="var(--text-secondary)" />
              <span style={{ color: 'var(--text-secondary)' }}>Estimated Timeline:</span>
              <span style={{ fontWeight: '600' }}>{result.estimated_months}</span>
            </div>

            <div style={{ marginTop: '0.5rem' }}>
              <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <FileText size={18} />
                Key Documents Required:
              </span>
              <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', margin: 0, lineHeight: '1.6' }}>
                {result.key_docs.map((doc, idx) => (
                  <li key={idx}>{doc}</li>
                ))}
              </ul>
              {result.cimea_needed && (
                <div style={{ marginTop: '0.75rem', padding: '0.5rem', backgroundColor: 'rgba(255, 85, 85, 0.1)', borderLeft: '3px solid #FF5555', fontSize: '0.9rem' }}>
                  <strong>Note:</strong> CIMEA Statement of Comparability is highly recommended or strictly required for this profession.
                </div>
              )}
            </div>
          </div>
          
          <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
            <p style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>Need help preparing these documents and submitting your application?</p>
            <button className="btn-outline" style={{ margin: '0 auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => window.location.href = '/quiz'}>
              Start Your Personalized Roadmap <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
    </div>
      </>
  );
};

export default AlboCheck;
