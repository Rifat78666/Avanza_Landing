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
          name: 'Grade Converter',
          description: 'Convert foreign grades to Italian 30/30 & US 4.0.',
          icon: <Calculator size={24} color="#009246" />,
          path: '/tools/grade-converter'
        },
        {
          id: 'ects-calculator',
          name: 'ECTS Calculator',
          description: 'Convert international credits to European ECTS.',
          icon: <BookOpen size={24} color="#CE2B37" />,
          path: '/tools/ects-calculator'
        },
        {
          id: 'us-credits',
          name: 'U.S. Credits Calculator',
          description: 'Convert foreign credits to U.S. Semester Hours.',
          icon: <Calculator size={24} color="#009246" />,
          path: '/tools/us-credits'
        },
        {
          id: 'ksa-credits',
          name: 'KSA Credits Calculator',
          description: 'Convert credits to Saudi Arabian standards.',
          icon: <Globe size={24} color="#CE2B37" />,
          path: '/tools/ksa-credits'
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
          icon: <GraduationCap size={24} color="#009246" />,
          path: '/tools/degree-checker'
        },
        {
          id: 'albo-check',
          name: 'Albo Check',
          description: 'Check if your profession is regulated in Italy.',
          icon: <ShieldCheck size={24} color="#CE2B37" />,
          path: '/tools/albo-check'
        },
        {
          id: 'university-requirements',
          name: 'University Requirements',
          description: 'Find entry requirements by country.',
          icon: <FileText size={24} color="#009246" />,
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
          icon: <Briefcase size={24} color="#009246" />,
          path: '/tools/work-permit'
        },
        {
          id: 'decreto-flussi',
          name: 'Decreto Flussi Checker',
          description: 'Check eligibility for Italian immigration quotas.',
          icon: <PlaneTakeoff size={24} color="#CE2B37" />,
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
          icon: <Trophy size={24} color="#009246" />,
          path: '/tools/university-rankings'
        },
        {
          id: 'cip-codes',
          name: 'CIP Codes Search',
          description: 'Search Classification of Instructional Programs.',
          icon: <Settings size={24} color="#CE2B37" />,
          path: '/tools/cip-codes'
        }
      ]
    }
  ];

  return (
    <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Free Immigration & Recognition Tools</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          Explore our suite of tools designed to help you navigate credential evaluation, university admissions, and immigration pathways.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
        {tools.map((section, idx) => (
          <div key={idx}>
            <h2 style={{ fontSize: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
              {section.category}
            </h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
              gap: '1.5rem' 
            }}>
              {section.items.map((tool) => (
                <div 
                  key={tool.id} 
                  className="card" 
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    height: '100%', 
                    padding: '1.5rem',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.2)';
                    e.currentTarget.style.borderColor = idx % 2 === 0 ? 'rgba(0, 146, 70, 0.4)' : 'rgba(206, 43, 55, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                  }}
                  onClick={() => navigate(tool.path)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ 
                      padding: '0.75rem', 
                      backgroundColor: 'rgba(255,255,255,0.03)', 
                      borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.05)'
                    }}>
                      {tool.icon}
                    </div>
                    <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{tool.name}</h3>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', flexGrow: 1, marginBottom: '1.5rem', lineHeight: '1.5' }}>
                    {tool.description}
                  </p>
                  <button 
                    className="btn-outline" 
                    style={{ width: '100%', justifyContent: 'center' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(tool.path);
                    }}
                  >
                    Use Tool
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FreeTools;
