import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Download, CheckCircle } from 'lucide-react';

const CourseEvaluation = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    student_name: '',
    degree_title: '',
    university: '',
    original_grade: '',
    target_country: 'Italy'
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePay = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch(
        window.location.hostname === "localhost" 
          ? "http://localhost:8000/api/create-evaluation-checkout" 
          : "https://avanza-backend.onrender.com/api/create-evaluation-checkout", 
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.ok && data.url) {
        window.location.href = data.url;
      } else {
        alert("Payment error. Could not generate checkout session.");
      }
    } catch (error) {
      console.error(error);
      alert("Network error: Something went wrong contacting the server.");
    } finally {
      setIsProcessing(false);
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
        borderBottom: '4px solid #0052FF'
      }}>
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(135deg, rgba(0, 82, 255, 0.4) 0%, rgba(0, 30, 100, 0.6) 100%)',
          zIndex: 1
        }}></div>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', fontWeight: 'bold' }}>Course by Course Evaluation</h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>Detailed course by course evaluation and European framework mapping for your academic qualifications.</p>
        </div>
      </div>
      
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '2rem', paddingBottom: '4rem' }}>
        <button 
          onClick={() => navigate('/tools')} 
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: '1.5rem', fontWeight: 'bold' }}
        >
          <ArrowLeft size={18} /> Back to Tools
        </button>

        <div className="card" style={{ padding: '2rem', borderTop: '4px solid #0052FF' }}>
          {step === 1 ? (
            <form onSubmit={handleNext} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', textAlign: 'center' }}>Enter Qualification Details</h2>
              
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
                    <option value="Netherlands">Netherlands</option>
                    <option value="France">France</option>
                    <option value="Spain">Spain</option>
                  </select>
                </div>
              </div>

              <div style={{ marginTop: '1rem' }}>
                <button 
                  type="submit" 
                  style={{ 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', 
                    width: '100%', padding: '1.2rem', background: '#0052FF', color: 'white', 
                    border: 'none', borderRadius: '8px', fontSize: '1.2rem', fontWeight: 'bold', 
                    cursor: 'pointer' 
                  }}
                >
                  Proceed to Evaluation
                </button>
              </div>
            </form>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                <div style={{ background: 'rgba(0, 82, 255, 0.1)', padding: '1rem', borderRadius: '50%' }}>
                  <FileText size={50} color="#0052FF" />
                </div>
              </div>
              <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Request Ready</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '2rem' }}>
                Your request for a course by course evaluation of <strong>{formData.degree_title}</strong> from <strong>{formData.university}</strong> to the standards of <strong>{formData.target_country}</strong> is ready.
              </p>
              
              <div style={{ background: 'var(--bg-color)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Evaluation Processing Fee</h3>
                <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#0052FF', marginBottom: '1rem' }}>€10</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'inline-flex', flexDirection: 'column', gap: '0.75rem', textAlign: 'left' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><CheckCircle size={18} color="#0052FF" /> Institution Verification</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><CheckCircle size={18} color="#0052FF" /> Qualification Framework Mapping</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><CheckCircle size={18} color="#0052FF" /> Grade Scale Conversion</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><CheckCircle size={18} color="#0052FF" /> Official PDF Report</li>
                </ul>
              </div>

              <button 
                onClick={handlePay}
                disabled={isProcessing}
                style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', 
                  width: '100%', padding: '1.2rem', background: '#0052FF', color: 'white', 
                  border: 'none', borderRadius: '8px', fontSize: '1.2rem', fontWeight: 'bold', 
                  cursor: isProcessing ? 'not-allowed' : 'pointer', opacity: isProcessing ? 0.7 : 1 
                }}
              >
                {isProcessing ? 'Redirecting to checkout...' : 'Pay €10 via Stripe'}
              </button>
              
              <button 
                onClick={() => setStep(1)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', marginTop: '1rem', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Go back to edit details
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CourseEvaluation;
