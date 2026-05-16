# AVANZA PRD v1.0 Gap Analysis

This document compares the current state of the `avanza-landing` codebase against the requirements specified in **AVANZA_PRD_v1.0** for the **Phase 1 (MVP)** scope.

## 1. Public Website (FR-PW)

| Feature | PRD Requirement | Current State | Status |
| :--- | :--- | :--- | :--- |
| **Service Packages & Pricing** | Show tiered service packages with pricing configurable by admin. | Not implemented. | ❌ Missing |
| **Testimonials** | Auto-rotating carousel of verifiable success stories. | Not implemented. | ❌ Missing |
| **Assessment Quiz** | 8-screen public quiz to capture leads *before* registration. Saves partial progress. | Exists as a 5-screen post-login `Onboarding.jsx`. Does not capture leads publicly. | ⚠️ Needs Update |
| **Country & Profession Pages** | Dedicated pages for specific countries, professions, and combinations (e.g., `romania/electrician`). | Generic landing page only. No dynamic/CMS pages. | ❌ Missing |
| **Booking System** | Calendar integration to book free/paid consultations. | Not implemented. | ❌ Missing |
| **FAQ Section** | Accordion style FAQ with schema markup. | Not implemented. | ❌ Missing |
| **Language Support** | Italian, English, Romanian (Phase 1). | `App.jsx` supports IT, EN, ES, AR, HI, FR, BN. | ✅ Exceeds Phase 1 |

## 2. Client Portal (FR-CP)

| Feature | PRD Requirement | Current State | Status |
| :--- | :--- | :--- | :--- |
| **Authentication** | Email/Password, Google OAuth, 2FA, Session timeout. | Stytch Magic Links used. No Google OAuth or 2FA currently. | ⚠️ Needs Update |
| **Case Tracking** | Detailed vertical timeline of case history, activity log, countdowns. | Dashboard shows general static roadmap based on degree type, not an active case instance. | ❌ Missing |
| **Messaging System** | Chat-style conversation view, file attachments, read receipts. | Not implemented. | ❌ Missing |
| **Payments** | Stripe/PayPal integration, installment plans, Italian-compliant invoices. | Not implemented. | ❌ Missing |
| **Document Upload** | Drag & drop, camera capture, virus scanning, strict validations. | Basic upload exists (`UploadCV.jsx`, `DocumentVault.jsx`). No virus scanning. | ⚠️ Needs Update |

## 3. Admin Dashboard (FR-AD)

| Feature | PRD Requirement | Current State | Status |
| :--- | :--- | :--- | :--- |
| **Admin Access** | Mandatory 2FA, role-based access control. | Checks if email is in `VITE_ADMIN_EMAILS`. No 2FA. | ⚠️ Needs Update |
| **Case Management** | Kanban/pipeline view, manual case creation, internal notes. | Basic user/doc list in `AdminPortal.jsx`. | ❌ Missing |
| **Unified Inbox** | View all client conversations, WhatsApp integration. | Not implemented. | ❌ Missing |
| **Financial Management** | Revenue dashboard, manual payment records, refund processing. | Not implemented. | ❌ Missing |
| **Analytics** | Dashboard KPIs, conversion funnel, revenue charts. | Not implemented. | ❌ Missing |
| **Automation Engine** | Triggered email sequences, task auto-creation. | Not implemented. | ❌ Missing |

## 4. Data Model & Architecture

| Feature | PRD Requirement | Current State | Status |
| :--- | :--- | :--- | :--- |
| **Core Schema** | `users`, `cases`, `documents`, `messages`, `conversations`, `payments`, `invoices`. | `users`, `onboarding_profiles`, `roadmap_steps`. Missing core entity tables. | ❌ Missing |
| **Third-Party Integrations** | Stripe, PayPal, Google Calendar, SendGrid, Twilio. | None currently integrated. | ❌ Missing |

---

## Recommended Next Steps for MVP

To align the current project with the Phase 1 PRD, you need to update the following major areas:

1. **Database Expansion:** Update your Supabase schema to include `cases`, `messages`, `payments`, and `invoices` as defined in Section 9.2 of the PRD.
2. **Public Quiz & Lead Capture:** Move the onboarding logic to be accessible *before* login to capture emails as CRM leads (FR-PW-002), and expand it to 8 screens.
3. **Case Management vs. Dashboard:** Transform the client dashboard from a generic roadmap view into a specific `Case` view with a timeline and status tracking (FR-CP-004).
4. **Payments & Booking:** Integrate Stripe (FR-CP-007) and a calendar booking component (FR-PW-008).
5. **Messaging:** Build the real-time chat interface for clients to talk to their assigned case managers (FR-CP-006).
