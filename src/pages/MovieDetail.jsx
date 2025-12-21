import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import TrailerCard from '../components/TrailerCard';
import { deleteTrailerVideo } from '../utils/indexedDB';

function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [movie, setMovie] = useState(null);
  const [trailers, setTrailers] = useState([]);

  useEffect(() => {
    // Load movie data
    const savedMovies = localStorage.getItem('movies');
    if (savedMovies) {
      const movies = JSON.parse(savedMovies);
      // Try to find by slug first, then fallback to id
      const foundMovie = movies.find(m => m.slug === id || m.id === parseInt(id));
      setMovie(foundMovie);
      
      // Load trailers for this movie using the actual movie id
      if (foundMovie) {
        const savedTrailers = localStorage.getItem(`trailers_${foundMovie.id}`);
        if (savedTrailers) {
          setTrailers(JSON.parse(savedTrailers));
        }
      }
    }
  }, [id]);

  const handleDeleteTrailer = async (trailerId) => {
    const updatedTrailers = trailers.filter(t => t.id !== trailerId);
    setTrailers(updatedTrailers);
    localStorage.setItem(`trailers_${movie.id}`, JSON.stringify(updatedTrailers));
    
    // Also delete video from IndexedDB
    try {
      await deleteTrailerVideo(trailerId);
      console.log('Video deleted from IndexedDB');
    } catch (error) {
      console.error('Error deleting video:', error);
    }
  };

  if (!movie) {
    return <div className="min-h-screen flex items-center justify-center bg-black text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Sidebar isOpen={isSidebarOpen} />

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate('/dashboard')}
            className="group flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-gray-800/50 mb-6 transition-all duration-200"
          >
            <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back</span>
          </button>

          {/* Movie Header Section */}
          <div className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 shadow-2xl mb-8">
            <div className="relative">
              {/* Banner Image */}
              <div className="relative h-80 sm:h-96">
                {movie.bannerImage ? (
                  <img src={movie.bannerImage} alt={movie.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                    <svg className="w-24 h-24 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                    </svg>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

                {/* Main Image Overlay */}
                <div className="absolute bottom-6 left-6 w-32 h-48 rounded-xl overflow-hidden border-4 border-amber-600 shadow-2xl bg-gray-900">
                  {movie.mainImage ? (
                    <img src={movie.mainImage} alt={movie.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <svg className="w-12 h-12 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Movie Title */}
                <div className="absolute bottom-6 left-44 right-6">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 drop-shadow-lg">
                    {movie.title}
                  </h1>
                </div>
              </div>
            </div>
          </div>

          {/* Trailers Section Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent mb-1">
                Trailers & Videos
              </h2>
              <p className="text-zinc-400 text-sm">{trailers.length} {trailers.length === 1 ? 'video' : 'videos'}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              {/* Add Trailer Button */}
              <button
                onClick={() => navigate(`/movie/${movie.id}/add-trailer`)}
                className="flex items-center space-x-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold rounded-xl shadow-lg transition-all transform hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="hidden sm:inline">Add</span>
              </button>

              {/* Live Stream Button */}
              <button
                className="flex items-center space-x-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold rounded-xl shadow-lg transition-all transform hover:scale-105"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                </svg>
                <span className="hidden sm:inline">Live</span>
              </button>
            </div>
          </div>

          {/* Trailers Grid */}
          {trailers.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              {trailers.map((trailer) => (
                <TrailerCard key={trailer.id} trailer={trailer} onDelete={handleDeleteTrailer} movieId={movie.id} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 bg-gradient-to-br from-zinc-800/50 to-black/50 rounded-2xl border border-zinc-700/50">
              <div className="bg-gradient-to-br from-amber-900/20 to-orange-900/20 rounded-full p-8 mb-6">
                <svg className="w-16 h-16 text-amber-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-zinc-300 text-xl mb-2">No trailers yet</p>
              <p className="text-zinc-500 text-sm mb-6">Add your first trailer or video</p>
              <button
                onClick={() => navigate(`/movie/${movie.id}/add-trailer`)}
                className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold rounded-xl shadow-lg transition-all"
              >
                Add Trailer
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default MovieDetail;
