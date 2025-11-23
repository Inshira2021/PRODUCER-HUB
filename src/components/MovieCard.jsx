import { useNavigate } from 'react-router-dom';

function MovieCard({ movie }) {
  const navigate = useNavigate();

  return (
    <div className="group relative bg-gradient-to-br from-zinc-800/90 to-black/90 backdrop-blur-lg rounded-2xl overflow-hidden border border-zinc-700/50 hover:border-amber-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-900/20 hover:scale-[1.03] hover:-translate-y-1">
      {/* Movie Images */}
      <div className="relative h-48 bg-gradient-to-br from-amber-900/10 to-orange-900/10">
        {/* Main Image (small) */}
        <div className="absolute top-3 left-3 w-16 h-16 rounded-lg overflow-hidden border-2 border-amber-500/50 shadow-lg z-10">
          {movie.mainImage ? (
            <img src={movie.mainImage} alt="Main" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-amber-800/30 flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <svg className="w-16 h-16 text-amber-500/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
          </div>
        )}

        {/* Action Icons */}
        <div className="absolute bottom-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* Edit Icon */}
          <button
            onClick={() => navigate(`/add-movie?id=${movie.id}`)}
            className="p-2 bg-amber-600 hover:bg-amber-700 rounded-lg shadow-lg transition-colors"
            title="Edit"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          {/* View/Play Icon */}
          <button
            onClick={() => window.open(movie.trailerUrl, '_blank')}
            className="p-2 bg-orange-600 hover:bg-orange-700 rounded-lg shadow-lg transition-colors"
            title="View Trailer"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Movie Info */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-amber-50 mb-2 truncate">{movie.title}</h3>
        <p className="text-sm text-amber-200/70 line-clamp-2">{movie.description}</p>
      </div>
    </div>
  );
}

export default MovieCard;
