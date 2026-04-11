# Avanza Platform: Full System Audit
**Status Date:** April 11, 2026

## 1. Fully Working Features (End-to-End)
These features are production-ready, connected to the backend, and integrated with Supabase/Stytch/SendGrid.

### 🔐 Authentication & Security
- **Email Magic Links**: Handled via Stytch.
- **Session Verification**: Every API call to the backend is cryptographically verified.
- **Role-Based Access**: Specialized views for standard Users vs. Admin users.

### 📋 Intelligent Onboarding
- **Multi-Step Collection**: Captures personal, academic, and professional data.
- **Persistence**: Saves specifically to the `onboarding_profiles` table.
- **Profile Rendering**: Automatically populates the dashboard with data from `/api/user/full-profile`.

### 🛡️ Document Vault (The "Cloud Drive")
- **File Management**: Full CRUD support (Upload, View, Delete) for academic documents.
- **Secure Storage**: Files are stored in Supabase Authenticated Buckets.
- **Status Badges**: Real-time UI updates for `Verified`, `Rejected`, and `Pending` statuses.

### ⚡ Administrative Control
- **User Management**: Admins can search users by Email or Name.
- **Verification Workflow**: Admins can Approve or Reject documents with a custom feedback note.
- **Email Notifications**: Triggers transactional emails via SendGrid when a document status changes.

### 📜 Professional PDF Dossier
- **Institutional Branding**: Generates a high-quality PDF with the Avanza logo and custom header.
- **Unique Trackability**: Includes a unique `Dossier ID` and timestamp for each generation.

---

## 2. Incomplete / Placeholder Features
These components exist in the UI but require additional logic or third-party API keys to be fully "intelligent."

*   **AI CV Generator**: UI collects all data and shows a preview, but it isn't currently hitting an LLM (GPT-4) for rewriting or exporting to PDF/Word.
*   **Real-time Job Matching**: Currently returns a list of mock nurse/care roles. Needs integration with a job API (Indeed/LinkedIn).
*   **Partner Translators**: Displays a static list of 4 agencies. Not a dynamic or searchable directory.
*   **CIMEA Direct Connect**: Provides instructions and links, but doesn't have a direct API status sync with CIMEA's internal systems.

---

## 3. Project File Inventory

| File | Module | Description |
| :--- | :--- | :--- |
| `backend/main.py` | Core Logic | The primary FastAPI server handling all DB, Email, and PDF logic. |
| `src/pages/Dashboard.jsx` | UI Shell | The central hub where users track their recognition progress. |
| `src/pages/AdminPortal.jsx` | Admin Hub | Searchable list of all users and their document statuses. |
| `src/pages/DocumentVault.jsx` | File UI | Secure interface for document management and feedback notes. |
| `src/pages/Onboarding.jsx` | Forms | Complex state-managed forms for profile building. |
| `src/LanguageContext.jsx` | Localization | Context provider for toggling between IT, EN, and other languages. |
| `src/translations/index.js` | Strings | Centralized translation dictionary for the entire platform. |
| `index.html` | Branding | Official SEO tags and initial brand configuration for `avanza.it.com`. |

---

## 4. Environment Configuration
The system relies on the following variables being correctly set:
- `VITE_API_URL`: Backend endpoint.
- `SENDGRID_API_KEY`: For transactional emails.
- `STYTCH_PROJECT_ID`: For authentication.
- `SUPABASE_URL` / `SERVICE_KEY`: For database and storage.
- `VITE_ADMIN_EMAILS`: Authorized admin list.
