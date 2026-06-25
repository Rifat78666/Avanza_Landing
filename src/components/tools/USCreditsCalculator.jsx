import React, { useState } from 'react';
import { Calculator, ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate , useLocation} from 'react-router-dom';

const USCreditsCalculator = () => {
  const location = useLocation();
  const themeColor = location.state?.themeColor || '#009246';
  const themeBg = location.state?.themeBg || 'rgba(0, 146, 70, 0.05)';
  const navigate = useNavigate();
  const [credits, setCredits] = useState('');
  const [system, setSystem] = useState('ects');
  const [result, setResult] = useState(null);

  const calculate = () => {
    const val = parseFloat(credits);
    if (isNaN(val) || val <= 0) {
      setResult({ error: 'Please enter a valid positive number.' });
      return;
    }
    
    let usCredits = 0;
    if (system === 'ects') usCredits = val * 0.5; // 2 ECTS = 1 US Credit
    if (system === 'uk') usCredits = val * 0.25; // 4 UK Cats = 1 US Credit

    setResult({ usCredits: usCredits.toFixed(1) });
  };

  return (
        <>
      <div style={{
        width: 'calc(100% - 2rem)',
        maxWidth: '1400px',
        margin: '1rem auto',
        position: 'relative',
        backgroundImage: 'url("https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1920&q=80")',
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
          background: 'linear-gradient(135deg, rgba(10, 49, 97, 0.4) 0%, rgba(179, 25, 66, 0.4) 100%)',
          zIndex: 1
        }}></div>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: 'bold' }}>U.S. Credits Calculator</h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>Convert foreign credits to U.S. Semester Hours.</p>
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
          U.S. Credits Calculator
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Convert your university credits to United States Semester Hours.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Original Credit System</label>
            <select value={system} onChange={(e) => setSystem(e.target.value)} className="input-field" style={{ width: '100%' }}>
              <option value="ects">European (ECTS)</option>
              <option value="uk">United Kingdom (CATS)</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Total Credits</label>
            <input type="number" value={credits} onChange={(e) => setCredits(e.target.value)} className="input-field" placeholder="e.g. 120" style={{ width: '100%' }} />
          </div>
        </div>

        <button className="btn-primary" onClick={calculate} style={{ width: '100%', marginBottom: '1.5rem', justifyContent: 'center' }}>
          Calculate U.S. Credits
        </button>

        {result && (
          <div style={{ padding: '1.5rem', backgroundColor: 'var(--surface-color)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            {result.error ? (
              <p style={{ color: '#FF5555' }}>{result.error}</p>
            ) : (
              <>
                <h3 style={{ marginBottom: '1rem', color: 'var(--accent-color)' }}>Result:</h3>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                  {result.usCredits} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>U.S. Semester Hours</span>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
      </>
  );
};

export default USCreditsCalculator;
