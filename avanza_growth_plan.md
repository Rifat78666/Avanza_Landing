# AVANZA: Indima-Inspired Feature Roadmap + Free Marketing Plan

---

## PART 1 — FEATURE IMPLEMENTATION ROADMAP

### Priority Rationale
Indima's competitive edge is: **automated pipelines** + **free SEO tools** + **instant micro-payments**.  
Avanza's current edge is: **deeper human outcome** (getting a legal job in Italy, not just a PDF).  
The goal is to **keep the depth, add the automation and discoverability**.

---

### PHASE 0 — Quick Wins (Week 1–2, Zero Backend Work)

These are static, pre-built tools hosted on a **separate `/tools` page** or a lightweight Astro/Next.js marketing subdomain. They do not require login and generate SEO traffic immediately.

#### Tool 1: "Albo Check" — Which Italian Professional Order Do I Join?
- **Input:** Profession (dropdown) + Country of origin
- **Output:** Correct *Albo* / professional order, estimated recognition timeline, 3 key documents needed, link to official Ministry page
- **SEO target keywords:** "how to work as a nurse in Italy", "engineer degree recognition Italy", "Albo ingegneri stranieri"
- **Implementation:** Pure frontend. Build a JSON config file mapping ~20 regulated professions → requirements. Zero API calls.

#### Tool 2: "Decreto Flussi Eligibility Checker"
- **Input:** Profession + Nationality + Current location (in/out of Italy)
- **Output:** Eligible or Not + explanation + link to Avanza full roadmap (sign-up gate)
- **SEO target keywords:** "decreto flussi 2024 eligibility", "how to apply decreto flussi", "lavoro Italia immigrati"
- **Implementation:** Static decision tree in JSON. 2–3 days of dev work.

#### Tool 3: "CIMEA/MUR Equivalence Estimator"
- **Input:** Foreign degree type + Issuing country + Study field
- **Output:** Likely Italian equivalent (Laurea Triennale / Magistrale / Ciclo Unico), estimated ECTS range, whether CIMEA dichiarazione di valore is needed
- **SEO target keywords:** "riconoscimento titolo straniero Italia", "CIMEA equivalenza laurea", "dichiarazione di valore cos'è"
- **Implementation:** Static lookup table. Most of the rules are publicly available on MUR/CIMEA websites.

#### Tool 4: "Italy Work Permit Wizard"
- **Input:** Nationality + Current residence status + Profession type
- **Output:** Which permesso di soggiorno they need + key steps + expected timeline
- **SEO target keywords:** "permesso di soggiorno lavoro Italy", "visto ingresso lavoro Italia", "soggiornanti lungo periodo requisiti"

---

### PHASE 1 — Automated Document Vault (Month 1–2)

**Current state:** Admin manually marks documents as Verified/Rejected.  
**Target state:** AI pre-screens on upload; admin only handles edge cases (reduces admin load by ~80%).

#### Implementation Plan (FastAPI + OpenAI Vision)

**Step 1 — Add a `/documents/scan` endpoint in FastAPI**
```python
# Pseudocode
@router.post("/documents/scan")
async def scan_document(file: UploadFile):
    # 1. Extract text via pdfplumber or PyMuPDF
    # 2. Send to OpenAI GPT-4o with structured prompt:
    #    "Is this a university degree certificate? 
    #     Extract: institution name, country, degree type, 
    #     year of issue, full name of graduate.
    #     Return JSON only."
    # 3. Cross-reference institution against open dataset 
    #    (WHED: https://whed.net — free, 18,000+ institutions)
    # 4. Return: { is_degree: bool, institution_recognized: bool, 
    #              extracted_fields: {...}, confidence: 0–1 }
```

**Step 2 — Map result to Supabase document status**
- `confidence >= 0.85` → auto-approve, notify user instantly
- `0.5 <= confidence < 0.85` → flag for admin review with pre-filled notes
- `confidence < 0.5` → auto-reject with specific reason returned to user

**Step 3 — Supabase Edge Function for async processing**  
Use a Supabase Edge Function triggered on storage bucket upload instead of polling. This keeps the user-facing FastAPI responsive and processes in background.

