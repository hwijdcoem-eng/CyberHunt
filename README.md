# Operation Blackout: HWIJDCOEM Vault

Welcome to the CyberHunt platform for **Operation Blackout**, built by HWIJDCOEM.

## Setup Instructions

This platform uses **Supabase** as the backend (PostgreSQL database + auth).

### 1. Environment Variables
Create a `.env.local` file in the root of the project with the following keys.
Do **NOT** commit this file to version control.

```env
# Supabase (public — safe for client)
NEXT_PUBLIC_SUPABASE_URL="YOUR_SUPABASE_PROJECT_URL"
NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"

# Supabase (server-only — NEVER expose to client)
SUPABASE_SERVICE_ROLE_KEY="YOUR_SUPABASE_SERVICE_ROLE_KEY"

# JWT signing secret (generate with: openssl rand -base64 32)
NEXTAUTH_SECRET="your-random-secret-at-least-32-chars"

# Resend API key for email
RESEND_API_KEY="your_resend_api_key"

# Admin login secret
ADMIN_SECRET="your_admin_secret"
```

### 2. Installation
Install all Node dependencies by running:
```bash
npm install
```

### 3. Running the Development Server
Once dependencies are installed and your `.env.local` is configured, start the server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3001) with your browser to see the result.

## Architecture & Routes
- `/`: The main landing and login page.
- `/rules`: The Terms of Engagement onboarding page.
- `/dashboard`: The centralized hub for fragments, hints, and proof submissions.
- `/admin/login`: The secret admin portal.
- `/admin/submissions`: The volunteer control center for verifying proofs and disqualifying teams.

for pdf 
npm install jspdf jspdf-autotable for pdf

SUPABASE: COMMAND TO INSTALL 
npm install @supabase/supabase-js
PASS : eDKunpCMfs5QysVo
login for user : test@example.com
pass : TEST-ALPHA

FOR ADMIN : HWI2026

SAGAR :


Email: test@example.com | ID/Passcode: TEST-ALPHA
Email: beta@example.com | ID/Passcode: TEST-BETA
Email: gamma@example.com | ID/Passcode: TEST-GAMMA
Email: delta@example.com | ID/Passcode: TEST-DELTA
Email: epsilon@example.com | ID/Passcode: TEST-EPSILON
Email: zeta@example.com | ID/Passcode: TEST-ZETA
Email: eta@example.com | ID/Passcode: TEST-ETA
Email: theta@example.com | ID/Passcode: TEST-THETA
Email: iota@example.com | ID/Passcode: TEST-IOTA
Email: kappa@example.com | ID/Passcode: TEST-KAPPA