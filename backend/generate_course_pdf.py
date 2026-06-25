import os
from fpdf import FPDF

class CourseEvaluationPDF(FPDF):
    def header(self):
        self.set_fill_color(0, 146, 70)
        self.rect(0, 0, 210, 40, 'F')
        self.set_text_color(255, 255, 255)
        self.set_font("helvetica", "B", 24)
        self.cell(0, 15, "AVANZA", ln=True, align='C')
        self.set_font("helvetica", "", 14)
        self.cell(0, 10, "Official Course-by-Course Evaluation Report", ln=True, align='C')
        self.ln(15)

def generate_sample_pdf(output_path):
    pdf = CourseEvaluationPDF()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=15)
    
    # Candidate Info
    pdf.set_font("helvetica", "B", 14)
    pdf.set_text_color(15, 18, 25)
    pdf.cell(0, 10, "Candidate Information", ln=True)
    pdf.set_draw_color(200, 241, 53)
    pdf.set_line_width(0.8)
    pdf.line(10, 60, 60, 60)
    pdf.ln(5)
    
    pdf.set_font("helvetica", "", 11)
    pdf.cell(60, 8, "Name:", border=0)
    pdf.cell(0, 8, "Jane Smith", border=0, ln=True)
    pdf.cell(60, 8, "Institution:", border=0)
    pdf.cell(0, 8, "University of Dhaka (Bangladesh)", border=0, ln=True)
    pdf.cell(60, 8, "Target Country:", border=0)
    pdf.cell(0, 8, "Germany", border=0, ln=True)
    pdf.ln(10)
    
    # Course Mapping Table
    pdf.set_font("helvetica", "B", 14)
    pdf.cell(0, 10, "Detailed Course Evaluation", ln=True)
    pdf.line(10, 100, 60, 100)
    pdf.ln(5)
    
    pdf.set_fill_color(206, 43, 55)
    pdf.set_text_color(255, 255, 255)
    pdf.set_font("helvetica", "B", 10)
    pdf.cell(80, 10, "Original Course", border=1, fill=True)
    pdf.cell(30, 10, "Credits", border=1, fill=True)
    pdf.cell(40, 10, "German Equivalent", border=1, fill=True)
    pdf.cell(40, 10, "ECTS Equivalent", border=1, fill=True, ln=True)
    
    courses = [
        ("Data Structures", "3.0", "1.7", "6 ECTS"),
        ("Database Systems", "3.0", "1.3", "6 ECTS"),
        ("Software Engineering", "4.0", "2.0", "8 ECTS"),
        ("Computer Networks", "3.0", "1.5", "6 ECTS"),
        ("Machine Learning", "4.0", "1.0", "8 ECTS"),
        ("Operating Systems", "3.0", "2.3", "6 ECTS"),
    ]
    
    pdf.set_text_color(15, 18, 25)
    pdf.set_font("helvetica", "", 10)
    fill = False
    for course in courses:
        if fill:
            pdf.set_fill_color(245, 245, 245)
        pdf.cell(80, 10, course[0], border=1, fill=fill)
        pdf.cell(30, 10, course[1], border=1, fill=fill, align='C')
        pdf.cell(40, 10, course[2], border=1, fill=fill, align='C')
        pdf.cell(40, 10, course[3], border=1, fill=fill, align='C', ln=True)
        fill = not fill
        
    pdf.ln(15)
    pdf.set_font("helvetica", "I", 10)
    pdf.cell(0, 10, "This evaluation was processed by AVANZA AI Verification Engine.", ln=True, align='C')
    
    pdf.output(output_path)

if __name__ == "__main__":
    output_path = r"C:\Users\rifat\.gemini\antigravity-ide\brain\250e62fd-5827-4f04-a08c-21d7cbaca58f\Course_Evaluation_Sample.pdf"
    generate_sample_pdf(output_path)
    print("Course Evaluation PDF Generated")
