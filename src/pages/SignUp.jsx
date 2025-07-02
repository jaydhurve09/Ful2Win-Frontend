import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import logo from '../assets/logo.png';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BackgroundBubbles from '../components/BackgroundBubbles';
import axios from 'axios';
import {
  FaArrowLeft,
  FaClipboard,
  FaWhatsapp,
  FaTelegramPlane,
  FaGift,
  FaUserFriends,
  FaCheckCircle,
  FaRupeeSign,
  FaTimesCircle,
  FaSpinner
} from 'react-icons/fa';

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    agree: false,
    referralCode: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showReferral, setShowReferral] = useState(false);
  const [isValidatingCode, setIsValidatingCode] = useState(false);
  const [isReferralCodeValid, setIsReferralCodeValid] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Check for referral code in URL on component mount
  useEffect(() => {
    const refCode = searchParams.get('ref');
    if (refCode) {
      // Set the referral code in the form
      setFormData(prev => ({
        ...prev,
        referralCode: refCode
      }));
      
      // Validate the referral code
      validateReferralCode(refCode);
    }
  }, [searchParams]);
  
  // Function to validate referral code
  const validateReferralCode = async (code) => {
    if (!code) {
      setIsReferralCodeValid(null);
      return;
    }
    
    try {
      setIsValidatingCode(true);
      const response = await axios.get(`/api/referrals/validate?code=${encodeURIComponent(code)}`);
      
      if (response.data.valid) {
        setIsReferralCodeValid(true);
        toast.success('Valid referral code!');
      } else {
        setIsReferralCodeValid(false);
        toast.warning(response.data.message || 'Invalid referral code');
      }
    } catch (error) {
      console.error('Error validating referral code:', error);
      setIsReferralCodeValid(false);
      toast.error('Error validating referral code');
    } finally {
      setIsValidatingCode(false);
    }
  };
  
  // Handle referral code input change
  const handleReferralCodeChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      referralCode: value
    }));
    
    // Only validate if the field is not empty
    if (value.trim()) {
      validateReferralCode(value);
    } else {
      setIsReferralCodeValid(null);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
      isValid = false;
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.phoneNumber.match(phoneRegex)) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
      isValid = false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.match(emailRegex)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }
    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
      isValid = false;
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  useEffect(() => {
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
    const isValid = validateForm();
    if (!isValid) return;
    if (!formData.agree) {
      toast.error('Please agree to the terms and privacy policy');
      return;
    }
    try {
      setIsLoading(true);
      const userData = {
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        password: formData.password,
        referralCode: formData.referralCode
      };
      const result = { success: true, message: 'OTP sent successfully' };
      if (result && result.success) {
        navigate('/verify-phone', {
          state: {
            formData: userData,
            message: result.message
          }
        });
      } else {
        throw new Error(result?.message || 'Registration failed');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-blueGradient flex flex-col overflow-hidden">
      <BackgroundBubbles />
      <div className="flex flex-col items-center justify-center flex-grow-0 mt-6">
        <img src={logo} alt="Ful2Win Logo" className="w-40 md:w-44 mb-2" />
        <p className="text-white text-sm font-semibold text-center">
          Entertainment. <span className="text-yellow-300">Earning.</span> <span className="text-pink-400">Fame</span>
        </p>
      </div>

      <div className="flex-grow flex flex-col justify-center">
        <div className="bg-white rounded-t-3xl px-6 py-8 w-full max-w-md mx-auto shadow-xl h-auto">
          <div className="p-4 flex flex-col justify-between h-full">
            <div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-5">Welcome!</h2>
              <p className="text-gray-500 mb-6">Sign up to continue</p>
              <form onSubmit={handleSubmit} className="space-y-4">
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
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
                  )}
                </div>

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
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

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
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                  )}
                </div>

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

                <div className="mt-2">
                  <div className="flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => setShowReferral(!showReferral)}
                      className="text-blue-600 text-sm font-medium hover:underline"
                    >
                      {showReferral ? 'Hide referral code' : 'Have a referral code?'}
                    </button>
                    {showReferral && formData.referralCode && (
                      <div className="flex items-center">
                        {isValidatingCode ? (
                          <span className="text-xs text-gray-500 flex items-center">
                            <FaSpinner className="animate-spin mr-1" /> Validating...
                          </span>
                        ) : isReferralCodeValid === true ? (
                          <span className="text-xs text-green-600 flex items-center">
                            <FaCheckCircle className="mr-1" /> Valid code
                          </span>
                        ) : isReferralCodeValid === false ? (
                          <span className="text-xs text-red-500">Invalid code</span>
                        ) : null}
                      </div>
                    )}
                  </div>
                  
                  {showReferral && (
                    <div className="mt-2 relative">
                      <input
                        id="referralCode"
                        name="referralCode"
                        type="text"
                        placeholder="Enter referral code (optional)"
                        value={formData.referralCode}
                        onChange={handleReferralCodeChange}
                        className={`w-full px-4 py-2 text-gray-500 border ${
                          isReferralCodeValid === false 
                            ? 'border-red-500' 
                            : isReferralCodeValid === true 
                              ? 'border-green-500' 
                              : 'border-gray-300'
                        } rounded-md focus:outline-none focus:ring focus:ring-blue-300`}
                        disabled={isValidatingCode}
                      />
                      {isReferralCodeValid === true && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <FaCheckCircle className="h-5 w-5 text-green-500" />
                        </div>
                      )}
                      {isReferralCodeValid === false && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <FaTimesCircle className="h-5 w-5 text-red-500" />
                        </div>
                      )}
                      <p className="mt-1 text-xs text-gray-500">
                        Enter a valid referral code to get a bonus on your first deposit
                      </p>
                    </div>
                  )}
                </div>

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
              </form>
            </div>

            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isLoading}
              className={`w-full mt-6 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>

            <p className="text-sm text-center mt-4 text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:underline font-medium">Login here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
