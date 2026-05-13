import { useState } from 'react';
import axios from 'axios';

const SearchRecipes = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      return;
    }
    try {
      const res = await axios.get(
        `http://localhost:5000/recipes/search/${encodeURIComponent(q)}`
      );
      setResults(res.data);
    } catch (err) {
      console.error(err);
      alert('שגיאה בחיפוש');
      setResults([]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 text-right" dir="rtl">
      <div className="flex gap-2 mb-8">
        <input 
          type="text" placeholder="חפש מתכון לפי שם..." 
          className="flex-1 p-3 border rounded-lg shadow-sm"
          value={query} onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearch} className="bg-slate-800 text-white px-6 rounded-lg font-bold">חפש</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {results.map(r => (
          <div key={r._id} className="bg-white p-4 rounded shadow border-r-4 border-orange-400">
            <h3 className="font-bold text-lg">{r.name}</h3>
            <p className="text-gray-600">⏱️ {r.preparationTime} דקות</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchRecipes;