import os
import datetime
from fpdf import FPDF
from fpdf.enums import XPos, YPos

class GradeConversionPDF(FPDF):
    def header(self):
        dark_green = (10, 67, 47)
        avanza_green = (0, 146, 70)
        
        self.set_fill_color(*dark_green)
        self.rect(0, 0, 210, 40, 'F')
        
        # Logo
        import os
        logo_path = os.path.join(os.path.dirname(__file__), '..', 'public', 'favicon.png')
        if os.path.exists(logo_path):
            self.image(logo_path, x=14, y=10, w=16)
        else:
            self.set_fill_color(*avanza_green)
            self.set_line_width(0)
            self.rect(14, 12, 12, 12, 'F', round_corners=True, corner_radius=2)
        
        self.set_text_color(255, 255, 255)
        self.set_font("helvetica", "B", 22)
        self.set_xy(34, 12)
        self.cell(0, 10, "AVANZA", new_x=XPos.RIGHT, new_y=YPos.TOP)
        self.set_font("helvetica", "", 8)
        self.set_xy(34, 20)
        self.cell(0, 5, "M O V E  F O R W A R D", new_x=XPos.RIGHT, new_y=YPos.TOP)
        
        self.set_font("helvetica", "", 9)
        self.set_xy(10, 18)
        self.cell(186, 10, "O F F I C I A L  R E P O R T", align='R', new_x=XPos.RIGHT, new_y=YPos.TOP)
        self.set_font("helvetica", "B", 14)
        self.set_xy(10, 24)
        self.cell(186, 10, "Grade Conversion & University Match", align='R', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.set_y(45)

    def footer(self):
        dark_green = (10, 67, 47)
        self.set_y(-25)
        self.set_font("helvetica", "", 7)
        self.set_text_color(100, 100, 100)
        self.cell(0, 10, "This is a preliminary, AI-assisted evaluation provided for guidance only. Equivalences are indicative and may vary.", align='C', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        
        self.set_y(-15)
        self.set_fill_color(*dark_green)
        self.rect(0, 282, 210, 15, 'F')
        self.set_text_color(255, 255, 255)
        self.set_xy(14, 285)
        self.cell(0, 10, "AVANZA  ·  Degree recognition, simplified", new_x=XPos.RIGHT, new_y=YPos.TOP)
        
        date_str = datetime.datetime.now().strftime("%d %B %Y")
        self.set_xy(10, 285)
        self.cell(186, 10, f"avanza.it.com  ·  Generated {date_str}", align='R', new_x=XPos.LMARGIN, new_y=YPos.NEXT)

def generate_sample_pdf(output_path):
    pdf = GradeConversionPDF()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=25)
    
    dark_green = (10, 67, 47)
    avanza_green = (0, 146, 70)
    text_color = (25, 30, 40)
    text_muted = (100, 100, 100)
    
    pdf.set_text_color(*text_color)
    pdf.set_font("helvetica", "B", 20)
    pdf.cell(0, 10, "Grade Conversion & University Match", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.set_font("helvetica", "", 11)
    pdf.set_text_color(*text_muted)
    pdf.cell(0, 8, "Your home grade, translated to the Germany system - with recognised universities you qualify for.", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    
    date_str = datetime.datetime.now().strftime("%d %B %Y")
    pdf.set_font("helvetica", "", 9)
    pdf.cell(50, 8, f"Report ID   AV-GC-2026-0814", new_x=XPos.RIGHT, new_y=YPos.TOP)
    pdf.cell(0, 8, f"Generated   {date_str}", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.ln(5)
    
    # Candidate Profile
    pdf.set_font("helvetica", "B", 10)
    pdf.set_text_color(*avanza_green)
    pdf.cell(0, 8, "C A N D I D A T E   P R O F I L E", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    
    pdf.set_fill_color(252, 252, 252)
    y_start = pdf.get_y()
    pdf.rect(14, y_start, 182, 35, 'FD', round_corners=True, corner_radius=3)
    
    pdf.set_xy(20, y_start + 5)
    pdf.set_font("helvetica", "", 8)
    pdf.set_text_color(*text_muted)
    pdf.cell(85, 5, "N A M E", new_x=XPos.RIGHT, new_y=YPos.TOP)
    pdf.cell(0, 5, "E M A I L", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.set_xy(20, y_start + 10)
    pdf.set_font("helvetica", "B", 12)
    pdf.set_text_color(*text_color)
    pdf.cell(85, 6, "John Doe", new_x=XPos.RIGHT, new_y=YPos.TOP)
    pdf.cell(0, 6, "john@example.com", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    
    pdf.set_xy(20, y_start + 20)
    pdf.set_font("helvetica", "", 8)
    pdf.set_text_color(*text_muted)
    pdf.cell(85, 5, "O R I G I N   C O U N T R Y", new_x=XPos.RIGHT, new_y=YPos.TOP)
    pdf.cell(0, 5, "T A R G E T   C O U N T R Y", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.set_xy(20, y_start + 25)
    pdf.set_font("helvetica", "B", 12)
    pdf.set_text_color(*text_color)
    pdf.cell(85, 6, "Italy", new_x=XPos.RIGHT, new_y=YPos.TOP)
    pdf.cell(0, 6, "Germany", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    
    pdf.set_y(y_start + 45)
    
    # Grade Conversion Section
    pdf.set_font("helvetica", "B", 10)
    pdf.set_text_color(*avanza_green)
    pdf.cell(0, 8, "G R A D E   C O N V E R S I O N", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    
    y_g = pdf.get_y()
    # Left box
    pdf.set_fill_color(248, 248, 248)
    pdf.rect(14, y_g, 80, 50, 'FD', round_corners=True, corner_radius=3)
    pdf.set_xy(14, y_g + 8)
    pdf.set_font("helvetica", "", 8)
    pdf.set_text_color(*text_muted)
    pdf.cell(80, 5, "O R I G I N A L   G R A D E  -  I T A L Y", align='C', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.set_font("helvetica", "B", 40)
    pdf.set_text_color(*dark_green)
    pdf.set_x(14)
    pdf.cell(80, 20, "28", align='C', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.set_font("helvetica", "", 8)
    pdf.set_text_color(*text_muted)
    pdf.set_x(14)
    pdf.cell(80, 5, "on a 0-30 scale", align='C', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    
    # Right box
    pdf.set_fill_color(*dark_green)
    pdf.rect(116, y_g, 80, 50, 'F', round_corners=True, corner_radius=3)
    pdf.set_xy(116, y_g + 8)
    pdf.set_font("helvetica", "B", 8)
    pdf.set_text_color(200, 241, 53)
    pdf.cell(80, 5, "G E R M A N   E Q U I V A L E N T", align='C', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.set_font("helvetica", "B", 40)
    pdf.set_text_color(255, 255, 255)
    pdf.set_x(116)
    pdf.cell(80, 20, "1.5", align='C', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    
    pdf.set_fill_color(*avanza_green)
    pdf.rect(131, y_g + 38, 50, 7, 'F', round_corners=True, corner_radius=3)
    pdf.set_xy(131, y_g + 39)
    pdf.set_font("helvetica", "B", 7)
    pdf.cell(50, 5, "S E H R  G U T  -  V E R Y  G O O D", align='C', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    
    pdf.set_y(y_g + 55)
    
    # Universities Table
    pdf.set_font("helvetica", "B", 10)
    pdf.set_text_color(*avanza_green)
    pdf.cell(0, 8, "U N I V E R S I T I E S   Y O U   Q U A L I F Y   F O R", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    
    pdf.set_fill_color(*dark_green)
    pdf.set_text_color(255, 255, 255)
    pdf.set_font("helvetica", "B", 8)
    
    col_w = [80, 30, 25, 25, 22]
    pdf.cell(col_w[0], 10, "  UNIVERSITY", fill=True, new_x=XPos.RIGHT, new_y=YPos.TOP)
    pdf.cell(col_w[1], 10, "QS RANK", fill=True, align='C', new_x=XPos.RIGHT, new_y=YPos.TOP)
    pdf.cell(col_w[2], 10, "CITY", fill=True, align='C', new_x=XPos.RIGHT, new_y=YPos.TOP)
    pdf.cell(col_w[3], 10, "LEVEL", fill=True, align='C', new_x=XPos.RIGHT, new_y=YPos.TOP)
    pdf.cell(col_w[4], 10, "TUITION", fill=True, align='C', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    
    unis = [
        ("Technical University of Munich", "#37", "Munich", "Master", "Free"),
        ("LMU Munich", "#59", "Munich", "Bachelor", "Free"),
        ("RWTH Aachen", "#106", "Aachen", "Both", "Free")
    ]
    
    pdf.set_text_color(*text_color)
    pdf.set_font("helvetica", "B", 9)
    fill = False
    
    for u in unis:
        if fill:
            pdf.set_fill_color(250, 250, 250)
        else:
            pdf.set_fill_color(255, 255, 255)
            
        pdf.cell(col_w[0], 10, f"  {u[0]}", fill=True, border='B', new_x=XPos.RIGHT, new_y=YPos.TOP)
        pdf.set_font("helvetica", "", 9)
        pdf.cell(col_w[1], 10, u[1], fill=True, align='C', border='B', new_x=XPos.RIGHT, new_y=YPos.TOP)
        pdf.cell(col_w[2], 10, u[2], fill=True, align='C', border='B', new_x=XPos.RIGHT, new_y=YPos.TOP)
        pdf.cell(col_w[3], 10, u[3], fill=True, align='C', border='B', new_x=XPos.RIGHT, new_y=YPos.TOP)
        pdf.cell(col_w[4], 10, u[4], fill=True, align='C', border='B', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.set_font("helvetica", "B", 9)
        fill = not fill
        
    pdf.ln(10)
    
    # Calendly Block
    final_y = pdf.get_y()
    pdf.set_fill_color(*dark_green)
    pdf.rect(14, final_y, 182, 35, 'F', round_corners=True, corner_radius=4)
    pdf.set_text_color(255, 255, 255)
    pdf.set_font("helvetica", "B", 14)
    pdf.set_xy(20, final_y + 8)
    pdf.cell(0, 8, "Your free 1:1 session with the founders", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.set_font("helvetica", "", 9)
    pdf.set_text_color(200, 200, 200)
    pdf.set_x(20)
    pdf.cell(0, 5, "Included with your report - book a time that suits you.", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    
    pdf.set_font("helvetica", "B", 9)
    pdf.set_text_color(255, 255, 255)
    pdf.set_x(20)
    pdf.cell(25, 6, "Pallab Mondal", new_x=XPos.RIGHT, new_y=YPos.TOP)
    pdf.set_font("helvetica", "", 9)
    pdf.cell(0, 6, "  ·  Co-founder, Country Manager", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    
    pdf.set_font("helvetica", "B", 9)
    pdf.set_x(20)
    pdf.cell(28, 6, "Md Rifatul Haque", new_x=XPos.RIGHT, new_y=YPos.TOP)
    pdf.set_font("helvetica", "", 9)
    pdf.cell(0, 6, "  ·  Co-founder, System & AI", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    
    # Button inside block
    pdf.set_fill_color(*avanza_green)
    pdf.rect(140, final_y + 10, 50, 15, 'F', round_corners=True, corner_radius=3)
    pdf.set_font("helvetica", "B", 11)
    pdf.set_text_color(255, 255, 255)
    pdf.set_xy(140, final_y + 13)
    pdf.cell(50, 5, "Book your session >", align='C', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.set_font("helvetica", "", 8)
    pdf.set_xy(140, final_y + 18)
    pdf.cell(50, 5, "calendly.com/avanza", align='C', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    
    pdf.output(output_path)

if __name__ == "__main__":
    output_path = r"C:\Users\rifat\.gemini\antigravity-ide\brain\250e62fd-5827-4f04-a08c-21d7cbaca58f\New_Grade_Conversion.pdf"
    generate_sample_pdf(output_path)
    print("Report 1 Python Mock Generated!")
