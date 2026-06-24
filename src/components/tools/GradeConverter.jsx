import React, { useState } from 'react';
import gradeTables from '../../data/grade_conversion_tables.json';
import { Calculator, ArrowRight } from 'lucide-react';

const GradeConverter = () => {
  const [country, setCountry] = useState(Object.keys(gradeTables)[0]);
  const [systemId, setSystemId] = useState(gradeTables[Object.keys(gradeTables)[0]].systems[0].id);
  const [score, setScore] = useState('');
  const [result, setResult] = useState(null);

  const currentCountryInfo = gradeTables[country];
  const currentSystem = currentCountryInfo.systems.find(s => s.id === systemId);

  const handleCountryChange = (e) => {
    const newCountry = e.target.value;
    setCountry(newCountry);
    setSystemId(gradeTables[newCountry].systems[0].id);
    setScore('');
    setResult(null);
  };

  const handleSystemChange = (e) => {
    setSystemId(e.target.value);
    setScore('');
    setResult(null);
  };

  const handleCalculate = () => {
    const numScore = parseFloat(score);
    if (isNaN(numScore)) {
      setResult({ error: 'Please enter a valid number.' });
      return;
    }

    if (numScore < currentSystem.min || numScore > currentSystem.max) {
      setResult({ error: `Score must be between ${currentSystem.min} and ${currentSystem.max}.` });
      return;
    }

    try {
      // Evaluate the formulas using Function instead of eval for better safety (though data is static)
      const toItalianFormula = currentSystem.to_italian_30.replace(/score/g, numScore);
      const toGpaFormula = currentSystem.to_gpa_4.replace(/score/g, numScore);

      // eslint-disable-next-line no-new-func
      const italianValue = new Function(`return ${toItalianFormula}`)();
      // eslint-disable-next-line no-new-func
      const gpaValue = new Function(`return ${toGpaFormula}`)();

      setResult({
        italian: Math.min(30, Math.max(18, parseFloat(italianValue))).toFixed(1), // Clamp between 18 and 30 for passing, though realistically it can fail
        rawItalian: parseFloat(italianValue).toFixed(1),
        gpa: Math.min(4.0, Math.max(0, parseFloat(gpaValue))).toFixed(2)
      });
    } catch (err) {
      setResult({ error: 'Calculation error.' });
    }
  };

  return (
    <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <Calculator size={24} color="var(--accent-color)" />
        Free Italian Grade Converter
      </h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
        Convert your foreign university grades to the Italian 30/30 scale instantly.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Country of Study</label>
          <select value={country} onChange={handleCountryChange} className="input-field" style={{ width: '100%' }}>
            {Object.keys(gradeTables).map(key => (
              <option key={key} value={key}>{gradeTables[key].name}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Grading System</label>
          <select value={systemId} onChange={handleSystemChange} className="input-field" style={{ width: '100%' }}>
            {currentCountryInfo.systems.map(sys => (
              <option key={sys.id} value={sys.id}>{sys.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Your Grade / Score</label>
          <input 
            type="number" 
            value={score} 
            onChange={(e) => setScore(e.target.value)} 
            placeholder={`e.g. ${currentSystem.max}`}
            className="input-field" 
            style={{ width: '100%' }}
            min={currentSystem.min}
            max={currentSystem.max}
            step="0.01"
          />
        </div>
      </div>

      <button className="btn-primary" onClick={handleCalculate} style={{ width: '100%', marginBottom: '1.5rem', justifyContent: 'center' }}>
        Calculate Equivalent
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
                  <span style={{ color: 'var(--text-secondary)' }}>Italian Equivalent:</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{result.rawItalian} <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>/ 30</span></span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Status:</span>
                  <span style={{ fontWeight: 'bold', color: parseFloat(result.rawItalian) >= 18 ? '#C8F135' : '#FF5555' }}>
                    {parseFloat(result.rawItalian) >= 18 ? 'Passing Grade' : 'Failing Grade'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>US GPA Equivalent:</span>
                  <span style={{ fontWeight: 'bold' }}>{result.gpa}</span>
                </div>
              </div>
              
              <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
                <p style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>Want a full official recognition report mapping your degree to the European Qualifications Framework (EQF)?</p>
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

export default GradeConverter;
