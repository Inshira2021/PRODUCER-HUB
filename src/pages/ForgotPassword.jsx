import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function ForgotPassword() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Password reset:', formData);
    // Simulate successful password reset
    alert('Password reset successful!');
    navigate('/login');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 sm:px-6 py-12">
        <div className="w-full max-w-md bg-black/20 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border border-amber-700/30 shadow-2xl">
          <div className="mb-6 sm:mb-8 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-amber-50 mb-2 sm:mb-3 tracking-tight">
              Reset Password
            </h1>
            <p className="text-amber-200/80 text-sm sm:text-base">
              Enter your details to reset your password
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            {/* Email Field */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-xs sm:text-sm font-medium text-amber-100 mb-2"
              >
                Email Address *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-transparent border-b-2 border-amber-700/50 text-white placeholder-amber-300/40 focus:outline-none focus:border-amber-500 transition-all text-sm sm:text-base"
                required
              />
            </div>

            {/* New Password Field */}
            <div>
              <label 
                htmlFor="newPassword" 
                className="block text-xs sm:text-sm font-medium text-amber-100 mb-2"
              >
                New Password *
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-transparent border-b-2 border-amber-700/50 text-white placeholder-amber-300/40 focus:outline-none focus:border-amber-500 transition-all text-sm sm:text-base"
                required
              />
              <p className="text-xs text-amber-300/60 mt-1.5">Must be at least 8 characters</p>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label 
                htmlFor="confirmPassword" 
                className="block text-xs sm:text-sm font-medium text-amber-100 mb-2"
              >
                Confirm Password *
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-transparent border-b-2 border-amber-700/50 text-white placeholder-amber-300/40 focus:outline-none focus:border-amber-500 transition-all text-sm sm:text-base"
                required
              />
            </div>

            {/* Save Password Button */}
            <button
              type="submit"
              className="w-full py-3 sm:py-3.5 px-4 bg-gradient-to-r from-amber-700 to-orange-700 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-amber-900/50 transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-transparent text-sm sm:text-base"
            >
              Save Password
            </button>

            {/* Back to Login Link */}
            <p className="text-center text-xs sm:text-sm text-amber-200/80">
              Remember your password?{' '}
              <Link 
                to="/login" 
                className="text-amber-100 font-semibold hover:text-white transition-colors"
              >
                Back to Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
