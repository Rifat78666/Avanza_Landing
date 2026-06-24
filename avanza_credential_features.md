# AVANZA: Credential Evaluation Features — Full Implementation Plan
## (Based on live analysis of Indima.app)

---

## WHAT INDIMA ACTUALLY OFFERS — THE COMPLETE PICTURE

Before building, let's be exact about what they have so we don't miss anything.

### Free Tools (zero login, pure SEO)
| Tool | What It Does | Their Tech |
|---|---|---|
| **Free GPA Calculator** | Upload PDF transcript OR manually enter courses → US 4.0 GPA. Handles weighted GPA, CGPA, subject area GPA breakdown | PDF OCR + grade mapping JSON per country |
| **Free ECTS Calculator** | Enter degree level + country + total credits + duration → ECTS total + per-course ECTS | Static formula-based. No AI, just math |
| **University Rankings** | Searchable database of global universities with scores and admission criteria | Static DB (likely pulled from Times/QS open data) |

### Paid Evaluation Reports (€5–€10, instant PDF output)
| Product | Price | What's Inside |
|---|---|---|
| **Course by Course Evaluation** | €10 | Institution verification, credit conversion, EQF level mapping, grade scale conversion, GPA evaluation, official PDF |
| **GPA Evaluation** | €5 | Full transcript AI analysis, GPA 4.0, weighted GPA, subject area GPA, SCED/CIP classification |
| **ECTS Evaluation** | €5 | International credit → ECTS, EHEA standards compliance, full course breakdown, SCED/CIP codes |

### Target Output Regions
- **European Union** — EQF + ECTS + Bologna Process
- **United States** — NACES-style, 4.0 GPA
- **Saudi Arabia** — Their third market

### Their AI pipeline (what's actually happening under the hood)
1. User uploads diploma PDF + transcript PDF
2. OCR extracts institution name, degree type, courses, grades, credits
3. Institution matched against 21,000+ university database (they built/licensed this)
4. Degree mapped to EQF level 1–8
5. Credits converted to ECTS using standard formula
6. Grades converted to 4.0 GPA using per-country grade map
7. PDF report generated and delivered

---

## THE AVANZA DIFFERENCE — WHY THIS IS BETTER FOR ITALY

Here is the critical strategic insight:
**Indima does generic European credential evaluation. Avanza does Italy-specific credential evaluation WITH the bureaucratic roadmap attached.**

This means AVANZA's version of these features should output things Indima never will:
- What Italian *Laurea* level your degree corresponds to (not just abstract EQF)
- Whether you need CIMEA vs. MUR vs. Albo recognition (Indima has no idea what these are)
- Which Italian Ministry/body you need to submit to based on your profession
- The exact documents you need for the Italian process (dichiarazione di valore, legalizzazione, traduzione giurata)
- Estimated total cost of the Italian recognition process in euros

That is a fundamentally more valuable output for the user, and it costs Indima nothing because it's outside their scope.

---

## THE ITALIAN GRADING CONTEXT (critical for building correctly)

| Country/System | Their Scale | Italian Equivalent (30/30) | Notes |
|---|---|---|---|
| India (most universities) | 0–100% or 0–10 CGPA | 18/30 = 55%, 30/30 = 95%+ | Conversion formula well-established |
| Pakistan | 0–4.0 GPA or 0–100% | Same as India pattern | |
| Philippines | 1.0–5.0 (inverted, 1.0 = best) | 1.0–1.5 = 28–30/30 | Tricky — inverted scale |
| Eastern Europe (Romania, Bulgaria, Albania) | 1–10 or 1–6 | Direct mapping | Major immigrant communities in Italy |
| China | 0–100% | 75%+ = 24–30/30 | |
| Nigeria/Ghana/Kenya | 0–100% or 1st/2nd Class | British-derived, maps well | |
| UAE/Saudi Arabia | 0–100% or 0–4.0 GPA | Standard conversions | |
| US/Canada | 0–4.0 GPA | Well-established MUR table | |
| Latin America | 0–10 or 0–20 | Varies by country | |

