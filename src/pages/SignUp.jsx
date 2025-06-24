import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png'; // Adjust path if needed
import axios from 'axios'; // Ensure axios is installed in your project
const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    agree: false,
  });
  const [userData, setUserData] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSignup = async(e) => {
    e.preventDefault();
    const { name, phoneNumber, password, confirmPassword, agree } = formData;

    if (!agree) return alert('Please agree to the Terms and Privacy Policy.');
    if (password !== confirmPassword) return alert('Passwords do not match.');
    const userData = { name, phoneNumber, password };
    console.log(userData);
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/register`, userData);
      setUserData(response.data);
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-700 to-blue-500 flex flex-col justify-end relative">
      {/* Logo and Tagline */}
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
        <img src={logo} alt="Ful2Win Logo" className="w-40 md:w-44 mb-3" />
        <p className="text-white text-sm font-semibold text-center">
          Entertainment. <span className="text-yellow-300">Earning.</span> <span className="text-pink-400">Fame</span>
        </p>
      </div>

      {/* Signup Form */}
      <div className="bg-white rounded-t-3xl px-6 py-8 w-full max-w-md mx-auto shadow-xl">
        <h2 className="text-2xl font-bold mb-1">Welcome!</h2>
        <p className="text-gray-500 mb-5">Sign up to continue</p>

        <form onSubmit={handleSignup}>
          {/* Full Name */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>

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
              placeholder="Enter your phone number"
              value={formData.phoneNumber}
              onChange={handleChange}
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
              autoComplete="new-password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Enter your confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
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
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 rounded-md transition duration-200"
          >
            SIGN UP
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
