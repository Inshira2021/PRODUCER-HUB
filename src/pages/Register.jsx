import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    nickname: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    contact_number: '',
    country: '',
    address: '',
    city: '',
    state: '',
    postal_code: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Register:', formData);
    // Simulate successful registration
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
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
        <div className="w-full max-w-4xl bg-black/20 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border border-amber-700/30 shadow-2xl my-8">
          <div className="mb-6 sm:mb-8 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-amber-50 mb-2 sm:mb-3 tracking-tight">
              Join Us
            </h1>
            <p className="text-amber-200/80 text-sm sm:text-base">
              Create your producer account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Personal Information Section */}
            <div className="border-b border-amber-700/30 pb-4">
              <h2 className="text-xl font-semibold text-amber-300 mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="first_name" className="block text-xs sm:text-sm font-medium text-amber-100 mb-1.5">
                    First Name *
                  </label>
                  <input
                    id="first_name"
                    name="first_name"
                    type="text"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="Enter first name"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-transparent border-b-2 border-amber-700/50 text-white placeholder-amber-300/40 focus:outline-none focus:border-amber-500 transition-all text-sm sm:text-base"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="last_name" className="block text-xs sm:text-sm font-medium text-amber-100 mb-1.5">
                    Last Name *
                  </label>
                  <input
                    id="last_name"
                    name="last_name"
                    type="text"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Enter last name"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-transparent border-b-2 border-amber-700/50 text-white placeholder-amber-300/40 focus:outline-none focus:border-amber-500 transition-all text-sm sm:text-base"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="nickname" className="block text-xs sm:text-sm font-medium text-amber-100 mb-1.5">
                    Nickname
                  </label>
                  <input
                    id="nickname"
                    name="nickname"
                    type="text"
                    value={formData.nickname}
                    onChange={handleChange}
                    placeholder="Enter nickname"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-transparent border-b-2 border-amber-700/50 text-white placeholder-amber-300/40 focus:outline-none focus:border-amber-500 transition-all text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label htmlFor="username" className="block text-xs sm:text-sm font-medium text-amber-100 mb-1.5">
                    Username *
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Choose a username"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-transparent border-b-2 border-amber-700/50 text-white placeholder-amber-300/40 focus:outline-none focus:border-amber-500 transition-all text-sm sm:text-base"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="border-b border-amber-700/30 pb-4">
              <h2 className="text-xl font-semibold text-amber-300 mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-amber-100 mb-1.5">
                    E-mail *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-transparent border-b-2 border-amber-700/50 text-white placeholder-amber-300/40 focus:outline-none focus:border-amber-500 transition-all text-sm sm:text-base"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="contact_number" className="block text-xs sm:text-sm font-medium text-amber-100 mb-1.5">
                    Contact Number *
                  </label>
                  <input
                    id="contact_number"
                    name="contact_number"
                    type="tel"
                    value={formData.contact_number}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-transparent border-b-2 border-amber-700/50 text-white placeholder-amber-300/40 focus:outline-none focus:border-amber-500 transition-all text-sm sm:text-base"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div className="border-b border-amber-700/30 pb-4">
              <h2 className="text-xl font-semibold text-amber-300 mb-4">Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-xs sm:text-sm font-medium text-amber-100 mb-1.5">
                    Street Address *
                  </label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="123 Main Street"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-transparent border-b-2 border-amber-700/50 text-white placeholder-amber-300/40 focus:outline-none focus:border-amber-500 transition-all text-sm sm:text-base"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block text-xs sm:text-sm font-medium text-amber-100 mb-1.5">
                    City *
                  </label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-transparent border-b-2 border-amber-700/50 text-white placeholder-amber-300/40 focus:outline-none focus:border-amber-500 transition-all text-sm sm:text-base"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-xs sm:text-sm font-medium text-amber-100 mb-1.5">
                    State *
                  </label>
                  <input
                    id="state"
                    name="state"
                    type="text"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="State"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-transparent border-b-2 border-amber-700/50 text-white placeholder-amber-300/40 focus:outline-none focus:border-amber-500 transition-all text-sm sm:text-base"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="postal_code" className="block text-xs sm:text-sm font-medium text-amber-100 mb-1.5">
                    Postal Code *
                  </label>
                  <input
                    id="postal_code"
                    name="postal_code"
                    type="text"
                    value={formData.postal_code}
                    onChange={handleChange}
                    placeholder="12345"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-transparent border-b-2 border-amber-700/50 text-white placeholder-amber-300/40 focus:outline-none focus:border-amber-500 transition-all text-sm sm:text-base"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="country" className="block text-xs sm:text-sm font-medium text-amber-100 mb-1.5">
                    Country *
                  </label>
                  <input
                    id="country"
                    name="country"
                    type="text"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Country"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-transparent border-b-2 border-amber-700/50 text-white placeholder-amber-300/40 focus:outline-none focus:border-amber-500 transition-all text-sm sm:text-base"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div className="pb-2">
              <h2 className="text-xl font-semibold text-amber-300 mb-4">Security</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-amber-100 mb-1.5">
                    Password *
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-transparent border-b-2 border-amber-700/50 text-white placeholder-amber-300/40 focus:outline-none focus:border-amber-500 transition-all text-sm sm:text-base"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="confirmPassword" className="block text-xs sm:text-sm font-medium text-amber-100 mb-1.5">
                    Confirm Password *
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-transparent border-b-2 border-amber-700/50 text-white placeholder-amber-300/40 focus:outline-none focus:border-amber-500 transition-all text-sm sm:text-base"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 sm:py-3.5 px-4 bg-gradient-to-r from-amber-700 to-orange-700 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-amber-900/50 transition-all duration-300 transform hover:scale-[1.02] text-sm sm:text-base"
            >
              Create Account
            </button>

            <p className="text-center text-xs sm:text-sm text-amber-200/80">
              Already have an account?{' '}
              <Link to="/login" className="text-amber-100 font-semibold hover:text-white transition-colors">
                Login here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
