"""
Avanza Pathfinders — Degree Validation Intelligence Engine
===========================================================
Core module that generates personalized degree recognition roadmaps
based on the user's country of origin, degree field, and degree level.

Two axes drive the entire logic:
  1. Country → determines authentication method (Apostille vs Legalizzazione)
                and Lisbon Convention eligibility (ARDI shortcut)
  2. Degree field → determines if profession is Regulated or Unregulated,
                     which Ministry handles recognition, and which Albo to register with.
"""

# ---------------------------------------------------------------------------
# Hague Apostille Convention — Member Countries (as of 2024)
# Countries in this set use the simplified Apostille process.
# Countries NOT in this set require full Consular Legalizzazione.
# ---------------------------------------------------------------------------
HAGUE_CONVENTION_MEMBERS = {
    "Albania", "Andorra", "Antigua and Barbuda", "Argentina", "Armenia",
    "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Barbados",
    "Belarus", "Belgium", "Belize", "Bolivia", "Bosnia and Herzegovina",
    "Botswana", "Brazil", "Brunei", "Bulgaria", "Burundi", "Cabo Verde",
    "Canada", "Chile", "China", "Colombia", "Cook Islands", "Costa Rica",
    "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Dominica",
    "Dominican Republic", "Ecuador", "El Salvador", "Estonia", "Eswatini",
    "Fiji", "Finland", "France", "Georgia", "Germany", "Greece", "Grenada",
    "Guatemala", "Guyana", "Honduras", "Hong Kong", "Hungary", "Iceland",
    "India", "Indonesia", "Ireland", "Israel", "Italy", "Jamaica", "Japan",
    "Jordan", "Kazakhstan", "Korea", "Kosovo", "Kyrgyzstan", "Latvia",
    "Lesotho", "Liberia", "Liechtenstein", "Lithuania", "Luxembourg",
    "Macao", "Malawi", "Malta", "Marshall Islands", "Mauritius", "Mexico",
    "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Namibia",
    "Netherlands", "New Zealand", "Nicaragua", "Niue", "North Macedonia",
    "Norway", "Oman", "Palau", "Panama", "Paraguay", "Peru", "Philippines",
    "Poland", "Portugal", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis",
    "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino",
    "Sao Tome and Principe", "Saudi Arabia", "Serbia", "Seychelles",
    "Singapore", "Slovakia", "Slovenia", "South Africa", "Spain",
    "Suriname", "Sweden", "Switzerland", "Tajikistan", "Tonga",
    "Trinidad and Tobago", "Tunisia", "Turkey", "Ukraine",
    "United Arab Emirates", "United Kingdom", "United States", "Uruguay",
    "Uzbekistan", "Vanuatu", "Venezuela",
    # Bangladesh acceded in 2023
    "Bangladesh",
    # Pakistan acceded in 2023
    "Pakistan",
}

# ---------------------------------------------------------------------------
# Lisbon Recognition Convention — Signatory Countries
# Countries in this set are eligible for ARDI automatic recognition.
# ---------------------------------------------------------------------------
LISBON_CONVENTION_MEMBERS = {
    "Albania", "Andorra", "Armenia", "Australia", "Austria", "Azerbaijan",
    "Belarus", "Belgium", "Bosnia and Herzegovina", "Bulgaria", "Canada",
    "Croatia", "Cyprus", "Czech Republic", "Denmark", "Estonia",
    "Finland", "France", "Georgia", "Germany", "Greece", "Holy See",
    "Hungary", "Iceland", "Ireland", "Israel", "Italy", "Kazakhstan",
    "Kyrgyzstan", "Latvia", "Liechtenstein", "Lithuania", "Luxembourg",
    "Malta", "Moldova", "Montenegro", "Netherlands", "New Zealand",
    "North Macedonia", "Norway", "Poland", "Portugal", "Romania",
    "Russia", "Serbia", "Slovakia", "Slovenia", "Spain", "Sweden",
    "Switzerland", "Tajikistan", "Turkey", "Ukraine", "United Kingdom",
}

