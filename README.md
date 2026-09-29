🧠 RECALL-OPS

AI-Powered Incident Investigation & SRE Memory System

RECALL-OPS is an AI-powered incident investigation system designed to help SRE and engineering teams diagnose production incidents faster by combining incident analysis, persistent operational memory, and automated investigation workflows.

The system uses Hindsight as a memory layer so that previous incidents, investigation findings, and operational knowledge can be recalled and used during future investigations.

⸻

🚀 Project Status

Status: MVP / Working Prototype

The core backend, Hindsight integration, incident investigation flow, memory retrieval, and initial frontend integration have been implemented and tested locally.

✅ Completed

* Project structure created
* Python virtual environment configured
* Backend application created
* Environment configuration with .env
* Hindsight integration
* Hindsight client connectivity tested
* Incident investigation API
* Incident symptoms processing
* Incident memory retrieval
* Operational knowledge recall
* Incident seed data
* /health endpoint
* Incident investigation endpoint
* Backend API tested using curl
* Hindsight memory bank tested
* Recall testing for previous incidents
* Frontend API integration started
* api.ts created for frontend/backend communication
* Lucide React icons integrated
* Git repository initialized
* .gitignore configured
* Initial Git commit prepared
* GitHub repository configured

⸻

🎯 Problem

Production incidents often require engineers to search through:

* Previous incident reports
* Logs
* Runbooks
* Slack conversations
* Monitoring alerts
* Documentation
* Previous troubleshooting decisions

This creates a major problem:

The same incident patterns can repeatedly consume engineering time because organizational knowledge is difficult to retrieve at the moment it is needed.

RECALL-OPS addresses this by creating a persistent operational memory for incident investigation.

⸻

💡 Solution

RECALL-OPS receives an incident and its symptoms, investigates the likely causes, retrieves relevant historical incidents from Hindsight, and provides useful operational context.

Example

Input:

{
  "service": "checkout-service",
  "symptoms": [
    "HTTP 503",
    "database connection acquisition delays"
  ]
}

The system can use previous operational memory to identify similar incidents and retrieve information such as:

* Previous occurrences
* Known root causes
* Investigation steps
* Successful remediation
* Related infrastructure problems
* Operational patterns

⸻

🏗️ Architecture

                    ┌─────────────────────┐
                    │      Engineer       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │     RECALL-OPS      │
                    │     Frontend UI     │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │     Backend API     │
                    │      FastAPI        │
                    └──────────┬──────────┘
                               │
                ┌──────────────┴──────────────┐
                │                             │
                ▼                             ▼
      ┌─────────────────┐           ┌──────────────────┐
      │ Incident Engine │           │     Hindsight    │
      │ Investigation   │◄─────────►│ Operational      │
      │                 │           │ Memory           │
      └────────┬────────┘           └──────────────────┘
               │
               ▼
      ┌─────────────────┐
      │ Investigation   │
      │ Results         │
      └─────────────────┘

⸻

🧩 Core Components

1. Incident Investigation API

The backend exposes an investigation endpoint:

POST /api/incidents/investigate

Example request:

{
  "service": "checkout-service",
  "symptoms": [
    "HTTP 503",
    "database connection acquisition delays"
  ]
}

The endpoint processes the incident and uses operational memory to assist the investigation.

⸻

2. Health Check

The backend provides a health endpoint:

GET /health

Example response:

{
  "status": "ok"
}

This allows the system to verify that the backend is running correctly.

⸻

🧠 Hindsight Integration

Hindsight provides the persistent memory layer for RECALL-OPS.

The system can store and retrieve operational knowledge associated with incidents.

Memory workflow

Incident
   │
   ▼
Extract symptoms
   │
   ▼
Generate investigation context
   │
   ▼
Query Hindsight
   │
   ▼
Retrieve related incidents
   │
   ▼
Use historical knowledge
   │
   ▼
Generate investigation result

This allows RECALL-OPS to become more useful as more incidents are recorded.

⸻

🔍 Example Investigation

Incident

Service:
checkout-service
Symptoms:
- HTTP 503
- Database connection acquisition delays

Investigation

RECALL-OPS searches its operational memory for similar incidents.

Example query:

checkout-service HTTP 503 database connection acquisition delays

