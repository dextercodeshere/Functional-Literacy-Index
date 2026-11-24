# India — Literacy, Knowledge & Data Platform
### Independent National Public Research, Assessment & Data Journalism Platform (Version 1.0)

[![Platform Version](https://img.shields.io/badge/Platform%20Version-V1.0%20Release-0A4D5C)](https://github.com)
[![Next.js](https://img.shields.io/badge/Next.js-14.2%20App%20Router-black)](https://nextjs.org)
[![Database](https://img.shields.io/badge/Database-Native%20Node%20SQLite%20(WAL)-003B46)](https://nodejs.org)
[![Question Repository](https://img.shields.io/badge/Question%20Bank-140%20Verified%20Items-10B981)](/admin)
[![Telemetry](https://img.shields.io/badge/Telemetry-Real--Time%20Live%20Database-D97706)](/)

---

## 1. Executive Overview

The **India Literacy, Knowledge & Data Platform** is an independent, non-governmental public information initiative designed to assess functional everyday literacy, explore cultural and geographical knowledge through interactive trivia, and present foundational demographic data through transparent mathematical explanations.

This platform is intentionally architected **not** as an academic examination portal or an administrative testing tool, but as a premium national research and data journalism hub.

### Core Pillars
1. **Literacy Survey (Default Landing Page)**: A 35-question adaptive assessment tracking functional comprehension across 5 progressive proficiency tiers, providing instant personalized diagnostics and printable proficiency summaries.
2. **Explore India**: A curated Indian general knowledge and cultural trivia module with instant verified source citations and category filters.
3. **Interactive Facts ("India in Numbers")**: Data journalism cards summarizing key demographic metrics, complete with step-by-step mathematical formulas and live interactive sliders allowing citizens to recalculate figures under custom parameters.
4. **Platform Control Center (Admin Portal)**: Secure administrator interface with live real-time participant telemetry, a 140-question repository inspector with answer keys, release version management, and one-click anonymized CSV/JSON dataset export.

---

## 2. Design System & Visual Identity

The platform adheres to an editorial, trustworthy, and minimalist visual language inspired by premier data journalism publications and modern research institutes.

- **Color Palette**:
  - **Deep Petroleum Teal (`#0A4D5C`)**: Primary brand identity, featured in hero banners, card accents, and category badges.
  - **Deep Navy Text (`#0A192F` / `#0F172A`)**: High-contrast, publication-grade typography.
  - **Off-White & Cream Backgrounds (`#FBFBF9` / `#FAF9F6`)**: Low-glare, comfortable reading canvas.
  - **Subtle Accents**: Vibrant Emerald Green (`#10B981`) for completed statuses and benchmark attainments; Warm Amber/Saffron (`#F59E0B`) for callouts and mathematical highlights.
- **Form & Geometry**:
  - Replaces boxy sharp corners with smooth **horizontal oval cylinder shapes** (`rounded-full` pills, capsule tabs, and `rounded-3xl` container cards).
- **Typography**:
  - **Editorial Serif** (`Newsreader`, `Georgia`, `serif` with bold and italic accents) for headlines, titles, and key metrics.
  - **Crisp Modern Sans-Serif** (`SF Pro`, `Inter`, `system-ui`) for user interface controls, question stimuli, options, and tables.
- **Ethical Safeguards**:
  - No Government of India emblems, official logos, or misleading representations.
  - Prominent mandatory platform disclaimer on all participation dashboards:
    > *"These results represent participants who completed this platform's assessment. They are not a representative estimate of India's national literacy rate."*

---

## 3. Technology Stack

| Layer | Technology | Key Architecture Details |
|---|---|---|
| **Framework** | Next.js 14.2.18 | App Router (`/app`), Server Components & Route Handlers (`force-dynamic`) |
| **UI Library** | React 18 | Client components with local state, interactive sliders, and modal drawers |
| **Styling** | Tailwind CSS | Custom cylinder pills, soft shadow elevations, responsive grid layouts |
| **Icons** | Lucide React | Clean, modern feather-style iconography |
| **Database** | Node 24 Native SQLite (`node:sqlite`) | Built-in `DatabaseSync` in WAL mode (`PRAGMA journal_mode = WAL; PRAGMA busy_timeout = 5000;`). Eliminates external DB servers and native C++ compilation issues. |
| **Telemetry** | Live Database Aggregation | Zero artificial offsets. Pure real-time SQLite queries on sessions and results. |

---

## 4. Complete 140-Question Repository

The platform ships with a comprehensive repository of **140 peer-calibrated literacy assessment questions** distributed evenly across 4 distinct sets. Each set contains exactly **35 questions** structured across **5 progressive proficiency tiers** (7 questions per level per set).

### Question Set Distribution

| Set Code | Name | Focus & Stimulus Domains | Items | Status |
|---|---|---|---|---|
| `SET_A` | Set A — Core Foundation & Functional Literacy | Sentence comprehension, public notices, transit schedules, utility billing math, and multi-source public text | 35 | Active in V1 |
| `SET_B` | Set B — Analytical Framework & Daily Interpretations | Contextual vocabulary, clinic hours, multi-step commerce, discount logic, and comparative instructions | 35 | Active in V1 |
| `SET_C` | Set C — Quantitative Reasoning & Consumer Data | Revenue/profit margins, electricity slabs, medication dosage, and dietary facts | 35 | Active in V1 |
| `SET_D` | Set D — Critical Media & Public Systems Literacy | Scheme eligibility, municipal budgeting, media verification, and research design | 35 | Active in V1 |
| **Total** | | | **140** | **Fully Seeded** |

### Progressive Proficiency Tiers (7 Questions per Level)

1. **Level 1 — Foundation**:
   - Sentence-level reading comprehension, contextual vocabulary, simple written notices, basic single-step arithmetic, everyday cash numeracy, safe verification of unknown links/messages, and simple numerical sequencing.
2. **Level 2 — Everyday Reader**:
   - Clinic timetables, metro schedules, medicine label usage, multi-pack grocery arithmetic, bill calculation with currency change, safety advisories, and transit duration reasoning.
3. **Level 3 — Functional Thinker**:
   - Tiered electricity utility tariffs, two-step discounts, warranty period calculations, SMS verification procedures, and multi-leg journey planning.
4. **Level 4 — Analytical Mind**:
   - Successive percentage increases and discounts, corporate revenue vs. expense profit shifts, tiered retail unit pricing, comparison of competing financial offers, and data table synthesis.
5. **Level 5 — Master Interpreter**:
   - Government welfare scheme coverage evaluation (registered vs. total eligible populations), public municipal budget allocations, media bias and source fact-checking, and three-constraint research design optimization.

### Arithmetic & Key Corrections Verified
During question repository calibration, three arithmetic and answer key updates were verified and permanently encoded into the database:

1. **Level 4 — Set B, Question 4 (Successive Price Adjustments)**:
   - *Question*: A product's price increases by 15% from ₹2,000. It is then discounted by 10% on the increased price. What is the final price?
   - *Calculation*: ₹2,000 × 1.15 = ₹2,300. Discount = 10% of ₹2,300 = ₹230. Final price = ₹2,300 − ₹230 = **₹2,070**.
   - *Key Correction*: **Option A (₹2,070)** is correct. Duplicate option C was eliminated.
2. **Level 4 — Set C, Question 5 (Corporate Net Profit Shift)**:
   - *Question*: A company's revenue rises from ₹8 lakh to ₹10 lakh. Its expenses rise from ₹5 lakh to ₹6.5 lakh. By how much does its profit increase?
   - *Calculation*: Initial profit = ₹8,00,000 − ₹5,00,000 = ₹3,00,000. Final profit = ₹10,00,000 − ₹6,50,000 = ₹3,50,000. Increase = ₹3,50,000 − ₹3,00,000 = **₹50,000**.
   - *Key Correction*: **Option B (₹50,000)** is correct.
3. **Level 4 — Set D, Question 4 (Retail Tiered Sales Profit)**:
   - *Question*: A retailer buys 50 units of a product at ₹400 each. It sells 40 units at ₹550 each and the remaining 10 units at ₹350 each. What is the total profit?
   - *Calculation*: Total Cost = 50 × ₹400 = ₹20,000. Revenue = (40 × ₹550) + (10 × ₹350) = ₹22,000 + ₹3,500 = ₹25,500. Profit = ₹25,500 − ₹20,000 = **₹5,500**.
   - *Key Correction*: Option B set to **₹5,500** and encoded as the correct answer.

---

## 5. Live Real-Time Telemetry (Zero Fake Numbers)

All dashboard metrics, API endpoints, and administrator overviews display **strictly live, genuine database telemetry**. All demonstration baseline numbers (e.g. artificial `+10,000` started or `+7,000` completed offsets) have been eliminated.

### Live Metrics Formula & Aggregation

```sql
-- 1. Total Started
SELECT COUNT(*) FROM assessment_sessions;

-- 2. Total Completed
SELECT COUNT(*) FROM assessment_sessions WHERE status = 'completed';

-- 3. Benchmark Attainment Percentage
-- Defined as scoring >= 70% (25+ correct out of 35) on the assessment
SELECT 
  CASE 
    WHEN completed.cnt = 0 THEN 0.0
    ELSE ROUND((CAST(bench.cnt AS REAL) / completed.cnt) * 100, 1)
  END as benchmark_attainment_pct
FROM 
  (SELECT COUNT(*) as cnt FROM assessment_sessions WHERE status = 'completed') completed,
  (SELECT COUNT(*) as cnt FROM assessment_results WHERE meets_benchmark = 1) bench;

-- 4. Active Participating States & Union Territories
SELECT COUNT(DISTINCT state_id) FROM assessment_sessions;
```

---

## 6. Database Schema (SQLite Native)

The SQLite database file is located at `data/platform.db`. It runs in WAL mode for safe concurrent reads during parallel user sessions.

### Tables

1. **`states`**: All 36 Indian states and Union Territories with state codes and classification.
2. **`cities`**: 241 Tier-1, Tier-2, and regional district cities mapped to parent states, plus an automatic *"Other / Unlisted City"* entry per state.
3. **`languages`**: 8 Indian languages (English, Hindi, Kannada, Telugu, Tamil, Malayalam, Marathi, Bengali) with native script renderings.
4. **`assessment_sets`**: Set registry (`SET_A`, `SET_B`, `SET_C`, `SET_D`) with version tags and activation flags.
5. **`questions`**: All 140 questions with columns:
   - `id`, `set_code`, `level_number`, `level_title`, `question_number`, `question_type`, `skill_category`, `difficulty`, `stimulus_type`, `stimulus_title`, `stimulus_content`, `stimulus_metadata`, `question_text`, `options_json`, `correct_answer`, `explanation`.
6. **`question_translations`**: Multi-language translations for stimuli, question texts, options, and explanations.
7. **`assessment_sessions`**: Participant session state:
   - `id`, `set_code`, `state_id`, `city_id`, `city_other`, `language_code`, `started_at`, `updated_at`, `completed_at`, `status`, `current_level`, `current_question`, `answers_json`, `client_ip_hash`.
8. **`assessment_results`**: Final performance calculations:
   - `id`, `session_id`, `total_score`, `max_score`, `percentage`, `meets_benchmark`, `provisional_level`, `provisional_level_num`, `category_scores_json`, `level_scores_json`, `strongest_skill`, `improvement_areas_json`, `generated_at`.
9. **`trivia_questions`**: Curated general knowledge questions with options, verified sources, and category tags.
10. **`fact_cards`**: Demographic data journalism cards with raw statistics, sources, reference dates, formulas, and JSON slider components.
11. **`statistics`**: Platform summary key-value cache synced in real time with live sessions.
12. **`admin_users`**: Administrator credentials with salted SHA-256 password hashing.

---

## 7. How to Launch & Develop

### Prerequisites
- **Node.js**: v20.x or v24.x (Node 24 provides built-in `node:sqlite`)
- **npm**: v10.x+

### Quick Start Guide

```bash
# 1. Clone repository & navigate to folder
cd c:\dev\survey

# 2. Install dependencies (sandboxed or direct)
npm install

# 3. Seed SQLite database with all 140 questions, locations, trivia & facts
node --experimental-strip-types scripts/seed.js

# 4. Build optimized Next.js production bundle
npm run build

# 5. Start production platform server (default port 3000)
npm start
```

For development with hot reload:
```bash
npm run dev
```

The platform will be reachable at `http://localhost:3000`.

---

## 8. API Reference

All routes are located under `/api/*` and use Next.js App Router dynamic handlers.

| Route | Method | Description | Parameters / Payload |
|---|---|---|---|
| `/api/stats/overview` | `GET` | Live platform telemetry counters | None |
| `/api/locations/states` | `GET` | All 36 Indian states & union territories | None |
| `/api/locations/cities` | `GET` | Filtered cities by state | `?state_id=<id>` |
| `/api/languages` | `GET` | Supported Indian languages | None |
| `/api/assessment/start` | `POST` | Initialize participant session | Body: `{ state_id, city_id?, city_other?, language_code, set_code? }` |
| `/api/assessment/questions` | `GET` | Questions for session/set (withheld answer keys) | `?session_id=<id>&lang=<code>&set_code=<code>` |
| `/api/assessment/save-progress` | `POST` | Auto-save interim progress | Body: `{ session_id, current_level, current_question, answers }` |
| `/api/assessment/submit` | `POST` | Grade session & compute diagnostics | Body: `{ session_id, answers }` |
| `/api/assessment/results/[sessionId]` | `GET` | Fetch saved assessment result summary | Path: `sessionId` |
| `/api/trivia/questions` | `GET` | Explore India trivia questions | `?category=<category>` |
| `/api/facts` | `GET` | Demographic facts with formulas | `?category=<category>` |
| `/api/admin/login` | `POST` | Administrator authentication | Body: `{ username, password }` |
| `/api/admin/stats` | `GET` | Live telemetry & breakdown for admin | Requires auth session |
| `/api/admin/questions` | `GET` | Full question inspector with answer keys | `?set_code=<code>&level=<lvl>` |
| `/api/admin/export` | `GET` | Export anonymized participant data | `?format=csv` or `?format=json` |

---

## 9. Administrator Portal & Credentials

To access the platform control center:
1. Navigate to `/admin` in your web browser.
2. Sign in with the default research administrator credentials:
   - **Username**: `admin`
   - **Password**: `admin123`
3. The control center allows you to:
   - Monitor live participants across states and languages in real time.
   - Inspect all 140 questions across Sets A, B, C, and D with verified answer keys and explanations.
   - Review release version architecture.
   - Export anonymized participant datasets in `.csv` or `.json` formats for statistical research and reporting.

---

## 10. Privacy & Anonymity Commitment

The platform is engineered under a strict **Zero-PII (Personally Identifiable Information)** architecture:
- No names, email addresses, phone numbers, or social media logins are requested or stored.
- Geographic data is recorded solely at the broad State and City level for regional participation metrics.
- All session submissions are anonymized and hashed, ensuring individual privacy while preserving statistical integrity for public research.