# ---------------------------------------------------------------------------
# Regulated Professions in Italy — Mapped to Competent Authorities
# ---------------------------------------------------------------------------
REGULATED_PROFESSIONS = {
    # Healthcare — Ministry of Health
    "medicine": {
        "keywords": ["medicine", "medical", "doctor", "physician", "medic", "chirurg"],
        "ministry": "Ministero della Salute (Ministry of Health)",
        "ministry_url": "https://www.salute.gov.it",
        "albo": "Ordine dei Medici Chirurghi e degli Odontoiatri",
        "exam_required": True,
        "language_req": "B2",
        "compensatory_measures": "Aptitude test or adaptation internship",
        "notes": "State exam (Esame di Stato) required. Registration with provincial Ordine mandatory."
    },
    "nursing": {
        "keywords": ["nurse", "nurs", "infermier"],
        "ministry": "Ministero della Salute (Ministry of Health)",
        "ministry_url": "https://www.salute.gov.it",
        "albo": "FNOPI (Federazione Nazionale Ordini Professioni Infermieristiche)",
        "exam_required": True,
        "language_req": "B2",
        "compensatory_measures": "Aptitude test or adaptation internship",
        "notes": "Must demonstrate clinical competency per EU Directive 2005/36/EC."
    },
    "pharmacy": {
        "keywords": ["pharmacy", "pharmacist", "farmac"],
        "ministry": "Ministero della Salute (Ministry of Health)",
        "ministry_url": "https://www.salute.gov.it",
        "albo": "FOFI (Federazione Ordini Farmacisti Italiani)",
        "exam_required": True,
        "language_req": "B2",
        "compensatory_measures": "Aptitude test",
        "notes": "Pharmaceutical practice requires Albo registration."
    },
    "dentistry": {
        "keywords": ["dentist", "dental", "odonto", "odontoiatr"],
        "ministry": "Ministero della Salute (Ministry of Health)",
        "ministry_url": "https://www.salute.gov.it",
        "albo": "Ordine dei Medici Chirurghi e degli Odontoiatri",
        "exam_required": True,
        "language_req": "B2",
        "compensatory_measures": "Aptitude test or adaptation internship",
        "notes": "Shared Albo with physicians. Specific dental qualification required."
    },
    "psychology": {
        "keywords": ["psychology", "psycholog", "psicolog"],
        "ministry": "Ministero della Salute (Ministry of Health)",
        "ministry_url": "https://www.salute.gov.it",
        "albo": "Ordine degli Psicologi",
        "exam_required": True,
        "language_req": "B2",
        "compensatory_measures": "Aptitude test",
        "notes": "Post-graduate supervised practice (tirocinio) may be required."
    },
    "veterinary": {
        "keywords": ["veterinary", "vet", "veterinar"],
        "ministry": "Ministero della Salute (Ministry of Health)",
        "ministry_url": "https://www.salute.gov.it",
        "albo": "FNOVI (Federazione Nazionale Ordini Veterinari Italiani)",
        "exam_required": True,
        "language_req": "B2",
        "compensatory_measures": "Aptitude test or adaptation internship",
        "notes": "State exam required for Albo registration."
    },
    "physiotherapy": {
        "keywords": ["physiotherapy", "physiotherapist", "fisioterapi", "physical therapy"],
        "ministry": "Ministero della Salute (Ministry of Health)",
        "ministry_url": "https://www.salute.gov.it",
        "albo": "Albo dei Fisioterapisti (FNOFI)",
        "exam_required": True,
        "language_req": "B2",
        "compensatory_measures": "Aptitude test",
        "notes": "Healthcare profession requiring Albo registration."
    },

    # Legal & Technical — Ministry of Justice
    "law": {
        "keywords": ["law", "legal", "lawyer", "avvocat", "juris"],
        "ministry": "Ministero della Giustizia (Ministry of Justice)",
        "ministry_url": "https://www.giustizia.it",
        "albo": "Ordine degli Avvocati",
        "exam_required": True,
        "language_req": "C1",
        "compensatory_measures": "Aptitude test (Esame di abilitazione)",
        "notes": "Extremely rigorous. Italian bar exam required. C1 Italian mandatory."
    },
    "engineering": {
        "keywords": ["engineering", "engineer", "ingegner"],
        "ministry": "Ministero della Giustizia (Ministry of Justice)",
        "ministry_url": "https://www.giustizia.it",
        "albo": "Ordine degli Ingegneri (CNI)",
        "exam_required": True,
        "language_req": "B1",
        "compensatory_measures": "Aptitude test",
        "notes": "State exam required. Divided into Sezione A (Laurea Magistrale) and Sezione B (Laurea Triennale)."
    },
    "accounting": {
        "keywords": ["accounting", "accountant", "commercialist", "contabil"],
        "ministry": "Ministero della Giustizia (Ministry of Justice)",
        "ministry_url": "https://www.giustizia.it",
        "albo": "CNDCEC (Consiglio Nazionale Dottori Commercialisti)",
        "exam_required": True,
        "language_req": "B1",
        "compensatory_measures": "Aptitude test",
        "notes": "State exam required for Albo registration."
    },

    # Architecture — Ministry of University and Research
    "architecture": {
        "keywords": ["architecture", "architect", "architet"],
        "ministry": "Ministero dell'Università e della Ricerca (MUR)",
        "ministry_url": "https://www.mur.gov.it",
        "albo": "Ordine degli Architetti, Pianificatori, Paesaggisti e Conservatori",
        "exam_required": True,
        "language_req": "B1",
        "compensatory_measures": "Aptitude test",
        "notes": "Divided into Sezione A (Architect) and Sezione B (Junior Architect)."
    },

    # Education — Ministry of Education
    "teaching": {
        "keywords": ["teaching", "teacher", "education", "pedagog", "insegnant"],
        "ministry": "Ministero dell'Istruzione e del Merito (MIM)",
        "ministry_url": "https://www.miur.gov.it",
        "albo": None,
        "exam_required": True,
        "language_req": "B2",
        "compensatory_measures": "Aptitude test or adaptation period",
        "notes": "Teaching roles require degree recognition + teaching qualification (abilitazione). Process managed by regional education offices (USR)."
    },

    # Cultural Heritage — Ministry of Culture
    "restoration": {
        "keywords": ["restoration", "restorer", "cultural heritage", "conserv"],
        "ministry": "Ministero della Cultura (MiC)",
        "ministry_url": "https://www.cultura.gov.it",
        "albo": "Elenco Restauratori",
        "exam_required": True,
        "language_req": "B1",
        "compensatory_measures": "Aptitude test",
        "notes": "Specialized field. Limited positions available."
    },
}

