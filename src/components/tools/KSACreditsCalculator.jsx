import React, { useState } from 'react';
import mapping from '../../data/ksa_credits_mapping.json';
import { Calculator, ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate , useLocation} from 'react-router-dom';

const KSACreditsCalculator = () => {
  const location = useLocation();
  const themeColor = location.state?.themeColor || '#009246';
  const themeBg = location.state?.themeBg || 'rgba(0, 146, 70, 0.05)';
  const navigate = useNavigate();
  const [systemIndex, setSystemIndex] = useState(0);
  const [credits, setCredits] = useState('');
  const [result, setResult] = useState(null);

  const calculate = () => {
    const val = parseFloat(credits);
    if (isNaN(val) || val <= 0) {
      setResult({ error: 'Please enter a valid positive number.' });
      return;
    }
    
    const sys = mapping.credits_mapping[systemIndex];
    const ksaCredits = val * sys.ratio;

    setResult({ ksaCredits: ksaCredits.toFixed(1), notes: sys.notes });
  };

  return (
        <>
      <div style={{
        width: 'calc(100% - 2rem)',
        maxWidth: '1400px',
        margin: '1rem auto',
        position: 'relative',
        backgroundImage: 'url("https://images.unsplash.com/photo-1551041777-ed277b8dd348?auto=format&fit=crop&w=1920&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '5rem 1rem',
        textAlign: 'center',
        color: 'white',
        borderRadius: '36px',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(135deg, rgba(0, 146, 70, 0.4) 0%, rgba(206, 43, 55, 0.4) 100%)',
          zIndex: 1
        }}></div>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: 'bold' }}>KSA Credits Calculator</h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>Convert credits to Saudi Arabian standards.</p>
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
          <Calculator size={24} color="var(--accent-color)" />
          KSA Credits Calculator
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Convert your university credits to Saudi Arabian credit standards.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Original Credit System</label>
            <select value={systemIndex} onChange={(e) => setSystemIndex(e.target.value)} className="input-field" style={{ width: '100%' }}>
              {mapping.credits_mapping.map((m, i) => (
                <option key={i} value={i}>{m.source_country} ({m.credit_type})</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Total Credits</label>
            <input type="number" value={credits} onChange={(e) => setCredits(e.target.value)} className="input-field" placeholder="e.g. 120" style={{ width: '100%' }} />
          </div>
        </div>

        <button className="btn-primary" onClick={calculate} style={{ width: '100%', marginBottom: '1.5rem', justifyContent: 'center' }}>
          Calculate KSA Credits
        </button>

        {result && (
          <div style={{ padding: '1.5rem', backgroundColor: 'var(--surface-color)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            {result.error ? (
              <p style={{ color: '#FF5555' }}>{result.error}</p>
            ) : (
              <>
                <h3 style={{ marginBottom: '1rem', color: 'var(--accent-color)' }}>Result:</h3>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  {result.ksaCredits} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>KSA Credits</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{result.notes}</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
      </>
  );
};

export default KSACreditsCalculator;
