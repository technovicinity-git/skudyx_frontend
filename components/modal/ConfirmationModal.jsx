"use client";

import React from "react";
import { X } from "lucide-react";
import Button from "../common/Button";
import { AlertIcon } from "@/public/assets/icons/icons";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  onConfirm2,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  confirmText2 = null,
  cancelText = "Cancel",
  loading = false,
  destructive = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      {/* Modal Container */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}

        <div className="px-5 py-6 flex flex-col items-center gap-4">
          <div>{AlertIcon}</div>
          <div className="font-semibold text-[#181D27]">Attenttion</div>
          <div className="text-sm text-gray-600 leading-relaxed">{message}</div>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 px-5 py-3 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <Button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 text-sm rounded-lg text-white transition
              ${
                destructive
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-[#061640] hover:bg-[#0A1F5C]"
              }
              disabled:opacity-50
            `}
          >
            {loading ? "Processing..." : confirmText}
          </Button>
          {confirmText2 && (
            <Button
              onClick={onConfirm2}
              disabled={loading}
              className={`px-4 py-2 text-sm rounded-lg text-white transition
              ${
                destructive
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-[#061640] hover:bg-[#0A1F5C]"
              }
              disabled:opacity-50
            `}
            >
              {loading ? "Processing..." : confirmText2}
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            {cancelText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
