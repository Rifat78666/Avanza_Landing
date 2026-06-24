import React, { useState } from 'react';
import rankingsData from '../../data/university_rankings_sample.json';
import { Trophy, ArrowLeft, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UniversityRankings = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filtered = rankingsData.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.country.toLowerCase().includes(search.toLowerCase())
  );

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
          <Trophy size={24} color="var(--accent-color)" />
          University Rankings
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Explore global university rankings and scores.
        </p>

        <div style={{ position: 'relative', marginBottom: '2rem' }}>
          <input 
            type="text" 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className="input-field" 
            placeholder="Search by university name or country..." 
            style={{ width: '100%', paddingLeft: '2.5rem' }} 
          />
          <Search size={18} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '1rem 0', width: '10%' }}>Rank</th>
                <th style={{ padding: '1rem 0' }}>University</th>
                <th style={{ padding: '1rem 0', width: '25%' }}>Country</th>
                <th style={{ padding: '1rem 0', width: '15%', textAlign: 'right' }}>Score</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? filtered.map((uni) => (
                <tr key={uni.rank} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem 0', fontWeight: 'bold' }}>#{uni.rank}</td>
                  <td style={{ padding: '1rem 0' }}>{uni.name}</td>
                  <td style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>{uni.country}</td>
                  <td style={{ padding: '1rem 0', textAlign: 'right', fontWeight: 'bold', color: 'var(--accent-color)' }}>{uni.score}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-secondary)' }}>No universities found matching your search.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UniversityRankings;
