import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { getTrailerVideo } from '../utils/indexedDB';

function TrailerDetail() {
  const { id, trailerId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [movie, setMovie] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [videoURL, setVideoURL] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoadingVideo, setIsLoadingVideo] = useState(true);
  const [showRatingPopup, setShowRatingPopup] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reactions, setReactions] = useState({
    like: 582,
    dislike: 23,
    love: 245,
    laugh: 89,
    fire: 156
  });
  const [userReaction, setUserReaction] = useState(null);

  useEffect(() => {
    // Load movie data
    const savedMovies = localStorage.getItem('movies');
    if (savedMovies) {
      const movies = JSON.parse(savedMovies);
      const foundMovie = movies.find(m => m.slug === id || m.id === parseInt(id));
      setMovie(foundMovie);

      if (foundMovie) {
        // Load specific trailer
        const savedTrailers = localStorage.getItem(`trailers_${foundMovie.id}`);
        if (savedTrailers) {
          const trailers = JSON.parse(savedTrailers);
          const foundTrailer = trailers.find(t => t.id === parseInt(trailerId));
          setTrailer(foundTrailer);
          
          // Load video from IndexedDB
          if (foundTrailer) {
            setIsLoadingVideo(true);
            getTrailerVideo(foundTrailer.id).then(videoData => {
              if (videoData) {
                setVideoURL(videoData.videoURL);
                console.log('Video loaded from IndexedDB');
              } else {
                console.log('No video found in IndexedDB for this trailer');
              }
              setIsLoadingVideo(false);
            }).catch(error => {
              console.error('Error loading video:', error);
              setIsLoadingVideo(false);
            });
          } else {
            setIsLoadingVideo(false);
          }
        }
      }
    }
  }, [id, trailerId]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (!document.fullscreenElement) {
        videoRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const handleMinimize = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: trailer.title,
      text: `Check out this trailer: ${trailer.title} from ${movie.title}`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.log('Error sharing:', err);
    }
  };

  const handleDownload = () => {
    if (videoURL) {
      const link = document.createElement('a');
      link.href = videoURL;
      link.download = `${trailer.title}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (trailer.thumbnail) {
      const link = document.createElement('a');
      link.href = trailer.thumbnail;
      link.download = `${trailer.title}-thumbnail.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('No video or thumbnail available to download');
    }
  };

  const handleReaction = (reactionType) => {
    if (userReaction === reactionType) {
      // Remove reaction
      setReactions(prev => ({ ...prev, [reactionType]: prev[reactionType] - 1 }));
      setUserReaction(null);
    } else {
      // Add new reaction
      const newReactions = { ...reactions };
      if (userReaction) {
        newReactions[userReaction] -= 1;
      }
      newReactions[reactionType] += 1;
      setReactions(newReactions);
      setUserReaction(reactionType);
    }
  };

  const handleRatingSubmit = () => {
    if (userRating > 0) {
      alert(`You rated this trailer ${userRating}/10 stars!`);
      setShowRatingPopup(false);
    }
  };

  if (!movie || !trailer) {
    return <div className="min-h-screen flex items-center justify-center bg-black text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-black via-zinc-900 to-black">
      <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Sidebar isOpen={isSidebarOpen} />

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate(`/movie/${movie.slug || movie.id}`)}
            className="flex items-center space-x-2 text-zinc-400 hover:text-amber-400 mb-6 transition-colors group"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-medium">Back to Movie</span>
          </button>

          {/* Trailer Video Section - Centered and Smaller */}
          <div className="flex justify-center mb-8">
            <div className="w-full max-w-5xl bg-gradient-to-br from-zinc-800/90 to-black/90 backdrop-blur-lg rounded-2xl overflow-hidden border border-zinc-700/50 shadow-2xl">
              {/* Video Player */}
              <div className="relative aspect-video bg-black group">
                {videoURL ? (
                  <div className="relative w-full h-full">
                    <video 
                      ref={videoRef}
                      src={videoURL}
                      poster={trailer.thumbnail}
                      className="w-full h-full object-contain bg-black"
                      onClick={handlePlayPause}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      controls
                    />
                    
                    {/* Play/Pause Overlay */}
                    {!isPlaying && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer" onClick={handlePlayPause}>
                        <div className="bg-amber-600/90 rounded-full p-8 hover:bg-amber-700 transition-all hover:scale-110 shadow-2xl">
                          <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    )}
                    
                    {/* Video Info Badge */}
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-green-600 to-green-500 px-4 py-2 rounded-xl text-white text-sm font-semibold shadow-lg flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Video Loaded</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-zinc-800 to-zinc-900 p-8">
                    <div className="text-center space-y-4">
                      <div className={`rounded-full p-6 inline-block border-2 ${isLoadingVideo ? 'bg-blue-600/20 border-blue-600/50 animate-pulse' : 'bg-amber-600/20 border-amber-600/50'}`}>
                        <svg className={`w-16 h-16 ${isLoadingVideo ? 'text-blue-500' : 'text-amber-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white mb-2">{trailer.videoFileName || 'No Video'}</p>
                        <p className="text-zinc-400 text-sm">Video file: {trailer.videoFileName || 'Not uploaded'}</p>
                        {isLoadingVideo ? (
                          <p className="text-blue-400 text-sm mt-4 flex items-center justify-center space-x-2">
                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Loading video...</span>
                          </p>
                        ) : (
                          <div className="mt-4 max-w-md mx-auto">
                            <p className="text-yellow-400 text-sm mb-3 flex items-center justify-center space-x-2">
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              <span>Video not found</span>
                            </p>
                            <p className="text-zinc-500 text-xs">
                              This trailer was uploaded before video storage was enabled. Please re-upload the video to enable playback.
                            </p>
                            <button
                              onClick={() => navigate(`/movie/${movie.slug || movie.id}/add-trailer?id=${trailer.id}`)}
                              className="mt-4 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium transition-colors"
                            >
                              Re-upload Video
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

            {/* Trailer Info */}
            <div className="p-6 sm:p-8 border-t border-zinc-700/30">
              <div className="mb-6">
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent mb-3">
                  {trailer.title}
                </h1>
                <p className="text-zinc-400 text-sm flex items-center space-x-2">
                  <span>From:</span>
                  <span className="text-amber-400 font-semibold">{movie.title}</span>
                  <span className="inline-block w-1 h-1 bg-amber-400 rounded-full"></span>
                  <span className="text-zinc-500">Official Trailer</span>
                </p>
              </div>

              <div className="mb-8">
                <h2 className="text-lg font-bold text-white mb-3 flex items-center space-x-2">
                  <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Description</span>
                </h2>
                <p className="text-zinc-300 text-base leading-relaxed pl-7">
                  {trailer.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => navigate(`/movie/${movie.id}/add-trailer?id=${trailer.id}`)}
                  className="flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-amber-500/30 transition-all transform hover:scale-105"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>Edit Trailer</span>
                </button>
                
                <button
                  onClick={handleShare}
                  className="flex items-center space-x-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all transform hover:scale-105"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  <span>Share</span>
                </button>
                
                <button
                  onClick={handleDownload}
                  className="flex items-center space-x-2 px-5 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-green-500/30 transition-all transform hover:scale-105"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Download</span>
                </button>
              </div>
            </div>
          </div>
        </div>

          {/* Additional Information Section - Centered */}
          <div className="flex justify-center">
            <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Details Card */}
              <div className="bg-gradient-to-br from-zinc-800/90 to-black/90 backdrop-blur-lg rounded-2xl p-6 border border-zinc-700/50 shadow-xl hover:shadow-amber-500/10 transition-shadow">
                <h3 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent mb-4 flex items-center space-x-2">
                  <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Details</span>
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-3 border-b border-zinc-700/50 hover:border-amber-500/30 transition-colors">
                    <span className="text-zinc-400 font-medium">Movie</span>
                    <span className="text-white font-semibold">{movie.title}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-zinc-700/50 hover:border-amber-500/30 transition-colors">
                    <span className="text-zinc-400 font-medium">IMDB ID</span>
                    <span className="text-amber-400 font-mono text-sm">{movie.imdbId || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-zinc-700/50 hover:border-amber-500/30 transition-colors">
                    <span className="text-zinc-400 font-medium">Format</span>
                    <span className="text-white font-semibold flex items-center space-x-1">
                      <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>HD Quality</span>
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-zinc-400 font-medium">Status</span>
                    <span className="px-3 py-1 bg-gradient-to-r from-green-600/20 to-emerald-600/20 text-green-400 rounded-full text-sm font-semibold border border-green-500/20">
                      Active
                    </span>
                  </div>
                </div>
              </div>

              {/* Statistics Card */}
              <div className="bg-gradient-to-br from-zinc-800/90 to-black/90 backdrop-blur-lg rounded-2xl p-6 border border-zinc-700/50 shadow-xl hover:shadow-blue-500/10 transition-shadow">
                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4 flex items-center space-x-2">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>Statistics</span>
                </h3>
                <div className="space-y-5">
                  <div className="flex items-center justify-between p-3 bg-blue-600/10 rounded-xl border border-blue-500/20 hover:border-blue-500/40 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-gradient-to-br from-blue-600/30 to-blue-700/30 rounded-xl">
                        <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-zinc-400 text-sm font-medium">Total Views</p>
                        <p className="text-white font-bold text-xl">0</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-600/10 rounded-xl border border-red-500/20 hover:border-red-500/40 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-gradient-to-br from-red-600/30 to-red-700/30 rounded-xl">
                        <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-zinc-400 text-sm font-medium">Likes</p>
                        <p className="text-white font-bold text-xl">0</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-600/10 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-gradient-to-br from-purple-600/30 to-purple-700/30 rounded-xl">
                        <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-zinc-400 text-sm font-medium">Shares</p>
                        <p className="text-white font-bold text-xl">0</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Rating Popup Modal */}
      {showRatingPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with blur */}
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowRatingPopup(false)}
          ></div>
          
          {/* Modal Content */}
          <div className="relative bg-gradient-to-br from-zinc-900 via-zinc-800 to-black border-2 border-amber-600/50 rounded-2xl p-8 max-w-md w-full shadow-2xl shadow-amber-600/20 animate-scale-in">
            {/* Close Button */}
            <button
              onClick={() => setShowRatingPopup(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Title */}
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent mb-2">
                Rate This Trailer
              </h3>
              <p className="text-zinc-400 text-sm">Click on a star to rate</p>
            </div>

            {/* Star Rating */}
            <div className="flex justify-center space-x-2 mb-8">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                <button
                  key={star}
                  onClick={() => setUserRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-all transform hover:scale-125 focus:outline-none"
                >
                  <svg
                    className={`w-8 h-8 ${
                      star <= (hoverRating || userRating)
                        ? 'text-amber-500 fill-current'
                        : 'text-zinc-600 fill-current'
                    }`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              ))}
            </div>

            {/* Rating Display */}
            {userRating > 0 && (
              <div className="text-center mb-6">
                <p className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                  {userRating}/10
                </p>
                <p className="text-zinc-400 text-sm mt-2">
                  {userRating <= 3 && "Poor"}
                  {userRating > 3 && userRating <= 5 && "Fair"}
                  {userRating > 5 && userRating <= 7 && "Good"}
                  {userRating > 7 && userRating <= 9 && "Great"}
                  {userRating === 10 && "Masterpiece!"}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleRatingSubmit}
              disabled={userRating === 0}
              className={`w-full py-3 rounded-xl font-bold text-white transition-all shadow-lg ${
                userRating === 0
                  ? 'bg-zinc-700 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 hover:shadow-amber-500/50'
              }`}
            >
              {userRating === 0 ? 'Select a Rating' : 'Submit Rating'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TrailerDetail;
