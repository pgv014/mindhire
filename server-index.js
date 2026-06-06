const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ── MIDDLEWARE ────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000' }));
app.use(express.json());

// Rate limiter: 30 requests / 15 min per IP
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { error: 'Too many requests. Please wait a moment.' }
}));

// ── ANTHROPIC CLIENT ──────────────────────────────────────────────
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ── SYSTEM PROMPT FACTORY ─────────────────────────────────────────
function buildSystemPrompt(role, difficulty) {
  return `You are Alex, a senior AI interviewer at a leading tech company. You're conducting a ${difficulty} difficulty interview for a ${role} position.

BEHAVIOR RULES:
1. Ask ONE question at a time — never dump multiple questions together.
2. After each candidate answer, give 2–3 lines of specific, constructive feedback, then ask the next question.
3. Conduct exactly 4–5 questions covering: technical depth, problem-solving, communication, and a situational/behavioral question.
4. Adapt follow-up questions based on the candidate's previous answers.
5. When the interview is complete (after 4–5 questions, or candidate says "done"), output ONLY this JSON (no prose around it):

{
  "action": "end_interview",
  "scores": {
    "technical": <0–100>,
    "communication": <0–100>,
    "problem_solving": <0–100>
  },
  "overall": <average of the three>,
  "summary": "<3–4 sentence honest, specific assessment>",
  "strengths": ["<strength 1>", "<strength 2>"],
  "improvements": ["<area 1>", "<area 2>"]
}

TONE: Professional but warm. Honest feedback, not flattery. Match question depth to ${difficulty} level.
ROLE CONTEXT: You're hiring for a ${role}. Tailor every question to this role specifically.`;
}

// ── ROUTES ────────────────────────────────────────────────────────

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), version: '1.0.0' });
});

// Start a new interview session — returns the first AI message
app.post('/api/interview/start', async (req, res) => {
  const { role = 'Software Engineer', difficulty = 'mid' } = req.body;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 600,
      system: buildSystemPrompt(role, difficulty),
      messages: [
        {
          role: 'user',
          content: `Please start the interview. Introduce yourself briefly (1–2 sentences) and ask your first question for the ${role} role at ${difficulty} level.`
        }
      ]
    });

    res.json({
      reply: message.content[0].text,
      role,
      difficulty,
      questionNumber: 1
    });

  } catch (err) {
    console.error('Start interview error:', err);
    res.status(500).json({ error: err.message || 'Failed to start interview' });
  }
});

// Send an answer — returns AI feedback + next question (or final scores)
app.post('/api/interview/respond', async (req, res) => {
  const { role, difficulty, history, userMessage } = req.body;

  if (!history || !userMessage) {
    return res.status(400).json({ error: 'history and userMessage are required' });
  }

  // Append new user message to history
  const messages = [
    ...history,
    { role: 'user', content: userMessage }
  ];

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 800,
      system: buildSystemPrompt(role, difficulty),
      messages
    });

    const replyText = message.content[0].text;

    // Detect end-of-interview JSON
    const jsonMatch = replyText.match(/\{[\s\S]*"action"\s*:\s*"end_interview"[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const result = JSON.parse(jsonMatch[0]);
        return res.json({ type: 'result', data: result });
      } catch (_) { /* fall through */ }
    }

    res.json({
      type: 'question',
      reply: replyText,
      updatedHistory: [...messages, { role: 'assistant', content: replyText }]
    });

  } catch (err) {
    console.error('Respond error:', err);
    res.status(500).json({ error: err.message || 'Failed to process response' });
  }
});

// End interview early — force score generation
app.post('/api/interview/end', async (req, res) => {
  const { role, difficulty, history } = req.body;

  const messages = [
    ...(history || []),
    { role: 'user', content: 'The interview is over. Please provide the final JSON evaluation now.' }
  ];

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 600,
      system: buildSystemPrompt(role, difficulty),
      messages
    });

    const replyText = message.content[0].text;
    const jsonMatch = replyText.match(/\{[\s\S]*"action"\s*:\s*"end_interview"[\s\S]*\}/);

    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      return res.json({ type: 'result', data: result });
    }

    res.json({ type: 'result', raw: replyText });

  } catch (err) {
    console.error('End interview error:', err);
    res.status(500).json({ error: err.message || 'Failed to end interview' });
  }
});

// Mock dashboard data (in production, replace with DB queries)
app.get('/api/dashboard/stats', (req, res) => {
  res.json({
    totalCandidates: 142,
    avgScore: 74,
    shortlisted: 31,
    openRoles: 8,
    scoresByRole: [
      { role: 'Frontend', avg: 78 },
      { role: 'Backend', avg: 71 },
      { role: 'Full-Stack', avg: 82 },
      { role: 'Data Science', avg: 68 },
      { role: 'Product', avg: 74 },
      { role: 'Design', avg: 85 }
    ],
    recentActivity: [
      { text: 'Priya Sharma completed Frontend interview — scored 88%', time: '2 min ago', type: 'success' },
      { text: 'Rohan Mehta applied for Backend Engineer', time: '14 min ago', type: 'info' },
      { text: 'Aisha Kapoor shortlisted for Product Manager', time: '1 hr ago', type: 'warning' }
    ]
  });
});

// ── START ─────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 MindHire AI server running at http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health\n`);
});
