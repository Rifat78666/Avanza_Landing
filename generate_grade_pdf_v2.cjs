const { jsPDF } = require("jspdf");
require("jspdf-autotable");
const fs = require("fs");

function generateSample() {
  const doc = new jsPDF();
  
  const userName = "John Doe";
  const userEmail = "john@example.com";
  const sourceCountry = "Italy";
  const targetCountry = "Germany";
  const grade = "28";
  const gradingSystem = "0-30";
  
  const matchedUnis = [
    { name: "Technical University of Munich", qs_ranking: "#37", city: "Munich", programme_level: "Master", tuition_range: "Free" },
    { name: "LMU Munich", qs_ranking: "#59", city: "Munich", programme_level: "Bachelor", tuition_range: "Free" },
    { name: "RWTH Aachen", qs_ranking: "#106", city: "Aachen", programme_level: "Both", tuition_range: "Free" }
  ];

  const equivalents = { "germany": 1.5 };

  // --- START COPIED LOGIC FROM GradeConverter.jsx ---
  const darkGreen = [10, 67, 47]; // #0a432f
  const lightGreen = [242, 248, 242];
  const avanzaGreen = [0, 146, 70];
  const textColor = [25, 30, 40];
  const textMuted = [100, 100, 100];
  
  // HEADER (Full width dark green banner)
  doc.setFillColor(...darkGreen);
  doc.rect(0, 0, 210, 40, 'F');
  
  // Play icon (simple triangle)
  doc.setFillColor(...avanzaGreen);
  doc.roundedRect(14, 12, 12, 12, 2, 2, 'F');
  doc.setFillColor(255, 255, 255);
  doc.triangle(18, 15, 18, 21, 23, 18, 'F');
  
  // Header Text
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("AVANZA", 30, 20);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("M O V E\nF O R W A R D", 30, 25);
  
  doc.setFontSize(9);
  doc.text("O F F I C I A L  R E P O R T", 196, 20, { align: 'right' });
  doc.setFont("helvetica", "bold");
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
  doc.text(`Report ID   AV-GC-2026-1029`, 14, 70);
  doc.text(`Generated   25 June 2026`, 65, 70);
  
  // CANDIDATE PROFILE SECTION
  doc.setFont("helvetica", "bold");
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
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...textColor);
  doc.text(userName || "N/A", 20, 106);
  doc.text(userEmail || "N/A", 105, 106);
  doc.text(sourceCountry || "N/A", 20, 126);
  doc.text(targetCountry || "N/A", 105, 126);
  
  // GRADE CONVERSION SECTION
  doc.setFont("helvetica", "bold");
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
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(200, 241, 53); // Lime green
  doc.text(`${targetCountry.toUpperCase()} E Q U I V A L E N T`, 156, 165, { align: 'center' });
  doc.setFontSize(45);
  doc.setTextColor(255, 255, 255);
  const eqGradeStr = equivalents ? String(equivalents[targetCountry.toLowerCase()] || equivalents[targetCountry]) : '';
  doc.text(eqGradeStr, 156, 185, { align: 'center' });
  
  // Badge inside Right Box
  doc.setFillColor(...avanzaGreen);
  doc.roundedRect(131, 195, 50, 8, 4, 4, 'F');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text("S E H R   G U T   -   V E R Y   G O O D", 156, 200, { align: 'center' });
  
  // UNIVERSITIES TABLE SECTION
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...avanzaGreen);
  doc.text("U N I V E R S I T I E S   Y O U   Q U A L I F Y   F O R", 14, 225);
  doc.line(100, 224, 196, 224);
  
  // Table
  doc.setTextColor(0, 0, 0);
  doc.autoTable({
    startY: 232,
    head: [['UNIVERSITY', 'QS WORLD RANK', 'CITY', 'LEVEL', 'TUITION']],
    body: matchedUnis.map(u => [u.name, u.qs_ranking || 'N/A', u.city, u.programme_level, u.tuition_range]),
    headStyles: { fillColor: darkGreen, textColor: 255, fontSize: 8, fontStyle: 'bold' },
    styles: { fontSize: 9, cellPadding: 4 },
    alternateRowStyles: { fillColor: [250, 250, 250] },
    didDrawCell: function(data) {
    }
  });
  
  let finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY : 240;
  
  // Check if we need a new page for the footer block
  if (finalY > 240) {
    doc.addPage();
    finalY = 20;
  }
  
  // CALENDLY BLOCK
  finalY += 15;
  doc.setFillColor(...darkGreen);
  doc.roundedRect(14, finalY, 182, 35, 4, 4, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Your free 1:1 session with the founders", 20, finalY + 12);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(200, 200, 200);
  doc.text("Included with your report — book a time that suits you.", 20, finalY + 18);
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text("Pallab Mondal", 20, finalY + 26);
  doc.setFont("helvetica", "normal");
  doc.text("  ·  Co-founder, Country Manager", 45, finalY + 26);
  doc.setFont("helvetica", "bold");
  doc.text("Md Rifatul Haque", 20, finalY + 31);
  doc.setFont("helvetica", "normal");
  doc.text("  ·  Co-founder, System & AI", 48, finalY + 31);
  
  // Button inside block
  doc.setFillColor(...avanzaGreen);
  doc.roundedRect(130, finalY + 10, 60, 15, 3, 3, 'F');
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text("Book your session →", 160, finalY + 18, { align: 'center' });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("calendly.com/avanza", 160, finalY + 22, { align: 'center' });
  
  // FOOTER
  doc.setFontSize(7);
  doc.setTextColor(...textMuted);
  doc.text("This is a preliminary, AI-assisted evaluation provided for guidance only. Equivalences are indicative and may vary.", 105, 285, { align: 'center' });
  
  doc.setFillColor(...darkGreen);
  doc.rect(0, 290, 210, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.text("AVANZA  ·  Degree recognition, simplified", 14, 294);
  doc.text(`avanza.it.com  ·  Generated 25 June 2026`, 196, 294, { align: 'right' });
  
  const pdfBytes = doc.output('arraybuffer');
  fs.writeFileSync('C:\\Users\\rifat\\.gemini\\antigravity-ide\\brain\\250e62fd-5827-4f04-a08c-21d7cbaca58f\\New_Grade_Conversion.pdf', Buffer.from(pdfBytes));
}

generateSample();
