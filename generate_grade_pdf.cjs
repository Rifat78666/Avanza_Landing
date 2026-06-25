const { jsPDF } = require("jspdf");
require("jspdf-autotable");
const fs = require('fs');

const doc = new jsPDF();
const userName = "John Doe";
const userEmail = "john@example.com";
const sourceCountry = "Italy";
const grade = "28";
const gradingSystem = "0-30 Scale";
const targetCountry = "Germany";
const equivalentGrade = "1.5";

const matchedUnis = [
  { name: "Technical University of Munich", city: "Munich", programme_level: "Master", tuition_range: "Free" },
  { name: "LMU Munich", city: "Munich", programme_level: "Bachelor", tuition_range: "Free" },
  { name: "RWTH Aachen", city: "Aachen", programme_level: "Both", tuition_range: "Free" }
];

// Header
doc.setFillColor(0, 146, 70);
doc.rect(0, 0, 210, 40, 'F');
doc.setTextColor(255, 255, 255);
doc.setFontSize(24);
doc.text("AVANZA", 105, 20, { align: 'center' });
doc.setFontSize(14);
doc.text("Official Grade Conversion & University Match Report", 105, 30, { align: 'center' });

// Candidate Profile
doc.setTextColor(0, 0, 0);
doc.setFontSize(12);
doc.text("Candidate Profile", 14, 55);
doc.setFontSize(10);
doc.text(`Name: ${userName}`, 14, 65);
doc.text(`Email: ${userEmail}`, 14, 72);
doc.text(`Origin Country: ${sourceCountry}`, 14, 79);
doc.text(`Original Grade: ${grade} (${gradingSystem})`, 14, 86);
doc.text(`Target Country: ${targetCountry}`, 14, 93);

// Results Highlight
doc.setFillColor(240, 248, 240);
doc.rect(120, 50, 75, 45, 'F');
doc.setDrawColor(0, 146, 70);
doc.setLineWidth(0.5);
doc.rect(120, 50, 75, 45, 'S');

doc.setFontSize(11);
doc.text(`${targetCountry} Equivalent Grade:`, 157, 65, { align: 'center' });
doc.setFontSize(22);
doc.setTextColor(0, 146, 70);
doc.text(equivalentGrade, 157, 80, { align: 'center' });

// Table
doc.setTextColor(0, 0, 0);
doc.autoTable({
  startY: 110,
  head: [['University Name', 'City', 'Level', 'Tuition']],
  body: matchedUnis.map(u => [u.name, u.city, u.programme_level, u.tuition_range]),
  headStyles: { fillColor: [206, 43, 55] },
  styles: { fontSize: 10 }
});

// Footer
const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY : 160;
doc.setFontSize(10);
doc.text("Your report includes a free 1:1 consultation with the Avanza Founders.", 105, finalY + 20, { align: 'center' });
doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, finalY + 26, { align: 'center' });

const pdfBytes = doc.output('arraybuffer');
fs.writeFileSync('C:\\Users\\rifat\\.gemini\\antigravity-ide\\brain\\250e62fd-5827-4f04-a08c-21d7cbaca58f\\Grade_Conversion_Sample.pdf', Buffer.from(pdfBytes));
console.log("Grade Conversion PDF Generated");
