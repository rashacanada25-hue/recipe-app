import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AllRecipes from './pages/AllRecipes';
import AddRecipe from './pages/AddRecipe';
import SearchRecipes from './pages/SearchRecipes';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <Routes>
          <Route path="/" element={<Navigate to="/all-recipes" replace />} />
          <Route path="/add" element={<Navigate to="/add-recipes" replace />} />
          <Route path="/search" element={<Navigate to="/search-recipes" replace />} />
          <Route path="/all-recipes" element={<AllRecipes />} />
          <Route path="/add-recipes" element={<AddRecipe />} />
          <Route path="/search-recipes" element={<SearchRecipes />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;
