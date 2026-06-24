# PRD: AVANZA Grade Converter & University Match Tool
**Version:** 1.0 | **Owner:** Pallab Mondal | **Platform:** avanza.it/tools  
**Stack:** React/TypeScript + FastAPI + Supabase + Stripe

---

## 1. Overview & Goals

### Problem
Immigrants from the Indian subcontinent (India, Bangladesh, Pakistan) struggle to understand how their academic grades translate to European standards — and which universities will realistically accept them.

### Solution
A free-to-start, freemium tool on `avanza.it/tools` that:
1. Converts grades from subcontinent systems to major European equivalents
2. Surfaces a curated, filtered list of universities they can realistically target
3. Converts casual visitors into paying customers for 1:1 consultations

### Business Goal
Generate traction (footfall), capture qualified leads, and monetize with a €5 micro-payment and Calendly consultation bookings.

---

## 2. User Personas

| Persona | Description |
|---|---|
| **Indian student** | BSc/MSc holder, Percentage or CGPA grade, wants to apply in Italy or Germany |
| **Bangladeshi student** | SSC/HSC/Honours graduate, Percentage-based grades, targets Hungary or Italy |
| **Pakistani student** | CGP (4.0 scale) or percentage, targets Germany, Netherlands |

---

## 3. Feature Scope & Tier Design

### Free Tier (No Login Required)
- Select country of origin
- Select grading system
- Enter grade
- See converted grade for **one target country**
- See a teaser: "You qualify for 12 universities in Italy — unlock to see them all"

