import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../assets/logo.png';
import BackgroundCircles from '../components/BackgroundCircles';
import authService from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Call the backend API to send password reset email
      const response = await authService.forgotPassword({ email });
      
      if (response.success) {
        setResetSent(true);
        toast.success('Password reset link sent to your email');
      } else {
        throw new Error(response.message || 'Failed to send reset email');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error(error.message || 'Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-royalBlueGradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 relative overflow-hidden">
      <BackgroundCircles />
      
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden z-10">
        <div className="p-8">
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <img src={logo} alt="Ful2Win Logo" className="h-12 mx-auto mb-4" />
            </Link>
            <h2 className="text-2xl font-bold text-gray-800">
              {resetSent ? 'Check Your Email' : 'Forgot Password?'}
            </h2>
            <p className="text-gray-600 mt-2">
              {resetSent 
                ? 'We have sent a password reset link to your email address.' 
                : 'Enter your email address to receive a password reset link.'}
            </p>
          </div>

          {!resetSent ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="Enter your email address"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2 px-4 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Sending Reset Link...' : 'Send Reset Link'}
              </button>
              
              <div className="text-center mt-4">
                <button 
                  type="button"
                  onClick={handleBackToLogin}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Back to Login
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center">
              <p className="mb-6 text-gray-600">
                If you don't see the email, check your spam folder or try again.
              </p>
              <button
                onClick={handleBackToLogin}
                className="w-full py-2 px-4 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
