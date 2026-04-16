'use client';
import React from 'react';
import { useIntersectionObserver } from '../language-context';

const ContactArea = () => {
  const { isVisible, elementRef } = useIntersectionObserver();
  return (
    <section ref={elementRef} className="w-full py-16 bg-white">
      <div className="container">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Left: Info */}
          <div
            className={`md:w-1/2 flex flex-col justify-center transition-all duration-1000 ease-out delay-0 ${
              isVisible
                ? 'translate-x-0 opacity-100'
                : 'translate-x-[-100px] opacity-0'
            }`}
          >
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              We look forward to hearing from you.
            </h2>
            <p className="text-lg text-gray-500 mb-10 max-w-xl">
              {`We're committed to clear communication, fast responses, and
              personalized support every step of the way.`}
            </p>
            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-start gap-4">
                <span className="bg-green-50 p-3 rounded-full">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5H4.5a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-.879 1.797l-7.5 5.625a2.25 2.25 0 01-2.742 0l-7.5-5.625A2.25 2.25 0 012.25 6.993V6.75"
                    />
                  </svg>
                </span>
                <div>
                  <div className="font-semibold text-gray-900">Email</div>
                  <div className="text-gray-500">hi@untitledui.com</div>
                </div>
              </div>
              {/* Office */}
              <div className="flex items-start gap-4">
                <span className="bg-green-50 p-3 rounded-full">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.362 17.748a9.038 9.038 0 01-3.362.627c-4.97 0-9-3.582-9-8s4.03-8 9-8 9 3.582 9 8c0 2.042-.81 3.92-2.138 5.377M15 21v-2a3 3 0 00-6 0v2"
                    />
                  </svg>
                </span>
                <div>
                  <div className="font-semibold text-gray-900">Office</div>
                  <div className="text-gray-500">
                    100 Smith Street
                    <br />
                    Collingwood VIC 3066 AU
                  </div>
                </div>
              </div>
              {/* Phone */}
              <div className="flex items-start gap-4">
                <span className="bg-green-50 p-3 rounded-full">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 6.75c0-1.243 1.007-2.25 2.25-2.25h2.086c.414 0 .81.168 1.102.467l2.263 2.32a2.25 2.25 0 01.21 2.833l-1.1 1.65a.75.75 0 00.073.927l4.242 4.242a.75.75 0 00.927.073l1.65-1.1a2.25 2.25 0 012.833.21l2.32 2.263c.299.292.467.688.467 1.102v2.086a2.25 2.25 0 01-2.25 2.25c-9.113 0-16.5-7.387-16.5-16.5z"
                    />
                  </svg>
                </span>
                <div>
                  <div className="font-semibold text-gray-900">Phone</div>
                  <div className="text-gray-500">+1 (555) 000-0000</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div
            className={`md:w-1/2 bg-white rounded-xl shadow p-8 md:p-4 lg:p-8 flex flex-col justify-center transition-all duration-1000 ease-out delay-200 ${
              isVisible
                ? 'translate-x-0 opacity-100'
                : 'translate-x-[-100px] opacity-0'
            }`}
          >
            <form className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-gray-900 font-medium mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter First Name"
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-gray-900 font-medium mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Last Name"
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-gray-900 font-medium mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Enter Email Address"
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-gray-900 font-medium mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter Phone Number"
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-900 font-medium mb-1">
                  Message
                </label>
                <textarea
                  rows={6}
                  placeholder=""
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600 resize-none"
                />
              </div>
              <button
                type="button"
                className="w-full bg-primary-1 hover:bg-primary-0 text-white font-semibold rounded-lg py-3 text-lg transition"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactArea;
