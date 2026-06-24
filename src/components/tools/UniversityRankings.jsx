import React, { useState } from 'react';
import rankingsData from '../../data/university_rankings_sample.json';
import { Trophy, ArrowLeft, Search, MapPin, Star, GraduationCap, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UniversityRankings = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const filtered = rankingsData.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.country.toLowerCase().includes(search.toLowerCase())
  );

  const toggleExpand = (rank) => {
    setExpandedId(expandedId === rank ? null : rank);
  };

  return (
        <>
      <div style={{
        width: '100%',
        position: 'relative',
        backgroundImage: 'url("https://images.unsplash.com/photo-1523580494112-071d311b95b8?auto=format&fit=crop&w=1920&q=80")',
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
          background: 'linear-gradient(135deg, rgba(243, 156, 18, 0.8) 0%, rgba(211, 84, 0, 0.8) 100%)',
          zIndex: 1
        }}></div>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: 'bold' }}>University Rankings</h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>Search global university rankings.</p>
        </div>
      </div>
<div className="container" style={{ maxWidth: '1000px', margin: '0 auto', paddingTop: '2rem', paddingBottom: '4rem' }}>
      <button 
        onClick={() => navigate('/tools')} 
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: '1.5rem', fontWeight: 'bold' }}
      >
        <ArrowLeft size={18} /> Back to Tools
      </button>

      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <div style={{ background: 'rgba(0, 146, 70, 0.1)', padding: '1rem', borderRadius: '50%' }}>
            <Trophy size={40} color="#009246" />
          </div>
        </div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>University Rankings</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          Explore top university rankings worldwide with GPA requirements, admission criteria, and scores.
        </p>
      </div>

      <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
        <Search size={20} style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
        <input 
          type="text" 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          className="input-field" 
          placeholder="Search by university name or country..." 
          style={{ width: '100%', paddingLeft: '3rem', fontSize: '1.1rem', padding: '1rem 1rem 1rem 3rem', borderRadius: '12px' }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '4rem' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--surface-color)', borderRadius: '16px' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>No universities found matching your search.</p>
          </div>
        ) : (
          filtered.map((uni) => (
            <div key={uni.rank} className="card" style={{ padding: '2rem', borderLeft: '4px solid #CE2B37' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#009246', minWidth: '80px' }}>
                    #{uni.rank}
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1.8rem', margin: '0 0 0.5rem 0' }}>{uni.name}</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                      <MapPin size={18} color="#CE2B37" />
                      <span>{uni.country}</span>
                    </div>
                  </div>
                </div>
                <div style={{ background: 'rgba(0, 146, 70, 0.1)', padding: '0.8rem 1.5rem', borderRadius: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Overall Score</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#009246' }}>{uni.score}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Star size={18} color="#009246" />
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Research: <strong style={{ color: '#fff' }}>{uni.metrics.research}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Star size={18} color="#009246" />
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Employability: <strong style={{ color: '#fff' }}>{uni.metrics.employability}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Star size={18} color="#009246" />
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Global: <strong style={{ color: '#fff' }}>{uni.metrics.globalEngagement}</strong></span>
                </div>
              </div>

              <div style={{ marginTop: '1.5rem' }}>
                <button 
                  onClick={() => toggleExpand(uni.rank)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: 'none', color: '#009246', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', padding: '0' }}
                >
                  <GraduationCap size={20} />
                  {expandedId === uni.rank ? 'Hide Admission Criteria' : 'View Admission Criteria'}
                  {expandedId === uni.rank ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {expandedId === uni.rank && (
                  <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', animation: 'fadeIn 0.3s ease' }}>
                    <div style={{ background: 'var(--surface-color)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                      <h4 style={{ color: '#CE2B37', marginBottom: '1rem', fontSize: '1.1rem', borderBottom: '1px solid rgba(206, 43, 55, 0.2)', paddingBottom: '0.5rem' }}>Bachelor's Programs</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Minimum GPA</div>
                          <div style={{ fontWeight: 'bold' }}>{uni.admission.bachelor.gpa}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Standardized Tests</div>
                          <div>{uni.admission.bachelor.tests}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>English Proficiency</div>
                          <div>{uni.admission.bachelor.english}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ background: 'var(--surface-color)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                      <h4 style={{ color: '#009246', marginBottom: '1rem', fontSize: '1.1rem', borderBottom: '1px solid rgba(0, 146, 70, 0.2)', paddingBottom: '0.5rem' }}>Master's Programs</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Minimum GPA</div>
                          <div style={{ fontWeight: 'bold' }}>{uni.admission.master.gpa}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Standardized Tests</div>
                          <div>{uni.admission.master.tests}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>English Proficiency</div>
                          <div>{uni.admission.master.english}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* FAQ Section */}
      <div style={{ marginTop: '4rem', borderTop: '1px solid var(--border-color)', paddingTop: '4rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <HelpCircle size={32} color="#009246" />
          <h2 style={{ fontSize: '2rem' }}>Frequently Asked Questions</h2>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <details style={{ background: 'var(--surface-color)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
            <summary style={{ padding: '1.5rem', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              What do university rankings measure?
              <ChevronDown size={20} color="var(--text-secondary)" />
            </summary>
            <div style={{ padding: '0 1.5rem 1.5rem 1.5rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              University rankings evaluate institutions across multiple dimensions including research output and quality, teaching quality, employability of graduates, international outlook, and sustainability.
            </div>
          </details>

          <details style={{ background: 'var(--surface-color)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
            <summary style={{ padding: '1.5rem', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              How are university scores calculated?
              <ChevronDown size={20} color="var(--text-secondary)" />
            </summary>
            <div style={{ padding: '0 1.5rem 1.5rem 1.5rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              University scores are calculated based on performance across multiple categories and indicators. Each indicator is scored out of 100, and the overall score represents the university's performance across all evaluated dimensions.
            </div>
          </details>

          <details style={{ background: 'var(--surface-color)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
            <summary style={{ padding: '1.5rem', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              How do I find admission requirements?
              <ChevronDown size={20} color="var(--text-secondary)" />
            </summary>
            <div style={{ padding: '0 1.5rem 1.5rem 1.5rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              Each university page includes detailed admission criteria organized by degree level (Bachelor, Master). Requirements typically include standardized test scores (SAT, ACT, GRE, GMAT), English proficiency tests (TOEFL, IELTS), and minimum GPA requirements. Click on "View Admission Criteria" to see full details.
            </div>
          </details>
        </div>
      </div>
    </div>
      </>
  );
};

export default UniversityRankings;
