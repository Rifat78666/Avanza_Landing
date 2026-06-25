import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, BookOpen, GraduationCap, ShieldCheck, PlaneTakeoff, Briefcase, Trophy, Globe, FileText, Settings, Star } from 'lucide-react';

const FreeTools = () => {
  const navigate = useNavigate();

  const tools = [
    {
      category: "Conversions & Calculations",
      items: [
        {
          id: 'grade-converter',
          name: 'Grade Converter & University Match',
          description: 'Convert your grades to European standards and see which universities you qualify for.',
          icon: <Calculator size={32} color="#009246" />,
          path: '/tools/grade-converter'
        },
        {
          id: 'ects-calculator',
          name: 'ECTS Calculator',
          description: 'Convert international credits to European ECTS.',
          icon: <BookOpen size={32} color="#CE2B37" />,
          path: '/tools/ects-calculator'
        },
        {
          id: 'us-credits',
          name: 'U.S. Credits Calculator',
          description: 'Convert foreign credits to U.S. Semester Hours.',
          icon: <Calculator size={32} color="#009246" />,
          path: '/tools/us-credits'
        },
        {
          id: 'ksa-credits',
          name: 'KSA Credits Calculator',
          description: 'Convert credits to Saudi Arabian standards.',
          icon: <Globe size={32} color="#CE2B37" />,
          path: '/tools/ksa-credits'
        },
        {
          id: 'credential-report',
          name: 'Course by Course Evaluation',
          description: 'A complete course-by-course evaluation — verification, credit and grade conversion, framework mapping, and GPA — delivered as one official PDF report.',
          price: '€10',
          features: [
            'Institution Verification',
            'Credit Points Conversion',
            'Qualification Framework Mapping',
            'Grade Scale Conversion',
            'GPA Evaluation',
            'Official PDF Report'
          ],
          icon: <FileText size={32} color="#009246" />,
          path: '/tools/course-evaluation'
        }
      ]
    },
    {
      category: "Degree & Recognition Verification",
      items: [
        {
          id: 'degree-checker',
          name: 'Degree Level Checker',
          description: 'Map foreign degrees to Italian Laurea levels.',
          icon: <GraduationCap size={32} color="#009246" />,
          path: '/tools/degree-checker'
        },
        {
          id: 'albo-check',
          name: 'Albo Check',
          description: 'Check if your profession is regulated in Italy.',
          icon: <ShieldCheck size={32} color="#CE2B37" />,
          path: '/tools/albo-check'
        },
        {
          id: 'university-requirements',
          name: 'University Requirements',
          description: 'Find entry requirements by country.',
          icon: <FileText size={32} color="#009246" />,
          path: '/tools/university-requirements'
        }
      ]
    },
    {
      category: "Immigration & Visas",
      items: [
        {
          id: 'work-permit',
          name: 'Work Permit Wizard',
          description: 'Find the exact Italian residence permit you need.',
          icon: <Briefcase size={32} color="#009246" />,
          path: '/tools/work-permit'
        },
        {
          id: 'decreto-flussi',
          name: 'Decreto Flussi Checker',
          description: 'Check eligibility for Italian immigration quotas.',
          icon: <PlaneTakeoff size={32} color="#CE2B37" />,
          path: '/tools/decreto-flussi'
        }
      ]
    },
    {
      category: "Databases & Search",
      items: [
        {
          id: 'university-rankings',
          name: 'University Rankings',
          description: 'Search global university rankings.',
          icon: <Trophy size={32} color="#009246" />,
          path: '/tools/university-rankings'
        },
        {
          id: 'cip-codes',
          name: 'CIP Codes Search',
          description: 'Search Classification of Instructional Programs.',
          icon: <Settings size={32} color="#CE2B37" />,
          path: '/tools/cip-codes'
        }
      ]
    }
  ];

  return (
    <>
      <div style={{
        width: 'calc(100% - 2rem)',
        maxWidth: '1400px',
        margin: '1rem auto',
        position: 'relative',
        backgroundImage: 'url("https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1920&q=80")',
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
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: 'bold' }}>Start your Europe journey with AVANZA</h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>Explore our suite of tools designed to help you navigate credential evaluation, university admissions, and immigration pathways.</p>
          <button 
            onClick={() => navigate('/tools/grade-converter')}
            style={{ padding: '0.8rem 2.5rem', background: '#ffffff', color: '#009246', border: 'none', borderRadius: '30px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 14px rgba(0,0,0,0.2)', transition: 'transform 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Start Now
          </button>
        </div>
      </div>

      <div id="tools-list" style={{ padding: '4rem 0', width: 'calc(100% - 2rem)', maxWidth: '1400px', margin: '0 auto' }}>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
        {tools.map((section, idx) => (
          <div key={idx}>
            <div style={{ borderBottom: '2px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '2.5rem' }}>
              <h2 style={{ 
                fontSize: '2.2rem', 
                fontWeight: '900',
                margin: 0,
                backgroundImage: 'linear-gradient(90deg, #009246 0%, #8a5a40 50%, #CE2B37 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: 'transparent',
                display: 'inline-block',
                letterSpacing: '-0.03em'
              }}>
                {section.category}
              </h2>
            </div>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
              gap: '1.5rem' 
            }}>
              {section.items.map((tool, toolIdx) => {
                const palettes = [
                  { bg: '#23252b', text: '#ffffff', subtext: '#a0a3b1', iconBg: '#34363f', pillBg: '#34363f', iconColor: '#ffffff' },
                  { bg: '#b4beff', text: '#1a1a1a', subtext: '#4a4d66', iconBg: '#ffffff', pillBg: '#ffffff', iconColor: '#4a4d66' },
                  { bg: '#f5e4d1', text: '#1a1a1a', subtext: '#66594d', iconBg: '#ffffff', pillBg: '#ffffff', iconColor: '#66594d' },
                  { bg: '#e0f2f1', text: '#1a1a1a', subtext: '#4d6664', iconBg: '#ffffff', pillBg: '#ffffff', iconColor: '#009246' },
                ];
                const theme = palettes[toolIdx % palettes.length];

                return (
                <div 
                  key={tool.id} 
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    height: '100%', 
                    padding: '2.5rem',
                    backgroundColor: theme.bg,
                    color: theme.text,
                    transition: 'transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)',
                    cursor: 'pointer',
                    borderRadius: '36px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.03)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  onClick={() => navigate(tool.path)}
                >
                  {/* Top row: Icon and pill badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
                    <div style={{ 
                      padding: '1.2rem', 
                      backgroundColor: theme.iconBg, 
                      borderRadius: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                    }}>
                      {React.cloneElement(tool.icon, { color: theme.iconColor, size: 28 })}
                    </div>
                    <div style={{
                      padding: '0.5rem 1.2rem',
                      backgroundColor: theme.pillBg,
                      borderRadius: '20px',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      color: theme.text,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                    }}>
                      <span>Try Now</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 style={{ fontSize: '1.8rem', fontWeight: '800', margin: '0 0 1rem 0', lineHeight: '1.2', letterSpacing: '-0.02em' }}>
                    {tool.name}
                  </h3>

                  {/* Description */}
                  <p style={{ color: theme.subtext, fontSize: '1.1rem', margin: 0, lineHeight: '1.5', fontWeight: '500' }}>
                    {tool.description}
                  </p>
                  
                  <div style={{ flexGrow: 1 }} />
                </div>
              )})}
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default FreeTools;
