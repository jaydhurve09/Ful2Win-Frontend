import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import authService from '../services/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import BackgroundBubbles from '../components/BackgroundBubbles';

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    agree: false
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if user is already logged in
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      navigate('/');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (!formData.agree) {
      toast.error('Please agree to the terms and privacy policy');
      return;
    }

    try {
      setIsLoading(true);
      
      // Prepare user data for the backend
      const userData = {
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        password: formData.password
      };
      
      console.log('Sending registration request with data:', userData);
      
      // Use authService for registration
      const result = await authService.register(userData);
      
      if (result && result.success) {
        console.log('Registration successful:', result);
        toast.success(result.message || 'Registration successful! Please login.');
        // Clear form
        setFormData({
          fullName: '',
          name: '',
          phoneNumber: '',
          password: '',
          confirmPassword: '',
          agree: false
        });
        // Redirect to login page
        navigate('/login');
      } else {
        throw new Error(result?.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Signup failed:', error);
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-blueGradient flex flex-col overflow-hidden">
      {/* Logo and Tagline */}
      <div className="flex flex-col items-center justify-center flex-grow-0">
        <BackgroundBubbles />
        <div className="mt-8 mb-8">
          <div className="flex flex-col items-center">
            <img src={logo} alt="Ful2Win Logo" className="w-40 md:w-44 mb-2" />
            <p className="text-white text-sm font-semibold text-center">
              Entertainment. <span className="text-yellow-300">Earning.</span> <span className="text-pink-400">Fame</span>
            </p>
          </div>
        </div>
      </div>

      {/* Signup Form */}
      <div className="bg-white rounded-t-3xl px-6 py-8 w-full max-w-md mx-auto shadow-xl flex-grow-0 h-[calc(100vh-100px)]">
        <div className="overflow-y-auto max-h-[70vh] md:max-h-[70vh] sm:max-h-full p-4">
          <h2 className="text-2xl font-semibold text-gray-700 mb-5">Welcome!</h2>
          <p className="text-gray-500 mb-6">Sign up to continue</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                placeholder="Enter your name"
                value={formData.fullName}
                onChange={handleChange}
                className={`w-full px-4 py-2 text-gray-500 border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring focus:ring-blue-300`}
                required
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                autoComplete="tel"
                placeholder="Enter your phone number"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 text-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 text-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 text-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                required
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 text-gray-500 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring focus:ring-blue-300`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Password Strength */}
            <div>
              <div className="flex justify-between text-sm">
                <span>Password Strength</span>
                <span>{formData.password.length}/6</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(formData.password.length / 6 * 100, 100)}%`,
                    backgroundColor: formData.password.length >= 6 ? 'green' : 'red'
                  }}
                ></div>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-center text-sm">
              <input
                id="agree"
                name="agree"
                type="checkbox"
                checked={formData.agree}
                onChange={handleChange}
                className="mr-2"
                required
              />
              <label htmlFor="agree" className="text-gray-700">
                I agree to the <Link to="/terms" className="text-blue-600 hover:underline">Terms</Link> and{' '}
                <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 hover:underline font-medium">Login</Link>
              </p>
            </div>

            <div className="text-center mt-4 md:block hidden">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 hover:underline font-medium">Login</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
