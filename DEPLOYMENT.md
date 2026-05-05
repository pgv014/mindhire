# 🚀 MindHire AI — Deployment Guide

Get a **live link** for your submission in under 10 minutes using free hosting.

---

## ⚡ FASTEST: Deploy Frontend Only (5 minutes)

The `mindhire-ai.html` file is a complete, self-contained app. No backend needed for demo mode.

### Option 1 — Netlify Drop (Fastest, 2 minutes)

1. Go to **https://app.netlify.com/drop**
2. Drag & drop `mindhire-ai.html` onto the page
3. ✅ You get a live URL instantly like `https://amazing-name-123.netlify.app`

### Option 2 — GitHub Pages

```bash
# 1. Create a new GitHub repo
# 2. Upload mindhire-ai.html and rename it to index.html
# 3. Go to Settings → Pages → Source: main branch / root
# 4. Live at: https://yourusername.github.io/mindhire-ai
```

### Option 3 — Vercel CLI (3 minutes)

```bash
npm i -g vercel
mkdir mindhire && cp mindhire-ai.html mindhire/index.html
cd mindhire
vercel --yes
# Follow prompts → get live URL
```

---

## 🏗 Full-Stack Deployment (Frontend + Backend)

### Step 1 — Deploy Backend on Railway (Free)

1. Go to **https://railway.app** → New Project → Deploy from GitHub
2. Push your `server/` folder to a GitHub repo
3. Railway auto-detects Node.js and runs `npm start`
4. Add environment variables in Railway dashboard:
   ```
   ANTHROPIC_API_KEY = sk-ant-your-key
   PORT = 5000
   CLIENT_URL = https://your-frontend-url.netlify.app
   ```
5. Copy your Railway URL: `https://mindhire-server.up.railway.app`

### Alternative Backend — Render (Free)

1. Go to **https://render.com** → New → Web Service
2. Connect your GitHub repo
3. Build command: `npm install`
4. Start command: `node index.js`
5. Add the same environment variables
6. Deploy → get URL like `https://mindhire-ai.onrender.com`

---

### Step 2 — Deploy Frontend on Netlify

1. Go to **https://app.netlify.com** → Add new site → Deploy manually
2. Upload `mindhire-ai.html` (rename to `index.html`)
3. In `mindhire-ai.html`, update the API base URL at the top of the `<script>` tag:
   ```javascript
   const API_BASE = 'https://your-railway-url.up.railway.app';
   ```
4. Re-upload the updated file
5. ✅ Live URL: `https://your-app.netlify.app`

---

## 📋 Submission Checklist

Before submitting the form, make sure you have:

- [ ] Live URL working in browser
- [ ] Interview tab functional (enter API key → start interview)
- [ ] Dashboard tab showing data
- [ ] GitHub repo link (backend code + README)
- [ ] Updated resume uploaded

---

## 🔧 Troubleshooting

| Problem | Fix |
|---|---|
| CORS error | Set `CLIENT_URL` env var on backend to your frontend URL |
| API key error | Ensure key starts with `sk-ant-` and has Sonnet 4 access |
| Netlify 404 | Make sure the file is named `index.html` |
| Railway crash | Check logs → ensure `ANTHROPIC_API_KEY` is set |
| Rate limit hit | Wait 15 minutes or upgrade Anthropic API plan |

---

## 🏆 Pro Tips for Judges

- Use **Demo Mode** (browser-direct API) for the live link — simpler to review
- Include a **Loom video walkthrough** (2–3 min) showing the interview flow
- Add your GitHub repo link with clean commit history
- Make sure the README has setup instructions

Good luck! 🎯
