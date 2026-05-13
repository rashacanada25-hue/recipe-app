import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE } from '../api';

const AllRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecipes = () => {
    setLoading(true);
    setError(null);
    axios
      .get(`${API_BASE}/recipes`)
      .then((res) => {
        setRecipes(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching recipes:', err);
        setError('לא ניתן לטעון מתכונים. ודאי שהשרת רץ ושה־API זמין.');
        setRecipes([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('למחוק את המתכון?')) return;
    try {
      await axios.delete(`${API_BASE}/recipes/${id}`);
      setRecipes((prev) => prev.filter((r) => r._id !== id));
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

      {loading && (
        <p className="text-slate-600 mt-6" dir="rtl">
          טוען מתכונים…
        </p>
      )}
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-right" dir="rtl">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-right" dir="rtl">
        {!loading &&
          recipes.map((recipe) => (
          <div
            key={recipe._id}
            className="bg-white rounded-2xl shadow-lg p-6 hover:scale-105 transition-transform border border-gray-100"
          >
            <h3 className="text-xl font-extrabold text-orange-600 mb-2">{recipe.title}</h3>
            <div className="text-gray-600 space-y-2 text-sm">
              <div>
                <p className="font-semibold text-slate-700 mb-1">מצרכים</p>
                <ul className="list-disc list-inside space-y-0.5">
                  {(recipe.ingredients || []).map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-semibold text-slate-700 mb-1">הוראות הכנה</p>
                <p className="whitespace-pre-wrap">{recipe.instructions}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleDelete(recipe._id)}
              className="mt-4 w-full bg-slate-800 text-white py-2 rounded-lg hover:bg-red-500 transition-colors"
            >
              Delete Recipe — מחיקת מתכון
            </button>
          </div>
          ))}
      </div>

      {!loading && !error && recipes.length === 0 && (
        <p className="text-gray-500 mt-10" dir="rtl">
          עדיין אין מתכונים... בואי נוסיף אחד! ✨
        </p>
      )}
    </div>
  );
};

export default AllRecipes;
