import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini lazily
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({ apiKey });
  }
  return genAIClient;
}

// Check API status
app.get('/api/status', (req, res) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY);
  res.json({ status: 'ok', hasKey, model: 'gemini-3.8-flash' });
});

// Verify login password
app.post('/api/auth/verify', (req, res) => {
  const { password } = req.body;
  const expectedPassword = process.env.APP_PASSWORD || 'AiMindset';
  const trimmed = typeof password === 'string' ? password.trim() : '';

  if (trimmed === expectedPassword) {
    return res.json({ valid: true });
  }
  return res.status(401).json({ valid: false, error: 'Invalid password' });
});

// API endpoint to enhance avatar prompt
app.post('/api/gemini/enhance-prompt', async (req, res) => {
  try {
    const { originalPrompt, style, characterDetails } = req.body;
    if (!originalPrompt) {
      return res.status(400).json({ error: 'Original prompt is required' });
    }

    const ai = getGenAI();
    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API key is not configured on the server',
        fallback: true,
      });
    }

    const systemPrompt =
      'You are a master AI Prompt Engineer specialized in creating photorealistic, visually stunning AI avatars for Myanmar creators. ' +
      'Refine the prompt for high quality generation in Midjourney v6, Flux, Leonardo, or Imagen. ' +
      'Maintain exact cultural authenticity of Myanmar attire (such as Acheik silk htamein, modern Yinzi blouse, Taikpon jacket, Paso, Gaung Baung) ' +
      'and incorporate professional photographic, cinematic, volumetric lighting, and camera depth descriptors. ' +
      'Return ONLY the enhanced English prompt without markdown fences, quotes, or preamble.';

    const userPrompt = `Refine and elevate this Myanmar avatar prompt:\n"${originalPrompt}"\n\nStyle Context: ${style || 'Realistic'}\nCharacter Context: ${characterDetails || ''}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    const refinedText = response.text?.trim() || '';
    res.json({ refinedPrompt: refinedText });
  } catch (error: any) {
    console.error('Error enhancing prompt with Gemini:', error);
    res.status(500).json({
      error: error.message || 'Failed to enhance prompt',
      fallback: true,
    });
  }
});

// API endpoint to generate speech scripts
app.post('/api/gemini/generate-script', async (req, res) => {
  try {
    const { topic, tone, lang } = req.body;
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const ai = getGenAI();
    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API key is not configured on the server',
        fallback: true,
      });
    }

    const systemPrompt =
      'You are a top-tier viral scriptwriter for Myanmar AI Voice & Video avatars (TikTok, Reels, YouTube Shorts, and Facebook). ' +
      'Write two distinct speech scripts for the provided topic in 100% natural, fluent Myanmar (Burmese) language:\n' +
      'Option A: Short and punchy for TikTok/Shorts (around 15-22 words in pure natural Burmese, strictly under 8 seconds of speech).\n' +
      'Option B: Detailed and professional (around 45-60 words in Burmese, divided into clear, clean sentences suitable for 8-second video chunking).\n' +
      'CRITICAL: Output must be in 100% authentic Myanmar Burmese script. Absolutely NO Thai or random script. ' +
      'You MUST respond with valid JSON matching:\n' +
      '{\n' +
      '  "optionA": "string",\n' +
      '  "optionB": "string"\n' +
      '}';

    const userPrompt = `Topic: "${topic}"\nTone: "${tone || 'friendly'}"\nLanguage style: "${lang || 'burmese'}"\nGenerate Option A and Option B.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const raw = response.text?.trim() || '{}';
    let parsed: { optionA?: string; optionB?: string } = {};
    try {
      parsed = JSON.parse(raw);
    } catch {
      // Clean possible json markdown wrappers
      const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
      parsed = JSON.parse(cleaned);
    }

    res.json({
      optionA: parsed.optionA || '',
      optionB: parsed.optionB || '',
    });
  } catch (error: any) {
    console.error('Error generating script with Gemini:', error);
    res.status(500).json({
      error: error.message || 'Failed to generate script',
      fallback: true,
    });
  }
});

// Vite middleware for development & static serving for production
async function setupViteOrStatic() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

setupViteOrStatic();