**Cost estimate:** GPT-4o Vision ≈ $0.01–0.02 per document scan. At 100 users/month = ~$2. Negligible.

**WHED (World Higher Education Database):** Free, maintained by IAU/UNESCO. Download CSV monthly and store in Supabase table for fast lookups.

---

### PHASE 2 — Stripe Micro-Transaction Layer (Month 2)

**Model: Freemium with unlockable features**

| Feature | Free | Paid |
|---|---|---|
| Onboarding quiz + basic roadmap | ✅ | — |
| Free SEO tools (Albo Check, etc.) | ✅ | — |
| Document upload + AI scan | ✅ | — |
| Full step-by-step bureaucratic roadmap | ❌ | €9.99 one-time |
| Professional PDF Dossier (employer-ready) | ❌ | €14.99 |
| Job Match Board access (Adzuna) | ❌ | €4.99/month |
| Certified translator directory + direct contact | ❌ | Included in roadmap unlock |

**Credit bundle alternative (like Indima):**
- 1 Credit = €10 → buy individual reports
- 3 Credits = €25 → best for nurses/engineers needing multiple docs

**FastAPI Stripe integration steps:**
1. Install `stripe` Python SDK
2. Create `/payments/create-checkout-session` endpoint
3. Use Stripe Webhook to update Supabase `user_features` table on `checkout.session.completed`
4. Gate features in React frontend by checking `user_features.unlocked` from Supabase

---

### PHASE 3 — B2B Organization Dashboard (Month 3–4)

Indima's B2B flow is "Book a Demo" → bulk processing. Avanza can go further with **partnership-native onboarding**, starting with your existing CAF partnership.

**B2B Features to Build:**
- Operator login (CAF staff, HR managers) separate from user login
- Bulk user invite via CSV (operators add clients)
- Operator sees client roadmap status + document scan results
- White-label PDF dossier with CAF/partner branding
- API key generation for ATS integration (Month 4+)

**Start point:** The CAF Milan partnership is your reference customer. Build the dashboard *for them specifically* first, then generalize.

---

### PHASE 4 — SEO Infrastructure Upgrade (Month 4–5)

The current React/Vite SPA is the SEO liability. Two options:

**Option A (Lower effort):** Add a Next.js or Astro marketing site at `avanza.it` (or `avanzacareer.it`) with the free tools and blog. Keep the current SPA as `app.avanza.it`. Standard separation used by most SaaS (e.g., vercel.com vs. app.vercel.com).

**Option B (Higher effort, cleaner long-term):** Migrate the public-facing pages (landing, tools, blog) to Next.js with SSR. Keep the dashboard as a Next.js Client Component to preserve SPA feel.

**Recommended: Option A.** You already deploy on Vercel — a second Vercel project for the marketing site takes one afternoon.

---

## PART 2 — FREE MARKETING PLAN

### Core Principle
Indima spends money on SEO tools and Lemlist B2B tracking. Avanza should spend *zero* by going where the community already lives: **expat Facebook groups, Italian Reddit, LinkedIn immigrant professional communities, and CAF partnership amplification.**

---

### Channel 1 — SEO Content (Compound Returns)

**Blog on the marketing site (avanza.it/blog)**  
Target long-tail Italian bureaucracy keywords that have search volume but almost no competition:

| Article Title | Target Keyword | Estimated Monthly Searches |
|---|---|---|
| "How to get your nursing degree recognized in Italy in 2025" | riconoscimento infermiere straniero Italia | ~800 |
| "Decreto Flussi 2025: complete guide for workers" | decreto flussi 2025 guida | ~2,400 |
| "What is CIMEA and do you need it?" | CIMEA dichiarazione di valore | ~600 |
| "How long does degree recognition take in Italy?" | quanto tempo riconoscimento titolo Italia | ~400 |
| "Engineer from outside EU: how to join Albo Ingegneri" | ingegnere straniero albo italia | ~300 |
| "Permesso di soggiorno attesa occupazione: how it works" | permesso attesa occupazione | ~500 |

**Publishing cadence:** 2 articles per month. Each article ends with a CTA to the free Albo Check tool, which captures email + prompts signup.

**Tools needed:** Google Search Console (free), Ubersuggest free tier, Ahrefs Webmaster Tools (free for your own domain).

