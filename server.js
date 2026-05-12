const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Recipe = require('./Recipe'); // ייבוא המודל שיצרנו קודם

const app = express();
app.use(cors()); // מאפשר ל-Frontend לדבר עם השרת
app.use(express.json()); // מאפשר לשרת לקרוא מידע בפורמט JSON

mongoose.connect('mongodb+srv://rasha-26:hello123@cluster0.tdvmbnh.mongodb.net/recipe_db?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('Connected to MongoDB!'))
    .catch(err => console.error('Connection error:', err));

// 1. נתיב לקבלת כל המתכונים (GET) 
app.get('/recipes', async (req, res) => {
    const recipes = await Recipe.find();
    res.json(recipes);
});

// 2. נתיב להוספת מתכון חדש (POST) 
app.post('/recipes', async (req, res) => {
    const newRecipe = new Recipe(req.body);
    await newRecipe.save();
    res.json(newRecipe);
});

// 3. נתיב למחיקת מתכון לפי ID (DELETE) 
app.delete('/recipes/:id', async (req, res) => {
    await Recipe.findByIdAndDelete(req.params.id);
    res.json({ message: 'Recipe deleted' });
});

app.listen(5000, () => console.log('Server running on port 5000'));