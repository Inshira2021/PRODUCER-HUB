import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

import { saveTrailerVideo, getStorageEstimate } from '../utils/indexedDB';

function AddTrailer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const trailerId = searchParams.get('id');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [movie, setMovie] = useState(null);
  const [storageUsage, setStorageUsage] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [thumbnailImage, setThumbnailImage] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  
  const thumbnailInputRef = useRef(null);
  const videoInputRef = useRef(null);

  useEffect(() => {
    // Load movie data to get the actual movie id
    const savedMovies = localStorage.getItem('movies');
    if (savedMovies) {
      const movies = JSON.parse(savedMovies);
      // Try to find by slug first, then fallback to id
      const foundMovie = movies.find(m => m.slug === id || m.id === parseInt(id));
      setMovie(foundMovie);
      
      // Calculate IndexedDB storage usage
      getStorageEstimate().then(estimate => {
        if (estimate) {
          setStorageUsage(estimate.percentUsed);
        }
      });
      
      // If editing, load the trailer data
      if (foundMovie && trailerId) {
        const savedTrailers = localStorage.getItem(`trailers_${foundMovie.id}`);
        if (savedTrailers) {
          const trailers = JSON.parse(savedTrailers);
          const trailerToEdit = trailers.find(t => t.id === parseInt(trailerId));
          if (trailerToEdit) {
            setFormData({
              title: trailerToEdit.title,
              description: trailerToEdit.description
            });
            setThumbnailPreview(trailerToEdit.thumbnail);
            if (trailerToEdit.videoFileName) {
              // Just store the filename for display
              setVideoFile({ name: trailerToEdit.videoFileName });
            }
          }
        }
      }
    }
  }, [id, trailerId]);

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (limit to 2MB for thumbnail)
      if (file.size > 2 * 1024 * 1024) {
        alert('Thumbnail image is too large. Please use an image smaller than 2MB.');
        return;
      }
      
      setThumbnailImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        // Compress the image
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 600;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to compressed base64
          const compressedImage = canvas.toDataURL('image/jpeg', 0.7);
          setThumbnailPreview(compressedImage);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      // Create a preview URL (not stored in localStorage)
      const videoURL = URL.createObjectURL(file);
      setVideoPreview(videoURL);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClear = () => {
    setFormData({ title: '', description: '' });
    setThumbnailImage(null);
    setVideoFile(null);
    setThumbnailPreview(null);
    setVideoPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!movie) {
      alert('Movie not found. Please try again.');
      return;
    }

    if (!thumbnailPreview) {
      alert('Please upload a thumbnail image.');
      return;
    }

    if (!formData.title || !formData.description) {
      alert('Please fill in both title and description.');
      return;
    }
    
    // Get existing trailers using the actual movie id
    const savedTrailers = localStorage.getItem(`trailers_${movie.id}`);
    const trailers = savedTrailers ? JSON.parse(savedTrailers) : [];
    
    let currentTrailerId = trailerId ? parseInt(trailerId) : Date.now();
    
    if (trailerId) {
      // Update existing trailer
      const trailerIndex = trailers.findIndex(t => t.id === parseInt(trailerId));
      if (trailerIndex !== -1) {
        trailers[trailerIndex] = {
          ...trailers[trailerIndex],
          title: formData.title,
          description: formData.description,
          thumbnail: thumbnailPreview,
          videoFileName: videoFile ? videoFile.name : trailers[trailerIndex].videoFileName,
        };
      }
    } else {
      // Create new trailer
      const newTrailer = {
        id: currentTrailerId,
        title: formData.title,
        description: formData.description,
        thumbnail: thumbnailPreview,
        videoFileName: videoFile ? videoFile.name : '',
        movieId: movie.id
      };
      trailers.push(newTrailer);
    }
    
    try {
      // Save video to IndexedDB if provided
      if (videoFile && videoFile.size) {
        console.log(`Saving video to IndexedDB: ${(videoFile.size / (1024 * 1024)).toFixed(2)} MB`);
        await saveTrailerVideo(currentTrailerId, videoFile, videoFile.name);
        console.log('Video saved to IndexedDB successfully');
      }
      
      // Save trailer metadata to localStorage
      localStorage.setItem(`trailers_${movie.id}`, JSON.stringify(trailers));
      console.log('Trailer metadata saved successfully');
      
      // Navigate back to movie detail page
      navigate(`/movie/${movie.slug || movie.id}`);
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        alert('Storage limit exceeded! Solutions:\n\n1. Use smaller images (under 2MB)\n2. Delete old trailers\n3. Use lower quality images\n\nCurrent data is too large for browser storage.');
      } else {
        alert('Error saving trailer: ' + error.message);
      }
      console.error('Error saving trailer:', error);
    }
  };

  if (!movie) {
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
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => navigate(`/movie/${id}`)}
            className="group flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-gray-800/50 mb-6 transition-all duration-200"
          >
            <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back</span>
          </button>
          
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent mb-8">
            {trailerId ? 'Edit Trailer' : 'Add New Trailer'}
          </h1>

          <div className="bg-gradient-to-br from-zinc-800/90 to-black/90 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border border-zinc-700/50 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Thumbnail and Video Upload */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Thumbnail Image */}
                <div>
                  <label className="block text-sm font-medium text-amber-100 mb-3">
                    Thumbnail Image *
                  </label>
                  <div
                    onClick={() => thumbnailInputRef.current?.click()}
                    className="relative h-52 rounded-xl border-2 border-dashed border-amber-600/50 hover:border-amber-500 transition-colors cursor-pointer overflow-hidden bg-black/20 group"
                  >
                    {thumbnailPreview ? (
                      <>
                        <img src={thumbnailPreview} alt="Thumbnail preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <p className="text-white font-medium">Click to change</p>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full">
                        <svg className="w-12 h-12 text-amber-500/50 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-amber-300/70 text-sm text-center px-2">Click to upload thumbnail</p>
                      </div>
                    )}
                  </div>
                  <input
                    ref={thumbnailInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    className="hidden"
                  />
                </div>

                {/* Video Upload */}
                <div>
                  <label className="block text-sm font-medium text-amber-100 mb-3">
                    Trailer Video *
                  </label>
                  <div
                    onClick={() => videoInputRef.current?.click()}
                    className="relative h-52 rounded-xl border-2 border-dashed border-amber-600/50 hover:border-amber-500 transition-colors cursor-pointer overflow-hidden bg-black/20 group"
                  >
                    {videoPreview ? (
                      <>
                        <video src={videoPreview} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <p className="text-white font-medium">Click to change</p>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="bg-amber-600/90 rounded-full p-4">
                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full">
                        <svg className="w-12 h-12 text-amber-500/50 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <p className="text-amber-300/70 text-sm text-center px-2">Click to upload video</p>
                      </div>
                    )}
                  </div>
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-amber-100 mb-2">
                  Title *
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter trailer title"
                  className="w-full px-4 py-3 bg-transparent border-b-2 border-amber-700/50 text-white placeholder-amber-300/40 focus:outline-none focus:border-amber-500 transition-all text-base"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-amber-100 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter trailer description"
                  rows="4"
                  className="w-full px-4 py-3 bg-transparent border-2 border-amber-700/50 rounded-lg text-white placeholder-amber-300/40 focus:outline-none focus:border-amber-500 transition-all text-base resize-none"
                  required
                ></textarea>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleClear}
                  className="flex-1 py-3 px-6 bg-transparent border-2 border-zinc-600 hover:border-zinc-500 hover:bg-zinc-800/30 text-zinc-300 font-semibold rounded-xl transition-all duration-300"
                >
                  Clear
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-amber-900/50 transition-all duration-300 transform hover:scale-[1.02]"
                >
                  {trailerId ? 'Update Trailer' : 'Save Trailer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AddTrailer;