Italian universities use **18–30/30** for passing grades. CIMEA and MUR use their own grade conversion tables which are publicly available.

---

## IMPLEMENTATION PLAN — 5 FEATURES TO BUILD

### FEATURE 1: Free Italian Grade Converter (Avanza's ECTS Calculator equivalent)
**This is Indima's ECTS calculator, but better because it outputs the Italian result.**

**What it does:**
- User selects their country + grading system
- Enters their grade (as percentage, letter, or GPA)
- Gets back: Italian 30/30 equivalent + EQF level context + what this means for Italian university admission

**UI inputs:**
```
Country of study: [dropdown — 50+ countries]
Degree level: [Bachelor's / Master's / PhD / Secondary]
Grading system: [auto-populated based on country]
Your grade/score: [number input]
```

**UI outputs:**
```
Italian equivalent: 27/30
EQF Level: 6 (Bachelor's)
US GPA equivalent: 3.3
ECTS equivalent: 180 credits (if 3-year degree)
→ [Sign up to get your full Italian Recognition Report]
```

**Implementation — pure frontend, zero backend:**
Build a JSON config file with grade conversion tables per country. The MUR (Italian Ministry of University) publishes official equivalence tables — use these as your data source.

```javascript
// grade_conversion_tables.json (partial example)
{
  "IN": { // India
    "name": "India",
    "systems": [
      {
        "name": "Percentage (0-100)",
        "to_italian_30": "score * 0.3", // 90% → 27/30
        "to_gpa_4": "(score - 55) / 11.25" // rough linear
      },
      {
        "name": "CGPA (0-10)",
        "to_italian_30": "cgpa * 3",  // 9.0 CGPA → 27/30
        "to_gpa_4": "cgpa * 0.4"
      }
    ]
  },
  "PH": { // Philippines
    "name": "Philippines", 
    "systems": [
      {
        "name": "Philippine Scale (1.0-5.0, inverted)",
        "to_italian_30": "(5 - score) / (5-1) * 12 + 18", // 1.0 → 30/30, 3.0 → 24/30
        "to_gpa_4": "(5 - score)"
      }
    ]
  }
}
```

**Time to build: 3–5 days.** No API calls, no backend changes, deploys as a static page.

---

### FEATURE 2: Free ECTS Credit Converter (direct Indima equivalent)
**Identical to Indima's free ECTS calculator — pure math.**

**The formula:**
```
ECTS per credit = 60 ECTS / (credits per year)
Example: Indian university with 25 credits/year → 60/25 = 2.4 ECTS per credit
US semester hour → 2 ECTS (standard accepted ratio)
UK credit → 0.5 ECTS (standard)
Chinese credit → approximately 1.5–2 ECTS
```

**UI inputs:**
```
Country: [dropdown]
Degree level: [Bachelor's / Master's]
Credit system used: [auto-populated]
Total credits in your transcript: [number]
Program duration (years): [number]
```

**UI output:**
```
Your ECTS equivalent: 183 ECTS
Standard for your degree level in Italy: 180 ECTS (Laurea Triennale)
→ Your credits MEET Italian Laurea Triennale requirements ✓
[Get your full Italian recognition report →]
```

**Data source:** ECTS Users' Guide (European Commission, free/public document). Has conversion ratios for every major credit system.

**Time to build: 2–3 days.**

---

### FEATURE 3: Free Italian Degree Level Checker (Avanza's unique tool Indima doesn't have)
**This is AVANZA's killer differentiator — what does my foreign degree become in Italy?**

**What it does:**
- User enters country + degree name (e.g., "B.Tech", "MBBS", "Licenciatura")
- Gets back: Italian Laurea equivalent + EQF level + CIMEA path needed

