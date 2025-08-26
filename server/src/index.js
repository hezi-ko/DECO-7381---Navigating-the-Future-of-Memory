import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });
dotenv.config({ path: path.join(__dirname, '..', '.env') });

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { GoogleGenerativeAI } from '@google/generative-ai';

console.log("We're Live");
// console.log("KEY?", process.env.GEMINI_API_KEY?.slice(0, 8));

const GENRATIVE_MODEL = "gemini-2.5-flash"  // chat model
const EMBEDDING_MODEL = "text-embedding-004"    //embedding model (turns text into vectors)

const app = express(); 
app.use(cors()); //allows all origins. Will need to tighten for security later
app.use(express.json ({
    limit: "1mb"    // Limit request body sizes to stop memory being eaten
}));
app.use(morgan('tiny'));

// TODO - move to env var
const googleGenAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Check if server is good
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
  console.log("Health check OK");
});


// User request to GEN AI
app.post("/api/ai/say", async (req, res) => {

    try {

        // get the prompt from the request
        const { prompt } = req.body ?? {};

        // validate the prompt
        if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
            res.status(400).json({ ok: false, error: "Invalid prompt" });
            return;
        }

        // run the prompt through the model
        const model = googleGenAI.getGenerativeModel({model: GENRATIVE_MODEL});
        const result = await model.generateContent(prompt);
        const text = result?.response?.text?.() ?? "(no response)";

        res.json({ ok: true, result: text });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ ok: false, error: String(error) });
    }

});

// Embedding model API Call
app.post('/api/ai/embed', async (req, res) => {
  try {

    const { text } = req.body ?? {};
    if (!text) return res.status(400).json({ ok: false, error: 'Missing text' });

    const embedModel = googleGenAI.getGenerativeModel({ model: EMBEDDING_MODEL });
    const r = await embedModel.embedContent(text);
    const vector = r?.embedding?.values ?? [];

    res.json({ ok: true, dims: vector.length, preview: vector });

  } catch (error) {
    console.error(err);
    res.status(500).json({ ok: false, error: String(err) });
  }
});

const port = Number(process.env.PORT || 3001);
app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});