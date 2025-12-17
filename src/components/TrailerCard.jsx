import { useNavigate } from 'react-router-dom';

function TrailerCard({ trailer, onDelete, movieId }) {
  const navigate = useNavigate();

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this trailer?')) {
      onDelete(trailer.id);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/movie/${movieId}/add-trailer?id=${trailer.id}`);
  };

  const handleCardClick = () => {
    navigate(`/movie/${movieId}/trailer/${trailer.id}`);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group relative bg-gradient-to-br from-zinc-800/90 to-black/90 backdrop-blur-lg rounded-xl overflow-hidden border border-zinc-700/50 hover:border-amber-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-amber-900/20 cursor-pointer"
    >
      {/* Horizontal Layout */}
      <div className="flex items-stretch">
        {/* Left: Thumbnail with Overlay Icons */}
        <div className="relative w-80 flex-shrink-0 aspect-video bg-gradient-to-br from-amber-900/10 to-orange-900/10">
          {/* Thumbnail Image */}
          {trailer.thumbnail ? (
            <img 
              src={trailer.thumbnail} 
              alt={trailer.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-16 h-16 text-amber-500/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          
          {/* Hover Overlay with Edit/Delete Icons */}
          <div className="absolute bottom-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {/* Edit Button */}
            <button
              onClick={handleEdit}
              className="p-3 bg-orange-600 hover:bg-orange-700 rounded-lg shadow-xl transition-all hover:scale-110 transform"
              title="Edit Trailer"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>

            {/* Delete Button */}
            <button
              onClick={handleDelete}
              className="p-3 bg-red-600 hover:bg-red-700 rounded-lg shadow-xl transition-all hover:scale-110 transform"
              title="Delete Trailer"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right: Title and Description */}
        <div className="flex-1 p-6 flex flex-col justify-center">
          <h3 className="text-xl font-bold text-amber-50 mb-3 line-clamp-2">
            {trailer.title}
          </h3>
          <p className="text-sm text-zinc-400 line-clamp-3">
            {trailer.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default TrailerCard;
