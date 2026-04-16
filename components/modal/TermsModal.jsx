"use client";

import { useState } from "react";
import { X } from "lucide-react";
import RichTextEditor from "../common/RichTextEditor";
import SettingModalFooter from "./SettingModalFooter";

const TermsModal = ({ isOpen, onClose }) => {
  const [termsContent, setTermsContent] = useState("");

  if (!isOpen) return null;

  const handleSave = () => {
    console.log("Collected Data:", termsContent);
    // call API here
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      {/* Modal Container */}
      <div className="w-full min-h-[90vh] bg-gray-100 rounded-2xl shadow-xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between bg-white px-6 py-4 border-b border-gray-200 rounded-t-2xl">
          <h2 className="text-lg sm:text-xl font-semibold">Terms of Use</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="bg-white rounded-xl shadow-sm max-w-4xl mx-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Terms of Use</h3>
            </div>

            <div className="p-6 space-y-4">
              <RichTextEditor
                value={termsContent}
                onChange={(content) => setTermsContent(content)}
                placeholder="BB Agency is a strategic partner for fast-growing tech companies in need of a scalable website with modular CMS, a design system, and future-proof brand identity."
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <SettingModalFooter onCancel={onClose} onSave={handleSave} />
      </div>
    </div>
  );
};

export default TermsModal;
