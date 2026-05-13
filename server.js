require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Recipe = require('./Recipe');

const app = express();
app.use(cors());
app.use(express.json());

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error('Missing MONGODB_URI — create a .env file (see .env.example)');
  process.exit(1);
}

const AI_GATEWAY_URL = (process.env.AI_GATEWAY_URL || 'https://ai-gateway.vercel.sh/v1').replace(
  /\/$/,
  ''
);
const AI_GATEWAY_MODEL = process.env.AI_GATEWAY_MODEL || 'openai/gpt-4o-mini';

mongoose
  .connect(mongoUri)
  .then(() => console.log('Connected to MongoDB!'))
  .catch((err) => console.error('Connection error:', err));

app.get('/', (req, res) => res.send('Server is running!'));

app.get('/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

app.get('/recipes/search', async (req, res) => {
  try {
    const raw = req.query.name ?? '';
    const q = String(raw).trim();
    if (!q) {
      return res.json([]);
    }
    const recipes = await Recipe.find({
      title: new RegExp(escapeRegex(q), 'i'),
    });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

function parseIngredientsInput(body) {
  const ing = body.ingredients;
  if (Array.isArray(ing)) {
    return ing.map((s) => String(s).trim()).filter(Boolean);
  }
  if (typeof ing === 'string') {
    return ing
      .split(',')
      .flatMap((part) => part.trim().split(/\s+/))
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

function validateRecipeBody(body) {
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const instructions = typeof body.instructions === 'string' ? body.instructions : '';
  const ingredients = parseIngredientsInput(body);

  if (!title || title.length > 15) {
    return { error: 'שם המתכון: חובה בין תו אחד ל-15 תווים.' };
  }
  if (ingredients.length === 0) {
    return { error: 'יש להזין לפחות מצרך אחד (רווחים או פסיקים).' };
  }
  if (instructions.length > 200) {
    return { error: 'הוראות ההכנה: עד 200 תווים.' };
  }
  return { value: { title, ingredients, instructions } };
}

app.post('/recipes/generate', async (req, res) => {
  try {
    const { title, ingredients } = req.body || {};
    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ message: 'חסר שם מתכון (title).' });
    }
    if (!Array.isArray(ingredients)) {
      return res.status(400).json({ message: 'מצרכים חייבים להיות מערך (ingredients).' });
    }
    const apiKey = process.env.AI_GATEWAY_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        message: 'שרת AI לא מוגדר: הוסיפי AI_GATEWAY_API_KEY לקובץ .env',
      });
    }

    const userMsg = `You are a cooking assistant. Given this recipe title and ingredients, respond with ONLY a valid JSON object (no markdown fences, no extra text) with exactly one key "instructions" whose value is a string of full preparation steps in Hebrew. The string must be at most 200 characters.

Title: ${title.trim()}
Ingredients: ${ingredients.map((x) => String(x).trim()).filter(Boolean).join(', ')}`;

    const response = await fetch(`${AI_GATEWAY_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: AI_GATEWAY_MODEL,
        messages: [{ role: 'user', content: userMsg }],
        temperature: 0.4,
        stream: false,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('AI gateway error:', response.status, text);
      return res.status(502).json({ message: 'שגיאה בשירות ה-AI.' });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content?.trim() || '';

    let parsedJson;
    try {
      const cleaned = content
        .replace(/^```(?:json)?\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();
      parsedJson = JSON.parse(cleaned);
    } catch (e) {
      return res.status(502).json({ message: 'תשובת ה-AI לא בפורמט JSON תקין.' });
    }

    if (!parsedJson || typeof parsedJson.instructions !== 'string' || !parsedJson.instructions.trim()) {
      return res.status(502).json({ message: 'המודל לא החזיר הוראות מקובלות.' });
    }

    let instructions = parsedJson.instructions.trim();
    if (instructions.length > 200) {
      instructions = instructions.slice(0, 200);
    }

    res.json({ instructions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || 'שגיאת שרת' });
  }
});

app.post('/recipes', async (req, res) => {
  try {
    const parsed = validateRecipeBody(req.body);
    if (parsed.error) {
      return res.status(400).json({ message: parsed.error });
    }
    const newRecipe = new Recipe(parsed.value);
    await newRecipe.save();
    res.status(201).json(newRecipe);
  } catch (err) {
    res.status(400).json({ message: err.message || 'שגיאה בשמירה' });
  }
});

app.delete('/recipes/:id', async (req, res) => {
  try {
    const deleted = await Recipe.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'לא נמצא' });
    }
    res.json({ message: 'Recipe deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

const port = Number(process.env.PORT) || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