# ---------------------------------------------------------------------------
# Degree Level Equivalence Mapping (Italian system)
# ---------------------------------------------------------------------------
DEGREE_EQUIVALENCE = {
    "Bachelor's": {
        "italian_name": "Laurea Triennale",
        "ects_credits": "180 ECTS",
        "eqf_level": "EQF Level 6",
        "duration": "3 years"
    },
    "Master's": {
        "italian_name": "Laurea Magistrale",
        "ects_credits": "120 ECTS (300 total)",
        "eqf_level": "EQF Level 7",
        "duration": "2 years (5 total)"
    },
    "PhD": {
        "italian_name": "Dottorato di Ricerca",
        "ects_credits": "N/A",
        "eqf_level": "EQF Level 8",
        "duration": "3-4 years"
    },
    "Professional Certification": {
        "italian_name": "Certificazione Professionale",
        "ects_credits": "Varies",
        "eqf_level": "EQF Level 4-5",
        "duration": "Varies"
    },
    "Vocational Diploma": {
        "italian_name": "Diploma Professionale (IeFP)",
        "ects_credits": "N/A",
        "eqf_level": "EQF Level 3-4",
        "duration": "3-4 years"
    },
}


# ---------------------------------------------------------------------------
# Core Function: Generate Personalized Validation Roadmap
# ---------------------------------------------------------------------------
def generate_validation_roadmap(degree_country: str, degree_field: str, degree_level: str) -> dict:
    """
    Generates a fully personalized degree validation roadmap based on
    the user's country of origin, degree field, and degree level.
    
    Returns a structured dict consumed by the frontend Dashboard.
    """
    country = degree_country.strip()
    field = degree_field.strip().lower()
    level = degree_level.strip()
    
    # --- Axis 1: Country-based determinations ---
    is_hague_member = _check_membership(country, HAGUE_CONVENTION_MEMBERS)
    is_lisbon_member = _check_membership(country, LISBON_CONVENTION_MEMBERS)
    
    authentication_method = "apostille" if is_hague_member else "legalizzazione"
    
    # --- Axis 2: Profession-based determinations ---
    profession_match = _match_profession(field)
    is_regulated = profession_match is not None
    
    # --- Degree equivalence ---
    equivalence = DEGREE_EQUIVALENCE.get(level, {
        "italian_name": "Titolo Estero",
        "ects_credits": "To be evaluated",
        "eqf_level": "To be determined",
        "duration": "Varies"
    })
    
    # --- Build the roadmap steps ---
    steps = _build_steps(
        country=country,
        is_hague=is_hague_member,
        is_lisbon=is_lisbon_member,
        is_regulated=is_regulated,
        profession=profession_match,
        level=level
    )
    
    # --- Compile the response ---
    roadmap = {
        "country": country,
        "degree_field": degree_field,
        "degree_level": level,
        "is_regulated": is_regulated,
        "authentication_method": authentication_method,
        "is_hague_member": is_hague_member,
        "lisbon_eligible": is_lisbon_member,
        "degree_equivalence": equivalence,
        "steps": steps,
        "total_estimated_time": _estimate_total_time(steps),
        "total_estimated_cost": _estimate_total_cost(steps),
    }
    
    # Add profession-specific details if regulated
    if is_regulated and profession_match:
        roadmap["competent_ministry"] = profession_match["ministry"]
        roadmap["ministry_url"] = profession_match["ministry_url"]
        roadmap["professional_board"] = profession_match["albo"]
        roadmap["exam_required"] = profession_match["exam_required"]
        roadmap["language_requirement"] = profession_match["language_req"]
        roadmap["compensatory_measures"] = profession_match["compensatory_measures"]
        roadmap["profession_notes"] = profession_match["notes"]
    else:
        roadmap["competent_ministry"] = None
        roadmap["professional_board"] = None
        roadmap["exam_required"] = False
        roadmap["language_requirement"] = None
        roadmap["compensatory_measures"] = None
        roadmap["profession_notes"] = "Your profession is not regulated in Italy. You can access the labor market directly with your foreign qualification. A CIMEA Statement of Comparability is recommended for credibility with employers."
    
    return roadmap


