import { useRef, useState } from "react";
import Button from "@/components/common/Button";
import Image from "next/image";
import { useVerifyIdentity } from "@/hook/kyc";

const TakeSelfie = ({ setCurrentStep, kycData }) => {
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const { verifyIdentity, isLoading } = useVerifyIdentity({
    onSuccess: () => {
      setCurrentStep(4);
      setPreviewImage(null);
    },
    onError: (error) => {
      setError(error.message || "Failed to verify identity");
    },
  });

  const handleImageChange = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      setSelectedImage(files[0]);
    }

    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPreviewImage(event.target.result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setTimeout(() => {
      console.log(
        "Submitting image data:",
        previewImage ? "Image selected" : "No image"
      );
      const data = {
        docType: kycData.idType,
        docNumber: kycData.idNumber,
        frontImage: kycData.frontImage,
        backImage: kycData.backImage,
        selfie: selectedImage,
      };
      verifyIdentity(data);
    }, 1000);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-sm">
      <div className="text-center mb-6">
        <Image
          src="/assets/icons/selfie-icon.png"
          alt="Selfie icon"
          width={64}
          height={64}
          className="mx-auto size-16 rounded-full mb-4"
        />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Upload a Photo
        </h2>
        <p className="text-gray-600 text-sm">
          This helps us verify your identity and personalize your experience.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col items-center">
          {/* Preview area */}
          {previewImage ? (
            <div className="relative mb-4">
              <div className="w-48 h-48 rounded-full border-4 border-gray-200 overflow-hidden">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                aria-label="Remove image"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <div className="w-48 h-48 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center mb-4 bg-gray-50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
          )}

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="user"
            onChange={handleImageChange}
            className="hidden"
          />

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current.click()}
              className="w-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Upload Photo
            </Button>
          </div>

          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          variant="solid"
          disabled={!previewImage || isLoading}
          className="w-full mt-6"
          isLoading={isLoading}
        >
          {isLoading ? "Processing..." : "Next"}
        </Button>
      </form>
    </div>
  );
};

export default TakeSelfie;
