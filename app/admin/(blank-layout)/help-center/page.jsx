"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What is this app used for?",
    answer:
      "This app helps you manage your tasks, access features easily, and enjoy a smooth, user-friendly experience—all in one place. When you create an account, we collect information such as your name, email address, and phone number to provide you with our services.",
  },
  {
    question: "How do I create an account?",
    answer:
      "Click on the Sign Up button and fill in the required details. You will receive a verification email to activate your account.",
  },
  {
    question: "Is the app free to use?",
    answer:
      "Yes, basic features are free. Premium features may require a subscription.",
  },
  {
    question: "I forgot my password. What should I do?",
    answer:
      "Click on 'Forgot Password' on the login screen and follow the instructions to reset it.",
  },
];

export default function HelpCenterBody() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="flex justify-center px-6 py-8   overflow-y-auto">
      {/* Center Card */}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-gray-200">
        {/* Title Section */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Help Center</h3>
          <p className="text-sm text-gray-500 mt-1">
            Find answers to common questions and learn more about how the
            application works.
          </p>
        </div>

        {/* FAQ Section */}
        <div className="p-4 space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="border border-gray-200 rounded-xl overflow-hidden"
              >
                {/* Question */}
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-left text-sm font-medium transition
                    ${isOpen ? "bg-blue-50" : "bg-white hover:bg-blue-50"}
                  `}
                >
                  {faq.question}
                  <ChevronDown
                    size={18}
                    className={`transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Answer */}
                {isOpen && (
                  <div className="px-4 py-3 text-sm text-gray-600 leading-relaxed bg-white border-t border-gray-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
