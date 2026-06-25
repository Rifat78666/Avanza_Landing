import os
from fpdf import FPDF

class GradeConversionPDF(FPDF):
    def header(self):
        self.set_fill_color(0, 146, 70)
        self.rect(0, 0, 210, 40, 'F')
        self.set_text_color(255, 255, 255)
        self.set_font("helvetica", "B", 24)
        self.cell(0, 15, "AVANZA", new_x="LMARGIN", new_y="NEXT", align='C')
        self.set_font("helvetica", "", 14)
        self.cell(0, 10, "Official Grade Conversion & University Match Report", new_x="LMARGIN", new_y="NEXT", align='C')
        self.ln(15)

def generate_sample_pdf(output_path):
    pdf = GradeConversionPDF()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=15)
    
    # Candidate Info
    pdf.set_font("helvetica", "B", 14)
    pdf.set_text_color(15, 18, 25)
    pdf.cell(0, 10, "Candidate Profile", new_x="LMARGIN", new_y="NEXT")
    
    pdf.set_font("helvetica", "", 11)
    pdf.cell(60, 7, "Name:", border=0)
    pdf.cell(0, 7, "John Doe", border=0, new_x="LMARGIN", new_y="NEXT")
    pdf.cell(60, 7, "Email:", border=0)
    pdf.cell(0, 7, "john@example.com", border=0, new_x="LMARGIN", new_y="NEXT")
    pdf.cell(60, 7, "Origin Country:", border=0)
    pdf.cell(0, 7, "Italy", border=0, new_x="LMARGIN", new_y="NEXT")
    pdf.cell(60, 7, "Original Grade:", border=0)
    pdf.cell(0, 7, "28 (0-30 Scale)", border=0, new_x="LMARGIN", new_y="NEXT")
    pdf.cell(60, 7, "Target Country:", border=0)
    pdf.cell(0, 7, "Germany", border=0, new_x="LMARGIN", new_y="NEXT")
    
    # Box for equivalent grade
    pdf.set_fill_color(240, 248, 240)
    pdf.rect(120, 50, 75, 45, 'F')
    pdf.set_draw_color(0, 146, 70)
    pdf.set_line_width(0.5)
    pdf.rect(120, 50, 75, 45, 'D')
    
    pdf.set_xy(120, 65)
    pdf.set_font("helvetica", "", 11)
    pdf.cell(75, 5, "Germany Equivalent Grade:", align='C', new_x="LMARGIN", new_y="NEXT")
    
    pdf.set_xy(120, 75)
    pdf.set_font("helvetica", "B", 26)
    pdf.set_text_color(0, 146, 70)
    pdf.cell(75, 10, "1.5", align='C', new_x="LMARGIN", new_y="NEXT")
    
    pdf.set_xy(10, 110)
    pdf.set_text_color(15, 18, 25)
    
    # Table
    pdf.set_fill_color(206, 43, 55)
    pdf.set_text_color(255, 255, 255)
    pdf.set_font("helvetica", "B", 10)
    pdf.cell(80, 10, "University Name", border=1, fill=True)
    pdf.cell(40, 10, "City", border=1, fill=True)
    pdf.cell(40, 10, "Level", border=1, fill=True)
    pdf.cell(30, 10, "Tuition", border=1, fill=True, new_x="LMARGIN", new_y="NEXT")
    
    unis = [
        ("Technical University of Munich", "Munich", "Master", "Free"),
        ("LMU Munich", "Munich", "Bachelor", "Free"),
        ("RWTH Aachen", "Aachen", "Both", "Free")
    ]
    
    pdf.set_text_color(15, 18, 25)
    pdf.set_font("helvetica", "", 10)
    fill = False
    for u in unis:
        if fill:
            pdf.set_fill_color(245, 245, 245)
        pdf.cell(80, 10, u[0], border=1, fill=fill)
        pdf.cell(40, 10, u[1], border=1, fill=fill, align='C')
        pdf.cell(40, 10, u[2], border=1, fill=fill, align='C')
        pdf.cell(30, 10, u[3], border=1, fill=fill, align='C', new_x="LMARGIN", new_y="NEXT")
        fill = not fill
        
    pdf.ln(20)
    pdf.set_font("helvetica", "", 10)
    pdf.cell(0, 10, "Your report includes a free 1:1 consultation with the Avanza Founders.", new_x="LMARGIN", new_y="NEXT", align='C')
    pdf.cell(0, 10, "Generated on: 25/06/2026", new_x="LMARGIN", new_y="NEXT", align='C')
    
    pdf.output(output_path)

if __name__ == "__main__":
    output_path = r"C:\Users\rifat\.gemini\antigravity-ide\brain\250e62fd-5827-4f04-a08c-21d7cbaca58f\Grade_Conversion_Sample.pdf"
    generate_sample_pdf(output_path)
    print("Grade Conversion PDF Generated")
