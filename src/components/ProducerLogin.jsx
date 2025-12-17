import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function ProducerLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password, rememberMe });
    // Add your login logic here
    // Simulate successful login and redirect to dashboard
    navigate('/dashboard');
  };

  const [activeSlide, setActiveSlide] = useState(0);
  const slides = [
    { 
      image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&q=90', 
      title: 'Welcome Back to<br />Producer Hub', 
      subtitle: 'Continue your journey in creating cinematic masterpieces' 
    },
    { 
      image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&q=90', 
      title: 'Your Creative<br />Journey Awaits', 
      subtitle: 'Access your projects and bring your vision to life' 
    },
    { 
      image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&q=90', 
      title: 'Ready to Create<br />Amazing Films?', 
      subtitle: 'Log in to manage your productions and collaborate' 
    }
  ];

  // Auto-play carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [slides.length]);

  const handleSlideClick = (index) => {
    setActiveSlide(index);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      {/* Animated gradient orbs in background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>
      
      {/* Split Screen Layout with rounded corners */}
      <div className="flex min-h-[80vh] w-full max-w-5xl bg-gray-900/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-gray-800/50 relative z-10">
        {/* Left Panel - Hero Section */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-all duration-700"
            style={{
              backgroundImage: `url('${slides[activeSlide].image}')`,
            }}
          >
            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
          
          {/* Hero Content */}
          <div className="relative z-10 flex flex-col justify-center items-center text-center px-8 w-full">
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-2xl border border-white/20">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4 leading-tight" dangerouslySetInnerHTML={{ __html: slides[activeSlide].title }}>
            </h2>
            <p className="text-lg text-white/90 mb-6 max-w-md">
              {slides[activeSlide].subtitle}
            </p>
            <div className="flex space-x-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleSlideClick(index)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    index === activeSlide ? 'w-12 bg-white' : 'w-12 bg-white/40 hover:bg-white/60'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Form Section */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 relative">
          {/* Background Image with transparency */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-15"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1574267432644-f610f5b7c18f?w=1200&q=90')",
            }}
          ></div>
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/85 via-gray-900/80 to-orange-900/70 backdrop-blur-sm"></div>
          
          <div className="w-full max-w-sm relative z-10">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                Welcome back
              </h1>
              <p className="text-amber-200/90 text-sm">Please enter your details.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label 
                  htmlFor="email" 
                  className="block text-sm font-medium text-amber-100 mb-2"
                >
                  E-mail
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your e-mail"
                  className="w-full px-4 py-3 bg-transparent border-b border-amber-700/50 text-white placeholder-amber-300/40 focus:outline-none focus:border-amber-500 transition-all text-base"
                  required
                />
              </div>

              {/* Password Field */}
              <div>
                <label 
                  htmlFor="password" 
                  className="block text-sm font-medium text-amber-100 mb-2"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  className="w-full px-4 py-3 bg-transparent border-b border-amber-700/50 text-white placeholder-amber-300/40 focus:outline-none focus:border-amber-500 transition-all text-base"
                  required
                />
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-amber-600 bg-amber-950/30 text-amber-600 focus:ring-2 focus:ring-amber-500 cursor-pointer"
                  />
                  <label 
                    htmlFor="remember-me" 
                    className="ml-2 text-sm text-amber-200/90 cursor-pointer"
                  >
                    Remember me
                  </label>
                </div>
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-amber-200 hover:text-amber-100 transition-colors"
                >
                  Forgot your password?
                </Link>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-700 to-orange-700 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-amber-900/50 transition-all duration-300 transform hover:scale-[1.02] text-base mt-8"
              >
                Log in
              </button>

              {/* Register Link */}
              <p className="text-center text-sm text-amber-200/80 mt-6">
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  className="text-amber-100 font-semibold hover:text-white transition-colors"
                >
                  Register here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProducerLogin;
