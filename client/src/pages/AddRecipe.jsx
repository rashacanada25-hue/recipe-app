import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../api';

function parseIngredientsString(raw) {
  return raw
    .split(',')
    .flatMap((part) => part.trim().split(/\s+/))
    .map((s) => s.trim())
    .filter(Boolean);
}

function validateForm(title, ingredientsRaw, instructions) {
  const t = title.trim();
  if (!t || t.length > 15) {
    return 'שם המתכון: חובה בין תו אחד ל-15 תווים.';
  }
  const ing = parseIngredientsString(ingredientsRaw);
  if (ing.length === 0) {
    return 'מצרכים: יש להזין לפחות מצרך אחד (פסיקים או רווחים, לדוגמה Milk,Eggs או Milk Egg Water).';
  }
  if (instructions.length > 200) {
    return 'הוראות ההכנה: מקסימום 200 תווים.';
  }
  return null;
}

const AddRecipe = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [ingredientsRaw, setIngredientsRaw] = useState('');
  const [instructions, setInstructions] = useState('');
  const [generating, setGenerating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validateForm(title, ingredientsRaw, instructions);
    if (err) {
      alert(err);
      return;
    }
    try {
      await axios.post(`${API_BASE}/recipes`, {
        title: title.trim(),
        ingredients: parseIngredientsString(ingredientsRaw),
        instructions,
      });
      alert('המתכון נוסף בהצלחה! 🥗');
      setTitle('');
      setIngredientsRaw('');
      setInstructions('');
      navigate('/all-recipes');
    } catch (err) {
      alert(err.response?.data?.message || 'שגיאה בשמירה');
    }
  };

  const handleGenerateInstructions = async () => {
    const t = title.trim();
    const ing = parseIngredientsString(ingredientsRaw);
    if (!t || t.length > 15) {
      alert('לפני יצירת הוראות: הזיני שם מתכון תקין (1–15 תווים).');
      return;
    }
    if (ing.length === 0) {
      alert('לפני יצירת הוראות: הזיני לפחות מצרך אחד.');
      return;
    }
    setGenerating(true);
    try {
      const res = await axios.post(`${API_BASE}/recipes/generate`, {
        title: t,
        ingredients: ing,
      });
      const text = res.data?.instructions ?? '';
      setInstructions(text.length > 200 ? text.slice(0, 200) : text);
    } catch (err) {
      alert(err.response?.data?.message || 'שגיאה ביצירת הוראות (בדקי AI_GATEWAY_API_KEY בשרת).');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-xl shadow-md text-right" dir="rtl">
      <h2 className="text-2xl font-bold mb-6 text-slate-800">הוספת מתכון חדש ✨</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">שם המתכון</label>
          <input
            type="text"
            placeholder="עד 15 תווים"
            className="w-full p-2 border rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={15}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">מצרכים (מחרוזת)</label>
          <textarea
            placeholder="לדוגמה: Milk,Eggs,Water או Milk Egg Water"
            className="w-full p-2 border rounded min-h-[80px]"
            value={ingredientsRaw}
            onChange={(e) => setIngredientsRaw(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">הוראות הכנה</label>
          <textarea
            placeholder="עד 200 תווים"
            className="w-full p-2 border rounded min-h-[100px]"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            maxLength={200}
          />
          <p className="text-xs text-gray-500 mt-1">{instructions.length}/200</p>
        </div>
        <button
          type="button"
          onClick={handleGenerateInstructions}
          disabled={generating}
          className="w-full bg-slate-700 text-white py-2 rounded hover:bg-slate-600 font-bold disabled:opacity-50"
        >
          {generating ? 'יוצר הוראות…' : 'הפק הוראות עם AI (לפי שם + מצרכים)'}
        </button>
        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 font-bold"
        >
          הוספת מתכון חדש
        </button>
      </form>
    </div>
  );
};

export default AddRecipe;
