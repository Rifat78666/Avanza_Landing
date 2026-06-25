import os
import datetime
from fpdf import FPDF
from fpdf.enums import XPos, YPos

class CourseEvaluationPDF(FPDF):
    def header(self):
        if self.page_no() == 1:
            dark_green = (10, 67, 47)
            avanza_green = (0, 146, 70)
            
            self.set_fill_color(*dark_green)
            self.rect(0, 0, 210, 40, 'F')
            
            # Logo
            import os
            logo_path = os.path.join(os.path.dirname(__file__), '..', '..', 'public', 'favicon.png')
            if os.path.exists(logo_path):
                self.image(logo_path, x=14, y=10, w=16)
            else:
                self.set_fill_color(*avanza_green)
                self.set_line_width(0)
                self.rect(14, 12, 12, 12, 'F', round_corners=True, corner_radius=2)
            
            # Header text
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
            self.cell(186, 10, "Course-by-Course Evaluation", align='R', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
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


def generate_course_evaluation_pdf(candidate_name, institution, target_country, courses, output_path):
    pdf = CourseEvaluationPDF()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=25)
    
    dark_green = (10, 67, 47)
    avanza_green = (0, 146, 70)
    text_color = (25, 30, 40)
    text_muted = (100, 100, 100)
    
    # Title Section
    pdf.set_text_color(*text_color)
    pdf.set_font("helvetica", "B", 20)
    pdf.cell(0, 10, "Course-by-Course Evaluation", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.set_font("helvetica", "", 11)
    pdf.set_text_color(*text_muted)
    pdf.cell(0, 8, "A detailed mapping of each course to its German grade and ECTS equivalent.", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    
    report_id = f"AV-CE-{datetime.datetime.now().year}-{abs(hash(candidate_name)) % 10000:04d}"
    date_str = datetime.datetime.now().strftime("%d %B %Y")
    pdf.set_font("helvetica", "", 9)
    pdf.cell(50, 8, f"Report ID   {report_id}", new_x=XPos.RIGHT, new_y=YPos.TOP)
    pdf.cell(0, 8, f"Generated   {date_str}", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.ln(5)
    
    # Candidate Info Box
    pdf.set_font("helvetica", "B", 10)
    pdf.set_text_color(*avanza_green)
    pdf.cell(0, 8, "C A N D I D A T E   I N F O R M A T I O N", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    
    pdf.set_fill_color(252, 252, 252)
    pdf.set_draw_color(220, 220, 220)
    y_start = pdf.get_y()
    pdf.rect(14, y_start, 182, 35, 'FD', round_corners=True, corner_radius=3)
    
    pdf.set_xy(20, y_start + 5)
    pdf.set_font("helvetica", "", 8)
    pdf.set_text_color(*text_muted)
    pdf.cell(80, 5, "N A M E", new_x=XPos.RIGHT, new_y=YPos.TOP)
    pdf.cell(0, 5, "T A R G E T   C O U N T R Y", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    
    pdf.set_xy(20, y_start + 10)
    pdf.set_font("helvetica", "B", 12)
    pdf.set_text_color(*text_color)
    pdf.cell(80, 6, candidate_name, new_x=XPos.RIGHT, new_y=YPos.TOP)
    pdf.cell(0, 6, target_country, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    
    pdf.set_xy(20, y_start + 20)
    pdf.set_font("helvetica", "", 8)
    pdf.set_text_color(*text_muted)
    pdf.cell(0, 5, "I N S T I T U T I O N", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.set_x(20)
    pdf.set_font("helvetica", "B", 12)
    pdf.set_text_color(*text_color)
    pdf.cell(0, 6, institution, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    
    pdf.set_y(y_start + 45)
    
    # Evaluation Summary
    total_courses = len(courses)
    total_ects = sum(float(c.get("ects", 0)) for c in courses)
    weighted_sum = sum(float(c.get("german_eq", 0)) * float(c.get("ects", 0)) for c in courses)
    avg_grade = round(weighted_sum / total_ects, 1) if total_ects > 0 else 0
    
    pdf.set_font("helvetica", "B", 10)
    pdf.set_text_color(*avanza_green)
    pdf.cell(0, 8, "E V A L U A T I O N   S U M M A R Y", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    
    y_sum = pdf.get_y()
    
    # Box 1
    pdf.set_fill_color(248, 248, 248)
    pdf.rect(14, y_sum, 55, 30, 'FD', round_corners=True, corner_radius=3)
    pdf.set_xy(14, y_sum + 8)
    pdf.set_font("helvetica", "B", 24)
    pdf.set_text_color(*dark_green)
    pdf.cell(55, 8, str(total_courses), align='C', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.set_font("helvetica", "B", 7)
    pdf.set_text_color(*text_muted)
    pdf.set_x(14)
    pdf.cell(55, 6, "C O U R S E S  E V A L U A T E D", align='C', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    
    # Box 2
    pdf.set_fill_color(248, 248, 248)
    pdf.rect(77, y_sum, 55, 30, 'FD', round_corners=True, corner_radius=3)
    pdf.set_xy(77, y_sum + 8)
    pdf.set_font("helvetica", "B", 24)
    pdf.set_text_color(*dark_green)
    pdf.cell(55, 8, f"{total_ects:g}", align='C', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.set_font("helvetica", "B", 7)
    pdf.set_text_color(*text_muted)
    pdf.set_x(77)
    pdf.cell(55, 6, "T O T A L  E C T S", align='C', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    
    # Box 3
    pdf.set_fill_color(*dark_green)
    pdf.rect(140, y_sum, 56, 30, 'F', round_corners=True, corner_radius=3)
    pdf.set_xy(140, y_sum + 8)
    pdf.set_font("helvetica", "B", 24)
    pdf.set_text_color(255, 255, 255)
    pdf.cell(56, 8, str(avg_grade), align='C', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.set_font("helvetica", "B", 7)
    pdf.set_text_color(200, 241, 53)
    pdf.set_x(140)
    pdf.cell(56, 6, "W E I G H T E D  A V G", align='C', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    
    pdf.set_y(y_sum + 40)
    
    # Course Table
    pdf.set_font("helvetica", "B", 10)
    pdf.set_text_color(*avanza_green)
    pdf.cell(0, 8, "D E T A I L E D   C O U R S E   E V A L U A T I O N", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    
    pdf.set_fill_color(*dark_green)
    pdf.set_text_color(255, 255, 255)
    pdf.set_font("helvetica", "B", 8)
    
    col_w = [82, 30, 45, 25]
    pdf.cell(col_w[0], 10, "  ORIGINAL COURSE", fill=True, new_x=XPos.RIGHT, new_y=YPos.TOP)
    pdf.cell(col_w[1], 10, "CREDITS", fill=True, align='C', new_x=XPos.RIGHT, new_y=YPos.TOP)
    pdf.cell(col_w[2], 10, "GERMAN EQUIVALENT", fill=True, align='C', new_x=XPos.RIGHT, new_y=YPos.TOP)
    pdf.cell(col_w[3], 10, "ECTS", fill=True, align='C', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    
    pdf.set_text_color(*text_color)
    pdf.set_font("helvetica", "B", 9)
    
    fill = False
    pdf.set_fill_color(250, 250, 250)
    
    for c in courses:
        # Check if we need to add a page (preventing split rows ideally)
        if pdf.get_y() > 250:
            pdf.add_page()
            # Draw header again
            pdf.set_fill_color(*dark_green)
            pdf.set_text_color(255, 255, 255)
            pdf.set_font("helvetica", "B", 8)
            pdf.cell(col_w[0], 10, "  ORIGINAL COURSE", fill=True, new_x=XPos.RIGHT, new_y=YPos.TOP)
            pdf.cell(col_w[1], 10, "CREDITS", fill=True, align='C', new_x=XPos.RIGHT, new_y=YPos.TOP)
            pdf.cell(col_w[2], 10, "GERMAN EQUIVALENT", fill=True, align='C', new_x=XPos.RIGHT, new_y=YPos.TOP)
            pdf.cell(col_w[3], 10, "ECTS", fill=True, align='C', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
            pdf.set_text_color(*text_color)
            pdf.set_font("helvetica", "B", 9)
            pdf.set_fill_color(250, 250, 250)
            
        pdf.cell(col_w[0], 10, f"  {c.get('name')}", fill=fill, border='B', new_x=XPos.RIGHT, new_y=YPos.TOP)
        pdf.set_font("helvetica", "", 9)
        pdf.cell(col_w[1], 10, str(c.get("credits")), fill=fill, align='C', border='B', new_x=XPos.RIGHT, new_y=YPos.TOP)
        pdf.set_font("helvetica", "B", 9)
        pdf.set_text_color(*avanza_green)
        pdf.cell(col_w[2], 10, str(c.get("german_eq")), fill=fill, align='C', border='B', new_x=XPos.RIGHT, new_y=YPos.TOP)
        
        # ECTS Badge
        pdf.set_text_color(*text_color)
        pdf.set_font("helvetica", "B", 8)
        x_start = pdf.get_x()
        y_start = pdf.get_y()
        pdf.cell(col_w[3], 10, "", fill=fill, border='B', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        
        pdf.set_fill_color(230, 240, 230)
        pdf.set_xy(x_start + 4, y_start + 2)
        pdf.rect(x_start + 2, y_start + 2, 21, 6, 'F', round_corners=True, corner_radius=2)
        pdf.cell(17, 6, f"{c.get('ects')} ECTS", align='C')
        
        pdf.set_xy(10, y_start + 10)
        pdf.set_fill_color(250, 250, 250)
        fill = not fill
        
    # Totals Row
    pdf.set_fill_color(*lighten(avanza_green, 0.9))
    pdf.set_font("helvetica", "B", 10)
    pdf.cell(col_w[0], 10, "  Total", fill=True, new_x=XPos.RIGHT, new_y=YPos.TOP)
    pdf.cell(col_w[1], 10, str(sum(float(c.get("credits",0)) for c in courses)), fill=True, align='C', new_x=XPos.RIGHT, new_y=YPos.TOP)
    pdf.cell(col_w[2], 10, f"{avg_grade} avg", fill=True, align='C', new_x=XPos.RIGHT, new_y=YPos.TOP)
    pdf.cell(col_w[3], 10, f"{total_ects} ECTS", fill=True, align='C', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    
    pdf.ln(5)
    
    # Processed by AVANZA badge
    pdf.set_fill_color(245, 250, 245)
    pdf.rect(14, pdf.get_y(), 182, 10, 'F', round_corners=True, corner_radius=3)
    pdf.set_xy(14, pdf.get_y()+2)
    pdf.set_font("helvetica", "B", 8)
    pdf.set_text_color(*avanza_green)
    pdf.cell(5, 6, "")
    pdf.set_fill_color(*avanza_green)
    pdf.rect(18, pdf.get_y()+2, 2, 6, 'F')
    pdf.cell(170, 6, "   Processed by the AVANZA AI Verification Engine", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
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
    public_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'public')
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
        pdf.cell(87, 5, "CEO", align='C', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
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

def lighten(color, factor):
    return tuple(min(255, int(c + (255 - c) * factor)) for c in color)
