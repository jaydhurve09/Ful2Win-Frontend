import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import Select from "react-select";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import BackgroundBubbles from "../components/BackgroundBubbles";
import "../App.css";

countries.registerLocale(enLocale);

const Account = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [avatar, setAvatar] = useState("https://i.pravatar.cc/150?img=12");
  const [confirmPassword, setConfirmPassword] = useState("");
  const fileInputRef = useRef(null);
  const location = useLocation();

  const initialFormData = {
    fullName: "Rohan Sharma",
    username: "rohan.sharma23",
    email: "rohan@example.com",
    phone: "7775557770",
    dob: "2001-05-18",
    gender: "Male",
    country: "India",
    password: "password123",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [countryOptions, setCountryOptions] = useState([]);

  useEffect(() => {
    const countryList = Object.entries(countries.getNames("en", { select: "official" })).map(
      ([code, name]) => ({ code, name })
    );
    setCountryOptions(countryList);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let error = "";
    if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      error = "Invalid email format";
    }
    if (name === "username" && !/^[a-zA-Z0-9._]+$/.test(value)) {
      error = "Only letters, numbers, dot and underscore allowed";
    }
    if (name === "password" && value.length < 6) {
      error = "Password must be at least 6 characters";
    }
    if (name === "confirmPassword" && value !== formData.password) {
      error = "Passwords do not match";
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleAvatarClick = () => {
    if (isEditing && fileInputRef.current) fileInputRef.current.click();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatar(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const toggleEdit = () => setIsEditing(true);

  const hasChanges = JSON.stringify(formData) !== JSON.stringify(initialFormData) || confirmPassword !== "";

  const handleSave = () => {
    if (!hasChanges || Object.values(errors).some((err) => err)) return;
    setIsEditing(false);
    setConfirmPassword("");
  };

  const fields = [
    { label: "Full Name", name: "fullName", editable: false },
    { label: "Username", name: "username", editable: true },
    { label: "Email ID", name: "email", editable: true },
    { label: "Phone Number", name: "phone", editable: false },
    { label: "Date of Birth", name: "dob", type: "date", editable: true },
    { label: "Password", name: "password", type: "password", editable: true },
  ];

  return (
    <div className="relative min-h-screen pb-24 overflow-hidden text-white bg-gradient-to-b from-[#0b3fae] via-[#1555d1] to-[#2583ff]">
      <BackgroundBubbles />
      <div className="relative z-10">
        <Header />
        <div className="pt-20 px-4 max-w-4xl mx-auto">
          <div className="flex justify-center py-6">
            <div className="relative transition-transform hover:scale-105 duration-300">
              <img
                src={avatar}
                onClick={handleAvatarClick}
                className="w-24 h-24 rounded-full border-4 border-yellow-400 shadow-lg object-cover cursor-pointer"
                alt="avatar"
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                className="hidden"
                accept="image/*"
              />
            </div>
          </div>

          {!isEditing && (
            <div className="flex justify-center mb-4">
              <button
                onClick={toggleEdit}
                className="bg-yellow-400 text-blue-900 px-6 py-2 rounded-full shadow hover:bg-yellow-300 transition-transform duration-300 hover:scale-105"
              >
                Edit Info
              </button>
            </div>
          )}

          {fields.map(({ label, name, type = "text", editable }, idx) => (
            <div
              key={idx}
              className="bg-[#0A3B8A] text-white rounded-xl p-4 mb-4 shadow-xl transform transition duration-300 hover:scale-[1.015] hover:shadow-2xl border border-yellow-400"
            >
              <label className="text-sm font-medium text-yellow-300">{label}</label>
              {name === "password" && isEditing ? (
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className="w-full rounded px-4 py-2 mt-1 bg-white text-black border border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[10px] text-sm text-blue-800"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              ) : isEditing && editable ? (
                <>
                  <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className="w-full rounded px-4 py-2 mt-1 bg-white text-black border border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                  />
                  {errors[name] && <p className="text-red-300 text-sm mt-1">{errors[name]}</p>}
                </>
              ) : (
                <div className="mt-1 font-semibold text-yellow-100">
                  {name === "password" ? "••••••••" : formData[name]}
                </div>
              )}
            </div>
          ))}

          {isEditing && (
            <div className="bg-[#0A3B8A] text-white rounded-xl p-4 mb-4 shadow-xl border border-yellow-400">
              <label className="text-sm font-medium text-yellow-300">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  validateField("confirmPassword", e.target.value);
                }}
                className="w-full rounded px-4 py-2 mt-1 bg-white text-black border border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-300"
              />
              {errors.confirmPassword && <p className="text-red-300 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>
          )}

          <div className="bg-[#0A3B8A] text-white rounded-xl p-4 mb-4 shadow-xl border border-yellow-400">
            <label className="text-sm font-medium text-yellow-300">Gender</label>
            {isEditing ? (
              <div className="flex gap-6 mt-2">
                {["Male", "Female"].map((g) => (
                  <label key={g} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      checked={formData.gender === g}
                      onChange={handleChange}
                    />
                    <span>{g}</span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="mt-1 font-semibold text-yellow-100">{formData.gender}</div>
            )}
          </div>

          <div className="bg-[#0A3B8A] text-white rounded-xl p-4 mb-4 shadow-xl border border-yellow-400">
            <label className="text-sm font-medium text-yellow-300">Country</label>
            {isEditing ? (
              <Select
                options={countryOptions.map((c) => ({ value: c.name, label: c.name }))}
                value={{ label: formData.country, value: formData.country }}
                onChange={(e) => setFormData((prev) => ({ ...prev, country: e.value }))}
                placeholder="Select country..."
                className="mt-2 text-black"
              />
            ) : (
              <div className="mt-1 font-semibold text-yellow-100">{formData.country}</div>
            )}
          </div>

          {isEditing && (
            <div className="mb-20">
              <button
                onClick={handleSave}
                disabled={!hasChanges || Object.values(errors).some((err) => err)}
                className={`w-full py-3 rounded-full font-bold shadow-md transition-transform duration-300 hover:scale-105 ${
                  !hasChanges || Object.values(errors).some((err) => err)
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-yellow-400 text-blue-900 hover:bg-yellow-300"
                }`}
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
      <Navbar />
    </div>
  );
};

export default Account;
