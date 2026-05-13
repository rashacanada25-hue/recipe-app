import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AllRecipes = () => {
  const [recipes, setRecipes] = useState([]);

  const fetchRecipes = () => {
    axios.get('http://localhost:5000/recipes')
      .then(res => setRecipes(res.data))
      .catch(err => console.error("Error fetching recipes:", err));
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('למחוק את המתכון?')) return;
    try {
      await axios.delete(`http://localhost:5000/recipes/${id}`);
      setRecipes(prev => prev.filter(r => r._id !== id));
    } catch (err) {
      console.error('Error deleting recipe:', err);
      alert('שגיאה במחיקה');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-3xl font-bold text-slate-800 mb-8 border-b-2 border-orange-400 pb-2 inline-block">
        ספר המתכונים הדיגיטלי שלי 📖
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-right" dir="rtl">
        {recipes.map(recipe => (
          <div key={recipe._id} className="bg-white rounded-2xl shadow-lg p-6 hover:scale-105 transition-transform border border-gray-100">
            <h3 className="text-xl font-extrabold text-orange-600 mb-2">{recipe.name}</h3>
            <div className="text-gray-600 space-y-1">
              <p>⏱️ **זמן הכנה:** {recipe.preparationTime} דקות</p>
              <p>📝 **מרכיבים:** {recipe.ingredients}</p>
            </div>
            <button
              type="button"
              onClick={() => handleDelete(recipe._id)}
              className="mt-4 w-full bg-slate-800 text-white py-2 rounded-lg hover:bg-red-500 transition-colors"
            >
              מחיקת מתכון 🗑️
            </button>
          </div>
        ))}
      </div>
      
      {recipes.length === 0 && (
        <p className="text-gray-500 mt-10">עדיין אין מתכונים... בואי נוסיף אחד! ✨</p>
      )}
    </div>
  );
};

export default AllRecipes;