import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

function AddMovie() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const movieId = searchParams.get('id');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imdbId: ''
  });
  const [mainImage, setMainImage] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [bannerImagePreview, setBannerImagePreview] = useState(null);
  
  const mainImageInputRef = useRef(null);
  const bannerImageInputRef = useRef(null);

  // Load existing movie data if editing
  useEffect(() => {
    if (movieId) {
      const savedMovies = localStorage.getItem('movies');
      if (savedMovies) {
        const movies = JSON.parse(savedMovies);
        const movieToEdit = movies.find(m => m.id === parseInt(movieId));
        if (movieToEdit) {
          setFormData({
            title: movieToEdit.title,
            description: movieToEdit.description,
            imdbId: movieToEdit.imdbId || ''
          });
          setMainImagePreview(movieToEdit.mainImage);
          setBannerImagePreview(movieToEdit.bannerImage);
        }
      }
    }
  }, [movieId]);

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setMainImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClear = () => {
    setFormData({ title: '', description: '', trailerUrl: '' });
    setMainImage(null);
    setBannerImage(null);
    setMainImagePreview(null);
    setBannerImagePreview(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Get existing movies from localStorage
    const savedMovies = localStorage.getItem('movies');
    const movies = savedMovies ? JSON.parse(savedMovies) : [];
    
    // Create slug from title
    const slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    if (movieId) {
      // Update existing movie
      const movieIndex = movies.findIndex(m => m.id === parseInt(movieId));
      if (movieIndex !== -1) {
        movies[movieIndex] = {
          ...movies[movieIndex],
          title: formData.title,
          description: formData.description,
          imdbId: formData.imdbId || '',
          slug: slug,
          mainImage: mainImagePreview,
          bannerImage: bannerImagePreview
        };
      }
    } else {
      // Create new movie object
      const newMovie = {
        id: Date.now(),
        title: formData.title,
        description: formData.description,
        imdbId: formData.imdbId || '',
        slug: slug,
        mainImage: mainImagePreview,
        bannerImage: bannerImagePreview
      };
      
      // Add new movie
      movies.push(newMovie);
    }
    
    // Save back to localStorage
    localStorage.setItem('movies', JSON.stringify(movies));
    
    // Navigate back to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 relative">
      {/* Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center -z-10"
        style={{
          backgroundImage: "url('/producer.avif')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-amber-950/60 via-orange-950/70 to-amber-900/80"></div>
      </div>

      {/* Navbar */}
      <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} />

      {/* Overlay for sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2 text-gray-300 hover:text-white mb-4 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Dashboard</span>
            </button>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
              {movieId ? 'Edit Movie' : 'Add New Movie'}
            </h1>
          </div>

          {/* Form Container */}
          <div className="bg-gray-800 rounded-2xl p-6 sm:p-8 border border-gray-700 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Image - Smaller */}
                <div>
                  <label className="block text-sm font-medium text-amber-100 mb-3">
                    Main Image
                  </label>
                  <div
                    onClick={() => mainImageInputRef.current?.click()}
                    className="relative h-40 rounded-xl border-2 border-dashed border-gray-600 hover:border-amber-600 transition-colors cursor-pointer overflow-hidden bg-gray-900 group"
                  >
                    {mainImagePreview ? (
                      <>
                        <img src={mainImagePreview} alt="Main preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <p className="text-white font-medium">Click to change</p>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full">
                        <svg className="w-10 h-10 text-amber-500/50 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-amber-300/70 text-xs text-center px-2">Click to upload</p>
                      </div>
                    )}
                  </div>
                  <input
                    ref={mainImageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleMainImageChange}
                    className="hidden"
                  />
                </div>

                {/* Banner Image - Larger */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-amber-100 mb-3">
                    Banner Image
                  </label>
                  <div
                    onClick={() => bannerImageInputRef.current?.click()}
                    className="relative h-40 rounded-xl border-2 border-dashed border-gray-600 hover:border-amber-600 transition-colors cursor-pointer overflow-hidden bg-gray-900 group"
                  >
                    {bannerImagePreview ? (
                      <>
                        <img src={bannerImagePreview} alt="Banner preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <p className="text-white font-medium">Click to change</p>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full">
                        <svg className="w-12 h-12 text-amber-500/50 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                        </svg>
                        <p className="text-amber-300/70 text-sm">Click to upload banner image</p>
                      </div>
                    )}
                  </div>
                  <input
                    ref={bannerImageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleBannerImageChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Movie Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-amber-100 mb-2">
                  Movie Title *
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter movie title"
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
                  placeholder="Enter movie description"
                  rows="4"
                  className="w-full px-4 py-3 bg-transparent border-2 border-amber-700/50 rounded-lg text-white placeholder-amber-300/40 focus:outline-none focus:border-amber-500 transition-all text-base resize-none"
                  required
                ></textarea>
              </div>

              {/* IMDB ID */}
              <div>
                <label htmlFor="imdbId" className="block text-sm font-medium text-amber-100 mb-2">
                  IMDB ID (Optional)
                </label>
                <input
                  id="imdbId"
                  name="imdbId"
                  type="text"
                  value={formData.imdbId}
                  onChange={handleChange}
                  placeholder="tt1234567"
                  className="w-full px-4 py-3 bg-transparent border-b-2 border-amber-700/50 text-white placeholder-amber-300/40 focus:outline-none focus:border-amber-500 transition-all text-base"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleClear}
                  className="flex-1 py-3 px-6 bg-transparent border-2 border-gray-600 hover:border-amber-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all duration-300"
                >
                  Clear
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-amber-900/50 transition-all duration-300 transform hover:scale-[1.02]"
                >
                  {movieId ? 'Update Movie' : 'Save Movie'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AddMovie;
