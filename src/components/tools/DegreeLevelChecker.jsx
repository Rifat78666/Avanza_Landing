import React, { useState } from 'react';
import degreeMapping from '../../data/degree_name_mapping.json';
import { GraduationCap, ArrowRight, CheckCircle2, Clock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DegreeLevelChecker = () => {
  const navigate = useNavigate();
  const [country, setCountry] = useState(Object.keys(degreeMapping)[0]);
  const [degree, setDegree] = useState(Object.keys(degreeMapping[Object.keys(degreeMapping)[0]].degrees)[0]);
  const [result, setResult] = useState(null);

  const handleCountryChange = (e) => {
    const newCountry = e.target.value;
    setCountry(newCountry);
    setDegree(Object.keys(degreeMapping[newCountry].degrees)[0]);
    setResult(null);
  };

  const handleCheck = () => {
    setResult(degreeMapping[country].degrees[degree]);
  };

  return (
        <>
      <div style={{
        width: '100%',
        position: 'relative',
        backgroundImage: 'url("https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1920&q=80")',
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
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: 'bold' }}>Degree Level Checker</h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>Map foreign degrees to Italian Laurea levels.</p>
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
        <GraduationCap size={24} color="var(--accent-color)" />
        Italian Degree Level Checker
      </h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
        Find out exactly what your foreign degree translates to in the Italian university system.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Country of Issue</label>
          <select value={country} onChange={handleCountryChange} className="input-field" style={{ width: '100%' }}>
            {Object.keys(degreeMapping).map(key => (
              <option key={key} value={key}>{degreeMapping[key].name}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Foreign Degree Name</label>
          <select value={degree} onChange={(e) => { setDegree(e.target.value); setResult(null); }} className="input-field" style={{ width: '100%' }}>
            {Object.keys(degreeMapping[country].degrees).map(deg => (
              <option key={deg} value={deg}>{deg}</option>
            ))}
          </select>
        </div>
      </div>

      <button className="btn-primary" onClick={handleCheck} style={{ width: '100%', marginBottom: '1.5rem', justifyContent: 'center' }}>
        Check Equivalent Level
      </button>

      {result && (
        <div style={{ padding: '1.5rem', backgroundColor: 'var(--surface-color)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--accent-color)' }}>Your Equivalency Match:</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.85rem', marginBottom: '0.2rem' }}>Italian Equivalent Laurea:</span>
              <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#fff' }}>{result.italian_equiv}</span>
            </div>
            
            <div style={{ display: 'flex', gap: '2rem' }}>
              <div>
                <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.85rem', marginBottom: '0.2rem' }}>EQF Level:</span>
                <span style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <CheckCircle2 size={16} color="var(--accent-color)" /> Level {result.eqf}
                </span>
              </div>
              <div>
                <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.85rem', marginBottom: '0.2rem' }}>ECTS Expectation:</span>
                <span style={{ fontWeight: 'bold' }}>~{result.ects_min} Credits</span>
              </div>
            </div>

            <div style={{ marginTop: '0.5rem', padding: '1rem', backgroundColor: '#151b28', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'block' }}>Recognition Pathway</span>
              <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
                <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Processing Ministry:</span>
                  <span>{result.ministry}</span>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>CIMEA Dichiarazione:</span>
                  <span style={{ color: result.cimea_needed ? '#FF5555' : '#C8F135' }}>
                    {result.cimea_needed ? "Typically Required" : "Not strictly required"}
                  </span>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Albo (Professional Order):</span>
                  <span>{result.albo_required ? result.albo_name : "Not Required"}</span>
                </li>
              </ul>
            </div>
            
            {result.note && (
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginTop: '0.5rem' }}>
                *Note: {result.note}
              </div>
            )}
          </div>
          
          <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
            <p style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>To use this degree in Italy, you need to navigate the bureaucratic process.</p>
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

export default DegreeLevelChecker;