**The mapping rules (simplified):**
```
3-year Bachelor's (180 ECTS) → Laurea Triennale (L) — EQF Level 6
4-year Bachelor's (240 ECTS) → Between L and LM, often accepted as LM in Italy
5-year integrated (300 ECTS) → Laurea Magistrale a ciclo unico (LM-CU) — EQF Level 7
Master's (60–120 ECTS on top of 180+) → Laurea Magistrale (LM) — EQF Level 7
PhD (3+ years after LM) → Dottorato di Ricerca — EQF Level 8
```

**India-specific rules (your primary user demographic):**
```
B.Tech / B.E. (4 years, 160-180 credits) → Laurea Magistrale equiv. in Italy 
  (MUR treats 4-year Indian B.Tech as equivalent to LM because of Bologna gap)
B.Sc. (3 years) → Laurea Triennale
MBBS (5.5 years) → Laurea Magistrale a ciclo unico (Medicine)
BDS (5 years) → Laurea Magistrale a ciclo unico (Dentistry)
M.Sc. / M.Tech (2 years) → Laurea Magistrale
MBA (2 years after Bachelor's) → Laurea Magistrale
```

**Output also shows:**
- Does this profession need Albo registration in Italy? (Yes/No)
- Which Ministry processes the recognition? (CIMEA / MUR / Specific Ministry)
- Estimated recognition timeline in Italy
- Link to start full Avanza roadmap

**Time to build: 1 week** (the degree name mapping JSON is the work, not the code).

**Data source:** MUR's official degree equivalence decrees (pubblici in Gazzetta Ufficiale).

---

### FEATURE 4: Paid — Italian Credential Evaluation Report (€9.99)
**This is Indima's Course by Course Evaluation, but Italy-specific and more actionable.**

**The paid output PDF includes everything Indima offers PLUS:**

| Section | Indima Has It? | Avanza Version |
|---|---|---|
| Institution Verification | ✅ | ✅ Against WHED + Italian CIMEA database |
| EQF Level Mapping | ✅ (generic EU) | ✅ + Italian Laurea type label |
| ECTS Credit Conversion | ✅ | ✅ |
| GPA → Grade Conversion | ✅ (US 4.0) | ✅ **PLUS Italian 30/30 conversion** |
| Official PDF Report | ✅ | ✅ Avanza branded, dark navy + orange |
| Italian Bureaucratic Pathway | ❌ | ✅ Which documents, which office, which timeline |
| Regulated Profession Check | ❌ | ✅ Albo/Order requirement flag |
| CIMEA vs MUR routing | ❌ | ✅ Tells user exactly who to contact |
| Decreto Flussi eligibility note | ❌ | ✅ If applicable |
| Estimated Italian process cost | ❌ | ✅ (CIMEA fees, translation costs, stamp duties) |
| Next step CTA | ❌ | ✅ Links to user's personal Avanza roadmap |

