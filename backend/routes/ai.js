import { Router } from 'express';
import Groq from 'groq-sdk';
import verifyToken from '../middleware/verifyToken.js';
import User from '../models/User.js';

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

async function getCandidateContext(userId) {
  const user = await User.findById(userId).select('profile');
  const p = user?.profile || {};
  return [
    p.name        && `Candidate name: ${p.name}`,
    p.currentRole && `Current/last role: ${p.currentRole}`,
    p.experience  && `Experience level: ${p.experience}`,
    p.skills      && `Key skills: ${p.skills}`,
    p.bio         && `About the candidate: ${p.bio}`,
  ].filter(Boolean).join('\n');
}

// POST /api/ai/cover-letter
router.post('/cover-letter', async (req, res) => {
  const { company, role, notes } = req.body;
  try {
    const candidate = await getCandidateContext(req.user.userId);
    const result = await chat(
      'You are an expert career coach writing for the Indian job market. Write a concise, compelling, personalized cover letter in 3 short paragraphs. Address it to the Hiring Manager. Be specific to the role and company. Use the candidate profile to make it personal.',
      `${candidate ? candidate + '\n\n' : ''}Company: ${company}\nRole: ${role}\nJob notes: ${notes}\n\nWrite a cover letter.`
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
    const candidate = await getCandidateContext(req.user.userId);
    const result = await chat(
      'You are an expert interview coach. Generate exactly 10 likely interview questions for this role with a concise ideal answer for each. Tailor answers to the candidate\'s background if provided. Format as numbered list: Question then Answer.',
      `${candidate ? candidate + '\n\n' : ''}Company: ${company}\nRole: ${role}\nNotes: ${notes}`
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

// POST /api/ai/cold-email
router.post('/cold-email', async (req, res) => {
  const { company, role, notes } = req.body;
  try {
    const candidate = await getCandidateContext(req.user.userId);
    const result = await chat(
      'You are an expert at writing cold outreach messages for job seekers in the Indian job market. Write a short, genuine cold email or LinkedIn message (60–90 words) to a recruiter or hiring manager at the target company. It should feel personal and human — not templated. Include a clear reason for reaching out, a one-line value pitch based on the candidate\'s background, and a soft call to action. No subject line needed.',
      `${candidate ? candidate + '\n\n' : ''}Company: ${company}\nRole: ${role}\nJob notes: ${notes}\n\nWrite a cold outreach message.`
    );
    res.json({ result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
