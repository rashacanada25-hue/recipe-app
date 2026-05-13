import { useState } from 'react';
import axios from 'axios';

const AddRecipe = () => {
  const [name, setName] = useState('');
  const [time, setTime] = useState('');
  const [ing, setIng] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/recipes', {
        name,
        preparationTime: Number(time),
        ingredients: ing
      });
      alert('המתכון נוסף בהצלחה! 🥗');
      setName(''); setTime(''); setIng('');
    } catch (err) {
      alert(err.response?.data?.message || 'שגיאה בשמירה');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-xl shadow-md text-right" dir="rtl">
      <h2 className="text-2xl font-bold mb-6 text-slate-800">הוספת מתכון חדש ✨</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          type="text" placeholder="שם המתכון (עד 15 תווים)" 
          className="w-full p-2 border rounded"
          value={name} onChange={(e) => setName(e.target.value)}
          maxLength="15" required 
        />
        <input 
          type="number" placeholder="זמן הכנה (דקות)" 
          className="w-full p-2 border rounded"
          value={time} onChange={(e) => setTime(e.target.value)}
          required 
        />
        <textarea 
          placeholder="מרכיבים" 
          className="w-full p-2 border rounded"
          value={ing} onChange={(e) => setIng(e.target.value)}
          required 
        />
        <button className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 font-bold">
          שמור מתכון
        </button>
      </form>
    </div>
  );
};

export default AddRecipe;