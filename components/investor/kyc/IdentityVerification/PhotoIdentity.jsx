"use client";

import Button from "@/components/common/Button";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useGetKYCById, useVerifyIdentity } from "@/hook/kyc";
import { useToast } from "@/lib/Provider/toastProvider";
import { useGetMyProfile } from "@/hook/user";
import { useRouter } from "next/navigation";

const PhotoIdentity = ({ setCurrentStep }) => {
  const { showToast } = useToast();
  const router = useRouter();
  const [frontImage, setFrontImage] = useState({ file: null, preview: "" });
  const [backImage, setBackImage] = useState({ file: null, preview: "" });
  const [error, setError] = useState("");

  const frontInputRef = useRef(null);

  const { profile } = useGetMyProfile();
  const { kycData } = useGetKYCById(profile?._id);

  const { verifyIdentity, isLoading, errorMessage } = useVerifyIdentity();

  const handleImageChange = (e, side) => {
    const file = e.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      const imageData = { file, preview };
      side === "front" ? setFrontImage(imageData) : setBackImage(imageData);
    }
  };

  useEffect(() => {
    return () => {
      frontImage.preview && URL.revokeObjectURL(frontImage.preview);
      backImage.preview && URL.revokeObjectURL(backImage.preview);
    };
  }, [frontImage, backImage]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!frontImage.file) {
      setError("Please fill all fields and upload images.");
      return;
    }

    const kycData = {
      frontImage: frontImage.file,
    };
    verifyIdentity(kycData, {
      onSuccess: () => {
        showToast("Your request submitted successfully", "success", "Success");
        if (profile?.address_created) {
          router.push("/investor");
        } else setCurrentStep(3);
      },
    });
  };

  return (
    <div className="w-full">
      {kycData?.frontImage_verified === "approved" && (
        <div className="flex p-4 border border-green-500 justify-between my-2 bg-green-100">
          <div className="p-3 text-xl text-green-800">
            Photo already verified
          </div>
          <Button variant="solid" onClick={() => setCurrentStep(3)}>
            Next
          </Button>
        </div>
      )}

      {kycData?.frontImage_verified === "pending" &&
        kycData?.frontImage_upload && (
          <div className="flex p-3 border border-yellow-500 justify-between my-2 bg-yellow-100">
            <div className="p-3 text-xl text-yellow-800">
              Your verification is pending
            </div>
          </div>
        )}
      {kycData?.frontImage_verified === "rejected" && (
        <div className="flex p-3 border border-red-500 justify-between my-2 bg-red-100">
          <div className="p-3 text-xl text-red-800">{kycData?.photo_note}</div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Image
          src="/assets/icons/id-verify.png"
          alt="img"
          width={48}
          height={48}
          className="size-12 rounded-full mb-6"
        />
        <h2 className="text-[#101828] text-2xl font-semibold mb-2">
          Verify Photo
        </h2>
        <p className="text-[#57585B] text-xs mb-8">
          To keep your account safe and meet regulatory requirements, we need to
          verify your Photo. Choose your image from your device.
        </p>

        {/* Front Side */}
        <div className="mt-6">
          <p className="text-black text-lg font-medium mb-1.5">Photo</p>
          <label className="hover:bg-gray-50 w-full h-[146px] border border-[#EAECF0] rounded-md flex flex-col items-center justify-center cursor-pointer transition">
            <input
              ref={frontInputRef}
              id="front-input"
              type="file"
              accept="image/png, image/jpeg"
              className="hidden"
              onChange={(e) => handleImageChange(e, "front")}
            />
            {frontImage.preview ? (
              <div className="relative w-full overflow-hidden rounded-md flex justify-center">
                <img
                  src={frontImage.preview}
                  alt="Front ID Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => frontInputRef.current?.click()}
                  className="absolute bottom-1/2 right-1/2 translate-1/2 bg-white text-sm p-2.5 border border-[#EAECF0] rounded-lg cursor-pointer"
                >
                  <Image
                    src="/assets/icons/upload-cloud.png"
                    alt="icon"
                    width={20}
                    height={20}
                    className="size-5"
                  />
                </button>
              </div>
            ) : (
              <>
                <div className="p-2.5 border border-[#EAECF0] rounded-lg mb-3">
                  <Image
                    src="/assets/icons/upload-cloud.png"
                    alt="icon"
                    width={20}
                    height={20}
                    className="size-5"
                  />
                </div>
                <p className="text-sm font-medium">Click to upload image</p>
                <p className="text-xs text-[#475467] mt-1">(JPG or PNG)</p>
              </>
            )}
          </label>
        </div>

        {errorMessage && (
          <p className="text-red-500 p-2 mt-2 bg-red-100 border border-red-400">
            {errorMessage}
          </p>
        )}

        {error && (
          <p className="text-red-500 p-2 mt-2 bg-red-100 border border-red-400">
            {error}
          </p>
        )}

        {/* Next Button */}
        <Button
          variant="solid"
          disabled={!frontImage.file || isLoading}
          type="submit"
          className="w-full mt-6"
        >
          {isLoading ? "Submitting..." : "Submit"}
        </Button>
        {/* <div className="flex py-4 justify-between my-2">
          <div className="p-3 text-xl text-green-800">
            Already submitted request?
          </div>
          <Button variant="outline" onClick={() => setCurrentStep(3)}>
            Next
          </Button>
        </div> */}
      </form>
    </div>
  );
};

export default PhotoIdentity;
