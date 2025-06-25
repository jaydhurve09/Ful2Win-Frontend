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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [confirmPassword, setConfirmPassword] = useState("");
  const [originalData, setOriginalData] = useState(null);
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
        
        // Show loading state immediately
        setFormData(prev => ({ ...prev, isLoading: true }));
        
        // Try to get fresh data from the server first
        try {
          const userData = await authService.getCurrentUserProfile();
          console.log('Fetched fresh user data:', userData);
          updateFormData(userData);
        } catch (serverError) {
          console.warn('Failed to fetch fresh data, using cached data if available');
          // If server fetch fails, try to use cached data
          const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
          if (storedUser && storedUser._id) {
            console.log('Using cached user data:', storedUser);
            updateFormData(storedUser);
          } else {
            throw serverError; // Re-throw if no cached data available
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        toast.error('Failed to load profile data. Please refresh the page.');
      } finally {
        setIsLoading(false);
        setFormData(prev => ({ ...prev, isLoading: false }));
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
    let hasPasswordField = false;
    
    // Check if any password field is being modified
    if (formData.password || confirmPassword) {
      hasPasswordField = true;
      
      // Only validate password if it's being changed
      if (formData.password) {
        if (formData.password.length < 6) {
          newErrors.password = 'Password must be at least 6 characters';
        }
        
        if (formData.password !== confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        }
      } else {
        // If confirm password is entered but password is empty
        if (confirmPassword) {
          newErrors.password = 'Please enter a new password';
        }
      }
    }
    
    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Only update errors if there are actual errors to show
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    console.log('Save button clicked - handleSubmit called');
    e.preventDefault();
    
    if (isSubmitting) {
      console.log('Form submission already in progress');
      return;
    }
    
    console.log('Form submitted, validating...');
    
    // Only validate password fields if they are being changed
    const validationErrors = validateForm();
    console.log('Validation errors:', validationErrors);
    
    // If there are validation errors, don't proceed with submission
    if (Object.keys(validationErrors).length > 0) {
      console.log('Form validation failed');
      const errorMessages = Object.values(validationErrors).join('\n');
      toast.error(errorMessages || 'Please fix the form errors before submitting');
      return;
    }
    
    // If we get here, there are no validation errors
    console.log('No validation errors, proceeding with form submission');
    setIsSubmitting(true);
    
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
        if (value === undefined || value === null || value === '') return;
        
        // Handle file uploads
        if (key.endsWith('File') && value instanceof File) {
          // For file inputs, use the field name without 'File' suffix
          const fieldName = key.replace(/File$/, '');
          formDataToSend.append(fieldName, value);
        } 
        // Handle date fields - format them as ISO string
        else if (key === 'dateOfBirth' && value) {
          try {
            const date = new Date(value);
            if (!isNaN(date.getTime())) {
              formDataToSend.append(key, date.toISOString());
            }
          } catch (dateError) {
            console.error('Error formatting date:', dateError);
          }
        }
        // Handle regular form fields
        else if (typeof value !== 'object') {
          formDataToSend.append(key, value);
        }
      });
      
      // Log FormData entries for debugging
      console.log('FormData entries before sending:');
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`  ${key}:`, value);
      }
      
      console.log('Making API call to update profile...');
      console.log('User ID:', userId);
      console.log('Is FormData:', true);
      
      // Make the API call
      const response = await authService.updateUserProfile(userId, formDataToSend, true);
      
      // Update local state with the response
      if (response && response.user) {
        // If the backend returns the updated user, update our local state
        const updatedUser = response.user;
        updateFormData(updatedUser);
        setOriginalData(updatedUser);
        
        // Update localStorage with the latest user data
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        const newUserData = {
          ...storedUser,
          ...updatedUser
        };
        
        // Preserve profile picture if it wasn't updated
        if (!updatedUser.profilePicture && storedUser.profilePicture) {
          newUserData.profilePicture = storedUser.profilePicture;
        }
        
        localStorage.setItem('user', JSON.stringify(newUserData));
        
        // Show success message
        toast.success('Profile updated successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        });
        
        // Exit edit mode and reset submission state
        setIsEditing(false);
        console.log('Profile update successful');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error updating profile:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        stack: error.stack
      });
      
      // Show error message
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to update profile. Please try again.';
      
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      
      // Re-throw the error to be caught by error boundaries if needed
      throw error;
    } finally {
      // Always reset the submitting state, whether successful or not
      setIsSubmitting(false);
    }
  };

  const toggleEdit = (e) => {
    console.log('toggleEdit called, current isEditing:', isEditing);
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (isEditing) {
      console.log('Canceling edit, resetting form data');
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
  
  return (
    <div className="relative min-h-screen pb-24 overflow-hidden text-white bg-gradient-to-b from-[#0b3fae] via-[#1555d1] to-[#2583ff]">
      <BackgroundBubbles />
      <div className="relative z-10">
        <Header />

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
                      onChange={(selected) =>
                        handleChange({
                          target: {
                            name: 'country',
                            value: selected ? selected.value : ''
                          }
                        })
                      }
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
  );
};

export default Account;
