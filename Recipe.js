const mongoose = require('mongoose');

// הגדרת המבנה של מתכון בבסיס הנתונים
const recipeSchema = new mongoose.Schema({
    title: { type: String, required: true },       // שם המתכון (חובה) [cite: 21]
    ingredients: { type: [String], required: true }, // רשימת מצרכים - מערך של מחרוזות (חובה) [cite: 22]
    instructions: { type: String, required: true }  // הוראות הכנה (חובה) [cite: 23]
});

module.exports = mongoose.model('Recipe', recipeSchema);
