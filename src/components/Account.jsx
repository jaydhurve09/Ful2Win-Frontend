import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import Select from "react-select";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiCamera } from "react-icons/fi";
import { FaTrophy, FaGamepad, FaRupeeSign } from "react-icons/fa";
import { IoMdPerson } from "react-icons/io";
import Header from "./Header";
import Navbar from "./Navbar";
import BackgroundBubbles from "./BackgroundBubbles";
import authService from "../services/api";
import "../App.css";

countries.registerLocale(enLocale);

const Account = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const fileInputRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    dateOfBirth: "",
    gender: "",
    country: "",
    bio: "",
    profilePicture: "",
    balance: 0
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [countryOptions, setCountryOptions] = useState([]);
  const [errors, setErrors] = useState({});
  const [originalData, setOriginalData] = useState(null);

  // Initialize country list
  useEffect(() => {
    try {
      const countryList = Object.entries(countries.getNames("en", { select: "official" })).map(
        ([code, name]) => ({ value: code, label: name })
      );
      setCountryOptions(countryList);
    } catch (error) {
      console.error('Error loading country list:', error);
    }
  }, []);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching user data...');
        
        // First try to get from localStorage for instant display
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (storedUser && storedUser._id) {
          console.log('Using stored user data:', storedUser);
          updateFormData(storedUser);
        }
        
        // Then fetch fresh data from the server
        const userData = await authService.getCurrentUserProfile();
        console.log('Fetched user data:', userData);
        
        if (userData) {
          updateFormData(userData);
        }
      } catch (error) {
        console.error('Error fetching user data:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        toast.error('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, []);
  
  // Helper function to update form data
  const updateFormData = (userData) => {
    const userProfile = {
      fullName: userData.fullName || "",
      phoneNumber: userData.phoneNumber || "",
      email: userData.email || "",
      dateOfBirth: userData.dateOfBirth ? formatDate(userData.dateOfBirth) : "",
      gender: userData.gender || "",
      country: userData.country || "",
      bio: userData.bio || "",
      profilePicture: userData.profilePicture || "",
      balance: userData.balance || 0
    };
    
    console.log('Updating form data with:', userProfile);
    setFormData(userProfile);
    setOriginalData(userProfile);
  };
  
  // Helper function to format date
  const formatDate = (dateString) => {
    try {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error('Error formatting date:', error);
      return "";
    }
  };

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    
    // Handle file inputs
    if (type === 'file' && files && files[0]) {
      const file = files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload a valid image file (JPEG, PNG, etc.)');
        return;
      }
      
      // Check file size (max 2MB)
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSize) {
        toast.error(`Image size should be less than ${maxSize / (1024 * 1024)}MB`);
        return;
      }
      
      // Create preview URL and update form data
      const reader = new FileReader();
      reader.onloadstart = () => {
        // Show loading state if needed
      };
      reader.onload = () => {
        setFormData(prev => ({
          ...prev,
          [name]: reader.result,
          [`${name}File`]: file // Store the actual file for upload
        }));
      };
      reader.onerror = () => {
        console.error('Error reading file');
        toast.error('Error reading image file');
      };
      reader.readAsDataURL(file);
    } 
    // Handle checkbox inputs
    else if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    }
    // Handle all other inputs
    else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (isEditing && formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (isEditing && formData.password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length === 0) {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          throw new Error('User not authenticated');
        }

        const toastId = toast.loading('Updating profile...');
        
        // Create FormData for the request
        const formDataToSend = new FormData();
        
        // Add all form fields to FormData
        Object.entries(formData).forEach(([key, value]) => {
          // Skip file objects and undefined values
          if (value === undefined || value === null) return;
          
          // Handle file uploads
          if (key.endsWith('File') && value instanceof File) {
            // For file inputs, use the field name without 'File' suffix
            const fieldName = key.replace(/File$/, '');
            formDataToSend.append(fieldName, value);
          } 
          // Handle regular form fields
          else if (typeof value !== 'object' || value instanceof Date) {
            formDataToSend.append(key, value);
          } 
          // Handle nested objects (stringify them)
          else if (typeof value === 'object') {
            formDataToSend.append(key, JSON.stringify(value));
          }
        });
        
        // Add any additional fields if needed
        // formDataToSend.append('customField', 'value');
        
        // Log FormData entries for debugging
        for (let [key, value] of formDataToSend.entries()) {
          console.log(`FormData: ${key} =`, value);
        }
        
        // Make the API call
        const updatedUser = await authService.updateUserProfile(userId, formDataToSend, true);
        
        // Update local state with the response
        if (updatedUser) {
          // If the backend returns the updated user, update our local state
          updateFormData(updatedUser);
          setOriginalData(updatedUser);
          
          // Update localStorage with the latest user data
          const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
          localStorage.setItem('user', JSON.stringify({
            ...storedUser,
            ...updatedUser,
            profilePicture: updatedUser.profilePicture || storedUser.profilePicture
          }));
        }
        
        // Show success message
        toast.update(toastId, {
          render: 'Profile updated successfully!',
          type: 'success',
          isLoading: false,
          autoClose: 3000
        });
        
        // Exit edit mode
        setIsEditing(false);
        
      } catch (error) {
        console.error('Error updating profile:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        
        // Show error message
        toast.error(
          error.response?.data?.message || 
          error.message || 
          'Failed to update profile. Please try again.'
        );
      }
    } else {
      // Show validation errors
      toast.error('Please fix the form errors before submitting');
    }
  };

  const toggleEdit = () => {
    if (isEditing) {
      // Reset to original data when canceling edit
      if (originalData) {
        setFormData(originalData);
      }
    }
    setIsEditing(!isEditing);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Debug: Log current form data
  console.log('Current form data:', formData);

  // Function to show JWT token for testing
  const showAuthToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
      alert(`Your JWT Token (first 15 chars): ${token.substring(0, 15)}...\n\nFull token (check console for complete token)`);
      console.log('Full JWT Token:', token);
      return token;
    } else {
      alert('No JWT token found in localStorage. Please log in first.');
      return null;
    }
  };

  // Call this function when component mounts
  useEffect(() => {
    showAuthToken();
  }, []);

  // Function to test user profile retrieval
  const testGetUserProfile = async () => {
    try {
      console.log('Testing user profile retrieval...');
      const userData = await authService.getCurrentUserProfile();
      console.log('User profile data:', userData);
      toast.success('Successfully fetched user profile!');
      
      // Update form data with the fetched user data
      setFormData(prev => ({
        ...prev,
        ...userData
      }));
      
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch user profile');
    }
  };

  return (
    <div className="relative min-h-screen pb-24 overflow-hidden text-white bg-gradient-to-b from-[#0b3fae] via-[#1555d1] to-[#2583ff]">
      <BackgroundBubbles />
      <div className="relative z-10">
        <Header />
        
        {/* Test Button - Can be removed after testing */}
        <div className="fixed bottom-20 right-4 z-50">
          <button 
            onClick={testGetUserProfile}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium shadow-lg transition-colors"
          >
            Test Get Profile
          </button>
        </div>

        <div className="pt-20 px-3 max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">My Profile</h1>
            <button
              type="button"
              onClick={toggleEdit}
              className="bg-yellow-400 text-blue-900 px-4 py-2 rounded-lg font-medium hover:bg-yellow-300 transition-colors"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 flex flex-col items-center">
                  <div className="relative group">
                    <img
                      src={formData.profilePicture || "https://i.pravatar.cc/150?img=12"}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover border-4 border-blue-400"
                    />
                    {isEditing && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <label className="cursor-pointer p-2 bg-blue-500 rounded-full hover:bg-blue-600 transition-colors">
                          <FiCamera className="text-white text-xl" />
                          <input
                            type="file"
                            name="profilePicture"
                            accept="image/*"
                            onChange={handleChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                    )}
                  </div>
                  {isEditing && (
                    <p className="text-sm text-gray-300 mt-2">
                      Click on the image to change
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-gray-300 text-sm font-bold mb-1" htmlFor="phoneNumber">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="phoneNumber"
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber || ''}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <p className="text-white text-lg">{formData.phoneNumber || 'Not provided'}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-300 text-sm font-bold mb-1" htmlFor="email">
                    Email
                  </label>
                  <p className="text-white text-lg">{formData.email || 'Not provided'}</p>
                  {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-300 text-sm font-bold mb-1" htmlFor="dateOfBirth">
                    Date of Birth
                  </label>
                  {isEditing ? (
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="dateOfBirth"
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth || ''}
                      onChange={handleChange}
                    />
                  ) : (
                    <p className="text-white text-lg">
                      {formData.dateOfBirth ? new Date(formData.dateOfBirth).toLocaleDateString() : 'Not provided'}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-gray-300 text-sm font-bold mb-1" htmlFor="gender">
                    Gender
                  </label>
                  {isEditing ? (
                    <select
                      name="gender"
                      value={formData.gender || ''}
                      onChange={handleChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  ) : (
                    <p className="text-white text-lg capitalize">
                      {formData.gender ? formData.gender.replace(/-/g, ' ') : 'Not provided'}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-gray-300 text-sm font-bold mb-1" htmlFor="country">
                    Country
                  </label>
                  {isEditing ? (
                    <Select
                      options={countryOptions}
                      value={countryOptions.find(option => option.value === formData.country) || null}
                      onChange={(selected) =>
                        handleChange({
                          target: {
                            name: 'country',
                            value: selected ? selected.value : ''
                          }
                        })
                      }
                      className="text-gray-700"
                      classNamePrefix="select"
                      isClearable
                      placeholder="Select a country"
                    />
                  ) : (
                    <p className="text-white text-lg">
                      {formData.country ? (countryOptions.find(c => c.value === formData.country)?.label || formData.country) : 'Not provided'}
                    </p>
                  )}
                </div>

                <div className="mb-4 md:col-span-2">
                  <label className="block text-gray-300 text-sm font-bold mb-1" htmlFor="bio">
                    Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={formData.bio || ''}
                      onChange={handleChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline min-h-[100px]"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="text-white text-lg whitespace-pre-line">
                      {formData.bio || 'Not provided'}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-gray-300 text-sm font-bold mb-1" htmlFor="phoneNumber">
                    Phone Number
                  </label>
                {isEditing ? (
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="phoneNumber"
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber || ''}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                  />
                ) : (
                  <p className="text-white text-lg">{formData.phoneNumber || 'Not provided'}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-bold mb-1" htmlFor="email">
                  Email
                </label>
                <p className="text-white text-lg">{formData.email || 'Not provided'}</p>
                {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-bold mb-1" htmlFor="dateOfBirth">
                  Date of Birth
                </label>
                {isEditing ? (
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="dateOfBirth"
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth || ''}
                    onChange={handleChange}
                  />
                ) : (
                  <p className="text-white text-lg">
                    {formData.dateOfBirth ? new Date(formData.dateOfBirth).toLocaleDateString() : 'Not provided'}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-bold mb-1" htmlFor="gender">
                  Gender
                </label>
                {isEditing ? (
                  <select
                    name="gender"
                    value={formData.gender || ''}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                ) : (
                  <p className="text-white text-lg capitalize">
                    {formData.gender ? formData.gender.replace(/-/g, ' ') : 'Not provided'}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-bold mb-1" htmlFor="country">
                  Country
                </label>
                {isEditing ? (
                  <Select
                    options={countryOptions}
                    value={countryOptions.find(option => option.value === formData.country) || null}
                    onChange={(selected) =>
                      handleChange({
                        target: {
                          name: 'country',
                          value: selected ? selected.value : ''
                        }
                      })
                    }
                    className="text-gray-700"
                    classNamePrefix="select"
                    isClearable
                    placeholder="Select a country"
                  />
                ) : (
                  <p className="text-white text-lg">
                    {formData.country ? (countryOptions.find(c => c.value === formData.country)?.label || formData.country) : 'Not provided'}
                  </p>
                )}
              </div>

              <div className="mb-4 md:col-span-2">
                <label className="block text-gray-300 text-sm font-bold mb-1" htmlFor="bio">
                  Bio
                </label>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={formData.bio || ''}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline min-h-[100px]"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-white text-lg whitespace-pre-line">
                    {formData.bio || 'Not provided'}
                  </p>
                )}
              </div>

              </div>
              
              {isEditing && (
                <div className="flex flex-col items-center space-y-4">
                  <p className="text-sm text-gray-300">
                    Click on the image to change your profile picture
                  </p>
                  <div className="flex justify-end space-x-4 w-full pt-4">
                    <button
                      type="button"
                      onClick={toggleEdit}
                      className="border border-gray-300 text-gray-300 px-6 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
      <Navbar />
    </div>
  );
};

export default Account;
