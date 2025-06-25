import React, { useState, useEffect, useContext } from 'react';
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
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state]);

  const testBackendConnection = async () => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL.endsWith('/') 
      ? import.meta.env.VITE_API_BASE_URL.slice(0, -1) 
      : import.meta.env.VITE_API_BASE_URL;
    const testUrl = `${baseUrl}/api/users/test-endpoint`;
    console.log('=== Testing Backend Connection ===');
    console.log('Test URL:', testUrl);
    
    try {
      const response = await fetch(testUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          test: 'connection',
          timestamp: new Date().toISOString()
        }),
        credentials: 'include',
        mode: 'cors'
      });
      
      const responseData = {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries([...response.headers.entries()])
      };
      
      console.log('Test connection response:', responseData);
      
      let data;
      try {
        data = await response.json();
        console.log('Test connection JSON data:', data);
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError);
        const text = await response.text();
        console.log('Raw response text:', text);
        data = { error: 'Invalid JSON response', raw: text };
      }
      
      return { 
        success: response.ok, 
        status: response.status,
        data,
        response: responseData
      };
    } catch (error) {
      console.error('Test connection failed:', error);
      throw error;
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!agree) {
      toast.error('Please agree to the terms and privacy policy');
      return;
    }
    
    if (!phoneNumber || !password) {
      toast.error('Please enter both phone number and password');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // First test the backend connection
      console.log('=== Connection Test ===');
      const connectionTest = await testBackendConnection();
      console.log('Connection test result:', connectionTest);
      
      if (!connectionTest.success) {
        if (connectionTest.status === 0) {
          throw new Error('Network error: Unable to connect to the server. Please check your internet connection.');
        } else if (connectionTest.status === 404) {
          throw new Error('Server error: The requested endpoint was not found. Please check the API URL.');
        } else if (connectionTest.status === 405) {
          throw new Error('Server error: Method not allowed. The server rejected the request method.');
        } else if (connectionTest.status >= 500) {
          throw new Error('Server error: The server encountered an internal error. Please try again later.');
        } else {
          throw new Error(`Connection failed with status ${connectionTest.status}: ${connectionTest.statusText}`);
        }
      }
      
      console.log('=== Login Attempt ===');
      console.log('1. Attempting login with:', { phoneNumber });
      const userData = { phoneNumber, password };
      
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
      toast.error(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blueGradient flex flex-col justify-end relative">
      {/* Centered Logo and Tagline */}
      <BackgroundBubbles />
      <div className="absolute top-40 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
        <img src={logo} alt="Ful2Win Logo" className="w-45 md:w-44 mb-4" />
        <p className="text-white text-sm font-semibold text-center">
          Entertainment. <span className="text-yellow-300">Earning.</span> <span className="text-pink-400">Fame</span>
        </p>
      </div>

      {/* Login Form */}
      <div className="bg-white rounded-t-3xl px-6 py-8 w-full max-w-md mx-auto shadow-xl">
        <h2 className="text-2xl font-bold mb-1">Hello Again!</h2>
        <p className="text-gray-500 mb-5">Login to continue</p>

        <form onSubmit={handleLogin}>
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
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter your phone number"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
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
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>

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
              <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
            </label>
          </div>

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
        </p>
      </div>
    </div>
  );
};

export default Login;

