import { useNavigate } from 'react-router-dom';

function MovieCard({ movie, onDelete }) {
  const navigate = useNavigate();

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this movie?')) {
      onDelete(movie.id);
    }
  };

  return (
    <div 
      onClick={() => navigate(`/movie/${movie.slug || movie.id}`)}
      className="group relative bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 hover:border-amber-600 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-900/50 hover:scale-[1.03] hover:-translate-y-1 cursor-pointer"
    >      {/* Movie Images */}
      <div className="relative h-48 bg-gray-900">
        {/* Main Image (vertical rectangle) */}
        <div className="absolute top-3 left-3 w-20 h-32 rounded-lg overflow-hidden border-2 border-amber-600 shadow-lg z-10 bg-gray-900">
          {movie.mainImage ? (
            <img src={movie.mainImage} alt="Main" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>

        {/* Banner Image */}
        {movie.bannerImage ? (
          <img src={movie.bannerImage} alt={movie.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-16 h-16 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
          </div>
        )}

        {/* Action Icons */}
        <div className="absolute bottom-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* Edit Icon */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/add-movie?id=${movie.id}`);
            }}
            className="p-2 bg-amber-600 hover:bg-amber-700 rounded-lg shadow-lg transition-colors"
            title="Edit"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          {/* Delete Icon */}
          <button
            onClick={handleDelete}
            className="p-2 bg-red-500 hover:bg-red-600 rounded-lg shadow-lg transition-colors"
            title="Delete"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Movie Info */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-white mb-2 truncate">{movie.title}</h3>
        <p className="text-sm text-gray-400 line-clamp-2">{movie.description}</p>
      </div>
    </div>
  );
}

export default MovieCard;
