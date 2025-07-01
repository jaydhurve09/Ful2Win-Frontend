import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import authService from '../services/api';
import logo from '../assets/logo.png';
import BackgroundBubbles from '../components/BackgroundBubbles';

const PhoneVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (location.state?.formData) {
      setFormData(location.state.formData);
      setPhoneNumber(location.state.formData.phoneNumber);
    } else {
      // If no form data is passed, redirect back to signup
      navigate('/signup');
    }
  }, [location, navigate]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;
    
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    
    // Auto focus next input
    if (element.nextSibling && element.value !== '') {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      // Move to previous input on backspace
      const prevInput = e.target.previousSibling;
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  const handleVerify = async () => {
    try {
      setIsLoading(true);
      const otpCode = otp.join('');
      
      if (otpCode.length !== 6) {
        toast.error('Please enter a valid 6-digit OTP');
        return;
      }

      // Call your verification API here
      // Example: await authService.verifyPhoneNumber(phoneNumber, otpCode);
      
      // If verification is successful, complete registration
      const result = await authService.completeRegistration({
        ...formData,
        phoneNumber,
        otp: otpCode
      });

      if (result && result.success) {
        toast.success('Phone number verified successfully!');
        // Redirect to login or dashboard
        navigate('/login');
      } else {
        throw new Error(result?.message || 'Verification failed');
      }
    } catch (error) {
      console.error('Verification failed:', error);
      toast.error(error.response?.data?.message || 'Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePhone = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }

    try {
      setIsLoading(true);
      // Call your API to resend OTP to the new number
      // await authService.sendOtp(phoneNumber);
      setIsEditingPhone(false);
      setOtp(['', '', '', '', '', '']);
      setCountdown(30);
      setCanResend(false);
      toast.success('New OTP sent to your updated number');
    } catch (error) {
      console.error('Failed to update phone number:', error);
      toast.error('Failed to update phone number. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    
    try {
      setIsLoading(true);
      // Call your API to resend OTP
      // await authService.resendOtp(phoneNumber);
      setCountdown(30);
      setCanResend(false);
      toast.success('New OTP sent to your number');
    } catch (error) {
      console.error('Failed to resend OTP:', error);
      toast.error('Failed to resend OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!formData) {
    return null; // or a loading spinner
  }

  return (
    <div className="h-screen bg-blueGradient flex flex-col overflow-hidden">
      <div className="flex flex-col items-center justify-center flex-grow-0">
        <BackgroundBubbles />
        <div className="mt-8 mb-8">
          <div className="flex flex-col items-center">
            <img src={logo} alt="Ful2Win Logo" className="w-40 md:w-44 mb-2" />
            <p className="text-white text-sm font-semibold text-center">
              Entertainment. <span className="text-yellow-300">Earning.</span>{' '}
              <span className="text-pink-400">Fame</span>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-t-3xl px-6 py-8 w-full max-w-md mx-auto shadow-xl flex-grow-0 h-[calc(100vh-100px)]">
        <div className="overflow-y-auto max-h-[70vh] md:max-h-[70vh] sm:max-h-full p-4">
          <h2 className="text-2xl font-semibold text-gray-700 mb-5">Verify Phone Number</h2>
          <p className="text-gray-500 mb-6">
            We've sent a verification code to {phoneNumber}
          </p>

          <div className="space-y-6">
            {/* Phone Number Edit */}
            {isEditingPhone ? (
              <div className="space-y-2">
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                  New Phone Number
                </label>
                <div className="flex space-x-2">
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="flex-1 px-4 py-2 text-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                    placeholder="Enter new phone number"
                  />
                  <button
                    onClick={handleUpdatePhone}
                    disabled={isLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Update
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
                <span className="text-gray-700">{phoneNumber}</span>
                <button
                  onClick={() => setIsEditingPhone(true)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Change
                </button>
              </div>
            )}

            {/* OTP Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Enter Verification Code
              </label>
              <div className="flex justify-between space-x-2">
                {[0, 1, 2, 3, 4, 5].map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    name="otp"
                    maxLength="1"
                    value={otp[index]}
                    onChange={(e) => handleOtpChange(e.target, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-10 h-12 text-center text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ))}
              </div>
              <div className="flex justify-between mt-2">
                <p className="text-sm text-gray-500">
                  Code expires in {countdown}s
                </p>
                <button
                  onClick={handleResendOtp}
                  disabled={!canResend || isLoading}
                  className={`text-sm ${canResend ? 'text-blue-600 hover:underline' : 'text-gray-400'}`}
                >
                  Resend Code
                </button>
              </div>
            </div>

            {/* Verify Button */}
            <button
              onClick={handleVerify}
              disabled={isLoading || otp.some(digit => digit === '')}
              className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${(isLoading || otp.some(digit => digit === '')) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Verifying...' : 'Verify Phone Number'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneVerification;
