import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Middleware for parsing JSON request bodies
app.use(express.json());

/**
 * Helper to initialize GoogleGenAI client on demand using GEMINI_API_KEY environment variable.
 */
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'MY_GEMINI_API_KEY') {
    throw new Error(
      'GEMINI_API_KEY environment variable is missing or not configured. Please set your GEMINI_API_KEY in the environment or Secrets panel.'
    );
  }

  return new GoogleGenAI({
    apiKey: apiKey.trim(),
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

/**
 * POST /api/chat
 * Secure server-side route that receives the chat message from the frontend,
 * calls the Gemini model via @google/genai, and returns the generated content.
 */
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body;

    // Validate request body
    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({
        error: 'Invalid request: "message" field is required and must be a non-empty string.',
      });
    }

    // Initialize the Gemini client using server-side GEMINI_API_KEY
    let ai: GoogleGenAI;
    try {
      ai = getGeminiClient();
    } catch (keyErr: any) {
      console.error('[API Key Error]:', keyErr.message);
      return res.status(500).json({
        error: keyErr.message || 'Gemini API key is not configured on the server.',
      });
    }

    // Prepare contents: optional previous turns plus the new user message
    const formattedContents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    if (Array.isArray(history) && history.length > 0) {
      for (const item of history) {
        if (item.content && (item.role === 'user' || item.role === 'assistant' || item.role === 'model')) {
          formattedContents.push({
            role: item.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: item.content }],
          });
        }
      }
    }

    // Append the current user prompt
    formattedContents.push({
      role: 'user',
      parts: [{ text: message.trim() }],
    });

    // Call the recommended Gemini model
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: formattedContents,
      config: {
        systemInstruction:
          'You are an intelligent, helpful AI Copilot. When asked a simple or factual question, give a direct, clean, and accurate answer immediately without unnecessary preamble. When asked coding, technical, or architecture questions, provide concise, high-quality, production-ready code and explanations.',
      },
    });

    const replyText = response.text || 'No response generated from the model.';

    return res.status(200).json({
      success: true,
      reply: replyText,
    });
  } catch (err: any) {
    console.error('Gemini API call failed:', err);
    return res.status(500).json({
      error: err?.message || 'Failed to generate response from Gemini API. Please try again.',
    });
  }
});

/**
 * Health check endpoint
 */
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    hasApiKey: Boolean(
      process.env.GEMINI_API_KEY &&
      process.env.GEMINI_API_KEY.trim() !== '' &&
      process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'
    ),
  });
});

// Vite middleware integration for full-stack dev / static serving in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    // In production, serve the built frontend assets from dist
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    // In development, mount Vite's connect instance as middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
