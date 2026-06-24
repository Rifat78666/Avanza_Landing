import React, { useState } from 'react';
import { BookOpen, ArrowRight } from 'lucide-react';

const ECTSCalculator = () => {
  const [country, setCountry] = useState('Generic');
  const [degreeLevel, setDegreeLevel] = useState('Bachelor');
  const [totalCredits, setTotalCredits] = useState('');
  const [duration, setDuration] = useState('');
  const [result, setResult] = useState(null);

  const handleCalculate = () => {
    const credits = parseFloat(totalCredits);
    const years = parseFloat(duration);

    if (isNaN(credits) || isNaN(years) || credits <= 0 || years <= 0) {
      setResult({ error: 'Please enter valid positive numbers for credits and duration.' });
      return;
    }

    // Italian ECTS standard requirement
    // Laurea Triennale (Bachelor) = 180 ECTS (3 years)
    // Laurea Magistrale (Master) = 120 ECTS (2 years)
    const requiredECTS = degreeLevel === 'Bachelor' ? 180 : 120;
    
    let calculatedECTS = 0;
    
    // Some hardcoded generic standard mappings as mentioned in requirements
    if (country === 'US') {
      calculatedECTS = credits * 2; // US semester hour -> 2 ECTS
    } else if (country === 'UK') {
      calculatedECTS = credits * 0.5; // UK credit -> 0.5 ECTS
    } else {
      // General ECTS Formula: 60 ECTS per year is standard.
      // ECTS per credit = 60 / (credits per year)
      const creditsPerYear = credits / years;
      const ectsPerCredit = 60 / creditsPerYear;
      calculatedECTS = credits * ectsPerCredit;
    }

    setResult({
      ects: Math.round(calculatedECTS),
      required: requiredECTS,
      meetsStandard: calculatedECTS >= (requiredECTS * 0.95) // Allow small margin
    });
  };

  return (
    <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <BookOpen size={24} color="var(--accent-color)" />
        Free ECTS Credit Converter
      </h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
        Convert your university credits to the European Credit Transfer and Accumulation System (ECTS).
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Country System</label>
          <select value={country} onChange={(e) => setCountry(e.target.value)} className="input-field" style={{ width: '100%' }}>
            <option value="Generic">Other / Standard (Formula Based)</option>
            <option value="US">United States (Semester Hours)</option>
            <option value="UK">United Kingdom (CATS)</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Degree Level</label>
          <select value={degreeLevel} onChange={(e) => setDegreeLevel(e.target.value)} className="input-field" style={{ width: '100%' }}>
            <option value="Bachelor">Bachelor's Degree</option>
            <option value="Master">Master's Degree</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Total Credits</label>
          <input 
            type="number" 
            value={totalCredits} 
            onChange={(e) => setTotalCredits(e.target.value)} 
            placeholder="e.g. 120"
            className="input-field" 
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Program Duration (Years)</label>
          <input 
            type="number" 
            value={duration} 
            onChange={(e) => setDuration(e.target.value)} 
            placeholder="e.g. 3"
            className="input-field" 
            style={{ width: '100%' }}
          />
        </div>
      </div>

      <button className="btn-primary" onClick={handleCalculate} style={{ width: '100%', marginBottom: '1.5rem', justifyContent: 'center' }}>
        Calculate ECTS
      </button>

      {result && (
        <div style={{ padding: '1.5rem', backgroundColor: 'var(--surface-color)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          {result.error ? (
            <p style={{ color: '#FF5555' }}>{result.error}</p>
          ) : (
            <>
              <h3 style={{ marginBottom: '1rem', color: 'var(--accent-color)' }}>Your Results:</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Your ECTS Equivalent:</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{result.ects} <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>ECTS</span></span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Standard for your degree in Italy:</span>
                  <span style={{ fontWeight: 'bold' }}>{result.required} ECTS</span>
                </div>
                <div style={{ marginTop: '0.5rem', padding: '0.75rem', backgroundColor: result.meetsStandard ? 'rgba(200, 241, 53, 0.1)' : 'rgba(255, 85, 85, 0.1)', borderLeft: `3px solid ${result.meetsStandard ? '#C8F135' : '#FF5555'}`, color: result.meetsStandard ? '#C8F135' : '#FF5555' }}>
                  {result.meetsStandard 
                    ? "✓ Your credits MEET the Italian standard requirements." 
                    : "⚠ Your credits are below the standard Italian requirement. You may need extra coursework or evaluation."}
                </div>
              </div>
              
              <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
                <p style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>Need an official ECTS mapping for your university admission or job application?</p>
                <button className="btn-outline" style={{ margin: '0 auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => window.location.href = '/quiz'}>
                  Get Your Recognition Roadmap <ArrowRight size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ECTSCalculator;