**Pricing: €9.99** (vs Indima's €10 for course-by-course, but with 2x the value)

**FastAPI backend implementation:**

```python
# POST /api/evaluations/italian-credential
# 1. Receive: diploma PDF + transcript PDF + user_id + profession (optional)
# 2. Extract text with pdfplumber
# 3. Call GPT-4o:
#    - Extract: institution name, country, degree name, graduation year, 
#               list of courses with credits and grades
#    - Classify: degree level (Bachelor/Master/PhD)
# 4. Match institution against WHED CSV in Supabase
# 5. Apply conversion tables (JSON config):
#    - Credits → ECTS
#    - Grade → Italian 30/30
#    - Grade → US 4.0
#    - Degree → EQF level
#    - Degree → Italian Laurea type
# 6. Look up profession in Albo table if provided
# 7. Generate PDF using ReportLab or WeasyPrint
# 8. Store PDF in Supabase Storage bucket (user's private folder)
# 9. Return: { report_url, summary_data }
```

**No dependency on Indima's database** — use WHED (free, UNESCO) + your own Italian-specific tables.

---

### FEATURE 5: Transcript GPA Extractor (the "pro" version of Free GPA Calculator)
**Matches Indima's GPA Evaluation (€5) but positioned differently.**

**Bundle it into the paid Italian Credential Evaluation** rather than selling separately. This gives Avanza a higher perceived value at the same price point.

Alternatively, offer it as a standalone free tool with a file upload (like Indima does) to drive signups:

```
[Upload your transcript PDF]
→ AI reads your PDF
→ Extracts all courses and grades
→ Shows: Your Indian CGPA: 8.2/10 | Italian equivalent: 24.6/30 | US GPA: 3.28
→ "Want your official Italian Recognition Report? Sign up →"
```

**Time to build: 3–4 days** (OCR + GPT-4o extraction call + simple display UI).

---

## TECHNICAL BUILD SEQUENCE (Ordered by Impact/Effort Ratio)

### Sprint 1 (Days 1–5): Free Static Tools — Zero Backend

**Day 1–2:** Build grade_conversion_tables.json
- Cover 25 countries (India, Pakistan, Philippines, Nigeria, Ghana, Kenya, Romania, Albania, China, Bangladesh, Sri Lanka, Egypt, Morocco, Brazil, US, UK, Germany, France, Poland, Ukraine, Indonesia, Vietnam, Turkey, Iran, Saudi Arabia)
- Each country: grading system name, to-Italian-30/30 formula, to-GPA-4.0 formula, to-ECTS-ratio

**Day 3:** Build Free Italian Grade Converter UI (React component)
- Country dropdown → auto-populate grading system
- Grade input → live calculation → Italian/GPA/ECTS output
- CTA: "Get full recognition report" → auth flow

**Day 4:** Build Free ECTS Calculator UI
- Country + degree level + credits + years → ECTS output + Italian degree level flag

**Day 5:** Build Italian Degree Level Checker
- Country + degree name (text input or dropdown) → Italian Laurea equivalent + EQF level + recognition path

**Deploy all three** as pages on the marketing site (or as `/tools/*` routes). No login required.

---

### Sprint 2 (Days 6–15): Paid Report Backend

**Day 6–8:** FastAPI evaluation endpoint
- PDF upload handler
- pdfplumber text extraction
- GPT-4o extraction prompt (structured JSON output)
- WHED institution lookup against Supabase table

**Day 9–10:** Conversion engine
- Python module applying grade_conversion_tables.json
- ECTS calculation
- Italian Laurea mapping
- Albo profession lookup

**Day 11–13:** PDF report generator
- Use **WeasyPrint** (Python, good for CSS-styled PDFs)
- Template: Avanza branded dark navy header, structured sections, QR code linking to verification URL
- Store in Supabase Storage

**Day 14–15:** Stripe payment gate
- €9.99 checkout session
- Webhook updates user_features in Supabase
- React UI: "Generate My Report" → Stripe → redirect back → report ready

---

### Sprint 3 (Days 16–20): Transcript Auto-Extractor (Free Lead Gen Tool)

- File upload component on the free tools page
- FastAPI endpoint: receives PDF, calls GPT-4o, returns structured grade data
- Display: courses table + calculated grades + Italy/GPA/ECTS equivalents
- **No login to see the estimate, login required to save or generate PDF**

---

## CONTENT/DATA FILES YOU NEED TO BUILD (The real work)

These JSON/CSV files are what make the features accurate. Code is the easy part.

### 1. grade_conversion_tables.json (~200 lines)
Maps every major country's grading system to Italian 30/30 and US 4.0.
**Source:** MUR/CIMEA official tables + EU grade conversion published guides.

### 2. degree_name_mapping.json (~500 lines)
Maps foreign degree names to Italian Laurea types.
```json
{
  "IN": {
    "B.Tech": { "italian_equiv": "Laurea Magistrale", "eqf": 7, "ects_min": 240, "note": "MUR treats 4-year Indian B.Tech as LM" },
    "B.Sc.": { "italian_equiv": "Laurea Triennale", "eqf": 6, "ects_min": 180 },
    "MBBS": { "italian_equiv": "Laurea Magistrale a Ciclo Unico (Medicina)", "eqf": 7, "ects_min": 360 },
    "M.Sc.": { "italian_equiv": "Laurea Magistrale", "eqf": 7, "ects_min": 120 }
  },
  "PH": {
    "Bachelor of Science in Nursing": { "italian_equiv": "Laurea Triennale", "eqf": 6, "albo_required": true, "albo_name": "Albo Infermieri" }
  }
}
```

### 3. albo_profession_table.json (~100 entries)
Maps professions → Italian Albo/Order → recognition Ministry → required documents.
```json
{
  "nurse": { 
    "italian": "Infermiere", 
    "albo": "Ordine delle Professioni Infermieristiche (OPI)",
    "ministry": "Ministero della Salute",
    "procedure": "art. 49 D.Lgs 206/2007",
    "key_docs": ["diploma", "dichiarazione di valore", "traduzione giurata", "certificato iscrizione albo paese origine", "nulla osta"],
    "estimated_months": "3-8",
    "cimea_needed": false
  },
  "engineer": {
    "italian": "Ingegnere",
    "albo": "Ordine degli Ingegneri",
    "ministry": "Ministero dell'Università e della Ricerca (MUR)",
    "key_docs": ["diploma", "transcript", "CIMEA dichiarazione", "traduzione giurata"],
    "estimated_months": "6-18",
    "cimea_needed": true
  }
}
```

### 4. whed_universities.csv (~18,000 rows)
Download free from whed.net (IAU/UNESCO). Import into Supabase.
Columns: institution_name, country, country_code, type (public/private), accredited (bool).

---

## COST BREAKDOWN FOR THE PAID REPORT

| Component | Cost per report |
|---|---|
| GPT-4o API (PDF extraction, ~2000 tokens) | ~€0.015 |
| Supabase storage (PDF, ~500KB) | ~€0.0001 |
| WeasyPrint PDF generation | €0 (open source) |
| WHED lookup (local Supabase) | €0 |
| Stripe fees (on €9.99) | ~€0.30 |
| **Total cost per report** | **~€0.32** |
| **Revenue per report** | **€9.67** |
| **Margin** | **97%** |

---

## HOW AVANZA'S TOOLS COMPARE TO INDIMA — FINAL TABLE

| Feature | Indima | Avanza (after building) |
|---|---|---|
| Free GPA Calculator | ✅ US 4.0 output | ✅ US 4.0 + **Italian 30/30** output |
| Free ECTS Calculator | ✅ Generic EU | ✅ ECTS + **Italian Laurea level flag** |
| Italian Degree Level Checker | ❌ | ✅ **Avanza only** |
| Free Transcript PDF Extractor | ✅ | ✅ |
| Paid Credential Report | ✅ €10, generic EU | ✅ €9.99, **Italy-specific + roadmap CTA** |
| CIMEA/MUR pathway guidance | ❌ | ✅ **Avanza only** |
| Albo recognition requirement flag | ❌ | ✅ **Avanza only** |
| Italian document checklist | ❌ | ✅ **Avanza only** |
| Job matching post-recognition | ❌ | ✅ Adzuna integration |
| Target regions | EU + US + Saudi Arabia | **Italy-focused + EU + US** |
| Pricing | €5–€10 | €9.99 (more value, same price) |

---

## RECOMMENDED MVP SCOPE (What to actually ship first)

Don't build everything at once. Ship in this order:

**Week 1 → Ship 3 free tools** (Grade Converter + ECTS Converter + Degree Level Checker)
— These cost nothing to run and immediately improve your SEO and lead capture.

**Week 2–3 → Ship the Paid Italian Credential Report**
— This is your first real revenue feature. Get one paying user before polishing.

**Week 4 → Ship Transcript PDF Auto-Extractor (free)**
— This is the most viral tool. Users share it. "Look, it read my entire IIT transcript in 10 seconds."

**Everything else** (SCED/CIP classification, university ranking DB, bulk org processing) — backlog for v2.
