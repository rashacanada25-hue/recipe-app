import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { API_BASE } from '../api';

const SearchRecipes = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const q = query.trim();
    if (!q) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await axios.get(`${API_BASE}/recipes/search`, {
          params: { name: q },
        });
        setResults(res.data);
      } catch (err) {
        console.error(err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  return (
    <div className="max-w-4xl mx-auto mt-10 text-right" dir="rtl">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">Search Recipes</h2>
      <input
        type="text"
        placeholder="הקלידי שם מתכון — התוצאות מתעדכנות אוטומטית"
        className="w-full p-3 border rounded-lg shadow-sm mb-2"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {query.trim() && (
        <p className="text-sm text-slate-500 mb-6 min-h-[1.25rem]">
          {loading ? 'מחפש…' : results.length === 0 ? 'לא נמצאו מתכונים' : `${results.length} תוצאות`}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {results.map((r) => (
          <div key={r._id} className="bg-white p-4 rounded shadow border-r-4 border-orange-400">
            <h3 className="font-bold text-lg">{r.title}</h3>
            <ul className="list-disc list-inside text-gray-600 text-sm mt-2">
              {(r.ingredients || []).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
            <p className="text-gray-700 text-sm mt-2 whitespace-pre-wrap">{r.instructions}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchRecipes;