### Paid Tier (€4.99 one-time, via Stripe)
- Full grade conversion for **all supported target countries** simultaneously
- Full university list with links, bachelor's vs master's filtering
- Contact form unlocked (your + co-founder's info)
- Calendly booking link for 1:1 consultation

---

## 4. Supported Countries & Grade Conversion Logic

### 4.1 Source Countries

#### India
| Input System | Range | Notes |
|---|---|---|
| Percentage | 0–100 | Most common |
| CGPA (10-pt) | 0–10 | UGC standard |
| CGPA (4-pt) | 0–4 | Some private universities |

#### Bangladesh
| Input System | Range | Notes |
|---|---|---|
| Percentage | 0–100 | HSC standard |
| GPA (5-pt) | 0–5 | National scale, A+ = 5.0 |

#### Pakistan
| Input System | Range | Notes |
|---|---|---|
| Percentage | 0–100 | Board exams |
| CGPA (4-pt) | 0–4 | HEC standard |

---

### 4.2 Conversion Formulas

#### → Italy (18–30/30)

**From Indian Percentage:**
```
if pct >= 95:  italian = 30 (con lode eligible)
elif pct >= 85: italian = round(18 + (pct - 60) / (100 - 60) * 12)  → 25–29
elif pct >= 70: italian = round(18 + (pct - 60) / (100 - 60) * 12)  → 21–24
elif pct >= 60: italian = 18–20
else:           italian = <18 (fail / non sufficiente)
```

Simplified mapping:
| India % | Italian Grade |
|---|---|
| 95–100 | 30–30L |
| 85–94 | 27–29 |
| 75–84 | 24–26 |
| 65–74 | 21–23 |
| 60–64 | 18–20 |
| <60 | <18 (Insufficient) |

**From Indian CGPA (10-pt):**
```
italian = round((cgpa / 10) * 30)
Cap at 30; flag con lode if cgpa >= 9.5
```

**From Bangladesh GPA (5-pt):**
```
italian = round((gpa / 5) * 30)
```

**From Pakistan/India CGPA (4-pt):**
```
italian = round((cgpa / 4) * 30)
```

---

#### → Germany (1.0–4.0, inverse scale — lower is better)

German Modified Bavarian Formula (DAAD standard):
```
german = 1 + 3 * ((Nmax - Nin) / (Nmax - Nmin))
```
Where:
- `Nin` = user's percentage
- `Nmax` = 100 (best possible)
- `Nmin` = 50 (minimum pass)

Clamped: Result between 1.0 (best) and 4.0 (pass). Above 4.0 = fail (5.0).

| India % | German Grade |
|---|---|
| 90–100 | 1.0–1.3 |
| 80–89 | 1.4–1.9 |
| 70–79 | 2.0–2.5 |
| 60–69 | 2.6–3.3 |
| 50–59 | 3.4–4.0 |
| <50 | 5.0 (Fail) |

---

#### → Hungary (1–5 scale)

| India % | Hungarian Grade |
|---|---|
| 90–100 | 5 (Jeles / Excellent) |
| 75–89 | 4 (Jó / Good) |
| 60–74 | 3 (Közepes / Average) |
| 50–59 | 2 (Elégséges / Pass) |
| <50 | 1 (Elégtelen / Fail) |

---

#### → Netherlands (1–10 scale)

```
dutch = round((pct / 100) * 10, 1)
Pass threshold = 5.5
```

#### → France (0–20)

```
french = round((pct / 100) * 20, 1)
Pass threshold = 10
```

#### → Spain (0–10)

```
spanish = round((pct / 100) * 10, 1)
Pass = 5, Notable = 7, Sobresaliente = 9
```

---

## 5. University Matching Logic

### 5.1 University Database Schema (Supabase)

```sql
CREATE TABLE universities (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT NOT NULL,           -- 'Italy', 'Germany', etc.
  city TEXT,
  programme_level TEXT,            -- 'Bachelor', 'Master', 'Both'
  min_italian_equivalent NUMERIC,  -- Minimum grade on Italian 30 scale
  min_german_equivalent NUMERIC,   -- Minimum GPA on German 1–4 scale
  fields_of_study TEXT[],          -- ['Engineering', 'Medicine', 'Business']
  tuition_range TEXT,              -- '€0–€3,000/year'
  language_of_instruction TEXT,    -- 'English', 'Italian', 'German'
  application_link TEXT,
  scholarship_available BOOLEAN,
  recognition_status TEXT,         -- 'Full', 'Partial', 'Pending' (for AVANZA context)
  notes TEXT
);
```

### 5.2 Matching Logic

```python
def match_universities(italian_equivalent: float, target_country: str, level: str):
    # Return universities where:
    # min_italian_equivalent <= user_grade AND country = target_country AND level matches
    # Sort by: match confidence (grade margin), then name
    return universities.query(
        "min_italian_equivalent <= ? AND country = ? AND programme_level IN (?, 'Both')",
        italian_equivalent, target_country, level
    )
```

### 5.3 Seed Data (Minimum Viable — expand over time)

**Italy:**
- Università di Bologna (≥24/30, Master)
- Università di Milano-Bicocca (≥22/30, Both)
- Università di Padova (≥24/30, Both)
- Università di Torino (≥20/30, Both)
- Università di Roma La Sapienza (≥20/30, Both)
- Università di Pavia (≥22/30, Both)

**Germany:**
- TU Munich (≤2.0 German, Master)
- LMU Munich (≤2.3 German, Both)
- Heidelberg University (≤2.5 German, Both)
- University of Hamburg (≤3.0 German, Both)
- Humboldt-Universität Berlin (≤2.5 German, Both)

**Hungary:**
- Eötvös Loránd University (ELTE) (≥3 Hungarian, Both)
- Budapest University of Technology (≥3, Both)
- University of Debrecen (≥2, Both) — popular with South Asian students

---

## 6. User Flow

```
[Landing: /tools]
        │
        ▼
[Step 1: Select Source Country]
  India / Bangladesh / Pakistan
        │
        ▼
[Step 2: Select Grading System]
  (Auto-populated per country)
        │
        ▼
[Step 3: Enter Grade]
  Input field with validation
        │
        ▼
[Step 4: Select Target Country]
  Italy / Germany / Hungary / Netherlands / France / Spain
  (Free: pick 1 | Paid: see all)
        │
        ▼
[RESULT CARD — Always Shown (Free)]
  ✅ Your Italian Equivalent: 24/30
  🎓 You qualify for 12 universities
  [BLURRED university list — 3 cards visible, rest locked]
        │
        ├──── [FREE] ────────────────────────────────────────────────────────┐
        │                                                               See 3 universities (teaser only)
        │
        └──── [PAID €4.99] ─────────────────────────────────────────────────┐
                                                                        Full university list
                                                                        All country conversions
                                                                        Contact us + Calendly
```

---

## 7. Payment Flow (Stripe)

### 7.1 What's Charged
- **€4.99 one-time** per result session
- Display approximate local equivalent in UI only (not charged in local currency):
  - India: ~₹450
  - Bangladesh: ~৳600
  - Pakistan: ~₨1,500

### 7.2 Stripe Integration (FastAPI Backend)

**Install:**
```bash
pip install stripe
```

**Backend: `POST /api/create-checkout-session`**
```python
import stripe
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

@app.post("/api/create-checkout-session")
async def create_checkout(session_data: ConversionSession):
    session = stripe.checkout.Session.create(
        payment_method_types=["card"],
        line_items=[{
            "price_data": {
                "currency": "eur",
                "product_data": {
                    "name": "AVANZA Grade Converter — Full Report",
                    "description": f"Grade conversion + university list for {session_data.source_country} → {session_data.target_country}"
                },
                "unit_amount": 499,  # €4.99 in cents
            },
            "quantity": 1,
        }],
        mode="payment",
        success_url=f"{BASE_URL}/tools?session_id={{CHECKOUT_SESSION_ID}}&unlocked=true",
        cancel_url=f"{BASE_URL}/tools?cancelled=true",
        metadata={
            "source_country": session_data.source_country,
            "grade": str(session_data.grade),
            "grading_system": session_data.grading_system,
        }
    )
    return {"url": session.url}
```

**Backend: `POST /api/verify-payment`**
```python
@app.post("/api/verify-payment")
async def verify_payment(session_id: str):
    session = stripe.checkout.Session.retrieve(session_id)
    if session.payment_status == "paid":
        # Store in Supabase: paid_sessions table
        # Return unlock token (JWT or signed UUID)
        token = generate_unlock_token(session.metadata)
        return {"unlocked": True, "token": token}
    return {"unlocked": False}
```

**Supabase: `paid_sessions` table**
```sql
CREATE TABLE paid_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_session_id TEXT UNIQUE,
  source_country TEXT,
  grade NUMERIC,
  grading_system TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  unlock_token TEXT UNIQUE
);
```

### 7.3 Frontend (React/TypeScript)
```typescript
const handlePay = async () => {
  const res = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ source_country, grading_system, grade, target_countries }),
  });
  const { url } = await res.json();
  window.location.href = url; // Redirect to Stripe Checkout
};

// On page load — if ?session_id=xxx in URL:
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get('session_id');
  if (sessionId) verifyAndUnlock(sessionId);
}, []);
```

### 7.4 Stripe Setup Checklist
- [ ] Create Stripe account at stripe.com
- [ ] Enable international cards (default ON)
- [ ] Add EUR as primary currency
- [ ] Enable "Automatic currency conversion" in Stripe Dashboard (so Indian cards paying in INR work automatically)
- [ ] Set up Stripe webhook for `checkout.session.completed` (backup to direct verify)
- [ ] Add `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` to Render env vars
- [ ] Test with Stripe test card: `4242 4242 4242 4242`

---

## 8. Contact & Calendly Integration

### 8.1 Contact Section (Unlocked after payment)

```tsx
// ContactSection.tsx — only rendered if isUnlocked === true
const ContactSection = () => (
  <div className="contact-section">
    <h3>Talk to an Expert</h3>
    <p>Our founders have navigated this process themselves.</p>
    
    <div className="founders">
      <FounderCard
        name="Pallab Mondal"
        role="Co-founder, Country Manager India"
        email="pallab@avanza.it"
        linkedin="linkedin.com/in/pallab-mondal"
      />
      <FounderCard
        name="[Co-founder Name]"
        role="Co-founder"
        email="[cofounder]@avanza.it"
        linkedin="..."
      />
    </div>

    {/* Calendly Embed */}
    <div className="calendly-section">
      <h4>Book a 30-min 1:1 Session</h4>
      <p>Get personalized guidance on your application — €0 extra, included with your report.</p>
      <a href="https://calendly.com/your-link" target="_blank" className="btn-calendly">
        📅 Book Free Consultation
      </a>
      {/* OR embed inline: */}
      {/* <InlineWidget url="https://calendly.com/your-link" /> */}
    </div>
  </div>
);
```

**Calendly Setup:**
- Create free Calendly account
- Set up "30-min Consultation" event type
- Embed as popup widget or inline on the page
- Optional: Calendly Pro (€8/mo) for custom branding and routing between 2 founders

---

## 9. Page Structure (Component Tree)

```
/tools
├── <Header /> — AVANZA logo + "Book a Demo" CTA (existing)
├── <GradeConverterHero />
│     ├── Title: "Convert Your Grades. Find Your University."
│     └── Subtitle: "For students from India, Bangladesh & Pakistan"
├── <ConversionForm />
│     ├── <CountrySelector />      — India / Bangladesh / Pakistan
│     ├── <GradingSystemSelector /> — dynamic per country
│     ├── <GradeInput />
│     ├── <TargetCountrySelector /> — Italy / Germany / Hungary / etc.
│     └── <CalculateButton />
├── <ResultCard />  (shown after calculation)
│     ├── <GradeEquivalents />     — shows conversion results
│     ├── <UniversityList />       — blurred if not paid
│     └── <PaywallBanner />        — "Unlock Full Report — €4.99"
│           └── <StripeButton />
├── <ContactSection />  (only if isUnlocked)
│     ├── <FounderCards />
│     └── <CalendlyWidget />
└── <Footer />
```

---

## 10. Database Tables Summary (Supabase)

```sql
-- Grade conversion logs (analytics)
CREATE TABLE conversion_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_country TEXT,
  grading_system TEXT,
  original_grade NUMERIC,
  target_country TEXT,
  converted_grade NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Paid unlocks
CREATE TABLE paid_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_session_id TEXT UNIQUE NOT NULL,
  source_country TEXT,
  grade NUMERIC,
  grading_system TEXT,
  unlock_token TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- University database
CREATE TABLE universities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  city TEXT,
  programme_level TEXT CHECK (programme_level IN ('Bachelor', 'Master', 'Both')),
  min_italian_equivalent NUMERIC,
  min_german_equivalent NUMERIC,
  fields_of_study TEXT[],
  tuition_range TEXT,
  language_of_instruction TEXT,
  application_link TEXT,
  scholarship_available BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 11. Implementation Phases

### Phase 1 — Core Tool (Week 1–2)
- [ ] Grade conversion logic (all formulas above)
- [ ] React form with source country / grading system / grade / target country
- [ ] Result card with grade equivalents
- [ ] University matching (seed with 10–15 universities per country)
- [ ] Free tier: show 3 universities, blur/lock rest

### Phase 2 — Payments (Week 2–3)
- [ ] Stripe backend endpoints (`/create-checkout-session`, `/verify-payment`)
- [ ] Supabase `paid_sessions` table
- [ ] Unlock flow: redirect back from Stripe → verify → show full results
- [ ] Local currency equivalent display (informational only)

### Phase 3 — Contact & Calendly (Week 3)
- [ ] Founder cards component
- [ ] Calendly account setup + embed
- [ ] Contact section (only visible after unlock)

### Phase 4 — Polish & Analytics (Week 4)
- [ ] Supabase `conversion_events` logging (for analytics)
- [ ] SEO meta tags: "Italian grade converter for Indian students" etc.
- [ ] Mobile responsiveness pass
- [ ] Stripe webhook handler for robustness

---

## 12. SEO & Acquisition Targets

Target keywords:
- "Indian percentage to Italian grade converter"
- "CGPA to German grade calculator"
- "university admission requirements Italy for Indian students"
- "Bangladesh grade to Italian 30 scale"

Recommended: Add `avanza.it/blog` articles targeting these long-tail keywords to drive organic traffic to the tool.

---

## 13. Revenue Estimate (Sanity Check)

| Metric | Conservative | Optimistic |
|---|---|---|
| Monthly tool visitors | 500 | 2,000 |
| Free → Paid conversion | 3% | 8% |
| Monthly paid users | 15 | 160 |
| Revenue @ €4.99 | ~€75/mo | ~€800/mo |
| Calendly bookings (20% of paid) | 3/mo | 32/mo |

Even at conservative numbers, this builds a qualified lead pipeline for AVANZA's core immigration advisory product.

---

## 14. Open Questions / Decisions Needed

| # | Question | Decision Needed |
|---|---|---|
| 1 | Calendly: shared team link or individual founder links? | Pallab to decide |
| 2 | Is €4.99 per session, or once per user (login required)? | Recommend: per session (no friction) |
| 3 | Do you want a lead capture form (name + email) before showing even free results? | Optional — increases leads but adds friction |
| 4 | University database: manual curation or scrape from CINECA/DAAD? | Recommend: manual seed first |
| 5 | Co-founder's info to include in contact section? | Pallab to provide |

---

*PRD v1.0 — AVANZA Grade Converter & University Matching Tool*  
*avanza.it/tools | FastAPI + React/TypeScript + Supabase + Stripe*
