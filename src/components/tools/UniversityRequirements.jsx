import React, { useState } from 'react';
import reqs from '../../data/university_requirements_table.json';
import { GraduationCap, ArrowLeft, Search, MapPin, Award, BookOpen, Clock, ExternalLink, HelpCircle, ChevronDown } from 'lucide-react';
import { useNavigate , useLocation} from 'react-router-dom';

const UniversityRequirements = () => {
  const location = useLocation();
  const themeColor = '#6b4c8a';
  const themeBg = '#f3e8ff';
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredReqs = reqs.filter(req => 
    req.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.qualificationEnglish.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.qualificationOriginal.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
        <>
      <div style={{
        width: 'calc(100% - 2rem)',
        maxWidth: '1400px',
        margin: '1rem auto',
        position: 'relative',
        backgroundImage: 'url("https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=1920&q=80")',
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
          background: 'linear-gradient(135deg, rgba(20, 30, 48, 0.4) 0%, rgba(36, 59, 85, 0.4) 100%)',
          zIndex: 1
        }}></div>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: 'bold' }}>University Requirements</h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>Find entry requirements by country.</p>
        </div>
      </div>
<div className="container" style={{ maxWidth: '1000px', margin: '0 auto', paddingTop: '2rem', paddingBottom: '4rem' }}>
      <button 
        onClick={() => navigate('/tools')} 
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: 'none', color: '#4a4a4a', cursor: 'pointer', marginBottom: '1.5rem', fontWeight: 'bold' }}
      >
        <ArrowLeft size={18} /> Back to Tools
      </button>

      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <div style={{ background: themeBg, padding: '1rem', borderRadius: '50%' }}>
            <GraduationCap size={40} color={themeColor} />
          </div>
        </div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>University Entry Requirements</h1>
        <p style={{ color: '#4a4a4a', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          Search university entry requirements by country. Find secondary certificates, entry qualifications, and higher education access requirements worldwide.
        </p>
      </div>

      <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
        <Search size={20} style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: '#4a4a4a' }} />
        <input 
          type="text" 
          placeholder="Search by country or qualification name..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field" 
          style={{ width: '100%', paddingLeft: '3rem', fontSize: '1.1rem', padding: '1rem 1rem 1rem 3rem', borderRadius: '12px' }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '4rem' }}>
        {filteredReqs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--surface-color)', borderRadius: '16px' }}>
            <p style={{ color: '#4a4a4a', fontSize: '1.1rem' }}>No results found for "{searchTerm}". Please try another country.</p>
          </div>
        ) : (
          filteredReqs.map((req, idx) => (
            <div key={idx} className="card" style={{ padding: '2rem', borderTop: `4px solid ${themeColor}`, background: themeBg, color: '#1a1a1a' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                <MapPin size={28} color={themeColor} />
                <h2 style={{ fontSize: '1.8rem', margin: 0 }}>{req.country}</h2>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4a4a4a', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                      <Award size={16} /> Qualification Name (Original)
                    </h4>
                    <p style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{req.qualificationOriginal}</p>
                  </div>
                  <div>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4a4a4a', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                      <BookOpen size={16} /> English Translation
                    </h4>
                    <p style={{ fontSize: '1.1rem' }}>{req.qualificationEnglish}</p>
                  </div>
                  <div>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4a4a4a', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                      <Clock size={16} /> Total Years of Schooling
                    </h4>
                    <p style={{ background: 'rgba(255,255,255,0.05)', display: 'inline-block', padding: '0.4rem 0.8rem', borderRadius: '6px', fontWeight: 'bold' }}>
                      {req.totalYears}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ background: themeBg, border: '1px solid rgba(0, 146, 70, 0.2)', padding: '1.5rem', borderRadius: '12px' }}>
                    <h4 style={{ color: themeColor, marginBottom: '0.5rem', fontSize: '1.1rem' }}>General Access Requirements</h4>
                    <p style={{ lineHeight: '1.6' }}>{req.accessRequirements}</p>
                  </div>
                  
                  <div>
                    <h4 style={{ color: '#4a4a4a', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Awarding Body</h4>
                    <p>{req.awardingBody}</p>
                  </div>
                  
                  <div>
                    <h4 style={{ color: '#4a4a4a', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Additional Notes</h4>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', lineHeight: '1.5' }}>{req.additionalNotes}</p>
                  </div>

                  {req.link && (
                    <a href={req.link} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: themeColor, fontWeight: 'bold', marginTop: '0.5rem' }}>
                      Official Source <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* FAQ Section */}
      <div style={{ marginTop: '4rem', borderTop: '1px solid var(--border-color)', paddingTop: '4rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <HelpCircle size={32} color={themeColor} />
          <h2 style={{ fontSize: '2rem' }}>Frequently Asked Questions</h2>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <details style={{ background: 'var(--surface-color)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
            <summary style={{ padding: '1.5rem', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              What information is included in the qualification requirements?
              <ChevronDown size={20} color="var(--text-secondary)" />
            </summary>
            <div style={{ padding: '0 1.5rem 1.5rem 1.5rem', color: '#4a4a4a', lineHeight: '1.6' }}>
              Each qualification entry includes the country, qualification name (in both original language and English), awarding body, total years of schooling, general requirements for higher education access, useful links to official sources, and additional description with detailed information.
            </div>
          </details>

          <details style={{ background: 'var(--surface-color)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
            <summary style={{ padding: '1.5rem', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              Is this information official and up-to-date?
              <ChevronDown size={20} color="var(--text-secondary)" />
            </summary>
            <div style={{ padding: '0 1.5rem 1.5rem 1.5rem', color: '#4a4a4a', lineHeight: '1.6' }}>
              The information is compiled from official sources and includes links to relevant education authorities. However, qualification requirements may change over time, so we recommend verifying current requirements directly with the relevant institutions or education authorities.
            </div>
          </details>

          <details style={{ background: 'var(--surface-color)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
            <summary style={{ padding: '1.5rem', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              Are there additional requirements beyond the qualification certificate?
              <ChevronDown size={20} color="var(--text-secondary)" />
            </summary>
            <div style={{ padding: '0 1.5rem 1.5rem 1.5rem', color: '#4a4a4a', lineHeight: '1.6' }}>
              Yes, many universities require additional elements such as: minimum grade requirements, subject-specific prerequisites for certain programs, entrance examinations or standardized tests, and proof of language proficiency (TOEFL, IELTS, etc.).
            </div>
          </details>
        </div>
      </div>
    </div>
      </>
  );
};

export default UniversityRequirements;
