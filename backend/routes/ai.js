import { Router } from 'express';
import Groq from 'groq-sdk';
import verifyToken from '../middleware/verifyToken.js';

const router = Router();
router.use(verifyToken);

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = 'llama-3.3-70b-versatile';

async function chat(systemPrompt, userMessage) {
  const response = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ],
  });
  return response.choices[0].message.content;
}

// POST /api/ai/cover-letter
router.post('/cover-letter', async (req, res) => {
  const { company, role, notes } = req.body;
  try {
    const result = await chat(
      'You are an expert career coach. Write a concise, compelling, personalized cover letter in 3 short paragraphs. Be specific to the role and company.',
      `Company: ${company}\nRole: ${role}\nJob notes: ${notes}\nWrite a cover letter for this job.`
    );
    res.json({ result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/ai/interview-prep
router.post('/interview-prep', async (req, res) => {
  const { company, role, notes } = req.body;
  try {
    const result = await chat(
      'You are an expert interview coach. Generate exactly 10 likely interview questions for this role with a concise ideal answer for each. Format as numbered list: Question then Answer.',
      `Company: ${company}\nRole: ${role}\nNotes: ${notes}`
    );
    res.json({ result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/ai/insights
router.post('/insights', async (req, res) => {
  const { jobs } = req.body;
  try {
    const result = await chat(
      'You are a career strategist. Analyze this job search data and return: 1) Key stats summary 2) Patterns you notice 3) Top 3 actionable suggestions to improve success rate. Be direct and specific.',
      JSON.stringify(jobs)
    );
    res.json({ result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
