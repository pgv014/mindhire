# MindHire AI

An AI-powered mock interview platform that helps candidates practice interviews and receive structured feedback in real time. The platform also provides recruiters with a dashboard to track candidate performance and interview analytics.

## Overview

MindHire AI simulates technical interviews using Anthropic Claude. Candidates can select a role and difficulty level, answer interview questions, and receive detailed evaluations covering technical knowledge, communication skills, and problem-solving ability.

The project was developed as part of the Ethara.AI Full-Stack Assessment.

## Features

* AI-generated mock interviews
* Role-specific interview questions
* Multiple difficulty levels (Entry, Mid, Senior)
* Real-time feedback after responses
* Automated candidate scoring
* Recruiter analytics dashboard
* Skill-based performance breakdown
* Rate-limited and secure API endpoints

## Supported Roles

* Frontend Engineer
* Backend Engineer
* Full Stack Engineer
* Data Scientist
* Product Manager
* UI/UX Designer

## Project Structure

```text
mindhire-ai/
├── client/
│   └── mindhire-ai.html
│
├── server/
│   ├── index.js
│   ├── package.json
│   ├── .env.example
│   └── .env
│
└── README.md
```

## Tech Stack

### Frontend

* HTML5
* CSS3
* JavaScript (ES6)
* Google Fonts

### Backend

* Node.js
* Express.js
* Anthropic Claude API
* Helmet
* Express Rate Limit
* CORS
* Dotenv

## Installation

### Backend Setup

```bash
cd server
npm install
```

Create a `.env` file using the example file:

```bash
cp .env.example .env
```

Add your Anthropic API key:

```env
ANTHROPIC_API_KEY=your_api_key
```

Start the server:

```bash
npm run dev
```

or

```bash
npm start
```

The backend will run on:

```text
http://localhost:5000
```

### Frontend Setup

Open the HTML file directly in your browser:

```bash
client/mindhire-ai.html
```

Or serve the client directory:

```bash
npx serve client
```

## API Endpoints

| Method | Endpoint                 | Description                        |
| ------ | ------------------------ | ---------------------------------- |
| GET    | `/api/health`            | Health check                       |
| POST   | `/api/interview/start`   | Start interview session            |
| POST   | `/api/interview/respond` | Submit answer and get feedback     |
| POST   | `/api/interview/end`     | End interview and generate results |
| GET    | `/api/dashboard/stats`   | Dashboard statistics               |

## Security

* Secure HTTP headers using Helmet
* API rate limiting
* Environment-based configuration
* Restricted CORS policy
* Sensitive credentials stored in environment variables

## Future Improvements

* Interview history and user accounts
* Resume-based interview customization
* Voice-enabled interviews
* Detailed analytics and reporting
* Database integration for persistent storage

## License

MIT License
