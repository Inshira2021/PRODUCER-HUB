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
  const [activeTab, setActiveTab] = useState('video');
  const [images, setImages] = useState([]);
  const [liveMovies, setLiveMovies] = useState([]);
  const [crewMembers, setCrewMembers] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showLiveModal, setShowLiveModal] = useState(false);
  const [showCrewModal, setShowCrewModal] = useState(false);
  const [newImage, setNewImage] = useState({ title: '', description: '', file: null, preview: '' });
  const [newLiveMovie, setNewLiveMovie] = useState({ title: '', date: '', time: '', description: '' });
  const [newCrewMember, setNewCrewMember] = useState({ linkedinId: '', contribution: '' });

  useEffect(() => {
    // Load movie data
    const savedMovies = localStorage.getItem('movies');
    if (savedMovies) {
      const movies = JSON.parse(savedMovies);
      const foundMovie = movies.find(m => m.slug === id || m.id === parseInt(id));
      setMovie(foundMovie);
      
      if (foundMovie) {
        // Load trailers
        const savedTrailers = localStorage.getItem(`trailers_${foundMovie.id}`);
        if (savedTrailers) {
          setTrailers(JSON.parse(savedTrailers));
        }
        
        // Load images
        const savedImages = localStorage.getItem(`images_${foundMovie.id}`);
        if (savedImages) {
          setImages(JSON.parse(savedImages));
        }
        
        // Load live movies
        const savedLiveMovies = localStorage.getItem(`live_${foundMovie.id}`);
        if (savedLiveMovies) {
          setLiveMovies(JSON.parse(savedLiveMovies));
        }
        
        // Load crew members
        const savedCrew = localStorage.getItem(`crew_${foundMovie.id}`);
        if (savedCrew) {
          setCrewMembers(JSON.parse(savedCrew));
        }
      }
    }
  }, [id]);

  const handleDeleteTrailer = async (trailerId) => {
    const updatedTrailers = trailers.filter(t => t.id !== trailerId);
    setTrailers(updatedTrailers);
    localStorage.setItem(`trailers_${movie.id}`, JSON.stringify(updatedTrailers));
    
    try {
      await deleteTrailerVideo(trailerId);
      console.log('Video deleted from IndexedDB');
    } catch (error) {
      console.error('Error deleting video:', error);
    }
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImage({ ...newImage, file: file, preview: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddImage = (e) => {
    e.preventDefault();
    if (newImage.title && newImage.preview) {
      const imageToAdd = { 
        id: Date.now(), 
        title: newImage.title, 
        description: newImage.description,
        url: newImage.preview 
      };
      const updatedImages = [...images, imageToAdd];
      setImages(updatedImages);
      localStorage.setItem(`images_${movie.id}`, JSON.stringify(updatedImages));
      setNewImage({ title: '', description: '', file: null, preview: '' });
      setShowImageModal(false);
    }
  };

  const handleDeleteImage = (imageId) => {
    const updatedImages = images.filter(img => img.id !== imageId);
    setImages(updatedImages);
    localStorage.setItem(`images_${movie.id}`, JSON.stringify(updatedImages));
  };

  const handleAddLiveMovie = (e) => {
    e.preventDefault();
    if (newLiveMovie.title && newLiveMovie.date && newLiveMovie.time && newLiveMovie.description) {
      const liveToAdd = { ...newLiveMovie, id: Date.now() };
      const updatedLive = [...liveMovies, liveToAdd];
      setLiveMovies(updatedLive);
      localStorage.setItem(`live_${movie.id}`, JSON.stringify(updatedLive));
      setNewLiveMovie({ title: '', date: '', time: '', description: '' });
      setShowLiveModal(false);
    }
  };

  const handleDeleteLive = (liveId) => {
    const updatedLive = liveMovies.filter(live => live.id !== liveId);
    setLiveMovies(updatedLive);
    localStorage.setItem(`live_${movie.id}`, JSON.stringify(updatedLive));
  };

  const handleAddCrewMember = (e) => {
    e.preventDefault();
    if (newCrewMember.linkedinId && newCrewMember.contribution) {
      const memberToAdd = { ...newCrewMember, id: Date.now() };
      const updatedCrew = [...crewMembers, memberToAdd];
      setCrewMembers(updatedCrew);
      localStorage.setItem(`crew_${movie.id}`, JSON.stringify(updatedCrew));
      setNewCrewMember({ linkedinId: '', contribution: '' });
      setShowCrewModal(false);
    }
  };

  const handleDeleteCrew = (crewId) => {
    const updatedCrew = crewMembers.filter(crew => crew.id !== crewId);
    setCrewMembers(updatedCrew);
    localStorage.setItem(`crew_${movie.id}`, JSON.stringify(updatedCrew));
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

          {/* Horizontal Tabs Navigation */}
          <div className="mb-8">
            <div className="border-b-2 border-gray-700">
              <div className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('video')}
                  className={`pb-4 px-2 font-semibold text-lg transition-all duration-200 border-b-4 ${
                    activeTab === 'video'
                      ? 'border-amber-500 text-amber-500'
                      : 'border-transparent text-gray-400 hover:text-gray-300'
                  }`}
                >
                  Video
                </button>
                <button
                  onClick={() => setActiveTab('image')}
                  className={`pb-4 px-2 font-semibold text-lg transition-all duration-200 border-b-4 ${
                    activeTab === 'image'
                      ? 'border-amber-500 text-amber-500'
                      : 'border-transparent text-gray-400 hover:text-gray-300'
                  }`}
                >
                  Images
                </button>
                <button
                  onClick={() => setActiveTab('live')}
                  className={`pb-4 px-2 font-semibold text-lg transition-all duration-200 border-b-4 ${
                    activeTab === 'live'
                      ? 'border-amber-500 text-amber-500'
                      : 'border-transparent text-gray-400 hover:text-gray-300'
                  }`}
                >
                  Live
                </button>
                <button
                  onClick={() => setActiveTab('crew')}
                  className={`pb-4 px-2 font-semibold text-lg transition-all duration-200 border-b-4 ${
                    activeTab === 'crew'
                      ? 'border-amber-500 text-amber-500'
                      : 'border-transparent text-gray-400 hover:text-gray-300'
                  }`}
                >
                  Crew
                </button>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
            {/* Video Tab */}
            {activeTab === 'video' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">Videos & Trailers</h2>
                  <button
                    onClick={() => navigate(`/movie/${movie.id}/add-trailer`)}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold rounded-xl shadow-lg transition-all transform hover:scale-105"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Video</span>
                  </button>
                </div>

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
                    <p className="text-zinc-300 text-xl mb-2">No videos yet</p>
                    <p className="text-zinc-500 text-sm">Add your first video or trailer</p>
                  </div>
                )}
              </div>
            )}

            {/* Images Tab */}
            {activeTab === 'image' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">Images Gallery</h2>
                  <button
                    onClick={() => setShowImageModal(true)}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold rounded-xl shadow-lg transition-all transform hover:scale-105"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Image</span>
                  </button>
                </div>

                {images.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {images.map((image) => (
                      <div key={image.id} className="group relative bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-amber-500 transition-all shadow-lg hover:shadow-2xl hover:shadow-amber-500/20">
                        <div className="aspect-video w-full overflow-hidden">
                          <img
                            src={image.url}
                            alt={image.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="text-white font-semibold truncate">{image.title}</h3>
                        </div>
                        <button
                          onClick={() => handleDeleteImage(image.id)}
                          className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 bg-gradient-to-br from-zinc-800/50 to-black/50 rounded-2xl border border-zinc-700/50">
                    <div className="bg-gradient-to-br from-amber-900/20 to-orange-900/20 rounded-full p-8 mb-6">
                      <svg className="w-16 h-16 text-amber-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-zinc-300 text-xl mb-2">No images yet</p>
                    <p className="text-zinc-500 text-sm">Add your first image</p>
                  </div>
                )}
              </div>
            )}

            {/* Live Tab */}
            {activeTab === 'live' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">Live Schedule</h2>
                  <button
                    onClick={() => setShowLiveModal(true)}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold rounded-xl shadow-lg transition-all transform hover:scale-105"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    <span>Live</span>
                  </button>
                </div>

                {liveMovies.length > 0 ? (
                  <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
                    <table className="w-full">
                      <thead className="bg-gray-900">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-amber-500 uppercase tracking-wider">Title</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-amber-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-amber-500 uppercase tracking-wider">Time</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-amber-500 uppercase tracking-wider">Description</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-amber-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {liveMovies.map((live) => (
                          <tr key={live.id} className="hover:bg-gray-700/50 transition-colors">
                            <td className="px-6 py-4 text-white font-medium">{live.title}</td>
                            <td className="px-6 py-4 text-gray-300">{live.date}</td>
                            <td className="px-6 py-4 text-gray-300">{live.time}</td>
                            <td className="px-6 py-4 text-gray-300">
                              {live.description}
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => handleDeleteLive(live.id)}
                                className="text-red-500 hover:text-red-400 transition-colors"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 bg-gradient-to-br from-zinc-800/50 to-black/50 rounded-2xl border border-zinc-700/50">
                    <div className="bg-gradient-to-br from-red-900/20 to-red-900/20 rounded-full p-8 mb-6">
                      <svg className="w-16 h-16 text-red-500/50" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                      </svg>
                    </div>
                    <p className="text-zinc-300 text-xl mb-2">No live sessions scheduled</p>
                    <p className="text-zinc-500 text-sm">Schedule your first live stream</p>
                  </div>
                )}
              </div>
            )}

            {/* Crew Tab */}
            {activeTab === 'crew' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">Crew Members</h2>
                  <button
                    onClick={() => setShowCrewModal(true)}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold rounded-xl shadow-lg transition-all transform hover:scale-105"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Add Member</span>
                  </button>
                </div>

                {crewMembers.length > 0 ? (
                  <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
                    <table className="w-full">
                      <thead className="bg-gray-900">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-amber-500 uppercase tracking-wider">LinkedIn ID</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-amber-500 uppercase tracking-wider">Contribution</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-amber-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {crewMembers.map((crew) => (
                          <tr key={crew.id} className="hover:bg-gray-700/50 transition-colors">
                            <td className="px-6 py-4">
                              <a 
                                href={`https://www.linkedin.com/in/${crew.linkedinId}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 underline font-medium"
                              >
                                {crew.linkedinId}
                              </a>
                            </td>
                            <td className="px-6 py-4 text-gray-300">{crew.contribution}</td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => handleDeleteCrew(crew.id)}
                                className="text-red-500 hover:text-red-400 transition-colors"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 bg-gradient-to-br from-zinc-800/50 to-black/50 rounded-2xl border border-zinc-700/50">
                    <div className="bg-gradient-to-br from-amber-900/20 to-orange-900/20 rounded-full p-8 mb-6">
                      <svg className="w-16 h-16 text-amber-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <p className="text-zinc-300 text-xl mb-2">No crew members yet</p>
                    <p className="text-zinc-500 text-sm">Add your first crew member</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gray-800 rounded-2xl p-8 max-w-2xl w-full border border-gray-700 shadow-2xl my-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Add New Image</h3>
              <button
                onClick={() => {
                  setNewImage({ title: '', description: '', file: null, preview: '' });
                  setShowImageModal(false);
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleAddImage}>
              {/* Image Upload Section */}
              <div className="mb-6">
                <label className="block text-gray-300 mb-3 font-medium">
                  <span className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Upload Image</span>
                  </span>
                </label>
                
                <div className="relative">
                  {newImage.preview ? (
                    <div className="relative group">
                      <img
                        src={newImage.preview}
                        alt="Preview"
                        className="w-full h-64 object-cover rounded-xl border-2 border-gray-600"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                        <label className="cursor-pointer px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg transition-all">
                          <span>Change Image</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageFileChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-600 rounded-xl cursor-pointer hover:border-amber-500 transition-colors bg-gray-900/50">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-16 h-16 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="mb-2 text-sm text-gray-400">
                          <span className="font-semibold text-amber-500">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="hidden"
                        required
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Title Input */}
              <div className="mb-4">
                <label className="block text-gray-300 mb-2 font-medium">
                  <span className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span>Title</span>
                  </span>
                </label>
                <input
                  type="text"
                  value={newImage.title}
                  onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
                  placeholder="Enter image title"
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-amber-500 focus:outline-none transition-colors placeholder-gray-500"
                  required
                />
              </div>

              {/* Description Input */}
              <div className="mb-6">
                <label className="block text-gray-300 mb-2 font-medium">
                  <span className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                    <span>Description (Optional)</span>
                  </span>
                </label>
                <textarea
                  value={newImage.description}
                  onChange={(e) => setNewImage({ ...newImage, description: e.target.value })}
                  placeholder="Enter image description"
                  rows="3"
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-amber-500 focus:outline-none transition-colors placeholder-gray-500 resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={!newImage.preview || !newImage.title}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-lg"
                >
                  Add Image
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNewImage({ title: '', description: '', file: null, preview: '' });
                    setShowImageModal(false);
                  }}
                  className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Live Modal */}
      {showLiveModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full border border-gray-700 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6">Schedule Live Session</h3>
            <form onSubmit={handleAddLiveMovie}>
              <div className="mb-4">
                <label className="block text-gray-300 mb-2 font-medium">Title</label>
                <input
                  type="text"
                  value={newLiveMovie.title}
                  onChange={(e) => setNewLiveMovie({ ...newLiveMovie, title: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none transition-colors"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-300 mb-2 font-medium">Date</label>
                <input
                  type="date"
                  value={newLiveMovie.date}
                  onChange={(e) => setNewLiveMovie({ ...newLiveMovie, date: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none transition-colors"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-300 mb-2 font-medium">Time</label>
                <input
                  type="time"
                  value={newLiveMovie.time}
                  onChange={(e) => setNewLiveMovie({ ...newLiveMovie, time: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none transition-colors"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-300 mb-2 font-medium">Description</label>
                <textarea
                  value={newLiveMovie.description}
                  onChange={(e) => setNewLiveMovie({ ...newLiveMovie, description: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none transition-colors resize-none"
                  placeholder="Enter live session description"
                  rows="3"
                  required
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold rounded-xl transition-all"
                >
                  Schedule
                </button>
                <button
                  type="button"
                  onClick={() => setShowLiveModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Crew Modal */}
      {showCrewModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full border border-gray-700 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6">Add Crew Member</h3>
            <form onSubmit={handleAddCrewMember}>
              <div className="mb-4">
                <label className="block text-gray-300 mb-2 font-medium">LinkedIn ID</label>
                <input
                  type="text"
                  value={newCrewMember.linkedinId}
                  onChange={(e) => setNewCrewMember({ ...newCrewMember, linkedinId: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-amber-500 focus:outline-none transition-colors"
                  placeholder="e.g., john-doe-123456"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-300 mb-2 font-medium">Contribution</label>
                <textarea
                  value={newCrewMember.contribution}
                  onChange={(e) => setNewCrewMember({ ...newCrewMember, contribution: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-amber-500 focus:outline-none transition-colors resize-none"
                  placeholder="Describe their contribution to the project"
                  rows="3"
                  required
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold rounded-xl transition-all"
                >
                  Add Member
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNewCrewMember({ linkedinId: '', contribution: '' });
                    setShowCrewModal(false);
                  }}
                  className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieDetail;

