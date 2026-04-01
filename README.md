# Enterprise Backend

Node.js + Express backend platform for enterprise solutions, with PostgreSQL, POPIA-compliant lead handling, behavior tracking, and dynamic recommendations.

## Table of Contents

- [Setup](#setup)
- [Environment Variables](#environment-variables)
- [API Routes](#api-routes)
- [Database Schema](#database-schema)
- [Deployment on Render](#deployment-on-render)

---

## Setup

### Prerequisites

- Node.js >= 18
- PostgreSQL >= 14

### Local Development

```bash
# 1. Clone the repository
git clone https://github.com/Nhlobo/enterprise-backend.git
cd enterprise-backend

# 2. Install dependencies
npm install

# 3. Copy and configure environment variables
cp .env.example .env
# Edit .env with your database credentials and secrets

# 4. Set up the database
psql -U postgres -d enterprise_db -f schema.sql

# 5. Start the development server
npm run dev
```

The server starts on `http://localhost:3001`.

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment (`development`, `production`, `test`) | `development` |
| `PORT` | Server port | `3001` |
| `DATABASE_URL` | PostgreSQL connection string | — |
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_NAME` | PostgreSQL database name | `enterprise_db` |
| `DB_USER` | PostgreSQL user | `postgres` |
| `DB_PASSWORD` | PostgreSQL password | — |
| `JWT_SECRET` | Secret for JWT signing | — |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window in ms | `900000` |
| `RATE_LIMIT_MAX` | Max requests per window | `100` |

---

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/health` | Health check |
| GET | `/api/solutions` | List all solutions |
| GET | `/api/solutions/:slug` | Get solution by slug |
| GET | `/api/solutions/industry/:industryId` | Solutions by industry |
| GET | `/api/industries` | List all industries |
| GET | `/api/industries/:slug` | Get industry by slug |
| GET | `/api/case-studies` | List all case studies |
| GET | `/api/case-studies/:slug` | Get case study by slug |
| GET | `/api/case-studies/industry/:industryId` | Case studies by industry |
| POST | `/api/leads` | Submit a lead (POPIA consent required) |
| GET | `/api/leads` | List all leads |
| DELETE | `/api/leads/:id` | Delete a lead (right to erasure) |
| POST | `/api/track` | Track a behavior event |
| GET | `/api/track/session/:sessionId` | Get session behavior logs |
| GET | `/api/recommendations` | Get personalized recommendations |

### Lead Submission (POPIA Compliant)

```json
POST /api/leads
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "company": "Acme Corp",
  "phone": "+27123456789",
  "message": "I'm interested in your services.",
  "sessionId": "uuid-session-id",
  "consentGiven": true
}
```

> `consentGiven` must be `true` — leads without consent are rejected with HTTP 422.

### Behavior Tracking

```json
POST /api/track
{
  "sessionId": "optional-existing-session-uuid",
  "eventType": "pageview",
  "pageUrl": "/solutions/erp-platform",
  "metadata": { "referrer": "https://google.com" }
}
```

---

## Database Schema

Run `schema.sql` against your PostgreSQL database:

```bash
psql -U postgres -d enterprise_db -f schema.sql
```

Tables created:
- `sessions` — visitor sessions
- `behavior_logs` — behavioral events per session
- `industries` — industry categories
- `solutions` — platform solutions
- `case_studies` — client case studies
- `leads` — POPIA-compliant lead records

---

## Deployment on Render

### 1. Create a PostgreSQL Database

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New** → **PostgreSQL**
3. Fill in name, region, plan
4. After creation, copy the **External Database URL**
5. Run `schema.sql` against the new database:
   ```bash
   psql <your-render-database-url> -f schema.sql
   ```

### 2. Deploy the Backend

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New** → **Web Service**
3. Connect your GitHub repository (`Nhlobo/enterprise-backend`)
4. Configure:
   - **Runtime:** Node
   - **Build Command:** `npm ci`
   - **Start Command:** `npm start`
5. Add Environment Variables:
   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |
   | `DATABASE_URL` | *(from Render PostgreSQL)* |
   | `JWT_SECRET` | *(generate a secure random string)* |
   | `RATE_LIMIT_MAX` | `100` |
6. Click **Create Web Service**

### 3. Health Check

Render will automatically ping `/health` to verify the service is running.

---

## POPIA Compliance

This platform is designed with POPIA (Protection of Personal Information Act) compliance in mind:

- **Consent**: All lead submissions require explicit consent (`consentGiven: true`)
- **Right to Erasure**: `DELETE /api/leads/:id` allows deletion of personal data
- **Minimal Data**: Only necessary personal information is collected
- **Audit Trail**: All lead submissions are timestamped
- **Secure Storage**: Data is stored in a managed PostgreSQL database

---

## CI/CD

The `.github/workflows/ci.yml` workflow runs on every push to `main`:

1. Installs dependencies (`npm ci`)
2. Runs build check (`npm run build`)
3. Lints code (`npm run lint`)
4. Runs tests with coverage (`npm test`)

---

## Project Structure

```
enterprise-backend/
├── controllers/          # Route handlers
│   ├── solutionsController.js
│   ├── industriesController.js
│   ├── caseStudiesController.js
│   ├── leadsController.js
│   └── trackingController.js
├── routes/               # Express routers
│   ├── solutions.js
│   ├── industries.js
│   ├── caseStudies.js
│   ├── leads.js
│   ├── tracking.js
│   └── recommendations.js
├── services/             # Business logic
│   ├── leadService.js
│   └── recommendationsService.js
├── middleware/           # Express middleware
│   ├── logging.js
│   ├── rateLimiter.js
│   └── validateInput.js
├── models/               # Data access layer
│   ├── session.js
│   ├── behaviorLog.js
│   ├── lead.js
│   ├── solution.js
│   ├── industry.js
│   └── caseStudy.js
├── utils/                # Shared utilities
│   ├── db.js
│   └── logger.js
├── tests/                # Jest test suites
│   ├── health.test.js
│   ├── middleware.test.js
│   ├── services.test.js
│   └── routes.test.js
├── schema.sql            # PostgreSQL schema
├── server.js             # Application entry point
├── .env.example          # Environment variable template
└── README.md
```
