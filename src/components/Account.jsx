import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiCamera, 
  FiCalendar, FiGlobe, FiEdit2, FiSave, FiX 
} from 'react-icons/fi';
import { FaTrophy, FaGamepad, FaRupeeSign } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import Header from './Header';
import Navbar from './Navbar';
import BackgroundBubbles from './BackgroundBubbles';
import '../App.css';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';

// Initialize countries
countries.registerLocale(enLocale);

const Account = () => {
  const { user, updateUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Form state
  const [formData, setFormData] = useState({
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
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
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
  
  // Initialize form with user data
  useEffect(() => {
    if (user) {
      const userData = {
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
    } else {
      // Redirect to login if no user is logged in
      navigate('/login', { state: { from: '/account' } });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'profilePicture' && files && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          profilePicture: reader.result
        }));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
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
    
    // Validate form
    const validationErrors = {};
    
    if (!formData.fullName.trim()) {
      validationErrors.fullName = 'Full name is required';
    }
    
    if (!formData.phoneNumber.trim()) {
      validationErrors.phoneNumber = 'Phone number is required';
    }
    
    // Only validate password if it's being changed
    if (formData.password) {
      if (formData.password.length < 6) {
        validationErrors.password = 'Password must be at least 6 characters';
      } else if (formData.password !== formData.confirmPassword) {
        validationErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare the data to send
      const userData = { ...formData };
      
      // Don't send password if it's not being changed
      if (!userData.password) {
        delete userData.password;
        delete userData.confirmPassword;
      }
      
      // Update user profile
      await updateUser(userData);
      
      // Exit edit mode and show success message
      setIsEditing(false);
      toast.success('Profile updated successfully!');
      
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile. Please try again.');
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



  // Handle file upload
  const handleFileUpload = (file) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file (JPEG, PNG, etc.)');
      return null;
    }
    
    // Check file size (max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      toast.error(`Image size should be less than ${maxSize / (1024 * 1024)}MB`);
      return null;
    }
    
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => {
        toast.error('Error reading file');
        resolve(null);
      };
      reader.readAsDataURL(file);
    });
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
