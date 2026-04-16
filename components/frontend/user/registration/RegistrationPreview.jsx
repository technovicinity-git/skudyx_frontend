"use client";

import Button from "@/components/common/Button";
import { useCreateFarmer } from "@/hook/farmer";
import { useToast } from "@/lib/Provider/toastProvider";
import useCreateFarmerStore from "@/store/useCreateFarmerStore";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaRegEdit } from "react-icons/fa";

const RegistrationPreview = ({ setCurrentStep }) => {
  const { showToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const { formData, resetForm } = useCreateFarmerStore();

  const { createFarmer, isLoading, errorMessage } = useCreateFarmer();

  const handleSubmit = () => {
    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key] ?? "");
    });

    if (formData?.identity_document) {
      data.append("identity_document", formData?.identity_document?.file);
    }
    if (formData?.trade_license) {
      data.append("trade_license", formData?.trade_license?.file);
    }
    createFarmer(data, {
      onSuccess: () => {
        showToast("Farmer registered successfully!", "success", "Success");
        resetForm();
        setShowModal(true);
      },
    });
  };

  return (
    <div className="w-full flex flex-col gap-10 mt-20">
      {/* Heading */}
      <div className="w-full mt-2 -mb-2 flex justify-between items-center">
        <h3 className="text-xl sm:text-2xl font-semibold text-[#101828]">
          Preview
        </h3>
        <div className="flex items-center gap-2 ">
          <Button variant="solid" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </div>

      {/* Personal Info */}
      <section className="text-[#222222] pb-8 border-b border-[#D0D5DD]">
        <div className="flex justify-between items-center mb-5">
          <h4 className="text-xl font-semibold">Personal Information</h4>
          <button
            className="font-semibold text-primary-0 flex items-center gap-[3px] cursor-pointer"
            onClick={() => setCurrentStep(1)}
          >
            <FaRegEdit className="text-xl" />
            <span>Edit</span>
          </button>
        </div>
        {errorMessage && (
          <p className="text-red-500 bg-red-100 p-2 border border-red-400 mb-4">
            {errorMessage}
          </p>
        )}
        <ul className="space-y-3">
          <li>
            <span className="font-semibold">First Name: </span>
            {formData.first_name || "-"}
          </li>
          <li>
            <span className="font-semibold">Last Name: </span>
            {formData.last_name || "-"}
          </li>
          <li>
            <span className="font-semibold">Email: </span>
            {formData.email || "-"}
          </li>
          <li>
            <span className="font-semibold">Phone Number: </span>
            {formData.phone_number || "-"}
          </li>
          <li>
            <span className="font-semibold">Address: </span>
            {formData?.address || "-"}
          </li>
        </ul>
      </section>

      {/* Additional Info */}
      <section className="text-[#222222] pb-8 mb-8 border-b border-[#D0D5DD]">
        <div className="flex justify-between items-center mb-5">
          <h4 className="text-xl font-semibold">Additional Details</h4>
          <button
            className="font-semibold text-primary-0 flex items-center gap-[3px] cursor-pointer"
            onClick={() => setCurrentStep(2)}
          >
            <FaRegEdit className="text-xl" />
            <span>Edit</span>
          </button>
        </div>
        <ul className="space-y-3">
          <li>
            <span className="font-semibold">Experience Level: </span>
            {formData.level_of_experience || "-"}
          </li>
          <li>
            <span className="font-semibold">Date of Birth: </span>
            {formData.birth_date
              ? new Date(formData.birth_date).toLocaleDateString()
              : "-"}
          </li>
          <li>
            <span className="font-semibold">Education Level: </span>
            {formData.level_of_education || "-"}
          </li>
          <li>
            <span className="font-semibold">Gender: </span>
            {formData.gender || "-"}
          </li>
          <li>
            <span className="font-semibold">Type: </span>
            {formData.type || "-"}
          </li>
          {formData?.business_name && (
            <li>
              <span className="font-semibold">Business Name: </span>
              {formData.business_name || "-"}
            </li>
          )}
          {formData?.business_reg_number && (
            <li>
              <span className="font-semibold">
                Business Registration Number:{" "}
              </span>
              {formData.business_reg_number || "-"}
            </li>
          )}

          <li>
            <span className="font-semibold">Images: </span>
            <div className="flex flex-wrap gap-4">
              {formData?.identity_document && (
                <div className="relative">
                  <Image
                    src={URL.createObjectURL(formData?.identity_document.file)}
                    alt={formData?.identity_document?.name}
                    width={100}
                    height={100}
                    className="w-[100px] h-[100px] rounded-lg object-cover"
                  />
                </div>
              )}
              {formData?.trade_license && (
                <div className="relative">
                  <Image
                    src={URL.createObjectURL(formData?.trade_license.file)}
                    alt={formData?.trade_license?.name}
                    width={100}
                    height={100}
                    className="w-[100px] h-[100px] rounded-lg object-cover"
                  />
                </div>
              )}
            </div>
          </li>
          <li>
            <span className="font-semibold">Request Details: </span>
            {formData.request_details || "-"}
          </li>
        </ul>
      </section>

      {/* Success Modal */}
      {showModal && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-lg flex justify-center items-center">
          <div className="bg-white w-[90%] max-w-[492px] p-8 rounded-xl">
            <div className="mb-6">
              <Image
                src="/assets/icons/success.png"
                alt="success"
                width={60}
                height={60}
                className="size-[60px] mx-auto"
              />
            </div>
            <div className="w-full mb-8">
              <h2 className="text-center text-black text-3xl font-bold mb-3">
                Success
              </h2>
              <p className="text-center text-[#314158] text-sm">
                Your details have been submitted
              </p>
            </div>
            <Link href="/">
              <Button
                onClick={() => setShowModal(false)}
                variant="solid"
                className="w-full"
              >
                Close
              </Button>
            </Link>
            {/* <Link href="/farm">
              <Button
                onClick={() => setShowModal(false)}
                variant="solid"
                className="w-full"
              >
                Add Farm
              </Button>
            </Link> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationPreview;
