"use client";

import "react-datepicker/dist/react-datepicker.css";
import { RxCross2 } from "react-icons/rx";

const NoteModal = ({ isOpen, onClose, note }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-10">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition cursor-pointer"
        >
          <RxCross2 size={22} />
        </button>

        {/* Modal Title */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Note</h2>

        {/* Note Content */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-gray-700 leading-relaxed">
          {note || "No note available."}
        </div>
      </div>
    </div>
  );
};

export default NoteModal;
