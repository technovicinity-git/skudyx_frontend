"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

const GalleryPopup = ({ images = [], isOpen, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsAnimating(true);
      document.body.style.overflow = "hidden";
    } else {
      setIsAnimating(true);
      setTimeout(() => {
        setIsVisible(false);
        setIsAnimating(false);
      }, 500); // Match transition duration
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isVisible) {
      document.body.style.overflow = "";
    }
  }, [isVisible]);

  // Helper to chunk images for modal layout
  const getModalImageRows = (images) => {
    const rows = [];
    let i = 0;
    while (i < images.length) {
      if (i % 3 === 0) {
        // Full width image
        rows.push([images[i]]);
        i++;
      } else {
        // Two half-width images
        rows.push([images[i], images[i + 1]].filter(Boolean));
        i += 2;
      }
    }
    return rows;
  };

  if (!isVisible && !isAnimating) return null;

  return (
    <div
      className={`fixed inset-0 z-50 bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-500 ease-in-out ${
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      <div
        className={`h-full w-full flex items-center justify-center p-4 transition-all duration-500 ease-in-out ${
          isOpen
            ? "scale-100 translate-y-0 opacity-100"
            : "scale-95 translate-y-8 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto relative">
          {/* Header with close button */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Gallery</h2>
            <button
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200"
              onClick={onClose}
              aria-label="Close gallery"
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* Images Grid */}
          <div className="p-6">
            <div className="flex flex-col gap-6">
              {getModalImageRows(images).map((row, rowIdx) => (
                <div
                  key={rowIdx}
                  className={`transition-all duration-500 ease-out ${
                    isOpen
                      ? "translate-y-0 opacity-100"
                      : "translate-y-4 opacity-0"
                  }`}
                  style={{ transitionDelay: `${rowIdx * 100}ms` }}
                >
                  <div className={row.length === 1 ? "w-full" : "flex gap-4"}>
                    {row.map((img, colIdx) => (
                      <div
                        key={colIdx}
                        className={
                          row.length === 1
                            ? "w-full h-[400px] rounded-lg overflow-hidden"
                            : "w-1/2 h-[200px] rounded-lg overflow-hidden"
                        }
                      >
                        <Image
                          src={img}
                          alt={`gallery-image-${colIdx}`}
                          width={row.length === 1 ? 1000 : 500}
                          height={row.length === 1 ? 400 : 200}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryPopup;