---

### Channel 2 — Expat & Immigrant Facebook Groups

These groups have 10,000–150,000 members and are the primary information source for immigrants in Italy. The strategy is to **answer questions, never pitch directly.**

**Target Groups:**
- "Expats in Italy" (~80,000 members)
- "Living and Working in Italy" (~45,000 members)
- "Immigrati in Italia – supporto e community" (~30,000 members)
- "Nurses in Italy / Infermieri Stranieri" (profession-specific)
- "Ingegneri e Architetti Stranieri in Italia"
- "India to Italy – Work & Life" (your specific demographic)
- "Filippini in Italia", "Albanesi in Italia" (top immigrant nationalities for nursing)

**Weekly activity (30 min/week):**
1. Search for new posts asking about degree recognition, Albo, Decreto Flussi
2. Post a genuinely helpful answer (2–3 paragraphs) based on your Avanza knowledge
3. At the bottom: *"I'm building Avanza (avanza.it) — a free tool that generates your personal bureaucratic roadmap. Happy to give you early access."*
4. DM the person directly after they engage

**Result:** 5–10 quality leads per week from a single 30-min session.

---

### Channel 3 — Reddit

**Subreddits to target:**
- r/ItalyExpats (~15,000 members) — most active
- r/ImmigrationInformation
- r/digitalnomad (for the "relocate to Italy" crowd)
- r/india → "anyone work in Italy" threads

**Strategy:** Same as Facebook — answer bureaucracy questions thoroughly. Reddit rewards genuine expertise with upvotes, which gives organic visibility for months.

**One high-effort post per month:** Write a detailed guide post (e.g., "Complete 2025 guide to getting your degree recognized in Italy — I built a tool to automate this") as a megathread. These get pinned by moderators and drive sustained signups.

---

### Channel 4 — LinkedIn (Highest B2B Leverage)

