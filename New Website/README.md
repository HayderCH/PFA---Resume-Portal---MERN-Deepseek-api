# CV Marketplace Platform

Welcome to the CV Marketplace Platform! This project is designed to be a comprehensive solution for candidates to showcase their validated skills and for companies to find top-tier talent. The platform leverages LLM technology for CV analysis and credibility testing.

## Key Features

The platform offers distinct functionalities based on user roles:

### 1. Candidate Portal
*   **Sign Up & Login:** Secure authentication for candidates.
*   **Dashboard:** Personalized space to manage their profile and track progress.
*   **CV Upload:** Candidates can upload their CVs. The system (currently using placeholders, to be integrated with an LLM like Deepseek) extracts information and provides an initial CV score.
*   **Credibility Test:** Candidates undergo an LLM-simulated interview to validate their CV claims, resulting in a credibility score and a final weighted profile score.
    *   Scores are broken down by Education / Projects / Certifications / Skill / Experience.
    *   Three main score sections: Initial CV Score, Credibility Score, and Final Weighted Score.

### 2. Company Portal
*   **Sign Up & Login:** Secure authentication for company representatives.
*   **Dashboard:** Overview of company activities and purchased packs.
*   **Marketplace:**
    *   Browse and purchase "Profile Packs" – curated lists of candidates ranked by their validated metrics.
    *   Packs are categorized by industry, skillset, etc.
    *   **Featured Section:** Highlights top or specially selected candidate profiles (this section is intended for a future recommendation system if implemented).
*   **Credibility Test Contribution:** Companies can upload their own credibility test scenarios or questions. This helps in evaluating and improving the platform's LLM assessment capabilities.

### 3. Admin Portal
*   **Sign Up & Login:** Secure authentication for platform administrators.
*   **Dashboard:** General website analytics and overview displays.
*   **CRUD Operations:** Essential management functionalities for users, profiles, and other platform data.
*   **Test Approval:** Admins can review, approve, or reject credibility tests submitted by companies.

## Tech Stack
*   **Frontend:** React, TypeScript
*   **Styling:** Tailwind CSS
*   **Backend & Database:** Supabase (PostgreSQL)
*   **Package Manager:** npm

## Getting Started

To get the project up and running on your local machine, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    ```
    (Alternatively, download the ZIP file and extract it.)

2.  **Navigate to the project directory:**
    ```bash
    cd <project-directory-name>
    ```

3.  **Install dependencies:**
    ```bash
    npm i
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application should now be running, typically on `http://localhost:3000` or another port specified in your Next.js/Vite configuration.

## Database Configuration (Supabase)

This project uses **Supabase** for its database and backend services, chosen for its flexibility and modern feature set.

*   **Using your own Supabase instance:**
    To connect the project to your own Supabase database, you'll need to update the API URL and anon key. Modify these in the following file:
    `integrations/supabase/client.ts`

*   **Using the pre-configured development database:**
    For ease of testing and development, the project might be pre-configured to use a shared development Supabase instance. If so, you can skip the above step for initial testing.

## Demo Accounts

While you can sign up for new accounts, the following pre-made accounts are available for the best demonstration experience:

*   **Candidate:** `candidate@example.com`
*   **Company:** `company@example.com`
*   **Admin:** `admin@example.com`

**Password for all demo accounts:** `123456789`