from services.pdf_report2 import generate_course_evaluation_pdf

courses = [
    {"name": "Data Structures", "credits": 3.0, "german_eq": 1.7, "ects": 6},
    {"name": "Database Systems", "credits": 3.0, "german_eq": 1.3, "ects": 6},
    {"name": "Software Engineering", "credits": 4.0, "german_eq": 2.0, "ects": 8},
    {"name": "Computer Networks", "credits": 3.0, "german_eq": 1.5, "ects": 6},
    {"name": "Machine Learning", "credits": 4.0, "german_eq": 1.0, "ects": 8},
    {"name": "Operating Systems", "credits": 3.0, "german_eq": 2.3, "ects": 6},
    {"name": "Computer Architecture", "credits": 3.0, "german_eq": 2.7, "ects": 6},
    {"name": "Algorithms", "credits": 3.0, "german_eq": 1.3, "ects": 6},
    {"name": "Compiler Design", "credits": 3.0, "german_eq": 2.0, "ects": 6},
    {"name": "Artificial Intelligence", "credits": 4.0, "german_eq": 1.3, "ects": 8},
    {"name": "Cloud Computing", "credits": 3.0, "german_eq": 1.0, "ects": 6},
    {"name": "Cyber Security", "credits": 3.0, "german_eq": 1.7, "ects": 6},
]

# Duplicate to show auto-page breaking works (simulate 48 courses)
courses = courses * 4

generate_course_evaluation_pdf(
    "Jane Smith", 
    "University of Dhaka, Bangladesh", 
    "Germany", 
    courses, 
    r"C:\Users\rifat\.gemini\antigravity-ide\brain\250e62fd-5827-4f04-a08c-21d7cbaca58f\New_Course_Evaluation.pdf"
)