The retrieved information can provide historical context about:

* Database connection pool exhaustion
* Increased request latency
* Infrastructure failures
* Dependency failures
* Previous remediation steps

⸻

🌱 Seed Incident Data

The project includes:

seed_incidents.py

This is used to populate the operational memory with initial incident knowledge for testing and development.

The seed data makes it possible to test the recall functionality before a large collection of real production incidents exists.

⸻

🧪 Testing

The Hindsight integration can be tested using:

test_hindsight.py

The project also includes API-level testing using curl.

Example:

curl -s http://localhost:8000/health

Incident investigation:

curl -s -X POST http://localhost:8000/api/incidents/investigate \
  -H "Content-Type: application/json" \
  -d '{
    "service": "checkout-service",
    "symptoms": [
      "HTTP 503",
      "database connection acquisition delays"
    ]
  }'

⸻

📁 Project Structure

RECALL-OPS/
│
├── backend/
│   │
│   ├── app/
│   │   ├── ...
│   │   └── ...
│   │
│   ├── seed_incidents.py
│   ├── test_hindsight.py
│   ├── .env
│   ├── .gitignore
│   └── ...
│
├── frontend/
│   └── ...
│
└── README.md

.env and .venv are excluded from Git using .gitignore.

⸻

⚙️ Technology Stack

Backend

* Python
* FastAPI
* REST API
* Hindsight

Frontend

* React
* TypeScript
* API integration
* Lucide React

Memory

* Hindsight
* Persistent incident recall

Development

* Git
* GitHub
* Python virtual environment
* cURL

⸻

🔐 Environment Variables

Create a .env file inside the backend:

HINDSIGHT_URL=your_hindsight_url

Additional environment variables can be added as the project evolves.

Never commit .env to GitHub.

⸻

🛠️ Local Development

1. Clone the repository

git clone https://github.com/cheswinvaddi/RECALL-OPS.git
cd RECALL-OPS

2. Enter the backend

cd backend

3. Create virtual environment

python3 -m venv .venv

4. Activate environment

macOS/Linux:

source .venv/bin/activate

5. Install dependencies

pip install -r requirements.txt

6. Configure environment

Create:

.env

and add the required Hindsight configuration.

7. Start the backend

uvicorn app.main:app --reload --port 8000

⸻

🧪 API Testing

Check backend health:

curl http://localhost:8000/health

Investigate an incident:

curl -X POST http://localhost:8000/api/incidents/investigate \
  -H "Content-Type: application/json" \
  -d '{
    "service": "checkout-service",
    "symptoms": [
      "HTTP 503",
      "database connection acquisition delays"
    ]
  }'

⸻

🔄 Current Workflow

Engineer reports incident
        ↓
RECALL-OPS receives symptoms
        ↓
Incident context is created
        ↓
Hindsight is queried
        ↓
Historical incidents are recalled
        ↓
Relevant operational knowledge is identified
        ↓
Investigation result is generated
        ↓
Engineer receives actionable context

⸻

📈 Future Roadmap

Phase 1 — Foundation

* Backend API
* Health check
* Hindsight connection
* Incident investigation
* Initial memory retrieval
* Seed incidents

Phase 2 — Intelligence

* Improved incident similarity
* Root-cause analysis
* Automatic incident summarization
* Confidence scoring
* Suggested remediation
* Related incident detection

Phase 3 — SRE Intelligence

* Log analysis
* Metrics integration
* Trace analysis
* Runbook retrieval
* Automated diagnosis
* Incident timeline generation

Phase 4 — Production Platform

* Authentication
* Multi-user support
* Incident dashboard
* Observability integrations
* Slack integration
* PagerDuty integration
* Kubernetes integration
* Production deployment

⸻

🎯 Vision

RECALL-OPS aims to become an AI operational memory layer for engineering teams.

Instead of asking:

“Has this happened before?”

Engineers should be able to immediately retrieve:

What happened, why it happened, how it was investigated, and what fixed it last time.

The long-term goal is to transform historical incident knowledge into an always-available operational intelligence system.

⸻

👨‍💻 Author

Cheswin Vaddi

GitHub:
https://github.com/cheswinvaddi

⸻

📄 License

License information will be added as the project is finalized.
