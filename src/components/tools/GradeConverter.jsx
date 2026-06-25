import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Calculator, GraduationCap, MapPin, CheckCircle, Lock, Calendar, Mail, Euro, User, FileText } from 'lucide-react';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import uniData from '../../data/university_match_seed.json';

const GradeConverter = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [sourceCountry, setSourceCountry] = useState('');
  const [gradingSystem, setGradingSystem] = useState('');
  const [grade, setGrade] = useState('');
  const [targetCountry, setTargetCountry] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('unlocked') === 'true') {
      setIsUnlocked(true);
      const savedState = localStorage.getItem('gradeConverterState');
      if (savedState) {
        const parsed = JSON.parse(savedState);
        setSourceCountry(parsed.sourceCountry);
        setGradingSystem(parsed.gradingSystem);
        setGrade(parsed.grade);
        setTargetCountry(parsed.targetCountry);
        setUserName(parsed.userName || '');
        setUserEmail(parsed.userEmail || '');
      }
      setStep(6);
    }
  }, [location]);

  const gradingSystems = {
    'India': ['Percentage (0-100)', 'CGPA (10-pt)', 'CGPA (4-pt)'],
    'Bangladesh': ['Percentage (0-100)', 'GPA (5-pt)', 'CGPA (4-pt)'],
    'Pakistan': ['Percentage (0-100)', 'CGPA (4-pt)']
  };

  const targetCountries = ['Italy', 'Germany', 'Hungary', 'Netherlands', 'France', 'Spain'];

  const calculateEquivalent = () => {
    const g = parseFloat(grade);
    if (isNaN(g)) return null;

    let pct = g;
    if (gradingSystem.includes('10-pt')) pct = (g / 10) * 100;
    if (gradingSystem.includes('4-pt')) pct = (g / 4) * 100;
    if (gradingSystem.includes('5-pt')) pct = (g / 5) * 100;

    let italy = 0;
    if (gradingSystem.includes('10-pt')) italy = Math.round((g / 10) * 30);
    else if (gradingSystem.includes('5-pt')) italy = Math.round((g / 5) * 30);
    else if (gradingSystem.includes('4-pt')) {
      if (g < 2.0) italy = 17; // Below Italian threshold
      else italy = Math.round(18 + ((g - 2.0) / 2.0) * 12);
    }
    else {
      if (pct >= 95) italy = 30;
      else if (pct >= 60) italy = Math.round(18 + ((pct - 60) / 40) * 12);
      else italy = 17; // Insufficient
    }
    if (italy > 30) italy = 30;

    let german = 1 + 3 * ((100 - pct) / 50);
    if (german > 4.0) german = 5.0;
    if (german < 1.0) german = 1.0;

    let hungary = 1;
    if (pct >= 90) hungary = 5;
    else if (pct >= 75) hungary = 4;
    else if (pct >= 60) hungary = 3;
    else if (pct >= 50) hungary = 2;
    else hungary = 1;

    let netherlands = Math.max(1, Math.min(10, Math.round((pct / 100) * 10 * 10) / 10));
    let france = Math.max(0, Math.min(20, Math.round((pct / 100) * 20 * 10) / 10));
    let spain = Math.max(0, Math.min(10, Math.round((pct / 100) * 10 * 10) / 10));

    return { 
      Italy: `${italy}/30${italy === 30 ? ' (Con Lode eligible)' : ''}`, 
      Germany: german.toFixed(1), 
      Hungary: `${hungary}/5`, 
      Netherlands: `${netherlands}/10`, 
      France: `${france}/20`, 
      Spain: `${spain}/10`,
      numeric: { italy, germany: german, hungary, netherlands, france, spain }
    };
  };

  const equivalents = grade ? calculateEquivalent() : null;

  const matchedUnis = equivalents ? uniData.filter(u => {
    if (targetCountry === 'Italy') return u.min_italian_equivalent !== null && equivalents.numeric.italy >= u.min_italian_equivalent;
    if (targetCountry === 'Germany') return u.min_german_equivalent !== null && equivalents.numeric.germany <= u.min_german_equivalent;
    if (targetCountry === 'Hungary') return u.min_hungarian_equivalent !== null && equivalents.numeric.hungary >= u.min_hungarian_equivalent;
    if (targetCountry === 'Netherlands') return u.min_netherlands_equivalent !== null && equivalents.numeric.netherlands >= u.min_netherlands_equivalent;
    if (targetCountry === 'France') return u.min_french_equivalent !== null && equivalents.numeric.france >= u.min_french_equivalent;
    if (targetCountry === 'Spain') return u.min_spanish_equivalent !== null && equivalents.numeric.spain >= u.min_spanish_equivalent;
    return false;
  }) : [];

  const handleNext = () => {
    if (step === 1 && !sourceCountry) return;
    if (step === 2 && !gradingSystem) return;
    if (step === 3 && !grade) return;
    if (step === 4 && !targetCountry) return;
    
    if (step === 4) {
      setStep(5);
      return;
    }
    
    if (step === 5) {
      if (!userName || !userEmail) {
        alert("Please enter your Name and Email to proceed.");
        return;
      }
      setStep(6);
      return;
    }

    setStep(step + 1);
  };

  const handleLivePayment = async () => {
    setIsProcessing(true);
    
    // Persist state in localStorage so we can recover it after Stripe redirects back
    localStorage.setItem('gradeConverterState', JSON.stringify({
      sourceCountry, gradingSystem, grade, targetCountry, userName, userEmail
    }));
    
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://avanza-backend.onrender.com';
      const response = await fetch(`${API_BASE_URL}/api/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source_country: sourceCountry,
          grading_system: gradingSystem,
          grade: parseFloat(grade) || 0,
          target_country: targetCountry || "All Europe"
        })
      });
      const data = await response.json();
      if (response.ok && data.url) {
        window.location.href = data.url;
      } else {
        alert("Payment error: " + (data.detail || JSON.stringify(data) || "Could not generate checkout session."));
        console.error("Backend error:", data);
      }
    } catch (error) {
      console.error("Error redirecting to Stripe:", error);
      alert("Network error: Something went wrong contacting the server.");
    } finally {
      setIsProcessing(false);
    }
  };

  const generatePDF = async () => {
    try {
      const doc = new jsPDF();
      
      const darkGreen = [10, 67, 47]; // #0a432f
      const lightGreen = [242, 248, 242];
      const avanzaGreen = [0, 146, 70];
      const textColor = [25, 30, 40];
      const textMuted = [100, 100, 100];
      
      // HEADER (Full width dark green banner)
      doc.setFillColor(...darkGreen);
      doc.rect(0, 0, 210, 40, 'F');
      
      // Logo
      try {
        const img = new Image();
        img.src = '/favicon.png';
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });
        doc.addImage(img, 'PNG', 14, 10, 16, 16);
      } catch (e) {
        // Fallback if logo fails to load
        doc.setFillColor(...avanzaGreen);
        doc.roundedRect(14, 12, 12, 12, 2, 2, 'F');
        doc.setFillColor(255, 255, 255);
        doc.triangle(18, 15, 18, 21, 23, 18, 'F');
      }
      
      // Header Text
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "B");
      doc.setFontSize(22);
      doc.text("AVANZA", 34, 18);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.text("M O V E  F O R W A R D", 34, 23);
      
      doc.setFontSize(9);
      doc.text("O F F I C I A L  R E P O R T", 196, 20, { align: 'right' });
      doc.setFont("helvetica", "B");
      doc.setFontSize(14);
      doc.text("Grade Conversion & University Match", 196, 27, { align: 'right' });
      
      // TITLE SECTION
      doc.setTextColor(...textColor);
      doc.setFontSize(20);
      doc.text("Grade Conversion & University Match", 14, 55);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(...textMuted);
      doc.text(`Your home grade, translated to the ${targetCountry} system — with recognised universities you qualify for.`, 14, 62);
      
      doc.setFontSize(9);
      doc.text(`Report ID   AV-GC-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000 + 1000)}`, 14, 70);
      doc.text(`Generated   ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`, 65, 70);
      
      // CANDIDATE PROFILE SECTION
      doc.setFont("helvetica", "B");
      doc.setFontSize(10);
      doc.setTextColor(...avanzaGreen);
      doc.text("C A N D I D A T E   P R O F I L E", 14, 85);
      doc.setDrawColor(220, 220, 220);
      doc.line(75, 84, 196, 84);
      
      // Profile Box
      doc.setFillColor(252, 252, 252);
      doc.roundedRect(14, 90, 182, 45, 3, 3, 'FD');
      
      doc.setFontSize(8);
      doc.setTextColor(...textMuted);
      doc.text("N A M E", 20, 100);
      doc.text("E M A I L", 105, 100);
      doc.text("O R I G I N   C O U N T R Y", 20, 120);
      doc.text("T A R G E T   C O U N T R Y", 105, 120);
      
      doc.setFont("helvetica", "B");
      doc.setFontSize(12);
      doc.setTextColor(...textColor);
      doc.text(userName || "N/A", 20, 106);
      doc.text(userEmail || "N/A", 105, 106);
      doc.text(sourceCountry || "N/A", 20, 126);
      doc.text(targetCountry || "N/A", 105, 126);
      
      // GRADE CONVERSION SECTION
      doc.setFont("helvetica", "B");
      doc.setFontSize(10);
      doc.setTextColor(...avanzaGreen);
      doc.text("G R A D E   C O N V E R S I O N", 14, 150);
      doc.line(75, 149, 196, 149);
      
      // Left Box (Original)
      doc.setFillColor(248, 248, 248);
      doc.roundedRect(14, 155, 80, 55, 4, 4, 'FD');
      doc.setFontSize(8);
      doc.setTextColor(...textMuted);
      doc.text(`O R I G I N A L   G R A D E  ·  ${sourceCountry.toUpperCase()}`, 54, 165, { align: 'center' });
      doc.setFontSize(45);
      doc.setTextColor(...darkGreen);
      doc.text(`${grade}`, 54, 185, { align: 'center' });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(...textMuted);
      doc.text(`on a ${gradingSystem} scale`, 54, 195, { align: 'center' });
      
      // Arrow
      doc.setTextColor(...avanzaGreen);
      doc.setFontSize(20);
      doc.text("→", 105, 182, { align: 'center' });
      
      // Right Box (Target)
      doc.setFillColor(...darkGreen);
      doc.roundedRect(116, 155, 80, 55, 4, 4, 'F');
      doc.setFont("helvetica", "B");
      doc.setFontSize(8);
      doc.setTextColor(200, 241, 53); // Lime green
      doc.text(`${targetCountry.toUpperCase()} E Q U I V A L E N T`, 156, 165, { align: 'center' });
      doc.setFontSize(45);
      doc.setTextColor(255, 255, 255);
      const eqGradeStr = equivalents ? String(equivalents.numeric[targetCountry.toLowerCase()] || equivalents[targetCountry]) : '';
      doc.text(eqGradeStr, 156, 185, { align: 'center' });
      
      // Badge inside Right Box
      doc.setFillColor(...avanzaGreen);
      doc.roundedRect(131, 195, 50, 8, 4, 4, 'F');
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text("C O N V E R T E D   S U C C E S S", 156, 200, { align: 'center' });
      
      // UNIVERSITIES TABLE SECTION
      doc.setFont("helvetica", "B");
      doc.setFontSize(10);
      doc.setTextColor(...avanzaGreen);
      doc.text("U N I V E R S I T I E S   Y O U   Q U A L I F Y   F O R", 14, 225);
      doc.line(100, 224, 196, 224);
      
      // Table
      doc.setTextColor(0, 0, 0);
      autoTable(doc, {
        startY: 232,
        head: [['UNIVERSITY', 'QS WORLD RANK', 'CITY', 'LEVEL', 'TUITION']],
        body: matchedUnis.map(u => [u.name, u.qs_ranking || 'N/A', u.city, u.programme_level, u.tuition_range]),
        headStyles: { fillColor: darkGreen, textColor: 255, fontSize: 8, fontStyle: 'bold' },
        styles: { fontSize: 9, cellPadding: 4 },
        alternateRowStyles: { fillColor: [250, 250, 250] },
        didDrawCell: function(data) {
          // Add custom badge styling logic here if needed (e.g. green pill for FREE)
        }
      });
      
      let finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY : 240;
      
      // Ensure there is enough space for the massive founder block (need ~90 units)
      if (finalY > 190) {
        doc.addPage();
        finalY = 20;
      } else {
        finalY += 15;
      }
      
      // CALENDLY BLOCK / FOUNDER PROFILES
      doc.setFillColor(...darkGreen);
      doc.roundedRect(14, finalY, 182, 25, 3, 3, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "B");
      doc.setFontSize(14);
      doc.text("Your free 1:1 session with the founders", 105, finalY + 11, { align: 'center' });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(200, 200, 200);
      doc.text("Included with your report - book a time that suits you.", 105, finalY + 17, { align: 'center' });
      
      finalY += 35;
      
      // FOUNDER PROFILES
      try {
        const pallabImg = new Image();
        pallabImg.src = '/pallab.png';
        const rifatImg = new Image();
        rifatImg.src = '/rifat.png';
        const uniLogos = new Image();
        uniLogos.src = '/university_logos.png';
        
        await Promise.all([
          new Promise(r => { pallabImg.onload = r; pallabImg.onerror = r; }),
          new Promise(r => { rifatImg.onload = r; rifatImg.onerror = r; }),
          new Promise(r => { uniLogos.onload = r; uniLogos.onerror = r; })
        ]);
        
        // Pallab
        doc.addImage(pallabImg, 'PNG', 45, finalY, 25, 25);
        // Rifat
        doc.addImage(rifatImg, 'PNG', 140, finalY, 25, 25);
        
        finalY += 34;
        
        // Names
        doc.setFont("helvetica", "B");
        doc.setFontSize(11);
        doc.setTextColor(...textColor);
        doc.text("Pallab Mondal", 57.5, finalY, { align: 'center' });
        doc.text("Md Rifatul Haque", 152.5, finalY, { align: 'center' });
        
        finalY += 6;
        
        // Roles
        doc.setFont("helvetica", "B");
        doc.setFontSize(9);
        doc.setTextColor(...avanzaGreen);
        doc.text("CEO", 57.5, finalY, { align: 'center' });
        doc.setTextColor(200, 30, 30); // Red
        doc.text("CEO", 152.5, finalY, { align: 'center' });
        
        finalY += 6;
        
        // Degrees
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(...textMuted);
        doc.text("Master's in Artificial Intelligence for", 57.5, finalY, { align: 'center' });
        doc.text("Master's in Artificial Intelligence for", 152.5, finalY, { align: 'center' });
        finalY += 4;
        doc.text("Science and Technology", 57.5, finalY, { align: 'center' });
        doc.text("Science and Technology", 152.5, finalY, { align: 'center' });
        finalY += 4;
        doc.text("(Joint Programme)", 57.5, finalY, { align: 'center' });
        doc.text("(Joint Programme)", 152.5, finalY, { align: 'center' });
        
        finalY += 6;
        
        // Emails
        doc.text("pallabm472@gmail.com", 57.5, finalY, { align: 'center' });
        doc.text("rifatulhaque200@gmail.com", 152.5, finalY, { align: 'center' });
        
        finalY += 4;
        
        // Separate Calendly Links as Green Buttons
        doc.setFillColor(...avanzaGreen);
        
        // Pallab Box (Wider)
        doc.roundedRect(32.5, finalY, 50, 9, 2, 2, 'F');
        doc.link(32.5, finalY, 50, 9, { url: "https://calendly.com/pallabm472/30min" });
        
        // Rifat Box (Wider)
        doc.roundedRect(127.5, finalY, 50, 9, 2, 2, 'F');
        doc.link(127.5, finalY, 50, 9, { url: "https://calendly.com/rifatulhaque200/30min" });
        
        doc.setFont("helvetica", "B");
        doc.setFontSize(9);
        doc.setTextColor(255, 255, 255);
        
        doc.text("Book 1:1 with Pallab", 57.5, finalY + 6, { align: 'center' });
        doc.text("Book 1:1 with Rifat", 152.5, finalY + 6, { align: 'center' });
        
        finalY += 15;
        
        // Uni Logos - Centered
        // Width 120, centered at 105 => x = 45
        doc.addImage(uniLogos, 'PNG', 45, finalY, 120, 25);
        
      } catch (e) {
        console.error("Failed to load founder images", e);
      }
      
      // FOOTER ON EVERY PAGE
      const dateString = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(7);
        doc.setTextColor(...textMuted);
        doc.text("This is a preliminary, AI-assisted evaluation provided for guidance only. Equivalences are indicative and may vary.", 105, 285, { align: 'center' });
        
        doc.setFillColor(...darkGreen);
        doc.rect(0, 290, 210, 7, 'F');
        doc.setTextColor(255, 255, 255);
        doc.text("AVANZA  ·  Degree recognition, simplified", 14, 294);
        doc.text(`avanza.it.com  ·  Generated ${dateString}`, 196, 294, { align: 'right' });
      }

      doc.save(`Avanza_Match_Report_${userName ? userName.replace(/ /g, '_') : 'User'}.pdf`);
    } catch (err) {
      console.error("PDF generation error:", err);
      alert("Error generating PDF.");
    }
  };

  return (
    <>
      <div style={{
        width: '100%',
        position: 'relative',
        backgroundImage: 'url("https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1920&q=80")',
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
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', fontWeight: 'bold' }}>Your degree already counts.</h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>We just make Europe see it — your academic record converted to European standards, so institutions understand you from day one.</p>
        </div>
      </div>

      <div id="calculator-start" className="container" style={{ maxWidth: '900px', margin: '0 auto', paddingTop: '2rem', paddingBottom: '4rem' }}>
        <button 
          onClick={() => navigate('/tools')} 
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: '1.5rem', fontWeight: 'bold' }}
        >
          <ArrowLeft size={18} /> Back to Tools
        </button>

        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <div style={{ background: 'rgba(0, 146, 70, 0.1)', padding: '1rem', borderRadius: '50%' }}>
              <Calculator size={40} color="#009246" />
            </div>
          </div>
          <h2 className="s-grad" style={{ fontSize: '2.5rem', marginBottom: '1rem', paddingBottom: '0.2rem' }}>Grade Converter & University Match</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
            Convert your grades to European standards and instantly see which universities you qualify for.
          </p>
        </div>

      {step < 5 && (
        <div className="card" style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', borderTop: '4px solid #CE2B37' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <span style={{ color: step >= 1 ? '#009246' : 'var(--text-secondary)', fontWeight: step === 1 ? 'bold' : 'normal' }}>1. Origin</span>
            <span style={{ color: step >= 2 ? '#009246' : 'var(--text-secondary)', fontWeight: step === 2 ? 'bold' : 'normal' }}>2. System</span>
            <span style={{ color: step >= 3 ? '#009246' : 'var(--text-secondary)', fontWeight: step === 3 ? 'bold' : 'normal' }}>3. Grade</span>
            <span style={{ color: step >= 4 ? '#009246' : 'var(--text-secondary)', fontWeight: step === 4 ? 'bold' : 'normal' }}>4. Target</span>
          </div>

          {step === 1 && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <h3 style={{ marginBottom: '1rem' }}>Where did you study?</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {['India', 'Bangladesh', 'Pakistan'].map(c => (
                  <button 
                    key={c}
                    onClick={() => { setSourceCountry(c); setGradingSystem(''); }}
                    className="input-field"
                    style={{ textAlign: 'left', padding: '1rem', border: sourceCountry === c ? '2px solid #009246' : '1px solid var(--border-color)', background: sourceCountry === c ? 'rgba(0, 146, 70, 0.05)' : 'transparent', cursor: 'pointer', fontSize: '1.1rem', borderRadius: '8px' }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <h3 style={{ marginBottom: '1rem' }}>What was your grading system in {sourceCountry}?</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {gradingSystems[sourceCountry].map(sys => (
                  <button 
                    key={sys}
                    onClick={() => setGradingSystem(sys)}
                    className="input-field"
                    style={{ textAlign: 'left', padding: '1rem', border: gradingSystem === sys ? '2px solid #009246' : '1px solid var(--border-color)', background: gradingSystem === sys ? 'rgba(0, 146, 70, 0.05)' : 'transparent', cursor: 'pointer', fontSize: '1.1rem', borderRadius: '8px' }}
                  >
                    {sys}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <h3 style={{ marginBottom: '1rem' }}>Enter your {gradingSystem} score</h3>
              <input 
                type="number" 
                value={grade} 
                onChange={(e) => setGrade(e.target.value)} 
                className="input-field"
                placeholder="e.g. 85.5 or 3.8"
                style={{ width: '100%', padding: '1rem', fontSize: '1.2rem', marginBottom: '1rem' }}
              />
            </div>
          )}

          {step === 4 && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <h3 style={{ marginBottom: '1rem' }}>Which country do you want to study in?</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {targetCountries.map(tc => (
                  <button 
                    key={tc}
                    onClick={() => setTargetCountry(tc)}
                    className="input-field"
                    style={{ textAlign: 'left', padding: '1rem', border: targetCountry === tc ? '2px solid #009246' : '1px solid var(--border-color)', background: targetCountry === tc ? 'rgba(0, 146, 70, 0.05)' : 'transparent', cursor: 'pointer', fontSize: '1.1rem', borderRadius: '8px' }}
                  >
                    {tc}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
            <button 
              onClick={() => setStep(step - 1)} 
              style={{ padding: '0.75rem 1.5rem', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', borderRadius: '8px', cursor: 'pointer', visibility: step === 1 ? 'hidden' : 'visible' }}
            >
              Back
            </button>
            <button 
              onClick={handleNext}
              style={{ padding: '0.75rem 1.5rem', background: '#009246', border: 'none', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              {step === 4 ? 'Calculate & Match' : 'Next'}
            </button>
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="card" style={{ padding: '3rem 2rem', maxWidth: '600px', margin: '0 auto', borderTop: '4px solid #CE2B37', textAlign: 'center', animation: 'fadeIn 0.5s ease' }}>
          <div style={{ background: 'rgba(206, 43, 55, 0.1)', padding: '1.5rem', borderRadius: '50%', display: 'inline-block', marginBottom: '1.5rem' }}>
            <User size={40} color="#CE2B37" />
          </div>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Your matches are ready.</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.1rem' }}>
            We've mapped your {gradingSystem} grade to {targetCountry} standards and found your eligible universities. Enter your details to link your results to your profile.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left', marginBottom: '2rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Full Name</label>
              <input 
                type="text" 
                value={userName} 
                onChange={(e) => setUserName(e.target.value)} 
                className="input-field"
                placeholder="e.g. John Doe"
                style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Email Address</label>
              <input 
                type="email" 
                value={userEmail} 
                onChange={(e) => setUserEmail(e.target.value)} 
                className="input-field"
                placeholder="e.g. john@example.com"
                style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
              />
            </div>
          </div>
          
          <button 
            onClick={handleNext}
            style={{ width: '100%', padding: '1.2rem', background: '#009246', border: 'none', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.2rem' }}
          >
            Process My Results
          </button>
        </div>
      )}

      {step === 6 && equivalents && (
        <div style={{ animation: 'fadeIn 0.5s ease', position: 'relative' }}>
          
          {isUnlocked && (
            <div className="card" style={{ padding: '2rem', marginBottom: '2rem', borderTop: '4px solid #009246', textAlign: 'center', animation: 'fadeIn 0.5s ease' }}>
              <h2 style={{ marginBottom: '1rem' }}>Your {targetCountry} Grade Equivalent</h2>
              <div style={{ fontSize: '3.5rem', fontWeight: '900', color: '#009246', marginBottom: '0.5rem' }}>
                {equivalents[targetCountry]}
              </div>
              <p style={{ color: 'var(--text-secondary)' }}>Converted from your {gradingSystem} score of {grade} in {sourceCountry}.</p>
            </div>
          )}

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem', marginBottom: '1rem', opacity: isUnlocked ? 1 : 0.4 }}>
              <GraduationCap size={24} color="#CE2B37" />
              University Matches
            </h3>
            
            {isUnlocked ? (
              <>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                  Based on your equivalent grade, you qualify for admission at <strong>{matchedUnis.length}</strong> universities in {targetCountry}.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {matchedUnis.map((uni, idx) => (
                    <div key={idx} className="card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{uni.name}</h4>
                        <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                          <span style={{ display: 'inline-block', background: '#f0f0f0', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 'bold' }}>QS: {uni.qs_ranking || 'N/A'}</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}><MapPin size={14}/> {uni.city}</span>
                          <span>Level: {uni.programme_level}</span>
                          <span>Tuition: {uni.tuition_range}</span>
                        </div>
                      </div>
                      <CheckCircle size={24} color="#009246" />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="card" style={{ padding: '1.5rem', filter: 'blur(5px)', opacity: 0.3 }}>
                  <h4 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>University of Milan (Example)</h4>
                  <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <span>Level: Master</span>
                  </div>
                </div>
                <div className="card" style={{ padding: '1.5rem', filter: 'blur(5px)', opacity: 0.1 }}>
                  <h4 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>Politecnico di Torino (Example)</h4>
                  <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <span>Level: Both</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {!isUnlocked && (
            <div style={{ position: 'absolute', top: '0', bottom: '0', left: '0', right: '0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
              <div style={{ background: 'var(--surface-color)', padding: '2rem', borderRadius: '12px', border: '2px solid #CE2B37', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0, 0.4)', maxWidth: '500px', width: '90%' }}>
                <Lock size={40} color="#CE2B37" style={{ marginBottom: '1rem' }} />
                <h3 style={{ marginBottom: '1rem', fontSize: '1.8rem' }}>Unlock Your Full Report</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '1.1rem', lineHeight: '1.5' }}>
                  Pay €4.99 to instantly unlock your exact {targetCountry} grade equivalent, your full list of eligible universities, your personalized PDF report, and a 1:1 consultation.
                </p>
                <button 
                  onClick={handleLivePayment}
                  disabled={isProcessing}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '1.2rem', background: isProcessing ? '#888' : '#009246', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.2rem', fontWeight: 'bold', cursor: isProcessing ? 'not-allowed' : 'pointer', transition: 'transform 0.1s ease' }}
                  onMouseEnter={(e) => { if(!isProcessing) e.currentTarget.style.transform = 'scale(1.02)' }}
                  onMouseLeave={(e) => { if(!isProcessing) e.currentTarget.style.transform = 'scale(1)' }}
                >
                  <Euro size={22} /> {isProcessing ? 'Redirecting to checkout...' : 'Pay €4.99 to Unlock'}
                </button>
                {isProcessing && (
                  <p style={{ marginTop: '1rem', color: '#009246', fontWeight: 'bold', fontSize: '0.95rem', animation: 'fadeIn 0.5s ease' }}>
                    Please wait while we prepare your secure checkout. Do not refresh or go back. You will be redirected automatically.
                  </p>
                )}
              </div>
            </div>
          )}


          {isUnlocked && (
            <div style={{ marginTop: '4rem', animation: 'fadeIn 0.5s ease', borderTop: '1px solid var(--border-color)', paddingTop: '3rem' }}>
              <div style={{ textAlign: 'center', marginBottom: '3rem', background: 'rgba(0, 146, 70, 0.05)', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(0, 146, 70, 0.2)' }}>
                <FileText size={48} color="#009246" style={{ marginBottom: '1rem' }} />
                <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Download Official Report</h2>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 2rem auto', fontSize: '1.1rem' }}>
                  Keep a permanent record of your grade conversion and eligible universities. This PDF report is ready for download.
                </p>
                <button 
                  onClick={generatePDF}
                  style={{ padding: '1rem 2rem', background: '#009246', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', transition: 'transform 0.1s' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <Download size={20}/> Download PDF Report
                </button>
              </div>

              <div style={{ textAlign: 'center', marginBottom: '2rem', marginTop: '4rem' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Talk to an Expert</h2>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
                  Our founders have navigated this exact process themselves. Book your included 1:1 consultation with them today.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                <div className="card" style={{ padding: '2rem', textAlign: 'center', borderTop: '4px solid #009246' }}>
                  <img src="/pallab.png" alt="Pallab Mondal" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 1rem auto', display: 'block', border: '3px solid #009246' }} />
                  <h3 style={{ marginBottom: '0.5rem' }}>Pallab Mondal</h3>
                  <p style={{ color: '#009246', fontWeight: 'bold', marginBottom: '0.5rem' }}>Co-founder, Country Manager</p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem', lineHeight: '1.4' }}>
                    Master's in Artificial Intelligence for Science and Technology (Joint Programme)<br />
                    University of Milan || University of Milano-Bicocca || University of Pavia
                  </p>
                  <a href="mailto:pallabm472@gmail.com" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}><Mail size={16}/> pallabm472@gmail.com</a>
                  <div style={{ marginTop: '1.5rem', marginBottom: '0.5rem', display: 'flex', justifyContent: 'center' }}>
                    <img src="/avanza_university_strip_white.png" alt="University of Milan, Bicocca, Pavia" style={{ width: '100%', maxWidth: '350px', height: 'auto', objectFit: 'contain', mixBlendMode: 'multiply' }} onError={(e) => e.target.style.display = 'none'} />
                  </div>
                </div>

                <div className="card" style={{ padding: '2rem', textAlign: 'center', borderTop: '4px solid #CE2B37' }}>
                  <img src="/rifat.png" alt="Md Rifatul Haque" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 1rem auto', display: 'block', border: '3px solid #CE2B37' }} />
                  <h3 style={{ marginBottom: '0.5rem' }}>Md Rifatul Haque</h3>
                  <p style={{ color: '#CE2B37', fontWeight: 'bold', marginBottom: '0.5rem' }}>Co-founder, System & AI</p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem', lineHeight: '1.4' }}>
                    Master's in Artificial Intelligence for Science and Technology (Joint Programme)<br />
                    University of Milan || University of Milano-Bicocca || University of Pavia
                  </p>
                  <a href="mailto:rifatulhaque200@gmail.com" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}><Mail size={16}/> rifatulhaque200@gmail.com</a>
                  <div style={{ marginTop: '1.5rem', marginBottom: '0.5rem', display: 'flex', justifyContent: 'center' }}>
                    <img src="/avanza_university_strip_white.png" alt="University of Milan, Bicocca, Pavia" style={{ width: '100%', maxWidth: '350px', height: 'auto', objectFit: 'contain', mixBlendMode: 'multiply' }} onError={(e) => e.target.style.display = 'none'} />
                  </div>
                </div>
              </div>

              <div className="card" style={{ padding: '3rem', textAlign: 'center', background: 'rgba(0, 146, 70, 0.05)', border: '1px solid rgba(0, 146, 70, 0.2)' }}>
                <Calendar size={48} color="#009246" style={{ margin: '0 auto 1rem auto' }} />
                <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Book a 30-min 1:1 Session</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem auto' }}>
                  Get personalized guidance on your university applications and visa process — €0 extra, included with your report unlock.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button 
                    onClick={() => window.open('https://calendly.com/pallabm472/30min', '_blank')}
                    style={{ padding: '1rem 2rem', background: '#009246', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', transition: 'transform 0.1s' }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <Calendar size={20} /> Book with Pallab
                  </button>
                  <button 
                    onClick={() => window.open('https://calendly.com/rifatulhaque200/30min', '_blank')}
                    style={{ padding: '1rem 2rem', background: '#CE2B37', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', transition: 'transform 0.1s' }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <Calendar size={20} /> Book with Rifat
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}
      </div>
    </>
  );
};

export default GradeConverter;
