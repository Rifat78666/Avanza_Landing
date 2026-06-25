import React, { useState } from 'react';
import { BookOpen, ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate , useLocation} from 'react-router-dom';

const ECTSCalculator = () => {
  const location = useLocation();
  const themeColor = '#4a5b8a';
  const themeBg = '#e0e7ff';
  const navigate = useNavigate();
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
    <>
      <div style={{
        width: 'calc(100% - 2rem)',
        maxWidth: '1400px',
        margin: '1rem auto',
        position: 'relative',
        backgroundImage: 'url("https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1920&q=80")',
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
          backgroundColor: 'rgba(0, 40, 20, 0.7)',
          zIndex: 1
        }}></div>
        
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: 'bold' }}>Free ECTS Credit Converter</h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>Convert your university credits to the European Credit Transfer and Accumulation System (ECTS).</p>
          <button 
            onClick={() => document.getElementById('ects-calc-start').scrollIntoView({ behavior: 'smooth' })}
            style={{ padding: '0.8rem 2.5rem', background: '#ffffff', color: themeColor, border: 'none', borderRadius: '30px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 14px rgba(0,0,0,0.2)', transition: 'transform 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Start Now
          </button>
        </div>
      </div>

      <div id="ects-calc-start" className="container" style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '2rem' }}>
        <button 
          onClick={() => navigate('/tools')} 
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: 'none', color: '#4a4a4a', cursor: 'pointer', marginBottom: '1.5rem', fontWeight: 'bold' }}
        >
          <ArrowLeft size={18} /> Back to Tools
        </button>

        <div className="card" style={{ background: themeBg, color: '#1a1a1a', padding: '2rem', marginBottom: '2rem' }}>

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

      <button className="btn-primary" style={{ background: themeColor, borderColor: themeColor, width: '100%', marginBottom: '1.5rem', justifyContent: 'center' }}>
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
                  <span style={{ color: '#4a4a4a' }}>Your ECTS Equivalent:</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{result.ects} <span style={{ fontSize: '0.9rem', color: '#4a4a4a', fontWeight: 'normal' }}>ECTS</span></span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#4a4a4a' }}>Standard for your degree in Italy:</span>
                  <span style={{ fontWeight: 'bold' }}>{result.required} ECTS</span>
                </div>
                <div style={{ marginTop: '0.5rem', padding: '0.75rem', backgroundColor: result.meetsStandard ? 'rgba(200, 241, 53, 0.1)' : 'rgba(255, 85, 85, 0.1)', borderLeft: `3px solid ${result.meetsStandard ? '#C8F135' : '#FF5555'}`, color: result.meetsStandard ? '#C8F135' : '#FF5555' }}>
                  {result.meetsStandard 
                    ? "✓ Your credits MEET the Italian standard requirements." 
                    : "⚠ Your credits are below the standard Italian requirement. You may need extra coursework or evaluation."}
                </div>
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

export default ECTSCalculator;
