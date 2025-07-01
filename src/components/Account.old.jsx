import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiCamera, 
  FiCalendar, FiGlobe, FiEdit2, FiSave, FiX 
} from 'react-icons/fi';
import { FaTrophy, FaGamepad, FaRupeeSign } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/api';
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

// Custom styles for react-select
const customSelectStyles = {
  control: (base) => ({
    ...base,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    '&:hover': {
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
  }),
  singleValue: (base) => ({
    ...base,
    color: 'white',
  }),
  input: (base) => ({
    ...base,
    color: 'white',
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: '#1e293b',
    zIndex: 9999,
  }),
  menuPortal: (base) => ({
    ...base,
    zIndex: 9999,
  }),
  option: (base, { isFocused, isSelected }) => ({
    ...base,
    backgroundColor: isSelected
      ? '#3b82f6'
      : isFocused
      ? 'rgba(255, 255, 255, 0.1)'
      : 'transparent',
    color: 'white',
    '&:active': {
      backgroundColor: '#3b82f6',
    },
  }),
};

const Account = () => {
  const { user, updateUser, isAuthenticated, checkAuthState } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
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
  
  // UI state
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [countryOptions, setCountryOptions] = useState([]);
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

  // Initialize form data when user changes
  useEffect(() => {
    if (user) {
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
      
      setFormData(userData);
      setOriginalData(userData);
      setIsLoading(false);
    }
  }, [user]);
  
  // Check if username is available
  const checkUsernameAvailability = async (username) => {
    if (!username || (user && username === user.username)) return { available: true };
    
    try {
      setIsCheckingUsername(true);
      const response = await authService.checkUsername(username);
      return { available: response.available };
    } catch (error) {
      console.error('Error checking username:', error);
      return { available: false, error: 'Error checking username availability' };
    } finally {
      setIsCheckingUsername(false);
    }
  };

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
    
    if (name === 'profilePicture' && files && files[0]) {
      const file = files[0];
      
      try {
        const result = await handleFileUpload(file);
        if (!result) return;
        
        // Update form data with both the file and preview URL
        setFormData(prev => ({
          ...prev,
          profilePicture: result.preview,  // Set preview URL for display
          profilePictureFile: result.file  // Store the actual file for upload
        }));
      } catch (error) {
        console.error('Error handling file upload:', error);
        toast.error('Failed to process the selected image');
      }
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
    
    // Clear previous errors
    setErrors({});
    
    // Client-side validation
    const validationErrors = {};
    
    // Username validation
    if (formData.username !== user?.username) {
      if (!formData.username) {
        validationErrors.username = 'Username is required';
      } else if (!/^[a-z0-9._-]+$/.test(formData.username)) {
        validationErrors.username = 'Username can only contain lowercase letters, numbers, dots, underscores, and hyphens';
      } else if (formData.username.length < 3 || formData.username.length > 30) {
        validationErrors.username = 'Username must be between 3 and 30 characters';
      } else {
        // Only check username availability if it's a new username
        try {
          setIsCheckingUsername(true);
          const { available, error } = await checkUsernameAvailability(formData.username);
          if (error) {
            validationErrors.username = error;
          } else if (!available) {
            validationErrors.username = 'Username is already taken';
          }
        } catch (err) {
          console.error('Error checking username:', err);
          validationErrors.username = 'Error checking username availability';
        } finally {
          setIsCheckingUsername(false);
        }
      }
    }
    
    // Required fields validation
    if (!formData.fullName?.trim()) {
      validationErrors.fullName = 'Full name is required';
    } else if (formData.fullName.length < 2 || formData.fullName.length > 50) {
      validationErrors.fullName = 'Full name must be between 2 and 50 characters';
    }
    
    if (!formData.email) {
      validationErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      validationErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.phoneNumber) {
      validationErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      validationErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
    }
    
    // Password validation (only if changing password)
    if (formData.password) {
      if (formData.password.length < 6) {
        validationErrors.password = 'Password must be at least 6 characters';
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
        validationErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
      } else if (formData.password !== formData.confirmPassword) {
        validationErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    // If there are validation errors, show them and stop submission
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      
      // Scroll to the first error
      const firstErrorField = Object.keys(validationErrors)[0];
      const errorElement = document.getElementById(firstErrorField);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create FormData for the request
      const formDataToSend = new FormData();
      
      // Add profile picture file if it exists
      if (formData.profilePictureFile) {
        formDataToSend.append('profilePicture', formData.profilePictureFile);
      } else if (formData.profilePicture && !formData.profilePicture.startsWith('blob:')) {
        // If it's not a blob URL, it's a regular URL that should be sent as a string
        formDataToSend.append('profilePicture', formData.profilePicture);
      }
      
      // Add other form fields
      const formFields = [
        'username', 'fullName', 'email', 'phoneNumber', 
        'bio', 'dateOfBirth', 'gender', 'country'
      ];
      
      formFields.forEach(field => {
        if (formData[field] !== undefined && formData[field] !== '') {
          formDataToSend.append(field, formData[field]);
        }
      });
      
      // Only add password if it's being changed
      if (formData.password) {
        formDataToSend.append('password', formData.password);
      }
      
      // Log the form data being sent (without file content)
      const formDataObj = {};
      formDataToSend.forEach((value, key) => {
        formDataObj[key] = key === 'profilePicture' ? (value instanceof File ? `[File: ${value.name}, ${value.type}, ${value.size} bytes]` : value) : value;
      });
      console.log('Submitting form data:', formDataObj);
      
      // Update user profile using the API service
      const response = await authService.updateUserProfile(user._id, formDataToSend, true);
      
      if (response && response.success) {
        // Update local user data with the returned user object
        const updatedUser = response.user || response.data;
        if (updatedUser) {
          // Clean up object URL if it exists
          if (formData.profilePicture && formData.profilePicture.startsWith('blob:')) {
            URL.revokeObjectURL(formData.profilePicture);
          }
          
          // Update user context and local storage
          await updateUser(updatedUser);
          
          // Show success message
          toast.success(response.message || 'Profile updated successfully!', {
            position: 'top-center',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
          });
          
          // Exit edit mode
          setIsEditing(false);
          
          // Refresh user data
          await checkAuthState();
          
          // Update original data
          setOriginalData({
            ...formData,
            profilePicture: updatedUser.profilePicture || formData.profilePicture,
            password: '',
            confirmPassword: ''
          });
        } else {
          throw new Error('Failed to get updated user data from the server');
        }
      } else {
        const errorMessage = response?.message || 'Failed to update profile';
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      
      // Handle specific error cases
      let errorMessage = 'An error occurred while updating your profile';
      
      if (error.response) {
        // Server responded with an error status code
        const { status, data } = error.response;
        
        if (status === 400) {
          // Handle validation errors
          if (data.errors) {
            setErrors(data.errors);
            errorMessage = 'Please fix the errors in the form';
          } else if (data.message) {
            errorMessage = data.message;
          }
        } else if (status === 401) {
          errorMessage = 'Your session has expired. Please log in again.';
          // Redirect to login after a delay
          setTimeout(() => {
            navigate('/login', { state: { from: '/account' } });
          }, 2000);
        } else if (status === 413) {
          errorMessage = 'File size is too large. Maximum allowed size is 5MB.';
        } else if (status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        }
      } else if (error.request) {
        // Request was made but no response was received
        errorMessage = 'Unable to connect to the server. Please check your internet connection.';
      }
      
      toast.error(errorMessage, {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
    } finally {
      setIsSubmitting(false);
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
  
  if (!user) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }



  // Handle file upload with better validation and cleanup
  const handleFileUpload = useCallback((file) => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid image (JPEG, PNG, GIF, or WebP)');
      return null;
    }
    
    // Check file size (max 5MB to match backend)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error(`Image must be less than 5MB (current: ${(file.size / (1024 * 1024)).toFixed(2)}MB)`);
      return null;
    }
    
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      // Clean up previous object URL if it exists
      if (formData.profilePicture && formData.profilePicture.startsWith('blob:')) {
        URL.revokeObjectURL(formData.profilePicture);
      }
      
      reader.onload = (e) => {
        const result = e.target.result;
        // Create an object URL for preview
        const objectUrl = URL.createObjectURL(file);
        resolve({ preview: objectUrl, file });
      };
      
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
        toast.error('Failed to read image file');
        resolve(null);
      };
      
      reader.readAsArrayBuffer(file); // Read as ArrayBuffer for better error handling
    });
  }, [formData.profilePicture]);

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

  if (isLoading || !user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16 bg-blueGradient text-white relative overflow-hidden">
      <BackgroundBubbles />
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="pt-20 px-3 max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">My Profile</h1>
            {!isEditing && (
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
                      {isSubmitting && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-400"></div>
                        </div>
                      )}
                    </div>
                    {isEditing && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <label 
                          className={`cursor-pointer p-2 rounded-full transition-colors ${
                            isSubmitting 
                              ? 'bg-gray-500 cursor-not-allowed' 
                              : 'bg-blue-500 hover:bg-blue-600'
                          }`}
                          title="Change profile picture"
                        >
                          <FiCamera className="text-white text-xl" />
                          <input
                            type="file"
                            name="profilePicture"
                            accept="image/jpeg,image/png,image/gif,image/webp"
                            onChange={handleChange}
                            className="hidden"
                            ref={fileInputRef}
                            disabled={isSubmitting}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                  {isEditing && (
                    <div className="text-center mt-2">
                      <p className="text-sm text-gray-300">
                        {isSubmitting ? 'Uploading...' : 'Click on the image to change'}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Max size: 5MB • JPG, PNG, GIF, WebP
                      </p>
                    </div>
                  )}
                </div>

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
                  <div className="flex justify-end space-x-4 w-full pt-4">
                    <button
                      type="button"
                      onClick={toggleEdit}
                      disabled={isSubmitting}
                      className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                        isSubmitting
                          ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                          : 'border border-gray-300 text-gray-300 hover:bg-gray-700 hover:border-gray-400'
                      }`}
                      aria-label="Cancel editing profile"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center justify-center min-w-[120px] ${
                        isSubmitting
                          ? 'bg-blue-600 cursor-wait'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                      aria-label={isSubmitting ? 'Saving changes...' : 'Save changes'}
                      aria-busy={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <svg 
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
                            xmlns="http://www.w3.org/2000/svg" 
                            fill="none" 
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Saving...</span>
                        </>
                      ) : (
                        <span>Save Changes</span>
                      )}
                    </button>
                  </div>
                  
                  {isSubmitting && (
                    <p className="text-sm text-blue-400 flex items-center">
                      <svg className="animate-pulse h-3 w-3 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="12" r="10" />
                      </svg>
                      Please wait while we update your profile...
                    </p>
                  )}
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
