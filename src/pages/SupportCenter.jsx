import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp, FiSend, FiUpload, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import BackgroundBubbles from '../components/BackgroundBubbles';



const SupportCenter = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('faq');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    issueType: 'Bug',
    file: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'bot', text: 'Hello! I\'m Nick, your support assistant. How can I help you today?', time: 'Just now' }
  ]);

  const faqs = [
    {
      question: 'How to withdraw coins?',
      answer: 'You can withdraw your coins by going to the Wallet section and selecting "Withdraw". Follow the on-screen instructions to complete the process.'
    },
    {
      question: 'How does matchmaking work?',
      answer: 'Our matchmaking system pairs you with players of similar skill level based on your performance in previous matches. The system considers various factors to ensure fair and competitive gameplay.'
    },
    {
      question: 'How can I verify my account?',
      answer: 'To verify your account, go to your Profile, select KYC Status, and follow the verification process by submitting the required documents.'
    },
    {
      question: 'What if the app crashes?',
      answer: 'If the app crashes, try restarting it first. If the issue persists, make sure you have the latest version installed. You can also clear the app cache or reinstall the app. If the problem continues, please contact our support team.'
    }
  ];

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        file: e.target.files[0]
      }));
    }
  };

  const removeFile = () => {
    setFormData(prev => ({
      ...prev,
      file: null
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setIsSubmitting(false);
      setSubmitSuccess(true);
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        issueType: 'Bug',
        file: null
      });

      // Hide success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    }, 1500);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const newMessage = {
      id: chatMessages.length + 1,
      sender: 'user',
      text: chatMessage,
      time: 'Just now'
    };

    setChatMessages([...chatMessages, newMessage]);
    setChatMessage('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: chatMessages.length + 2,
        sender: 'bot',
        text: 'Thank you for your message. Our support team will get back to you shortly with a response.',
        time: 'Just now'
      };
      setChatMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  return (

    <div
      className="min-h-screen p-4 sm:p-6 lg:p-8"
      style={{
        background: 'linear-gradient(to bottom, #0A2472 0%, #0D47A1 45%, #1565C0 100%)'
      }}

    ><BackgroundBubbles />



      <div className="max-w-4xl mx-auto px-4 pt-4 text-left">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-[#1b1f61] font-medium"
        >
          <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>


      <Navbar title="Support Center" />

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-amber-400 mb-2">Support Center</h1>
          <p className="text-blue-200">Need help? We're here for you.</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab('faq')}
            className={`py-3 px-6 font-medium text-sm ${activeTab === 'faq' ? 'text-blue-300 border-b-2 border-blue-300' : 'text-blue-300 hover:text-blue-600'}`}
          >
            FAQs
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`py-3 px-6 font-medium text-sm ${activeTab === 'contact' ? 'text-blue-300 border-b-2 border-blue-300' : 'text-blue-300 hover:text-blue-600'}`}
          >
            Contact Support
          </button>
        </div>

        {/* FAQ Section */}
        {activeTab === 'faq' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white mb-4">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <button
                    className="w-full px-5 py-4 text-left flex justify-between items-center focus:outline-none"
                    onClick={() => toggleFaq(index)}
                  >
                    <span className="font-medium text-gray-800">{faq.question}</span>
                    {expandedFaq === index ? (
                      <FiChevronUp className="text-gray-500" />
                    ) : (
                      <FiChevronDown className="text-gray-500" />
                    )}
                  </button>
                  {expandedFaq === index && (
                    <div className="px-5 pb-4 pt-0 text-gray-600 bg-gray-50">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>


          </div>
        )}

        {/* Contact Form Section */}
        {activeTab === 'contact' && (
          <div className="max-w-2xl mx-auto">
            {submitSuccess && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-r">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">
                      Your support request has been submitted successfully. We'll get back to you soon!
                    </p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-white mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="issueType" className="block text-sm font-medium text-white mb-1">
                  Issue Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="issueType"
                  name="issueType"
                  value={formData.issueType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  required
                >
                  <option value="Bug">Bug</option>
                  <option value="Payment Issue">Payment Issue</option>
                  <option value="Account Issue">Account Issue</option>
                  <option value="Other">Other</option>
                </select>

                {/* Show input if "Other" is selected */}
                {formData.issueType === 'Other' && (
                  <input
                    type="text"
                    name="customIssue"
                    value={formData.customIssue || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, customIssue: e.target.value }))}
                    placeholder="Please describe your issue"
                    className="mt-3 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                )}
              </div>


              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-white mb-1">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-white mb-1">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Attachment (Optional)
                </label>
                <div className="mt-1 flex items-center">
                  <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <span>Choose File</span>
                    <input
                      type="file"
                      className="sr-only"
                      onChange={handleFileChange}
                      accept="image/*,.pdf,.doc,.docx"
                    />
                  </label>
                  <span className="block text-sm font-medium text-white mb-1">
                    {formData.file ? formData.file.name : 'No file chosen'}
                  </span>
                  {formData.file && (
                    <button
                      type="button"
                      onClick={removeFile}
                      className="block text-sm font-medium text-white mb-1"
                    >
                      <FiX className="h-5 w-5" />
                    </button>
                  )}
                </div>
                <p className="block text-sm font-medium text-white/70 mb-1"
                >
                  Upload a screenshot or document (max 5MB)
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>

            <div className="mt-10 border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <svg className="h-5 w-5 text-gray-400 mr-3 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <div>
                    <p className="text-sm text-white">Email us at</p>
                    <a href="mailto:support@ful2win.com" className="text-sm font-medium text-white/80 hover:text-white">
                      support@ful2win.com
                    </a>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chat Modal */}
      {showChat && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div
              className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowChat(false)}
            ></div>
            <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
              <div className="w-screen max-w-md">
                <div className="h-full flex flex-col bg-white shadow-xl">
                  <div className="flex-1 overflow-y-auto">
                    <div className="bg-blue-600 px-4 py-5 sm:px-6">
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg font-medium text-white">Chat with Nick</h2>
                        <button
                          type="button"
                          className="bg-blue-600 rounded-md text-blue-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                          onClick={() => setShowChat(false)}
                        >
                          <span className="sr-only">Close panel</span>
                          <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="flex-1 p-4 overflow-y-auto">
                      <div className="space-y-4">
                        {chatMessages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.sender === 'user'
                                ? 'bg-blue-600 text-white rounded-br-none'
                                : 'bg-gray-100 text-gray-800 rounded-bl-none'
                                }`}
                            >
                              <p className="text-sm">{msg.text}</p>
                              <p className="text-xs opacity-70 mt-1 text-right">{msg.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 p-4">
                    <form onSubmit={handleSendMessage} className="flex items-center">
                      <input
                        type="text"
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 border border-gray-300 rounded-l-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="submit"
                        className="bg-blue-600 text-white p-2 rounded-r-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        <FiSend className="h-5 w-5" />
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      )}

      {/* Footer */}
      <footer className="bg-transparent border-t border-gray-600 mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">

            {/* Left: Links */}
            <div className="flex space-x-6 md:space-x-8">
              <a
                href="#"
                className="text-white hover:text-blue-300 text-sm font-medium focus:outline-none focus:ring-0 active:bg-transparent"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab('contact');
                  window.scrollTo(0, 0);
                }}
              >
                Contact Us
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white text-sm font-medium focus:outline-none focus:ring-0 active:bg-transparent"
                onClick={(e) => {
                  e.preventDefault();
                  setShowAboutModal(true);
                }}
              >
                About Company
              </a>
              {showAboutModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                  <div className="bg-white rounded-2xl p-6 w-[90%] max-w-sm text-center shadow-lg">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">About Our Company</h2>
                    <p className="text-gray-600 mb-6">
                      We are dedicated to providing the best gaming experience! Your satisfaction is our priority.
                    </p>
                    <button
                      onClick={() => setShowAboutModal(false)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}


            </div>

            {/* Right: Copyright */}
            <div className="mt-4 md:mt-0">
              <p className="text-white text-xs md:text-sm">
                © {new Date().getFullYear()} Your Game Name. All rights reserved.
              </p>
            </div>

          </div>
        </div>
      </footer>




    </div>
  );
};


export default SupportCenter;
