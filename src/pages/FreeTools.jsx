import React, { useState } from 'react';
import GradeConverter from '../components/tools/GradeConverter';
import AlboCheck from '../components/tools/AlboCheck';
import ECTSCalculator from '../components/tools/ECTSCalculator';
import DegreeLevelChecker from '../components/tools/DegreeLevelChecker';
import { Wrench, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FreeTools = () => {
  const [activeTab, setActiveTab] = useState('grade');
  const navigate = useNavigate();

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '800px', margin: '0 auto', minHeight: '80vh' }}>
      {/* Optional SEO Helmet tags, assuming react-helmet is or will be added. 
          If not, these can be safely ignored or removed later. */}
      {/* <Helmet>
        <title>Free Tools for Immigrants in Italy | AVANZA</title>
        <meta name="description" content="Calculate your Italian grade equivalent and find out which Albo (Professional Order) you need to join in Italy for free." />
      </Helmet> */}

      <button 
        onClick={() => navigate('/')} 
        style={{ 
          display: 'flex', alignItems: 'center', gap: '0.5rem', 
          background: 'transparent', border: 'none', color: 'var(--text-secondary)', 
          cursor: 'pointer', marginBottom: '1.5rem', padding: 0 
        }}
      >
        <ArrowLeft size={18} /> Back to Home
      </button>

      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
          <Wrench color="var(--accent-color)" size={36} />
          Free Tools
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          Instantly evaluate your foreign credentials and find the right professional pathway in Italy. No signup required.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        <button 
          onClick={() => setActiveTab('grade')}
          style={{ 
            padding: '0.75rem 1.5rem', 
            background: 'transparent', 
            border: 'none', 
            borderBottom: activeTab === 'grade' ? '3px solid var(--accent-color)' : '3px solid transparent',
            color: activeTab === 'grade' ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'grade' ? 'bold' : 'normal',
            cursor: 'pointer',
            fontSize: '1.05rem',
            whiteSpace: 'nowrap'
          }}
        >
          Grade Converter
        </button>
        <button 
          onClick={() => setActiveTab('ects')}
          style={{ 
            padding: '0.75rem 1.5rem', 
            background: 'transparent', 
            border: 'none', 
            borderBottom: activeTab === 'ects' ? '3px solid var(--accent-color)' : '3px solid transparent',
            color: activeTab === 'ects' ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'ects' ? 'bold' : 'normal',
            cursor: 'pointer',
            fontSize: '1.05rem',
            whiteSpace: 'nowrap'
          }}
        >
          ECTS Calculator
        </button>
        <button 
          onClick={() => setActiveTab('degree')}
          style={{ 
            padding: '0.75rem 1.5rem', 
            background: 'transparent', 
            border: 'none', 
            borderBottom: activeTab === 'degree' ? '3px solid var(--accent-color)' : '3px solid transparent',
            color: activeTab === 'degree' ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'degree' ? 'bold' : 'normal',
            cursor: 'pointer',
            fontSize: '1.05rem',
            whiteSpace: 'nowrap'
          }}
        >
          Degree Equivalency
        </button>
        <button 
          onClick={() => setActiveTab('albo')}
          style={{ 
            padding: '0.75rem 1.5rem', 
            background: 'transparent', 
            border: 'none', 
            borderBottom: activeTab === 'albo' ? '3px solid var(--accent-color)' : '3px solid transparent',
            color: activeTab === 'albo' ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'albo' ? 'bold' : 'normal',
            cursor: 'pointer',
            fontSize: '1.05rem',
            whiteSpace: 'nowrap'
          }}
        >
          Albo (Order) Check
        </button>
      </div>

      <div className="tab-content" style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
        {activeTab === 'grade' && <GradeConverter />}
        {activeTab === 'ects' && <ECTSCalculator />}
        {activeTab === 'degree' && <DegreeLevelChecker />}
        {activeTab === 'albo' && <AlboCheck />}
      </div>

    </div>
  );
};

export default FreeTools;