**Your personal profile (Pallab's LinkedIn) should be the main content vehicle.**

**Content pillars (rotate weekly):**
1. **Builder story:** "I moved to Italy as an immigrant and couldn't work as a physicist for 8 months because of degree recognition bureaucracy. So I built AVANZA to fix this for 5 million people."
2. **Data/insight:** "Did you know that 68% of non-EU immigrants in Italy report difficulty getting qualifications recognized? Here's why — and what we built."
3. **Free tool announcement:** "We launched a free Italian Albo Checker. No signup required. Here's the link + a short demo video."
4. **User story (anonymized):** "A nurse from the Philippines used AVANZA to complete her Albo Infermieri registration in 3 months instead of 12. Here's her roadmap."
5. **B2B angle:** "CAF centers handle 50,000+ immigrant cases per year in Italy. We just partnered with one in Milan. HR departments — DM me."

**Posting frequency:** 3x per week. Use LinkedIn's native video (Shorts-style, 60 sec) for the demo content — LinkedIn heavily boosts native video.

**Target connections to build:**
- Immigration lawyers in Italy (tag them in relevant posts)
- HR managers at companies in your B2B target list (see Part 3)
- Directors of Italian CAF centers, Patronati, CISL/CGIL/UIL local offices
- International student office staff at Italian universities

---

### Channel 5 — Direct Outreach to Patronati & CAF

You already have one CAF partnership. Now systematize it.

**Step 1 — Build a list of 50 CAF/Patronato centers in Milan, Rome, Turin, and Naples** (the 4 cities with highest non-EU immigrant populations). Their contacts are all public.

**Step 2 — Email outreach sequence (3 emails, 1 week apart):**

> **Email 1 — Value-first:**  
> Subject: "Free tool for your immigrant clients — degree recognition roadmaps"  
> Body: 2 sentences on what Avanza does. Link to the free Albo Check tool. "Thought it might be useful for your clients. No strings attached."

> **Email 2 — Social proof:**  
> Subject: "CAF [Name of your partner] is already using this"  
> Body: Brief mention of your existing CAF partnership. Offer a 15-min call.

> **Email 3 — Concrete ask:**  
> Subject: "Partnership proposal — co-branded roadmaps for your clients"  
> Body: Offer to white-label their PDF dossiers with the CAF logo. No cost to them. Revenue share on premium unlocks driven through their clients.

**Expected conversion rate:** 5–10% of contacts → 2–5 new partnerships from 50 outreach emails.

---

### Channel 6 — WhatsApp & Telegram Communities

The largest informal channel for immigrants in Italy. These are harder to find but extremely high-trust.

**How to get in:**
- Ask your CAF partner to add you to their client WhatsApp groups (framed as "we provide free tools for your clients")
- Search Telegram for "immigrati italia", "lavoro italia stranieri", "decreto flussi community"
- Post your free tools here periodically — once every 2–3 weeks

---

### Channel 7 — Press & Editorial (Zero Cost)

Italian media covering immigration and tech:
- **Corriere della Sera – Economia section** → pitch an article on "why immigrants can't work in Italy for years despite being qualified"
- **Il Sole 24 Ore** → pitch on startup + social impact angle
- **Vita.it** → Italian NGO/social innovation media, very receptive to immigrant-tech stories
- **StartupItalia** → specific to Italian startup ecosystem, free to pitch
- **ANSA Nuova Europa** → covers immigrant communities in Italy directly

**Pitch angle:** Your personal story (Indian physicist builds AI platform to fix Italy's bureaucratic nightmare for 5 million immigrants). That is a genuinely compelling editorial story. Send a 200-word pitch email with your background + one user success story.

---

### 90-Day Free Marketing Calendar

| Week | Activity |
|---|---|
| W1–2 | Launch Albo Check free tool. Post on LinkedIn + Reddit + 3 Facebook groups |
| W3–4 | Publish first blog article. Start 50-email CAF outreach sequence |
| W5–6 | Launch Decreto Flussi Checker. 60-sec LinkedIn demo video |
| W7–8 | Follow up on CAF outreach. First Reddit megathread guide post |
| W9–10 | Publish second blog article. Pitch 3 Italian media outlets |
| W11–12 | CIMEA Estimator tool launch. LinkedIn post with user story (your first CAF partner client) |

---

## PART 3 — B2B TARGET LIST

### Category A: CAF & Patronati Centers (Direct Partnerships)

These organizations serve immigrants daily. They are your primary distribution channel.

| Organization | Why They're a Fit | Key Cities |
|---|---|---|
| **CAF CISL** | Largest CAF network in Italy, ~1,000 offices. Already working with immigrants | National |
| **CAF CGIL** | Second largest, strong in industrial cities (Turin, Milan, Genoa) | National |
| **CAF UIL** | Third largest union CAF network | National |
| **Patronato ACLI** | Explicitly focused on workers and immigrants; very active in degree recognition | National |
| **Patronato INCA** (CGIL) | Specializes in social security + work permits | National |
| **Patronato ITAL** (UIL) | Immigration-specific services | National |
| **Caritas Ambrosiana** (Milan) | Largest NGO serving immigrants in Lombardy | Milan |
| **Fondazione ISMU** | Research + services on immigration in Italy | Milan |
| **Centro Servizi per Immigrati** (CSI) | Rome-based, high volume | Rome |

---

### Category B: Italian Universities (International Student Offices)

These offices deal with foreign credential recognition for every incoming international student. They need exactly what Avanza's B2B dashboard provides.

| University | International Students | Priority |
|---|---|---|
| **Università degli Studi di Milano** | ~4,000 international | High |
| **Politecnico di Milano** | ~5,000 international | High |
| **Università di Bologna** | ~5,500 international (historic internationalization) | High |
| **Sapienza – Roma** | ~3,500 international | High |
| **Università di Padova** | ~3,000 international | Medium |
| **Università di Torino** | ~2,500 international | Medium |
| **Università di Napoli Federico II** | ~2,000 international | Medium |
| **Università di Pavia** | ~1,500 international | Medium (you have personal ties here) |
| **Università di Milano-Bicocca** | ~1,200 international | High (you are enrolled here — direct access) |
| **Università di Pisa** | ~1,500 international | Medium |

**Best entry point:** Your own university (Bicocca). Walk into the Ufficio Relazioni Internazionali and propose a pilot. Your enrollment there is a trust signal.

---

### Category C: Italian Employers Actively Hiring Non-EU Workers

These companies regularly hire internationally and deal with degree recognition in-house. A B2B Avanza integration saves their HR team weeks per hire.

#### Healthcare (Largest demand for foreign-trained professionals)

| Company/Entity | Why They Need Avanza |
|---|---|
| **ASST Fatebenefratelli Sacco** (Milan) | Actively recruits nurses from Philippines, Eastern Europe |
| **Humanitas Hospital** (Milan) | International research hospital, large non-EU medical staff |
| **Ospedale San Raffaele** (Milan) | High volume of international medical professionals |
| **GVM Care & Research** | Private hospital chain across Italy, known recruiter |
| **Korian Italia** | Largest private care home operator — huge nursing shortfall |
| **Eleonora** / **Segesta** (elder care) | Massive recruiters of non-EU care workers |

#### Engineering & Construction

| Company | Why They Need Avanza |
|---|---|
| **Webuild** (ex-Salini Impregilo) | Global construction, large non-EU engineer workforce |
| **Italferr** (FS Group) | Railway engineering, hires internationally |
| **Eni** | Oil & gas, large number of non-EU technical staff |
| **Leonardo S.p.A.** | Aerospace/defence, recruits globally |
| **Prysmian Group** | Cables/infrastructure, large international workforce |

#### Tech & Consulting (visa-sponsored international hires)

| Company | Why They Need Avanza |
|---|---|
| **Accenture Italia** | Largest consulting firm in Italy, active international recruiter |
| **Deloitte Italia** | Big4, hires globally for Milan office |
| **Engineering Ingegneria Informatica** | Largest Italian IT services firm |
| **Reply S.p.A.** | Tech consulting, known for hiring internationally |
| **Jakala** | MarTech/data consultancy, growing international team |

---

### Category D: Immigration Law Firms

These firms process dozens of cases per month and would pay for an API integration or operator dashboard.

| Firm | Location | Notes |
|---|---|---|
| **Studio Legale Immigrazione** (multiple) | National | Generic search + LinkedIn outreach |
| **Avvocato Immigrazione Italia** firms | Milan, Rome, Turin | Target via LinkedIn: "avvocato immigrazione" |
| **Consulenti del lavoro** (CDL) | National | Labor consultants regularly advise on foreign hires |

**Outreach approach:** LinkedIn DM + offer a free 30-day operator trial. Frame it as: *"Your clients need this anyway — let us handle the bureaucracy mapping while you handle the legal work."*

---

### Category E: Recruiting Agencies Specializing in Non-EU Workers

| Agency | Focus |
|---|---|
| **Gi Group** | Italy's largest recruiter, explicit non-EU worker placement programs |
| **Adecco Italia** | Healthcare and manufacturing divisions |
| **Randstad Italia** | Active in nursing and technical roles |
| **Manpower Italia** | Construction and industrial |
| **AxL S.p.A.** | Mid-size, strong in manufacturing and logistics |
| **Wesper** | Niche agency specifically for foreign-qualified professionals in Italy |

---

## Summary: Sequenced Action Plan

| Priority | Action | Effort | Expected Impact |
|---|---|---|---|
| 1 | Build Albo Check + Decreto Flussi Checker (free tools) | 1 week dev | SEO + top-of-funnel leads |
| 2 | LinkedIn content: 3x/week personal story + tool demos | Ongoing, 1hr/day | B2B awareness + investor visibility |
| 3 | 50-email CAF/Patronato outreach | 3 days list-build + 2hrs writing | 2–5 new B2B partnerships |
| 4 | Facebook/Reddit organic community answering | 30 min/week | 5–10 signups/week |
| 5 | Stripe micro-transaction integration | 1–2 weeks dev | First revenue |
| 6 | Automate Document Vault (GPT-4o Vision) | 2–3 weeks dev | Admin time savings + trust |
| 7 | Next.js marketing site separation | 1 week dev | Long-term SEO foundation |
| 8 | University B2B outreach (start with Bicocca) | 1 day prep + meetings | Institutional partnerships |
| 9 | Press pitch to StartupItalia + Vita.it | 2hr writing | Brand credibility |
| 10 | B2B employer outreach (healthcare HR first) | Ongoing | Enterprise revenue stream |
