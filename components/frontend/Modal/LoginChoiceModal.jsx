"use client";
import Link from "next/link";
import { useEffect } from "react";

const LoginChoiceModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-opacity-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-4xl cursor-pointer"
        >
          &times;
        </button>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-center text-green-800 mb-6">
          Choose Login Option
        </h2>

        {/* Options */}
        <div className="flex gap-4">
          <Link
            href="/investor/login"
            className="flex items-center gap-3 bg-blue-50 border border-blue-200 hover:bg-blue-100 transition rounded-lg p-4 text-lg font-medium text-blue-900"
          >
            <span className="text-2xl">💼</span> Investor Login
          </Link>

          <Link
            href="/farmer/login"
            className="flex items-center gap-3 bg-green-50 border border-green-200 hover:bg-green-100 transition rounded-lg p-4 text-lg font-medium text-green-700"
          >
            <span className="text-2xl">🌱</span> Farmer Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginChoiceModal;
