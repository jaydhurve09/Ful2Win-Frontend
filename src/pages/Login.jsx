import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import axios from 'axios';

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [userData, setUserData] = useState({});

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!agree) {
      alert('Please agree to the terms and privacy policy');
      return;
    }
    const userData = { phoneNumber, password };

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/login`, userData);
      setUserData(response.data);
      console.log('Login successful:', response.data);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-700 to-blue-500 flex flex-col justify-end relative">
      {/* Centered Logo and Tagline */}
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
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              id="email"
              name="Email"
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
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 rounded-md transition duration-200"
          >
            LOGIN
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

