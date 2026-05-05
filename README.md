#  MindHire AI

> **AI-Powered Interview Platform** — Built for the Ethara.AI Full-Stack Assessment

MindHire AI is a full-stack intelligent hiring platform where candidates practice real interviews with a Claude-powered AI interviewer and get instant, structured feedback — while recruiters get a clean analytics dashboard.

---

##  Features

| Feature | Description |
|---|---|
| AI Mock Interviews | Claude AI conducts role-specific interviews with adaptive follow-ups |
| Instant Scoring | Scored on Technical, Communication & Problem Solving (0–100) |
| 6 Job Roles | Frontend, Backend, Full-Stack, Data Science, Product, Design |
| 3 Difficulty Levels | Entry / Mid / Senior |
| Recruiter Dashboard | KPIs, score charts, candidate rankings, skill breakdowns |
| Real-Time Feedback | Constructive feedback after every answer |
| Bias-Free Evaluation | AI scores purely on answer quality |

---

##  Architecture

```
mindhire-ai/
├── client/                  # React frontend (single HTML for demo)
│   └── mindhire-ai.html     # Self-contained app (open in browser)
│
├── server/                  # Node.js + Express backend
│   ├── index.js             # Main server file
│   ├── package.json
│   ├── .env.example         # Copy to .env
│   └── .env                 # Your secrets (git-ignored)
│
└── README.md
```

### Tech Stack

**Frontend**
- Vanilla JS + HTML/CSS (production-grade, no build step needed)
- Google Fonts (Syne + DM Sans + DM Mono)
- Anthropic Claude API (direct from browser for demo)

**Backend**
- Node.js + Express
- `@anthropic-ai/sdk` — Official Anthropic SDK
- `helmet` — Security headers
- `express-rate-limit` — API abuse protection
- `cors` — Cross-origin requests
- `dotenv` — Environment variable management

---

##  Quick Start

### Option A — Frontend Only (Demo Mode, No Backend Needed)

1. Open `client/mindhire-ai.html` in any browser
2. Enter your Anthropic API key in the Interview tab
3. Select a role + difficulty → Start Interview!

### Option B — Full Stack (Frontend + Backend)

**1. Clone & install backend**
```bash
cd server
npm install
```

**2. Set up environment**
```bash
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
```

**3. Start the server**
```bash
npm run dev        # Development (auto-reload)
npm start          # Production
```

Server runs at: `http://localhost:5000`

**4. Open the frontend**
```bash
# Just open client/mindhire-ai.html in your browser
# Or serve it:
npx serve client/
```

---

##  API Reference

### `GET /api/health`
Returns server status.

```json
{ "status": "ok", "timestamp": "...", "version": "1.0.0" }
```

---

### `POST /api/interview/start`
Starts a new interview session. Returns the AI's intro + first question.

**Body:**
```json
{
  "role": "Frontend Engineer",
  "difficulty": "mid"
}
```

**Response:**
```json
{
  "reply": "Hi! I'm Alex, your interviewer today...",
  "role": "Frontend Engineer",
  "difficulty": "mid",
  "questionNumber": 1
}
```

---

### `POST /api/interview/respond`
Sends a candidate answer, gets feedback + next question (or final scores).

**Body:**
```json
{
  "role": "Frontend Engineer",
  "difficulty": "mid",
  "history": [ { "role": "assistant", "content": "..." }, ... ],
  "userMessage": "I would use React with a virtual DOM approach..."
}
```

**Response (mid-interview):**
```json
{
  "type": "question",
  "reply": "Good thinking on the virtual DOM. Now let's talk about...",
  "updatedHistory": [ ... ]
}
```

**Response (end of interview):**
```json
{
  "type": "result",
  "data": {
    "action": "end_interview",
    "scores": { "technical": 82, "communication": 76, "problem_solving": 79 },
    "overall": 79,
    "summary": "Strong grasp of React fundamentals...",
    "strengths": ["React knowledge", "Clear explanations"],
    "improvements": ["System design depth", "Edge case handling"]
  }
}
```

---

### `POST /api/interview/end`
Force-ends the interview and generates scores immediately.

**Body:** Same as `/respond` (without `userMessage`)

---

### `GET /api/dashboard/stats`
Returns recruiter dashboard data.

---

##  Security

- API key is never stored server-side (per-request, passed by client)
- `helmet` sets secure HTTP headers
- Rate limiting: 30 req / 15 min per IP
- CORS restricted to `CLIENT_URL`

---

##  Deployment

See `DEPLOYMENT.md` for step-by-step instructions to deploy on:
- **Vercel** (frontend)
- **Railway / Render** (backend)
- **Netlify** (frontend alternative)

---

##  Author

Built for **Ethara.AI Full-Stack Assessment — Round 1**
Deadline: 6th May 2026, 11:00 PM

---

##  License

MIT