# ---------------------------------------------------------------------------
# Internal Helpers
# ---------------------------------------------------------------------------
def _check_membership(country: str, registry: set) -> bool:
    """Fuzzy-match a country name against a registry set."""
    country_lower = country.lower().strip()
    for member in registry:
        if member.lower() == country_lower:
            return True
        # Handle common variations
        if country_lower in member.lower() or member.lower() in country_lower:
            return True
    # Handle common aliases
    aliases = {
        "usa": "United States", "us": "United States", "america": "United States",
        "uk": "United Kingdom", "britain": "United Kingdom", "england": "United Kingdom",
        "uae": "United Arab Emirates", "emirates": "United Arab Emirates",
        "south korea": "Korea", "republic of korea": "Korea",
        "holland": "Netherlands",
        "czech": "Czech Republic", "czechia": "Czech Republic",
        "north macedonia": "North Macedonia", "macedonia": "North Macedonia",
        "bosnia": "Bosnia and Herzegovina",
        "trinidad": "Trinidad and Tobago",
        "st kitts": "Saint Kitts and Nevis",
        "st lucia": "Saint Lucia",
        "st vincent": "Saint Vincent and the Grenadines",
        "cape verde": "Cabo Verde",
        "swaziland": "Eswatini",
        "ivory coast": "Côte d'Ivoire",
    }
    resolved = aliases.get(country_lower)
    if resolved and resolved in registry:
        return True
    return False


