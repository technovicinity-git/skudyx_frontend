"use client";

import Image from "next/image";

const FullscreenImageViewer = ({ image, onClose }) => {
  if (!image) return null;

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        className="absolute top-6 right-8 text-white text-4xl font-bold z-[70] hover:text-gray-300 cursor-pointer"
        onClick={onClose}
        aria-label="Close"
      >
        &times;
      </button>

      {/* Image container */}
      <div className="max-w-6xl max-h-[90vh] w-full px-6">
        <Image
          src={image || "/assets/images/default_image.jpg"}
          alt="Full View"
          width={1600}
          height={1200}
          className="w-full h-auto max-h-[90vh] object-contain mx-auto rounded-lg"
        />
      </div>
    </div>
  );
};

export default FullscreenImageViewer;
