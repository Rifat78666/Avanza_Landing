import React, { useState } from 'react';
import reqs from '../../data/university_requirements_table.json';
import { GraduationCap, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UniversityRequirements = () => {
  const navigate = useNavigate();
  const [country, setCountry] = useState(Object.keys(reqs)[0]);

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
          <GraduationCap size={24} color="var(--accent-color)" />
          University Entry Requirements
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Discover the general university entry requirements by country.
        </p>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Target Country</label>
          <select value={country} onChange={(e) => setCountry(e.target.value)} className="input-field" style={{ width: '100%' }}>
            {Object.keys(reqs).map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div style={{ padding: '1.5rem', backgroundColor: 'var(--surface-color)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--accent-color)' }}>Requirements for {country}:</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {Object.entries(reqs[country]).map(([level, details]) => (
              <div key={level} style={{ padding: '1rem', backgroundColor: '#151b28', borderRadius: '6px' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{level}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>{details}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversityRequirements;