def _match_profession(field_lower: str) -> dict | None:
    """Match a degree field to a regulated profession entry."""
    for _prof_key, prof_data in REGULATED_PROFESSIONS.items():
        for keyword in prof_data["keywords"]:
            if keyword in field_lower:
                return prof_data
    return None


def _build_steps(country: str, is_hague: bool, is_lisbon: bool, 
                 is_regulated: bool, profession: dict | None, level: str) -> list:
    """Build an ordered list of validation steps based on all inputs."""
    steps = []
    step_num = 1
    
    # --- STEP: Document Authentication ---
    if is_hague:
        steps.append({
            "step_number": step_num,
            "key": "authentication",
            "title": "Apostille Your Documents",
            "description": f"Since {country} is a Hague Convention member, your degree certificate must be apostilled by the competent authority in {country}. This is a simplified one-step authentication process.",
            "estimated_time": "1-4 weeks",
            "estimated_cost": "€20-€100",
            "action_url": "https://www.hcch.net/en/instruments/conventions/authorities1/?cid=41",
            "action_label": "Find Your Country's Apostille Authority",
            "documents_needed": [
                "Original degree certificate",
                "Transcript of records",
                "Valid passport/ID"
            ],
            "status": "not_started"
        })
    else:
        steps.append({
            "step_number": step_num,
            "key": "authentication",
            "title": "Consular Legalizzazione",
            "description": f"{country} is not a member of the Hague Convention. Your documents must undergo Consular Legalizzazione — a multi-step process through the Italian Embassy or Consulate in {country}.",
            "estimated_time": "4-8 weeks",
            "estimated_cost": "€50-€200",
            "action_url": "https://www.esteri.it/it/servizi-consolari-e-visti/",
            "action_label": "Find Italian Embassy/Consulate",
            "documents_needed": [
                "Original degree certificate",
                "Transcript of records",
                "Valid passport/ID",
                "Local government authentication (varies by country)"
            ],
            "status": "not_started"
        })
    step_num += 1
    
    # --- STEP: Sworn Translation ---
    steps.append({
        "step_number": step_num,
        "key": "translation",
        "title": "Sworn Translation (Traduzione Giurata)",
        "description": "All documents must be officially translated into Italian by a court-certified sworn translator (Perito Giurato) registered with an Italian court.",
        "estimated_time": "1-2 weeks",
        "estimated_cost": "€100-€300",
        "action_url": "/translators",
        "action_label": "Find a Sworn Translator",
        "documents_needed": [
            "Apostilled/legalized degree certificate",
            "Apostilled/legalized transcript"
        ],
        "status": "not_started"
    })
    step_num += 1
    
    # --- STEP: CIMEA / ARDI ---
    if is_lisbon:
        steps.append({
            "step_number": step_num,
            "key": "cimea",
            "title": "ARDI Automatic Recognition (Fast Track)",
            "description": f"Great news! {country} is a signatory of the Lisbon Recognition Convention. You can use the ARDI database for automatic recognition of your qualification, which is significantly faster than the standard CIMEA process.",
            "estimated_time": "1-2 weeks",
            "estimated_cost": "€0 (Free)",
            "action_url": "https://ardi.cimea.it/",
            "action_label": "Check ARDI Database",
            "documents_needed": [
                "Translated degree certificate",
                "Diploma Supplement (if available)"
            ],
            "status": "not_started"
        })
    else:
        steps.append({
            "step_number": step_num,
            "key": "cimea",
            "title": "CIMEA Statement of Comparability",
            "description": "Apply to CIMEA for a Statement of Comparability (Attestato di Comparabilità). This is the standard credential evaluation used by Italian employers and institutions.",
            "estimated_time": "4-12 weeks",
            "estimated_cost": "€100-€200",
            "action_url": "https://cimea-diplome.it/",
            "action_label": "Apply on CIMEA DiploMe Portal",
            "documents_needed": [
                "Translated and authenticated degree certificate",
                "Translated transcript",
                "Valid passport",
                "Payment receipt"
            ],
            "status": "not_started"
        })
    step_num += 1
    
    # --- STEPS FOR REGULATED PROFESSIONS ---
    if is_regulated and profession:
        # Step: Ministry Application
        steps.append({
            "step_number": step_num,
            "key": "ministry_application",
            "title": f"Apply to {profession['ministry']}",
            "description": f"Your profession is regulated in Italy. You must submit a formal recognition application to {profession['ministry']}. They will evaluate if your foreign training meets Italian standards.",
            "estimated_time": "2-6 months",
            "estimated_cost": "€100-€500",
            "action_url": profession["ministry_url"],
            "action_label": f"Visit {profession['ministry'].split('(')[0].strip()}",
            "documents_needed": [
                "CIMEA Statement of Comparability",
                "Translated and authenticated degree + transcript",
                "Certificate of Good Standing (from country of origin)",
                "Italian language certificate (minimum " + profession["language_req"] + ")",
                "Valid residence permit"
            ],
            "status": "not_started"
        })
        step_num += 1
        
        # Step: Compensatory Measures (if applicable)
        if profession.get("exam_required"):
            steps.append({
                "step_number": step_num,
                "key": "compensatory_measures",
                "title": "Compensatory Measures (Exam/Internship)",
                "description": f"If substantial differences are found between your training and Italian requirements, you may be required to complete: {profession['compensatory_measures']}.",
                "estimated_time": "3-12 months",
                "estimated_cost": "€200-€1,000",
                "action_url": profession["ministry_url"],
                "action_label": "Check Requirements",
                "documents_needed": [
                    "Ministry recognition decree",
                    "Italian language certificate (" + profession["language_req"] + ")"
                ],
                "status": "not_started"
            })
            step_num += 1
        
        # Step: Albo Registration
        if profession.get("albo"):
            steps.append({
                "step_number": step_num,
                "key": "albo_registration",
                "title": f"Register with {profession['albo']}",
                "description": f"After obtaining the Ministry's recognition decree, you must register with {profession['albo']} to legally practice your profession in Italy.",
                "estimated_time": "2-4 weeks",
                "estimated_cost": "€100-€300 (annual fee)",
                "action_url": None,
                "action_label": f"Contact {profession['albo']}",
                "documents_needed": [
                    "Ministry recognition decree",
                    "Valid residence permit",
                    "Italian language certificate (" + profession["language_req"] + ")",
                    "Professional liability insurance"
                ],
                "status": "not_started"
            })
            step_num += 1
    
    else:
        # Unregulated: simpler path
        steps.append({
            "step_number": step_num,
            "key": "employer_submission",
            "title": "Present to Employers / Institutions",
            "description": "Your profession is not regulated in Italy. Once you have your CIMEA Statement of Comparability (or ARDI certificate), you can present it directly to Italian employers or institutions. No Ministry application is needed.",
            "estimated_time": "Immediate",
            "estimated_cost": "€0",
            "action_url": None,
            "action_label": "View Job Opportunities",
            "documents_needed": [
                "CIMEA Statement or ARDI certificate",
                "Translated degree certificate",
                "Updated CV (use the AI CV Generator)"
            ],
            "status": "not_started"
        })
    
    return steps


