const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, minlength: 1, maxlength: 15 },
    ingredients: [{ type: String, required: true }],
    instructions: { type: String, required: true, maxlength: 200 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Recipe', recipeSchema);
