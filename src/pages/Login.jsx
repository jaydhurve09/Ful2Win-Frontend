<<<<<<< HEAD
import React, { useState, useEffect, useContext } from 'react';
=======
// src/components/Login.jsx
import React, { useState, useEffect } from 'react';
>>>>>>> bced60bd76460f363b7b931c2d1ca19819f69d8b
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../assets/logo.png';
import { useAuth } from '../contexts/AuthContext';
import BackgroundBubbles from '../components/BackgroundBubbles';

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
<<<<<<< HEAD
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
=======

  useEffect(() => {
    if (isAuthenticated) {
      toast.info('You are  logged in');
>>>>>>> bced60bd76460f363b7b931c2d1ca19819f69d8b
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state]);

<<<<<<< HEAD
  // Removed testBackendConnection function as it's not needed

  const validatePhoneNumber = (phone) => {
    // Remove all non-digit characters
    const digitsOnly = phone.replace(/\D/g, '');
    // Check if we have exactly 10 digits
=======
  const validatePhoneNumber = (phone) => {
    const digitsOnly = phone.replace(/\D/g, '');
>>>>>>> bced60bd76460f363b7b931c2d1ca19819f69d8b
    return digitsOnly.length === 10 ? digitsOnly : null;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
<<<<<<< HEAD
    
=======

>>>>>>> bced60bd76460f363b7b931c2d1ca19819f69d8b
    if (!agree) {
      toast.error('Please agree to the terms and privacy policy');
      return;
    }
<<<<<<< HEAD
    
=======
>>>>>>> bced60bd76460f363b7b931c2d1ca19819f69d8b
    if (!phoneNumber || !password) {
      toast.error('Please enter both phone number and password');
      return;
    }
<<<<<<< HEAD
    
    // Validate and format phone number
=======

>>>>>>> bced60bd76460f363b7b931c2d1ca19819f69d8b
    const formattedPhone = validatePhoneNumber(phoneNumber);
    if (!formattedPhone) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }
<<<<<<< HEAD
    
    try {
      setIsLoading(true);
      
      console.log('=== Login Attempt ===');
      console.log('1. Attempting login with formatted phone:', formattedPhone);
      const userData = { phoneNumber: formattedPhone, password };
      
      console.log('2. Calling login function...');
      const result = await login(userData);
      console.log('3. Login result:', result);
      
      if (result.success) {
        console.log('4. Login successful, checking user data...');
        toast.success('Login successful!');
        
        if (result.user) {
          console.log('5. User data received:', result.user);
          console.log('6. Location state:', location.state);
          
          // The useEffect hook will handle the redirection when isAuthenticated changes
          console.log('7. Login successful, isAuthenticated should update');
        } else {
          console.error('9. Login successful but no user data received');
          throw new Error('Login successful but unable to load user data');
        }
      } else {
        throw new Error(result.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login failed:', error);
=======

    try {
      setIsLoading(true);
      const result = await login({ phoneNumber: formattedPhone, password });
      if (result.success) {
        toast.success('Login successful!');
        // Navigate to home with state indicating we came from auth
        navigate('/', { state: { from: 'auth' } });
      } else {
        toast.error('Invalid phone number or password');
      }
    } catch (error) {
>>>>>>> bced60bd76460f363b7b931c2d1ca19819f69d8b
      toast.error(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blueGradient flex flex-col justify-end relative">
<<<<<<< HEAD
      {/* Centered Logo and Tagline */}
=======
>>>>>>> bced60bd76460f363b7b931c2d1ca19819f69d8b
      <BackgroundBubbles />
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
        <img src={logo} alt="Ful2Win Logo" className="w-45 md:w-44 mb-4" />
        <p className="text-red-500 text-sm font-semibold text-center">
          Entertainment. <span className="text-yellow-300">Earning.</span> <span className="text-pink-400">Fame</span>
        </p>
      </div>

<<<<<<< HEAD
      {/* Login Form */}
=======
>>>>>>> bced60bd76460f363b7b931c2d1ca19819f69d8b
      <div className="bg-white rounded-t-3xl px-6 py-8 w-full max-w-md mx-auto shadow-xl">
        <h2 className="text-2xl font-semibold text-gray-700 mb-5">Hello Again!</h2>
        <p className="text-gray-500 mb-5">Login to continue</p>

        <form onSubmit={handleLogin}>
<<<<<<< HEAD
          {/* Phone Number */}
          <div className="mb-4">
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              autoComplete="tel"
              value={phoneNumber}
              onChange={(e) => {
                // Only allow numbers and auto-format as user types
                const value = e.target.value.replace(/\D/g, '');
                setPhoneNumber(value);
              }}
              placeholder="Enter 10-digit phone number"
              className="w-full px-4 py-2 text-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              pattern="[0-9]{10}"
              maxLength="10"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Enter 10 digits (e.g., 9876543210)</p>
          </div>

          {/* Password */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 text-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
=======
          {/* Phone field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter 10-digit phone number"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-blue-300"
              maxLength="10"
              required
            />
          </div>

          {/* Password field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-blue-300"
>>>>>>> bced60bd76460f363b7b931c2d1ca19819f69d8b
              required
            />
          </div>

<<<<<<< HEAD
          {/* Terms Checkbox */}
          <div className="flex items-center mb-4 text-sm">
            <input
              id="agree"
              name="agree"
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="mr-2"
              required
            />
            <label htmlFor="agree" className="text-gray-700">
              I agree to the <Link to="/terms" className="text-blue-600 hover:underline">Terms</Link> and{' '}
=======
          {/* Forgot password link */}
          <div className="text-right text-sm mb-4">
            <Link to="/forgot-password" className="text-blue-600 hover:underline">
              Forgot Password?
            </Link>
          </div>

          {/* Terms agreement */}
          <div className="flex items-center mb-4 text-sm">
            <input
              type="checkbox"
              checked={agree}
              onChange={e => setAgree(e.target.checked)}
              className="mr-2"
              required
            />
            <label className="text-gray-700">
              I agree to the{' '}
              <Link to="/terms" className="text-blue-600 hover:underline">Terms</Link> and{' '}
>>>>>>> bced60bd76460f363b7b931c2d1ca19819f69d8b
              <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
            </label>
          </div>

<<<<<<< HEAD
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full ${isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white py-3 px-4 rounded-lg font-medium transition-colors flex justify-center items-center`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </>
            ) : 'Login'}
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-gray-500">
          Don’t have an account?{' '}
          <Link to="/signup" className="text-blue-600 hover:underline font-medium">SignUp</Link>
=======
          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-lg text-white ${
              isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-sm mt-4 text-gray-500">
          Don’t have an account?{' '}
          <Link to="/signup" className="text-blue-600 hover:underline font-medium">
            Sign Up
          </Link>
>>>>>>> bced60bd76460f363b7b931c2d1ca19819f69d8b
        </p>
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default Login;
=======
export default Login;
>>>>>>> bced60bd76460f363b7b931c2d1ca19819f69d8b
