import { useState } from 'react';
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

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Full Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/producer.avif')",
        }}
      >
        {/* Warm brown cinematic overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-950/60 via-orange-950/70 to-amber-900/80"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex min-h-screen">
        {/* Left side - Empty space showing background (hidden on mobile) */}
        <div className="hidden lg:block lg:w-1/2"></div>

        {/* Right side - Login Form with glass morphism */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12 backdrop-blur-md bg-gradient-to-br from-amber-950/40 via-orange-950/50 to-brown-900/60">
        <div className="w-full max-w-md bg-black/20 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border border-amber-700/30 shadow-2xl">
          {/* Header */}
          <div className="mb-6 sm:mb-8 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-amber-50 mb-2 sm:mb-3 tracking-tight">
              Welcome back
            </h1>
            <p className="text-amber-200/80 text-sm sm:text-base">
              Please enter your details.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            {/* Email Field */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-xs sm:text-sm font-medium text-amber-100 mb-2"
              >
                E-mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your e-mail"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-transparent border-b-2 border-amber-700/50 text-white placeholder-amber-300/40 focus:outline-none focus:border-amber-500 transition-all text-sm sm:text-base"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label 
                htmlFor="password" 
                className="block text-xs sm:text-sm font-medium text-amber-100 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-transparent border-b-2 border-amber-700/50 text-white placeholder-amber-300/40 focus:outline-none focus:border-amber-500 transition-all text-sm sm:text-base"
                required
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
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
                  className="ml-2 text-xs sm:text-sm text-amber-200/90 cursor-pointer"
                >
                  Remember me
                </label>
              </div>
              <Link 
                to="/forgot-password" 
                className="text-xs sm:text-sm text-amber-200 hover:text-amber-100 transition-colors"
              >
                Forgot your password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-3 sm:py-3.5 px-4 bg-gradient-to-r from-amber-700 to-orange-700 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-amber-900/50 transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-transparent text-sm sm:text-base"
            >
              Log in
            </button>

            {/* Register Link */}
            <p className="text-center text-xs sm:text-sm text-amber-200/80">
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