def _estimate_total_time(steps: list) -> str:
    """Produce a human-readable total time estimate."""
    if len(steps) <= 3:
        return "2-4 months"
    elif len(steps) <= 5:
        return "6-12 months"
    else:
        return "12-18 months"


def _estimate_total_cost(steps: list) -> str:
    """Produce a human-readable total cost estimate."""
    if len(steps) <= 3:
        return "€200-€600"
    elif len(steps) <= 5:
        return "€500-€1,500"
    else:
        return "€700-€2,500"


# ---------------------------------------------------------------------------
# Bridge Courses — Profession-Specific Training Recommendations
# ---------------------------------------------------------------------------
BRIDGE_COURSES = {
    "nursing": {
        "keywords": ["nurse", "nurs", "infermier"],
        "courses": [
            {
                "title": "Italian for Medical Professionals (B2/C1)",
                "provider": "Università di Bologna — Centro Linguistico",
                "duration": "4 Months (160 hours)",
                "language": "Italian",
                "cost": "Free (EU-funded)",
                "description": "Intensive Italian language course designed for healthcare workers, covering medical terminology, patient communication, and clinical documentation."
            },
            {
                "title": "Italian National Health System (SSN) Overview",
                "provider": "Regione Lombardia — Formazione Sanitaria",
                "duration": "20 Hours (Online)",
                "language": "Italian / English",
                "cost": "Free",
                "description": "Introduction to the Servizio Sanitario Nazionale: hospital structure, patient rights, regional health agencies (ASL), and emergency protocols."
            },
            {
                "title": "Clinical Nursing Adaptation Programme",
                "provider": "FNOPI — Federazione Nazionale Ordini Professioni Infermieristiche",
                "duration": "6 Months (part-time)",
                "language": "Italian",
                "cost": "€200-€500",
                "description": "Supervised clinical internship (tirocinio) designed for foreign-trained nurses to bridge competency gaps and prepare for Albo registration."
            },
        ]
    },
    "medicine": {
        "keywords": ["medicine", "medical", "doctor", "physician", "medic", "chirurg"],
        "courses": [
            {
                "title": "Italian Medical Terminology & Clinical Communication",
                "provider": "Università di Padova — Facoltà di Medicina",
                "duration": "3 Months (120 hours)",
                "language": "Italian",
                "cost": "Free (scholarship available)",
                "description": "Covers medical terminology in Italian, clinical history-taking, report writing, and patient-doctor communication standards."
            },
            {
                "title": "Esame di Stato Preparation Course for Foreign Doctors",
                "provider": "SIMMG — Società Italiana di Medicina Generale",
                "duration": "8 Weeks (intensive)",
                "language": "Italian",
                "cost": "€300-€600",
                "description": "Focused preparation for the Italian State Exam (Esame di Stato), including practice questions, clinical simulations, and Italian healthcare law."
            },
        ]
    },
    "engineering": {
        "keywords": ["engineering", "engineer", "ingegner"],
        "courses": [
            {
                "title": "Italian Building Codes & Eurocode Standards",
                "provider": "Politecnico di Milano — Continuing Education",
                "duration": "6 Weeks (Online)",
                "language": "English / Italian",
                "cost": "Free (sponsored by CNI)",
                "description": "Introduction to Italian construction regulations (NTC 2018), seismic design codes, and Eurocode compliance for foreign-trained engineers."
            },
            {
                "title": "AutoCAD & BIM for the Italian Construction Industry",
                "provider": "AFOL Metropolitana — Milano",
                "duration": "8 Weeks (in-person)",
                "language": "Italian",
                "cost": "Free (regional funding)",
                "description": "Hands-on course covering AutoCAD, Revit, and BIM workflows as used in Italian architectural and engineering firms."
            },
            {
                "title": "Esame di Stato Preparation for Engineers",
                "provider": "Ordine degli Ingegneri di Roma",
                "duration": "4 Weeks (online + in-person)",
                "language": "Italian",
                "cost": "€150-€300",
                "description": "Covers the structure and content of the Italian Engineering State Exam, including practice exams and legal framework review."
            },
        ]
    },
    "architecture": {
        "keywords": ["architecture", "architect", "architet"],
        "courses": [
            {
                "title": "Italian Urban Planning & Heritage Conservation Law",
                "provider": "Politecnico di Torino — Dipartimento di Architettura",
                "duration": "10 Weeks (Online)",
                "language": "Italian / English",
                "cost": "Free (EU-funded)",
                "description": "Covers Italian zoning regulations, heritage conservation standards (Codice dei Beni Culturali), and sustainable urban planning practices."
            },
            {
                "title": "Progettazione CAD 3D per Architetti",
                "provider": "AFOL — Agenzia Formazione Lavoro",
                "duration": "8 Weeks (in-person)",
                "language": "Italian",
                "cost": "Free (regional funding)",
                "description": "CAD and 3D modelling course tailored for architects transitioning to the Italian professional market."
            },
        ]
    },
    "it_software": {
        "keywords": ["software", "computer", "data", "it ", "developer", "programm", "tech"],
        "courses": [
            {
                "title": "Sviluppo Web Full Stack",
                "provider": "AFOL Metropolitana — Milano",
                "duration": "12 Weeks (in-person)",
                "language": "Italian",
                "cost": "Free (GOL programme)",
                "description": "Full-stack web development bootcamp covering HTML/CSS, JavaScript, React, Node.js, and database management. Funded by the Italian GOL programme."
            },
            {
                "title": "Google IT Support Professional Certificate",
                "provider": "Google / Coursera",
                "duration": "6 Months (self-paced)",
                "language": "English / Italian",
                "cost": "Free (Google Career Certificates)",
                "description": "Industry-recognized certification covering troubleshooting, networking, system administration, and IT security."
            },
            {
                "title": "Data Analytics with Python & SQL",
                "provider": "Università di Napoli Federico II (MOOC)",
                "duration": "8 Weeks (online)",
                "language": "Italian / English",
                "cost": "Free",
                "description": "Practical course on data analysis using Python (Pandas, Matplotlib) and SQL for business intelligence applications."
            },
        ]
    },
    "law": {
        "keywords": ["law", "legal", "lawyer", "avvocat", "juris"],
        "courses": [
            {
                "title": "Introduction to Italian Civil & Constitutional Law",
                "provider": "Università di Roma La Sapienza (MOOC)",
                "duration": "10 Weeks (online)",
                "language": "Italian",
                "cost": "Free",
                "description": "Comprehensive overview of the Italian legal system, constitutional framework, civil code fundamentals, and court structure."
            },
            {
                "title": "Italian Legal Language (C1 Level)",
                "provider": "Università per Stranieri di Perugia",
                "duration": "6 Months",
                "language": "Italian",
                "cost": "€200-€400",
                "description": "Advanced Italian language course specializing in legal terminology, contract drafting, and courtroom communication."
            },
        ]
    },
    "teaching": {
        "keywords": ["teaching", "teacher", "education", "pedagog", "insegnant"],
        "courses": [
            {
                "title": "Italian Education System & Teaching Methodologies",
                "provider": "INDIRE — Istituto Nazionale Documentazione Innovazione Ricerca Educativa",
                "duration": "6 Weeks (online)",
                "language": "Italian",
                "cost": "Free",
                "description": "Overview of the Italian school system, curriculum standards, assessment methods, and inclusive education practices."
            },
            {
                "title": "DITALS — Teaching Italian as a Foreign Language",
                "provider": "Università per Stranieri di Siena",
                "duration": "3 Months",
                "language": "Italian",
                "cost": "€300-€500",
                "description": "Certification course for teaching Italian as L2/LS. Recognized by MIUR and useful for integration into Italian schools."
            },
        ]
    },
}

