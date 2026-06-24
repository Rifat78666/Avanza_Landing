import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Download, CheckCircle } from 'lucide-react';

const CredentialReport = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    student_name: '',
    degree_title: '',
    university: '',
    original_grade: '',
    target_country: 'Italy',
    converted_grade: '24/30' // Mocked conversion for the PDF test
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    setSuccess(false);
    
    try {
      const response = await fetch('http://localhost:8000/api/generate-credential-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to generate report');

      // Trigger file download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Avanza_Report_${formData.student_name.replace(' ', '_') || 'Student'}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      
      setSuccess(true);
    } catch (error) {
      console.error(error);
      alert('Error generating PDF. Is the Python backend running on localhost:8000?');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
        <>
      <div style={{
        width: '100%',
        position: 'relative',
        backgroundImage: 'url("https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&w=1920&q=80")',
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
          background: 'linear-gradient(135deg, rgba(169, 50, 38, 0.4) 0%, rgba(146, 43, 33, 0.4) 100%)',
          zIndex: 1
        }}></div>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: 'bold' }}>Official Credential Report</h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>Generate an official PDF translating your foreign academic credentials into European standards.</p>
        </div>
      </div>
<div className="container" style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '2rem', paddingBottom: '4rem' }}>
      <button 
        onClick={() => navigate('/tools')} 
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: '1.5rem', fontWeight: 'bold' }}
      >
        <ArrowLeft size={18} /> Back to Tools
      </button>

      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <div style={{ background: 'rgba(206, 43, 55, 0.1)', padding: '1rem', borderRadius: '50%' }}>
            <FileText size={40} color="#CE2B37" />
          </div>
        </div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Official Credential Report</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          Generate a downloadable, branded PDF that translates your foreign academic credentials into European standards.
        </p>
      </div>

      <div className="card" style={{ padding: '2rem', borderTop: '4px solid #CE2B37' }}>
        <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Full Name</label>
            <input 
              type="text" 
              name="student_name"
              required
              value={formData.student_name}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g. Rahul Sharma"
              style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Degree / Title</label>
            <input 
              type="text" 
              name="degree_title"
              required
              value={formData.degree_title}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g. B.Sc. in Computer Science"
              style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Institution (University / School)</label>
            <input 
              type="text" 
              name="university"
              required
              value={formData.university}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g. University of Mumbai"
              style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Original Grade</label>
              <input 
                type="text" 
                name="original_grade"
                required
                value={formData.original_grade}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g. 8.5 CGPA"
                style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Target Country</label>
              <select 
                name="target_country"
                value={formData.target_country}
                onChange={handleChange}
                className="input-field"
                style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', background: 'var(--bg-color)' }}
              >
                <option value="Italy">Italy</option>
                <option value="Germany">Germany</option>
                <option value="Hungary">Hungary</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <button 
              type="submit" 
              disabled={isGenerating}
              style={{ 
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', 
                width: '100%', padding: '1.2rem', background: '#CE2B37', color: 'white', 
                border: 'none', borderRadius: '8px', fontSize: '1.2rem', fontWeight: 'bold', 
                cursor: isGenerating ? 'not-allowed' : 'pointer', opacity: isGenerating ? 0.7 : 1 
              }}
            >
              {isGenerating ? 'Generating PDF...' : <><Download size={24} /> Generate & Download PDF Report</>}
            </button>
          </div>
          
          {success && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#009246', marginTop: '1rem', fontWeight: 'bold' }}>
              <CheckCircle size={20} /> Report successfully downloaded!
            </div>
          )}

        </form>
      </div>
    </div>
      </>
  );
};

export default CredentialReport;
