import os
import datetime
from fpdf import FPDF
from fpdf.enums import XPos, YPos

class GradeConversionPDF(FPDF):
    def header(self):
        if self.page_no() == 1:
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
        else:
            self.set_y(25)

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
    
    # Calendly & Founders Block
    if pdf.get_y() > 190:
        pdf.add_page()
        
    final_y = pdf.get_y()
    pdf.set_fill_color(*dark_green)
    pdf.rect(14, final_y, 182, 25, 'F', round_corners=True, corner_radius=3)
    pdf.set_text_color(255, 255, 255)
    pdf.set_font("helvetica", "B", 14)
    pdf.set_xy(14, final_y + 7)
    pdf.cell(182, 8, "Your free 1:1 session with the founders", align='C')
    pdf.set_font("helvetica", "", 9)
    pdf.set_text_color(200, 200, 200)
    pdf.set_xy(14, final_y + 13)
    pdf.cell(182, 5, "Included with your report - book a time that suits you.", align='C', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    
    final_y += 35
    
    # FOUNDER PROFILES
    import os
    public_dir = os.path.join(os.path.dirname(__file__), '..', 'public')
    pallab_path = os.path.join(public_dir, 'pallab.png')
    rifat_path = os.path.join(public_dir, 'rifat.png')
    unis_path = os.path.join(public_dir, 'avanza_university_strip_white.png')
    
    if os.path.exists(pallab_path) and os.path.exists(rifat_path):
        pdf.image(pallab_path, x=45, y=final_y, w=25, h=25)
        pdf.image(rifat_path, x=140, y=final_y, w=25, h=25)
        final_y += 34
        
        # Names
        pdf.set_font("helvetica", "B", 11)
        pdf.set_text_color(*text_color)
        pdf.set_xy(14, final_y)
        pdf.cell(87, 5, "Pallab Mondal", align='C')
        pdf.set_xy(109, final_y)
        pdf.cell(87, 5, "Md Rifatul Haque", align='C', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        final_y += 6
        
        # Roles
        pdf.set_font("helvetica", "B", 9)
        pdf.set_text_color(*avanza_green)
        pdf.set_xy(14, final_y)
        pdf.cell(87, 5, "CEO", align='C')
        pdf.set_text_color(200, 30, 30)
        pdf.set_xy(109, final_y)
        pdf.cell(87, 5, "CTO", align='C', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        final_y += 6
        
        # Degrees
        pdf.set_font("helvetica", "", 8)
        pdf.set_text_color(*text_muted)
        pdf.set_xy(14, final_y)
        pdf.cell(87, 4, "Master's in Artificial Intelligence for", align='C')
        pdf.set_xy(109, final_y)
        pdf.cell(87, 4, "Master's in Artificial Intelligence for", align='C', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        final_y += 4
        pdf.set_xy(14, final_y)
        pdf.cell(87, 4, "Science and Technology", align='C')
        pdf.set_xy(109, final_y)
        pdf.cell(87, 4, "Science and Technology", align='C', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        final_y += 4
        pdf.set_xy(14, final_y)
        pdf.cell(87, 4, "(Joint Programme)", align='C')
        pdf.set_xy(109, final_y)
        pdf.cell(87, 4, "(Joint Programme)", align='C', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        final_y += 4
        
        pdf.set_xy(14, final_y)
        pdf.cell(87, 4, "University of Milan || University of Milano-Bicocca ||", align='C')
        pdf.set_xy(109, final_y)
        pdf.cell(87, 4, "University of Milan || University of Milano-Bicocca ||", align='C', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        final_y += 4
        pdf.set_xy(14, final_y)
        pdf.cell(87, 4, "University of Pavia", align='C')
        pdf.set_xy(109, final_y)
        pdf.cell(87, 4, "University of Pavia", align='C', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        final_y += 6
        
        # Emails
        pdf.set_xy(14, final_y)
        pdf.cell(87, 4, "pallabm472@gmail.com", align='C')
        pdf.set_xy(109, final_y)
        pdf.cell(87, 4, "rifatulhaque200@gmail.com", align='C', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        final_y += 6
        
        # Separate Calendly Links as Green Buttons
        pallab_link = "https://calendly.com/pallabm472/30min"
        rifat_link = "https://calendly.com/rifatulhaque200/30min"
        
        pdf.set_fill_color(*avanza_green)
        
        # Pallab Button
        pdf.rect(32.5, final_y, 50, 9, 'F', round_corners=True, corner_radius=2)
        pdf.link(32.5, final_y, 50, 9, pallab_link)
        
        # Rifat Button
        pdf.rect(127.5, final_y, 50, 9, 'F', round_corners=True, corner_radius=2)
        pdf.link(127.5, final_y, 50, 9, rifat_link)
        
        pdf.set_font("helvetica", "B", 9)
        pdf.set_text_color(255, 255, 255)
        
        pdf.set_xy(32.5, final_y + 2.5)
        pdf.cell(50, 4, "Book 1:1 with Pallab", align='C')
        
        pdf.set_xy(127.5, final_y + 2.5)
        pdf.cell(50, 4, "Book 1:1 with Rifat", align='C', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        
        final_y += 15
        
        # Uni Logos - Centered
        if os.path.exists(unis_path):
            pdf.image(unis_path, x=45, y=final_y, w=120)
    
    pdf.output(output_path)

if __name__ == "__main__":
    output_path = r"C:\Users\rifat\.gemini\antigravity-ide\brain\250e62fd-5827-4f04-a08c-21d7cbaca58f\New_Grade_Conversion_v10.pdf"
    generate_sample_pdf(output_path)
    print("Report 1 Python Mock Generated!")
