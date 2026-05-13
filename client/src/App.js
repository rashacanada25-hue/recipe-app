import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
          <Route path="/" element={<AllRecipes />} />
          <Route path="/add" element={<AddRecipe />} />
          <Route path="/search" element={<SearchRecipes />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;