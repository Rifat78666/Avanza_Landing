import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, FileText, Download, CheckCircle } from 'lucide-react';

const CourseEvaluation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    student_name: '',
    email: '',
    degree_title: '',
    university: '',
    original_grade: '',
    target_country: 'Italy'
  });
  const [file, setFile] = useState(null);
  const [documentId, setDocumentId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiProcessing, setAiProcessing] = useState(false);
  const [aiSuccess, setAiSuccess] = useState(false);

  // Check for Stripe redirect
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    if (query.get('success') === 'true' && query.get('session_id')) {
      setAiProcessing(true);
      processAiEvaluation(query.get('session_id'));
    }
  }, [location.search]);

  const processAiEvaluation = async (sessionId) => {
    try {
      const response = await fetch(
        window.location.hostname === "localhost" 
          ? "http://localhost:8000/api/process-evaluation" 
          : "https://avanza-backend.onrender.com/api/process-evaluation",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionId })
        }
      );
      
      if (!response.ok) throw new Error("Failed to process evaluation");
      
      // Download PDF
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Avanza_Course_Evaluation.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      
      setAiProcessing(false);
      setAiSuccess(true);
    } catch (error) {
      console.error(error);
      alert("Error processing your transcript. Please contact support.");
      setAiProcessing(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleEvaluate = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please upload your transcript.");
      return;
    }
    
    setIsProcessing(true);
    try {
      const formPayload = new FormData();
      formPayload.append("file", file);
      formPayload.append("student_name", formData.student_name);
      formPayload.append("email", formData.email);
      formPayload.append("degree_title", formData.degree_title);
      formPayload.append("university", formData.university);
      formPayload.append("original_grade", formData.original_grade);
      formPayload.append("target_country", formData.target_country);

      const response = await fetch(
        window.location.hostname === "localhost" 
          ? "http://localhost:8000/api/upload-transcript" 
          : "https://avanza-backend.onrender.com/api/upload-transcript",
        {
          method: "POST",
          body: formPayload
        }
      );
      
      const data = await response.json();
      if (response.ok && data.document_id) {
        setDocumentId(data.document_id);
        setStep(2);
      } else {
        alert("Error uploading transcript.");
      }
    } catch (error) {
      console.error(error);
      alert("Network error.");
    } finally {
      setIsProcessing(false);
    }
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
        body: JSON.stringify({ document_id: documentId })
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
        borderBottom: '4px solid #009246'
      }}>
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 40, 20, 0.7)',
          zIndex: 1
        }}></div>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', fontWeight: 'bold' }}>Unlock your global potential.</h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>Comprehensive course-by-course evaluation verifying your academic achievements to the highest European standards.</p>
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
            <div style={{ background: 'rgba(0, 146, 70, 0.1)', padding: '1rem', borderRadius: '50%' }}>
              <FileText size={40} color="#009246" />
            </div>
          </div>
          <h2 className="s-grad" style={{ fontSize: '2.5rem', marginBottom: '1rem', paddingBottom: '0.2rem' }}>Course by Course Evaluation</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
            A complete course-by-course evaluation — verification, credit and grade conversion, framework mapping, and GPA — delivered as one official PDF report.
          </p>
        </div>

        <div className="card" style={{ padding: '2rem', borderTop: '4px solid #009246' }}>
          {aiProcessing ? (
            <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 2rem auto' }}>
                <div style={{ 
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                  border: '4px solid rgba(0, 146, 70, 0.2)', borderRadius: '50%', borderTopColor: '#009246',
                  animation: 'spin 1.5s linear infinite'
                }}></div>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                  <FileText size={40} color="#009246" />
                </div>
              </div>
              <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
              <h2 style={{ fontSize: '2rem', marginBottom: '1rem', background: 'linear-gradient(90deg, #009246, #00c653)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI is Reading Your Transcript...</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '500px', margin: '0 auto' }}>
                Our AI is currently analyzing your subjects, converting your credits, and mapping your grades to European standards. This takes about 10-20 seconds.
              </p>
            </div>
          ) : aiSuccess ? (
            <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <CheckCircle size={80} color="#009246" />
              </div>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Evaluation Complete!</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '2rem' }}>
                Your transcript has been successfully evaluated. The PDF report should download automatically. A copy has also been sent to your email.
              </p>
              <button 
                onClick={() => navigate('/tools')}
                style={{ background: '#009246', color: 'white', padding: '1rem 2rem', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Return to Tools
              </button>
            </div>
          ) : step === 1 ? (
            <form onSubmit={handleEvaluate} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', textAlign: 'center' }}>Enter Qualification Details</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g. rahul@example.com"
                    style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
                  />
                </div>
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

              <div style={{ border: '2px dashed var(--border-color)', padding: '2rem', borderRadius: '8px', textAlign: 'center', backgroundColor: 'var(--bg-color)' }}>
                <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 'bold', fontSize: '1.1rem' }}>Upload Transcript</label>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Upload your official transcript (PDF, JPG, or PNG) so our AI can evaluate your courses.</p>
                <input 
                  type="file" 
                  accept=".pdf,image/*"
                  onChange={handleFileChange}
                  required
                  style={{ display: 'block', margin: '0 auto' }}
                />
              </div>

              <div style={{ marginTop: '1rem' }}>
                <button 
                  type="submit" 
                  disabled={isProcessing}
                  style={{ 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', 
                    width: '100%', padding: '1.2rem', background: '#009246', color: 'white', 
                    border: 'none', borderRadius: '8px', fontSize: '1.2rem', fontWeight: 'bold', 
                    cursor: isProcessing ? 'not-allowed' : 'pointer', opacity: isProcessing ? 0.7 : 1
                  }}
                >
                  {isProcessing ? 'Uploading...' : 'Evaluate'}
                </button>
              </div>
            </form>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                <div style={{ background: 'rgba(0, 146, 70, 0.1)', padding: '1rem', borderRadius: '50%' }}>
                  <FileText size={50} color="#009246" />
                </div>
              </div>
              <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Request Ready</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '2rem' }}>
                Your request for a course by course evaluation of <strong>{formData.degree_title}</strong> from <strong>{formData.university}</strong> to the standards of <strong>{formData.target_country}</strong> is ready.
              </p>
              
              <div style={{ background: 'var(--bg-color)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Evaluation Processing Fee</h3>
                <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#009246', marginBottom: '1rem' }}>€10</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'inline-flex', flexDirection: 'column', gap: '0.75rem', textAlign: 'left' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><CheckCircle size={18} color="#009246" /> Institution Verification</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><CheckCircle size={18} color="#009246" /> Qualification Framework Mapping</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><CheckCircle size={18} color="#009246" /> Grade Scale Conversion</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><CheckCircle size={18} color="#009246" /> Official PDF Report</li>
                </ul>
              </div>

              <button 
                onClick={handlePay}
                disabled={isProcessing}
                style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', 
                  width: '100%', padding: '1.2rem', background: '#009246', color: 'white', 
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