# Default courses for professions not matched above
_DEFAULT_BRIDGE_COURSES = [
    {
        "title": "Italian Language for Professionals (B1/B2)",
        "provider": "CPIA — Centro Provinciale Istruzione Adulti",
        "duration": "4 Months (free public classes)",
        "language": "Italian",
        "cost": "Free",
        "description": "Free Italian language courses offered by local adult education centres across Italy. Covers everyday and professional communication up to B2 level."
    },
    {
        "title": "Digital Marketing & Communication Certificate",
        "provider": "Google Activate / Coursera",
        "duration": "3 Months (self-paced)",
        "language": "English / Italian",
        "cost": "Free",
        "description": "Google-certified course covering SEO, social media marketing, analytics, and digital advertising — highly transferable across industries."
    },
    {
        "title": "Excel & Data Analysis for Business",
        "provider": "AFOL — Agenzia Formazione Lavoro",
        "duration": "4 Weeks (in-person)",
        "language": "Italian",
        "cost": "Free (regional funding)",
        "description": "Practical course on advanced Excel, pivot tables, data visualization, and basic business analysis techniques."
    },
]


def get_bridge_courses(degree_field: str) -> list:
    """
    Returns a list of recommended bridge courses based on the user's
    degree field / profession. Falls back to general courses if no
    specific match is found.
    """
    field_lower = degree_field.strip().lower()

    for _category, data in BRIDGE_COURSES.items():
        for keyword in data["keywords"]:
            if keyword in field_lower:
                return data["courses"]

    return _DEFAULT_BRIDGE_COURSES
