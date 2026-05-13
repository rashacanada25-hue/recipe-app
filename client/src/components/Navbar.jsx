import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-slate-800 text-white p-4 shadow-lg flex justify-center gap-10">
      <Link to="/" className="hover:text-orange-400 font-bold transition">🏠 כל המתכונים</Link>
      <Link to="/add" className="hover:text-orange-400 font-bold transition">➕ הוספה</Link>
      <Link to="/search" className="hover:text-orange-400 font-bold transition">🔍 חיפוש</Link>
    </nav>
  );
};

export default Navbar;