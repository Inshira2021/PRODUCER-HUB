import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import MovieCard from '../components/MovieCard';

function Dashboard() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Load movies from localStorage on component mount
  useEffect(() => {
    const savedMovies = localStorage.getItem('movies');
    if (savedMovies) {
      setMovies(JSON.parse(savedMovies));
    }
  }, []);

  // Filter movies based on search query
  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    movie.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle delete movie
  const handleDeleteMovie = (movieId) => {
    const updatedMovies = movies.filter(m => m.id !== movieId);
    setMovies(updatedMovies);
    localStorage.setItem('movies', JSON.stringify(updatedMovies));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      {/* Navbar */}
      <Navbar 
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} />

      {/* Overlay for sidebar on mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header with Add Button */}
          <div className="flex justify-between items-center mb-6 sm:mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">
                My Movies
              </h1>
              <p className="text-gray-400 text-sm sm:text-base">
                {filteredMovies.length} {filteredMovies.length === 1 ? 'movie' : 'movies'} found
              </p>
            </div>
            
            {/* Add New Button */}
            <button
              onClick={() => navigate('/add-movie')}
              className="flex items-center space-x-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-500 hover:via-orange-500 hover:to-amber-600 text-white font-semibold rounded-xl shadow-lg shadow-amber-900/30 hover:shadow-amber-900/50 transition-all duration-300 transform hover:scale-[1.05] hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>New Movie</span>
            </button>
          </div>

          {/* Movie Cards Grid */}
          {filteredMovies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} onDelete={handleDeleteMovie} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 sm:py-24">
              <div className="bg-gray-800 rounded-full p-8 mb-6">
                <svg className="w-16 h-16 sm:w-24 sm:h-24 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
              </div>
              <p className="text-white text-xl mb-2">
                {searchQuery ? 'No movies match your search' : 'No movies yet'}
              </p>
              <p className="text-gray-400 text-sm mb-6">
                {searchQuery ? 'Try a different search term' : 'Start building your collection'}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => navigate('/add-movie')}
                  className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold rounded-xl shadow-lg transition-all transform hover:scale-105"
                >
                  Add Your First Movie
                </button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
