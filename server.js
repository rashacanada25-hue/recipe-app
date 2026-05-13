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

mongoose.connect(mongoUri)
    .then(() => console.log('Connected to MongoDB!'))
    .catch(err => console.error('Connection error:', err));

// נתיב לבדיקה שהשרת עובד
app.get('/', (req, res) => res.send('Server is running!'));

app.get('/recipes', async (req, res) => {
    const recipes = await Recipe.find();
    res.json(recipes);
});

// חיפוש לפי שם (תואם ל־SearchRecipes בלקוח)
function escapeRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

app.get('/recipes/search/:query', async (req, res) => {
    try {
        const raw = req.params.query ?? '';
        const q = String(raw).trim();
        if (!q) {
            return res.json([]);
        }
        const recipes = await Recipe.find({
            name: new RegExp(escapeRegex(q), 'i')
        });
        res.json(recipes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/recipes', async (req, res) => {
    try {
        const newRecipe = new Recipe(req.body);
        await newRecipe.save();
        res.status(201).json(newRecipe);
    } catch (err) {
        res.status(400).json({ message: "שגיאה: שם המתכון עד 15 תווים" });
    }
});

app.delete('/recipes/:id', async (req, res) => {
    await Recipe.findByIdAndDelete(req.params.id);
    res.json({ message: 'Recipe deleted' });
});

app.listen(5000, () => console.log('Server running on port 5000'));