import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../services/api';
import { 
  FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiCamera, 
  FiCalendar, FiGlobe, FiEdit2, FiSave, FiX 
} from 'react-icons/fi';
import { FaTrophy, FaGamepad, FaRupeeSign } from 'react-icons/fa';
import authService from '../services/authService';
import Header from './Header';
import Navbar from './Navbar';
import BackgroundBubbles from './BackgroundBubbles';
import '../App.css';
import Select from 'react-select';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
import defaultProfile from '../assets/default-profile.jpg';

// Initialize countries
countries.registerLocale(enLocale);

const Account = () => {
  const { user, updateUser, isAuthenticated, checkAuthState } = useAuth();
  const navigate = useNavigate();
  const [forceUpdate, setForceUpdate] = useState(false);
  
  // Remove the redundant auth check as ProtectedRoute already handles this
  
  // Form state
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    phoneNumber: '',
    email: '',
    dateOfBirth: '',
    gender: '',
    country: '',
    bio: '',
    profilePicture: '',
    password: '',
    confirmPassword: ''
  });
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countryOptions, setCountryOptions] = useState([]);
  const fileInputRef = useRef(null);
  const [originalData, setOriginalData] = useState(null);
  
  // Initialize country list
  useEffect(() => {
    try {
      const countryList = Object.entries(countries.getNames("en", { select: "official" }))
        .map(([code, name]) => ({
          value: code,
          label: name
        }));
      setCountryOptions(countryList);
    } catch (error) {
      console.error('Error loading country list:', error);
    }
  }, []);
  
  // Check if username is available
  const checkUsernameAvailability = async (username) => {
    if (!username || username === user?.username) return { available: true };
    
    try {
      const response = await authService.checkUsername(username);
      return { available: response.available };
    } catch (error) {
      console.error('Error checking username:', error);
      return { available: false, error: 'Error checking username availability' };
    }
  };

  // Initialize form with user data
  useEffect(() => {
    let isMounted = true;
    
    const initializeForm = () => {
      try {
        if (!user) {
          // If user is null/undefined, set empty form and enable edit mode
          const emptyForm = {
            username: '',
            fullName: '',
            phoneNumber: '',
            email: '',
            dateOfBirth: '',
            gender: '',
            country: '',
            bio: '',
            profilePicture: '',
            password: '',
            confirmPassword: ''
          };
          if (isMounted) {
            setFormData(emptyForm);
            setOriginalData(emptyForm);
            setIsLoading(false);
            setIsEditing(true); // Enable edit mode for new users
          }
          return;
        }
        
        const userData = {
          username: user.username || '',
          fullName: user.fullName || '',
          phoneNumber: user.phoneNumber || '',
          email: user.email || '',
          dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
          gender: user.gender || '',
          country: user.country || '',
          bio: user.bio || '',
          profilePicture: user.profilePicture || '',
          password: '',
          confirmPassword: ''
        };
        
        if (isMounted) {
          setFormData(userData);
          setOriginalData(userData);
          setIsLoading(false);
          // If user doesn't have a profile picture, enable edit mode
          if (!user.profilePicture) {
            setIsEditing(true);
          }
        }
      } catch (error) {
        console.error('Error initializing account form:', error);
        if (isMounted) {
          setIsLoading(false);
          toast.error('Failed to load account information');
        }
      }
    };

    initializeForm();
    
    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleChange = async (e) => {
    // Handle country selection from react-select
    if (e && e.target === undefined && e.value) {
      const { value, name } = e;
      
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      return;
    }
    
    const { name, value, files, type } = e.target;
    
    // Skip file handling for profile picture (handled by handleFileChange)
    if (name === 'profilePicture') {
      return;
    }
    
    // For other fields, just update the value
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    const toastId = toast.loading('Updating profile...');
    let response;
    
    try {
      // Prepare profile data for submission
      // Never send any File object or FormData here! Only send text fields as JSON.
      const {
        profilePictureFile, // ignore any file object
        password,
        confirmPassword,
        profilePicture, // only send if it's a URL (string)
        ...profileData
      } = formData;

      // Remove empty strings and undefined/null values
      const cleanProfileData = Object.fromEntries(
        Object.entries(profileData).filter(([_, v]) => v !== '' && v !== undefined && v !== null)
      );

      // Only include profilePicture if it's a non-empty string (URL), never a File
      if (typeof profilePicture === 'string' && profilePicture.trim() !== '') {
        cleanProfileData.profilePicture = profilePicture;
      }

      // Update profile data
      toast.update(toastId, { 
        render: 'Updating profile information...',
        type: 'info',
        isLoading: true 
      });
      
      // Send the update to the server
      response = await authService.updateUserProfile(user._id, cleanProfileData);
      
      if (!response?.success) {
        throw new Error(response?.message || 'Failed to update profile');
      }
      
      // Update the UI with the response
      toast.update(toastId, {
        render: 'Profile updated successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 3000
      });
      
      // Update the user in local storage and context
      if (response.user || response.data) {
        const updatedUser = response.user || response.data;
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        
        // Merge with existing user data
        const mergedUser = { ...currentUser, ...updatedUser };
        
        // Update local storage
        localStorage.setItem('user', JSON.stringify(mergedUser));
        
        // Update context
        if (updateUser) {
          updateUser(mergedUser);
        }
        
        // Update form data with the new user data
        setFormData(prev => ({
          ...prev,
          username: mergedUser.username,
          fullName: mergedUser.fullName,
          email: mergedUser.email,
          phoneNumber: mergedUser.phoneNumber,
          bio: mergedUser.bio || '',
          dateOfBirth: mergedUser.dateOfBirth ? new Date(mergedUser.dateOfBirth).toISOString().split('T')[0] : '',
          gender: mergedUser.gender || '',
          country: mergedUser.country || '',
          // Reset password fields
          password: '',
          confirmPassword: ''
        }));
      }
      
      // Update success message
      setSuccess('Profile updated successfully!');
      
      // Exit edit mode
      setIsEditing(false);
      
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update profile';
      
      toast.update(toastId, {
        render: errorMessage,
        type: 'error',
        isLoading: false,
        autoClose: 5000
      });
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    // Reset form to original values when canceling edit
    if (isEditing && user) {
      setFormData(prev => ({
        ...prev,
        username: user.username || '',
        fullName: user.fullName || '',
        phoneNumber: user.phoneNumber || '',
        email: user.email || '',
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
        gender: user.gender || '',
        country: user.country || '',
        bio: user.bio || '',
        profilePicture: user.profilePicture || '',
        password: '',
        confirmPassword: ''
      }));
      setErrors({});
    }
  };
  
  // Show loading state while initializing
  if (isLoading || !user) {
    return (
      <div className="min-h-screen pb-16 bg-blueGradient text-white relative overflow-hidden">
        <BackgroundBubbles />
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }



  // Compress image before upload
  const compressImage = async (file, options = {}) => {
    try {
      // Use dynamic import for browser-image-compression to reduce initial bundle size
      const imageCompression = (await import('browser-image-compression')).default;
      return await imageCompression(file, options);
    } catch (error) {
      console.error('Image compression error:', error);
      throw error;
    }
  };

  // Handle file upload with preview and Cloudinary upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    const toastId = toast.loading('Uploading image...');
    const formData = new FormData();
    
    
    // Use 'profilePicture' as the field name to match the backend's multer configuration
    formData.append('profilePicture', file);
    
    // Add any other user data that might be required
    formData.append('fullName', formData.fullName || user.fullName || '');
    formData.append('email', formData.email || user.email || '');
    formData.append('phoneNumber', formData.phoneNumber || user.phoneNumber || '');
    
    try {
      // Create a custom config for the request
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json'
        },
        withCredentials: true,
        timeout: 30000, // 30 seconds timeout
        transformRequest: (data, headers) => {
          // Let the browser set the Content-Type with boundary
          delete headers['Content-Type'];
          return data;
        }
      };

      // Make the request directly using axios to ensure proper headers
      const response = await api.put(`/users/profile/${user._id}`, formData, config);
      
      // Get the response data
      const responseData = response?.data || {};
      
      if (!responseData.success) {
        throw new Error(responseData.message || 'Failed to update profile picture');
      }
      
      // Get the new profile picture URL from the response
      const cloudinaryUrl = responseData?.profileUpdate?.newUrl || 
                          responseData?.user?.profilePicture || 
                          responseData?.profilePicture ||
                          user.profilePicture;
      
      
      if (!cloudinaryUrl) {
        throw new Error('No profile picture URL in the response');
      }
      
      // Get the full updated user data
      const updatedUser = responseData.user || user;
      
      // Create updated user object with new profile picture
      const updatedUserData = {
        ...user,
        profilePicture: cloudinaryUrl,
        ...(responseData.user || {}) // Include any other updated user data
      };
      
      // Update the user context with the new data
      updateUser(updatedUserData);
      
      // Update local storage with the new user data
      localStorage.setItem('user', JSON.stringify(updatedUserData));
      
      // Update form data with the new values
      setFormData(prev => ({
        ...prev,
        profilePicture: cloudinaryUrl,
        profilePicturePreview: cloudinaryUrl,
        ...(responseData.user || {}) // Include any other updated user data
      }));
      
      // Force a re-render by updating state
      setForceUpdate(prev => !prev);
      
      toast.dismiss(toastId);
      toast.success('Profile picture updated successfully!', {
        position: 'top-center',
        autoClose: 3000,
        closeButton: true
      });
      
    } catch (error) {
      console.error('Error updating profile picture:', error);
      toast.dismiss(toastId);
      
      // Revert to the previous profile picture on error
      setFormData(prev => ({
        ...prev,
        profilePicture: user.profilePicture,
        profilePicturePreview: user.profilePicture
      }));
      
      toast.error(error.response?.data?.message || error.message || 'Failed to update profile picture', {
        position: 'top-center',
        autoClose: 3000,
        closeButton: true
      });
    } finally {
      // Reset the file input
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  const toggleEdit = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (isEditing && originalData) {
      // Reset to original data when canceling edit
      setFormData(originalData);
    }
    setIsEditing(!isEditing);
  };

  if (isLoading) {
    // If user is missing after loading, show message or redirect
    if (!user) {
      return (
        <div className="flex flex-col justify-center items-center h-64 text-white">
          <p className="mb-4 text-lg">You must be logged in to view your account.</p>
          <button onClick={() => navigate('/login')} className="bg-blue-500 px-4 py-2 rounded-lg text-white font-semibold">Go to Login</button>
        </div>
      );
    }
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="relative min-h-screen pb-24 overflow-hidden text-white bg-gradient-to-b from-[#0b3fae] via-[#1555d1] to-[#2583ff]">
        <BackgroundBubbles />
        <div className="relative z-10">
          <Header />

          <div className="pt-20 px-3 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">My Profile</h1>
              {!isEditing && !isLoading && (
                <button
                  type="button"
                  onClick={toggleEdit}
                  className="bg-yellow-400 text-blue-900 px-4 py-2 rounded-lg font-medium hover:bg-yellow-300 transition-colors"
                >
                  Edit Profile
                </button>
              )}
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* File upload feedback */}
                {errors.profilePicture && (
                  <div className="md:col-span-2">
                    <div className="p-3 bg-red-100 text-red-700 rounded-lg">
                      {errors.profilePicture}
                    </div>
                  </div>
                )}
                <div className="md:col-span-2">
                  <div className="mb-4">
                    <label htmlFor="username" className="block text-sm font-medium mb-1">
                      Username
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        disabled={!isEditing || isCheckingUsername}
                        className={`w-full px-4 py-2 rounded-lg bg-white/10 border ${errors.username ? 'border-red-500' : 'border-white/20'} focus:ring-2 focus:ring-blue-400 focus:border-transparent`}
                        placeholder="Choose a username"
                      />
                      {isCheckingUsername && (
                        <div className="absolute right-3 top-2.5">
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-400"></div>
                        </div>
                      )}
                    </div>
                    {errors.username && (
                      <p className="mt-1 text-sm text-red-400">{errors.username}</p>
                    )}
                    {!errors.username && formData.username && formData.username !== user?.username && (
                      <p className="mt-1 text-xs text-green-400">Username available!</p>
                    )}
                  </div>
                </div>
                
                <div className="md:col-span-2 flex flex-col items-center">
                  <div className="relative group">
                    <div className="relative w-32 h-32">
                      <img
                        src={formData.profilePicture || defaultProfile}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover border-4 border-blue-400"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = defaultProfile;
                        }}
                      />
                      {/* Always show the upload button if no picture is set or if in edit mode */}
                      {(!formData.profilePicture || isEditing) && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <label className={`relative cursor-pointer p-2 bg-blue-500 rounded-full ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'} transition-colors`}>
                            {isSubmitting ? (
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <>
                                <FiCamera className="text-white text-xl" />
                                <input
                                  type="file"
                                  name="profilePicture"
                                  accept="image/*"
                                  onChange={handleFileChange}
                                  ref={fileInputRef}
                                  className="hidden"
                                  disabled={isSubmitting}
                                />
                              </>
                            )}
                          </label>
                        </div>
                      )}
                    </div>
                    {!formData.profilePicture && isEditing && (
                      <p className="text-center text-sm text-yellow-300 mt-2">
                        Add a profile picture
                      </p>
                    )}
                  </div>
                </div>
                {/* end profile picture upload block */}

                {/* ...rest of the form fields... */}

                <div className="mb-4">
                  <label className="block text-gray-300 text-sm font-bold mb-1" htmlFor="fullName">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="fullName"
                      type="text"
                      name="fullName"
                      value={formData.fullName || ''}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <p className="text-white text-lg">{formData.fullName || 'Not provided'}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-gray-300 text-sm font-bold mb-1" htmlFor="phoneNumber">
                    Phone Number
                  </label>
                  <p className="text-white text-lg">{formData.phoneNumber || 'Not provided'}</p>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-300 text-sm font-bold mb-1" htmlFor="email">
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email || ''}
                      onChange={handleChange}
                      placeholder="Enter your email"
                    />
                  ) : (
                    <p className="text-white text-lg">{formData.email || 'Not provided'}</p>
                  )}
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
                      value={formData.dateOfBirth ? formData.dateOfBirth.split('T')[0] : ''}
                      onChange={handleChange}
                      max={new Date().toISOString().split('T')[0]}
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
                      onChange={(selected) => {
                        console.log('Country selected:', selected);
                        setFormData(prev => ({
                          ...prev,
                          country: selected ? selected.value : ''
                        }));
                      }}
                      className="react-select-container"
                      classNamePrefix="react-select"
                      isClearable
                      placeholder="Select a country..."
                      menuPortalTarget={document.body}
                      styles={{
                        control: (base) => ({
                          ...base,
                          backgroundColor: 'white',
                          borderColor: '#d1d5db',
                          minHeight: '42px',
                          color: '#1f2937',
                          '&:hover': {
                            borderColor: '#9ca3af'
                          }
                        }),
                        singleValue: (base) => ({
                          ...base,
                          color: '#1f2937'
                        }),
                        input: (base) => ({
                          ...base,
                          color: '#1f2937'
                        }),
                        menu: (base) => ({
                          ...base,
                          zIndex: 9999,
                          backgroundColor: 'white'
                        }),
                        menuPortal: (base) => ({
                          ...base,
                          zIndex: 9999
                        }),
                        option: (base, { isFocused, isSelected }) => ({
                          ...base,
                          backgroundColor: isSelected
                            ? '#3b82f6'
                            : isFocused
                            ? '#e5e7eb'
                            : 'white',
                          color: isSelected ? 'white' : '#1f2937',
                          '&:active': {
                            backgroundColor: '#d1d5db'
                          }
                        })
                      }}
                    />
                      ) : (
                        <p className="text-white text-lg">
                          {formData.country ? (countryOptions.find(c => c.value === formData.country)?.label || formData.country) : 'Not provided'}
                        </p>
                      )}
                    </div>

                    <div className="mb-4 md:col-span-2">
                      <label className="block text-gray-300 text-sm font-bold mb-1" htmlFor="bio">Bio</label>
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
                      className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </>
                      ) : 'Save Changes'}
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
  </div>
);
};

export default Account;
