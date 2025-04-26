import React, { useState } from 'react';

function ForgetPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically call your API to send a password reset email
    setIsSubmitted(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-[#FF8C00]">EasyEats</h1>
        {!isSubmitted ? (
          <p className="text-gray-600 mt-2">Reset your password to continue</p>
        ) : (
          <p className="text-gray-600 mt-2">Check your email for reset instructions</p>
        )}
      </div>

      {!isSubmitted ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 w-full max-w-md">
          <h2 className="text-xl font-medium text-gray-700 mb-6">Forgot Password</h2>
          <p className="text-gray-600 mb-6">
            Enter your email address and we'll send you instructions to reset your password.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="email" className="block text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  className="pl-10 w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent"
                  placeholder="hello@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#FF8C00] hover:bg-[#FF7800] text-white py-3 px-4 rounded-md flex items-center justify-center transition-colors duration-300"
            >
              Send Reset Link
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="/login" className="text-gray-600 hover:text-[#FF8C00] transition-colors duration-300">
              Back to Sign In
            </a>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 w-full max-w-md text-center">
          <div className="flex justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-medium text-gray-700 mb-4">Email Sent!</h2>
          <p className="text-gray-600 mb-6">
            We've sent password reset instructions to:<br />
            <span className="font-medium">{email}</span>
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="w-full bg-[#FF8C00] hover:bg-[#FF7800] text-white py-3 px-4 rounded-md transition-colors duration-300"
          >
            Resend Email
          </button>
          <div className="mt-6">
            <a href="/login" className="text-gray-600 hover:text-[#FF8C00] transition-colors duration-300">
              Back to Sign In
            </a>
          </div>
        </div>
      )}

      <div className="mt-8 text-center">
        <p className="text-gray-600">
          Don't have an account? <a href="/signup" className="text-[#FF8C00] hover:underline">Sign up</a>
        </p>
        <p className="text-gray-600 mt-2">
          <a href="/admin-login" className="text-gray-600 hover:text-gray-800">
            Restaurant Owner? Sign in to admin
          </a>
        </p>
      </div>
    </div>
  );
}

export default ForgetPassword;