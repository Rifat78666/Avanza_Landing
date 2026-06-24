import React, { useState } from 'react';
import rulesData from '../../data/decreto_flussi_rules.json';
import { PlaneTakeoff, ArrowRight, AlertTriangle } from 'lucide-react';

const DecretoFlussiChecker = () => {
  const [nationality, setNationality] = useState(rulesData.nationalities[0]);
  const [location, setLocation] = useState(rulesData.locations[0]);
  const [profession, setProfession] = useState(rulesData.professions[0]);
  const [result, setResult] = useState(null);

  const handleCheck = () => {
    let matchedResult = rulesData.default_result;

    for (const rule of rulesData.rules) {
      const cond = rule.condition;
      let match = true;

      if (cond.nationality && cond.nationality !== nationality) match = false;
      if (cond.location && cond.location !== location) match = false;
      if (cond.profession_in && !cond.profession_in.includes(profession)) match = false;

      if (match) {
        matchedResult = rule.result;
        break; // Take the first matching rule
      }
    }

    setResult(matchedResult);
  };

  return (
    <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <PlaneTakeoff size={24} color="var(--accent-color)" />
        Decreto Flussi Eligibility Checker
      </h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
        Check if you are eligible to apply for an Italian work visa under the annual Decreto Flussi quotas.
      </p>

      <div style={{ padding: '1rem', backgroundColor: 'rgba(255, 204, 0, 0.1)', borderLeft: '3px solid #FFCC00', marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        <AlertTriangle size={16} style={{ display: 'inline', marginRight: '0.5rem', color: '#FFCC00' }} />
        <strong>Disclaimer:</strong> Immigration rules change frequently. This tool uses general 2024/2025 guidelines. Always consult official sources or generate a full roadmap.
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Nationality</label>
          <select value={nationality} onChange={(e) => { setNationality(e.target.value); setResult(null); }} className="input-field" style={{ width: '100%' }}>
            {rulesData.nationalities.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Current Location</label>
          <select value={location} onChange={(e) => { setLocation(e.target.value); setResult(null); }} className="input-field" style={{ width: '100%' }}>
            {rulesData.locations.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Profession Sector</label>
          <select value={profession} onChange={(e) => { setProfession(e.target.value); setResult(null); }} className="input-field" style={{ width: '100%' }}>
            {rulesData.professions.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      <button className="btn-primary" onClick={handleCheck} style={{ width: '100%', marginBottom: '1.5rem', justifyContent: 'center' }}>
        Check Eligibility
      </button>

      {result && (
        <div style={{ padding: '1.5rem', backgroundColor: 'var(--surface-color)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <h3 style={{ marginBottom: '1rem', color: result.eligible ? 'var(--accent-color)' : '#FF5555' }}>
            {result.eligible === false && nationality !== 'EU Citizen' ? "Not Eligible / Difficult Pathway" : "Potential Eligibility Match"}
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
              {result.message}
            </div>
            
            <div style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              {result.explanation}
            </div>

            {result.requires_job_offer && (
              <div style={{ marginTop: '0.5rem', padding: '0.75rem', backgroundColor: '#151b28', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '0.9rem' }}>
                <strong style={{ color: 'var(--text-primary)' }}>Important Requirement:</strong> You must have a formal job offer from an Italian employer willing to sponsor your application.
              </div>
            )}
          </div>
          
          <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
            <p style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>Want a precise step-by-step bureaucratic roadmap for your exact situation?</p>
            <button className="btn-outline" style={{ margin: '0 auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => window.location.href = '/quiz'}>
              Get Your Immigration Roadmap <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DecretoFlussiChecker;
