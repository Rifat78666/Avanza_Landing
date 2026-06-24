import React, { useState } from 'react';
import permitRules from '../../data/work_permit_rules.json';
import { Briefcase, ArrowRight, CheckCircle2, Clock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WorkPermitWizard = () => {
  const navigate = useNavigate();
  const [nationality, setNationality] = useState(permitRules.nationalities[0]);
  const [residenceStatus, setResidenceStatus] = useState(permitRules.residence_status[0]);
  const [professionType, setProfessionType] = useState(permitRules.profession_types[0]);
  const [result, setResult] = useState(null);

  const handleCheck = () => {
    let matchedResult = permitRules.default_result;

    for (const rule of permitRules.rules) {
      const cond = rule.condition;
      let match = true;

      if (cond.nationality && cond.nationality !== nationality) match = false;
      if (cond.residence_status && cond.residence_status !== residenceStatus) match = false;
      if (cond.profession_type && cond.profession_type !== professionType) match = false;

      if (match) {
        matchedResult = rule.result;
        break;
      }
    }

    setResult(matchedResult);
  };

  return (
        <>
      <div style={{
        width: '100%',
        position: 'relative',
        backgroundImage: 'url("https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1920&q=80")',
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
          background: 'linear-gradient(135deg, rgba(0, 146, 70, 0.4) 0%, rgba(20, 100, 60, 0.4) 100%)',
          zIndex: 1
        }}></div>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: 'bold' }}>Work Permit Wizard</h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>Find the exact Italian residence permit you need.</p>
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
        <Briefcase size={24} color="var(--accent-color)" />
        Italy Work Permit Wizard
      </h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
        Discover exactly which 'Permesso di Soggiorno' (Residence Permit) you need to work legally in Italy based on your current status.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Nationality</label>
          <select value={nationality} onChange={(e) => { setNationality(e.target.value); setResult(null); }} className="input-field" style={{ width: '100%' }}>
            {permitRules.nationalities.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>

        {nationality !== 'EU Citizen' && (
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Current Status</label>
            <select value={residenceStatus} onChange={(e) => { setResidenceStatus(e.target.value); setResult(null); }} className="input-field" style={{ width: '100%' }}>
              {permitRules.residence_status.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        )}

        {nationality !== 'EU Citizen' && residenceStatus === 'Living abroad (no Italian permit)' && (
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Target Profession Type</label>
            <select value={professionType} onChange={(e) => { setProfessionType(e.target.value); setResult(null); }} className="input-field" style={{ width: '100%' }}>
              {permitRules.profession_types.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        )}
      </div>

      <button className="btn-primary" onClick={handleCheck} style={{ width: '100%', marginBottom: '1.5rem', justifyContent: 'center' }}>
        Find Required Permit
      </button>

      {result && (
        <div style={{ padding: '1.5rem', backgroundColor: 'var(--surface-color)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--accent-color)' }}>Your Required Pathway:</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.85rem', marginBottom: '0.2rem' }}>Permit Type:</span>
              <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#fff' }}>{result.permit_name}</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={18} color="var(--text-secondary)" />
              <span style={{ color: 'var(--text-secondary)' }}>Estimated Timeline:</span>
              <span style={{ fontWeight: '600' }}>{result.timeline}</span>
            </div>

            <div style={{ marginTop: '0.5rem' }}>
              <span style={{ fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'block' }}>Key Steps</span>
              <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {result.steps.map((step, idx) => (
                  <li key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                    <CheckCircle2 size={16} color="var(--accent-color)" style={{ marginTop: '0.2rem', flexShrink: 0 }} />
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
      </>
  );
};

export default WorkPermitWizard;
