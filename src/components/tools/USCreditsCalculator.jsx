import React, { useState } from 'react';
import { Calculator, ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const USCreditsCalculator = () => {
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
  );
};

export default USCreditsCalculator;
