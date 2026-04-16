"use client";

import Button from "@/components/common/Button";
import Label from "@/components/common/Label";
import Select from "@/components/common/Select";
import { useGetKYCById, useVerifyIdentity } from "@/hook/kyc";
import { useGetMyProfile } from "@/hook/user";
import { useToast } from "@/lib/Provider/toastProvider";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const VerifyIdentity = ({ setCurrentStep }) => {
  const { showToast } = useToast();
  const [docType, setDocType] = useState("");
  const [frontImage, setFrontImage] = useState({ file: null, preview: "" });
  const [backImage, setBackImage] = useState({ file: null, preview: "" });
  const [error, setError] = useState("");

  const backInputRef = useRef(null);

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

    if (!docType || !backImage.file) {
      setError("Please fill all fields and upload images.");
      return;
    }

    const kycData = {
      docType,
      docImage: backImage.file,
    };
    verifyIdentity(kycData, {
      onSuccess: () => {
        showToast("Your request submitted successfully", "success", "Success");
        setCurrentStep(2);
      },
    });
  };

  return (
    <div className="w-full">
      {kycData?.docImage_verified === "approved" && (
        <div className="flex p-3 border border-green-500 justify-between my-2 bg-green-100">
          <div className="p-3 text-xl text-green-800">
            Document already verified
          </div>
          <Button variant="solid" onClick={() => setCurrentStep(2)}>
            Next
          </Button>
        </div>
      )}

      {kycData?.docImage_verified === "pending" && kycData?.docImage_upload && (
        <div className="flex p-3 border border-yellow-500 justify-between my-2 bg-yellow-100">
          <div className="p-3 text-xl text-yellow-800">
            Your verification is pending
          </div>
        </div>
      )}
      {kycData?.docImage_verified === "rejected" && (
        <div className="flex p-3 border border-red-500 justify-between my-2 bg-red-100">
          <div className="p-3 text-xl text-red-800">
            {kycData?.doc_note || "Your document was rejected."}
          </div>
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
          Verify Identity
        </h2>
        <p className="text-[#57585B] text-xs mb-8">
          To keep your account safe and meet regulatory requirements, we need to
          verify your ID. Choose a valid government-issued ID (e.g., passport,
          driver’s license, national ID).
        </p>

        {/* ID Type Select */}
        <div className="flex flex-col">
          <Label htmlFor="id-type">ID Type</Label>
          <Select
            id="id-type"
            name="id-type"
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
          >
            <option value="" disabled>
              Select ID
            </option>
            <option value="passport">Passport</option>
            <option value="driving_license">Driving License</option>
            <option value="national_id">National ID</option>
          </Select>
        </div>
        {/* Back Side */}
        <div className="mt-6">
          <p className="text-black text-lg font-medium mb-1.5">Document</p>
          <label className="hover:bg-gray-50 w-full h-[146px] border border-[#EAECF0] rounded-md flex flex-col items-center justify-center cursor-pointer transition">
            <input
              ref={backInputRef}
              id="back-input"
              type="file"
              accept="image/png, image/jpeg"
              className="hidden"
              onChange={(e) => handleImageChange(e, "back")}
            />
            {backImage.preview ? (
              <div className="relative w-full overflow-hidden rounded-md flex justify-center">
                <img
                  src={backImage.preview}
                  alt="Back ID Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => backInputRef.current?.click()}
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
          <p className="text-red-500 bg-red-100 border border-red-400 mt-2">
            {errorMessage}
          </p>
        )}
        {error && (
          <p className="text-red-500 bg-red-100 border border-red-400 mt-2">
            {error}
          </p>
        )}

        {/* Next Button */}
        <Button
          variant="solid"
          disabled={!docType || !backImage.file || isLoading}
          type="submit"
          className="w-full mt-6"
        >
          {isLoading ? "Submitting..." : "Submit"}
        </Button>
        {/* <div className="flex p-4 justify-between my-2">
          <div className="p-3 text-xl text-green-800">
            Already submitted request?
          </div>
          <Button variant="outline" onClick={() => setCurrentStep(2)}>
            Next
          </Button>
        </div> */}
      </form>
    </div>
  );
};

export default VerifyIdentity;
