# 🇮🇹 Avanza Pathfinders: Technical Architecture & Development Overview

Avanza Pathfinders is a production-grade career navigation platform built to support global talent in the Italian ecosystem. This document outlines the technical choices, architecture, and deployment strategy used to build the platform.

---

## 🏗️ Core Architecture: Decoupled Monorepo
The project is structured as a **Decoupled Monorepo**, separating concerns between the presentation layer and the logic layer while maintaining a single source of truth in version control.

### 1. Frontend (The Interface)
- **Framework**: React.js with Vite for high-performance development and optimized production builds.
- **State Management**: React Hooks and Local Storage for persistent session handling.
- **Authentication**: **Stytch SDK** (Magic Links). We chose Stytch to provide a "passwordless" experience, which increases conversion rates and security.
- **Localization**: Custom i18n engine supporting 7 languages (EN, IT, FR, AR, HI, BN, UKR).
- **Deployment**: **Vercel** with CI/CD (Auto-build on Git Push).

### 2. Backend (The Brain)
- **Framework**: **Python FastAPI**. 
- **Reasoning**: Chosen for its native asynchronous support and speed. It is ideal for future AI integrations like PDF parsing and LinkedIn data scraping.
- **Containerization**: **Docker**. We used Docker to ensure the backend runs identically on local machines and production servers (Render).
- **CORS**: Dynamic CORS middleware to allow secure communication between the Vercel frontend and Render backend.
- **Deployment**: **Render** (Hosted Docker Web Service).

### 3. Database & Storage (The Memory)
- **Database**: **Supabase (PostgreSQL)**.
- **Key Features**: 
    - Row-level security (RLS) for user privacy.
    - PostgreSQL for complex relational queries (Job matching).
    - Image storage for user profiles and certifications.

---

## 🛠️ The Development Journey

### Phase 1: Prototype (Localhost)
- Initial landing page with basic CSS.
- Hardcoded data for testing the UI flow.

### Phase 2: Intelligence & Localization
- Implementation of the 7-language localization engine.
- Building the Onboarding flow (Collecting user intent: Student, Professional, or Worker).

### Phase 3: Infrastructure Migration
- Switched from a basic Python script to a professional FastAPI monorepo.
- Integrated Stytch and Supabase for real-time authentication and data persistence.

### Phase 4: Production Deployment
- **Domain Acquisition**: `avanza.it.com` purchased on Spaceship.com.
- **DNS Configuration**: Set up A and CNAME records to link the custom domain.
- **Production Environment Variables**: Secured all API keys (Stytch, Supabase, Backend URLs) using specialized environment variable managers.

---

## 🚀 Scalability & Future Scope
The platform is built on an **Elastic Architecture**, meaning it can easily handle the addition of:
1. **AI CV Parsing**: Utilizing `pdfplumber` on the backend to analyze resumes.
2. **Adzuna Job API**: Real-time job ingestion from official Italian job boards.
3. **Legalization Tracker**: An interactive step-by-step tool for "Dichiarazione di Valore" (Degree recognition).
4. **Document Vault**: Encrypted storage for legal migrant documents.

---

## 👨‍💻 Developer Summary
- **Primary Languages**: JavaScript (ES6+), Python 3.10+, CSS3.
- **Dev Tools**: Git/GitHub, Docker, npm, Uvicorn.
- **Live URL**: https://avanza.it.com
