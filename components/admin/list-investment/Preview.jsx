"use client";

import Image from "next/image";
import { useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";

import Button from "@/components/common/Button";
import { useCreateInvestmentPlan } from "@/hook/investmentPlan";
import useInvestmentFormStore from "@/store/useInvestmentFormStore";
import { formatDate } from "@/utils/formatDate";
import Link from "next/link";

const Preview = ({ setCurrentStep }) => {
  const { formData, resetForm, removeFile, removeImage } =
    useInvestmentFormStore();
  const { createInvestmentPlan, isLoading, errorMessage } =
    useCreateInvestmentPlan();

  const [showModal, setShowModal] = useState(false);

  const handleSubmit = () => {
    const data = new FormData();

    // -------- Step 1: Investment Overview --------
    data.append("name", formData.name || "");
    data.append("farmType", formData.farmType || "");
    data.append("farm_id", formData.selectedFarm || "");
    // data.append("crop_types", JSON.stringify(formData.crop_types || []));
    data.append("crop_types", formData.crop_types.join(",") || "");
    data.append("description", formData.description || "");
    data.append("location", formData.location || "");
    data.append("manager_name", formData.manager_name || "");
    data.append("country", formData.country || "");
    data.append("activities", JSON.stringify(formData.activities || []));
    // data.append("activities", formData.activities);
    data.append("expected_yield", formData.expected_yield || "");
    if (formData.investEndDate)
      data.append("investEndDate", formData.investEndDate);
    if (formData.endDate) data.append("endDate", formData.endDate);

    // -------- Step 2: Investment Details --------
    if (formData.startDate) data.append("startDate", formData.startDate);
    if (formData.matureDate) data.append("matureDate", formData.matureDate);
    data.append("type", formData.type || "");
    data.append("duration_type", formData.duration_type || "");
    data.append("duration", formData.duration || "");
    data.append("number_of_slots", formData.number_of_slots || "");
    data.append("slot_price", formData.slot_price || "");
    data.append("max_slot", formData.max_slot || "");
    data.append("min_slot", formData.min_slot || "");
    data.append("roi", formData.roi || "");
    data.append("discount_percent", formData.discount_percent || "");
    data.append("slots_for_discount", formData.slots_for_discount || "");
    data.append("riskLevel", formData.riskLevel || "");
    data.append("referral_bonus", formData.referral_bonus || "");
    data.append("premium_fees", formData.premium_fees || "");

    // -------- Step 3: Add Cycles (send as JSON string) --------
    data.append("cycles", JSON.stringify(formData.cycles || []));

    // -------- Step 4: Add Documents --------
    formData.propertyImages.forEach((fileItem) => {
      data.append("propertyImages", fileItem.file);
    });

    formData.propertyDocuments.forEach((fileItem) => {
      data.append("propertyDocuments", fileItem.file);
    });

    createInvestmentPlan(data, {
      onSuccess: () => {
        setShowModal(true);
        resetForm();
      },
    });
  };

  return (
    <div className="w-full flex flex-col gap-10">
      {/* Heading */}
      <div className="w-full mt-2 -mb-2 flex justify-between items-center">
        <h3 className="text-xl sm:text-2xl font-semibold text-[#101828]">
          Preview
        </h3>
        <div className="flex items-center gap-2">
          {/* <Button variant="outline">Save as draft</Button> */}
          <Button variant="solid" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </div>
      {errorMessage && (
        <div className="mt-4 p-4 bg-red-100 text-red-800 rounded">
          {errorMessage}
        </div>
      )}

      {/* Farm Overview */}
      <section className="text-[#222222] pb-8 border-b border-[#D0D5DD]">
        <div className="flex justify-between items-center mb-5">
          <h4 className="text-xl font-semibold">Farm Overview</h4>
          <button
            className="font-semibold text-primary-0 flex items-center gap-[3px] cursor-pointer"
            onClick={() => setCurrentStep(1)}
          >
            <FaRegEdit /> <span>Edit</span>
          </button>
        </div>
        <ul className="space-y-3">
          <li>
            <span className="font-semibold">Name of Investment: </span>
            {formData.name}
          </li>
          <li>
            <span className="font-semibold">Name of Manager: </span>
            {formData.manager_name}
          </li>
          <li>
            <span className="font-semibold">Farm Type: </span>
            {formData.farmType}
          </li>
          <li>
            <span className="font-semibold">Selected Farm: </span>
            {formData.selectedFarm}
          </li>
          {/* <li>
            <span className="font-semibold">Crops/ Livestock: </span>
            {formData.crop_types?.map((type, index) => (
              <span key={index}>
                {type}
                {index < formData.crop_types.length - 1 && ", "}
              </span>
            ))}
          </li> */}

          <li>
            <span className="font-semibold">Location: </span>
            {formData.location}
          </li>
          <li>
            <span className="font-semibold">Activities: </span>
            {formData.activities?.map((activity, index) => (
              <>
                <div key={index}>Title: {activity.title}</div>
              </>
            ))}
          </li>
          {formData?.expected_yield && (
            <li>
              <span className="font-semibold">Expected Yield: </span>
              {formData.expected_yield} ton(s)
            </li>
          )}
          <li>
            <span className="font-semibold">About Investment: </span>
            {formData.description}
          </li>

          <li>
            <span className="font-semibold">Investment Start Date: </span>
            {formatDate(formData.startDate)}
          </li>
          <li>
            <span className="font-semibold">Investment End Date: </span>
            {formatDate(formData.investEndDate)}
          </li>
        </ul>
      </section>

      {/* Investment Details */}
      <section className="text-[#222222] pb-8 border-b border-[#D0D5DD]">
        <div className="flex justify-between items-center mb-5">
          <h4 className="text-xl font-semibold">Investment Details</h4>
          <button
            className="font-semibold text-primary-0 flex items-center gap-[3px] cursor-pointer"
            onClick={() => setCurrentStep(2)}
          >
            <FaRegEdit /> <span>Edit</span>
          </button>
        </div>
        <ul className="space-y-3">
          <li>
            <span className="font-semibold">Maturity Date: </span>
            {formatDate(formData.matureDate)}
          </li>
          <li>
            <span className="font-semibold">Plan End Date: </span>
            {formatDate(formData.endDate)}
          </li>
          <li>
            <span className="font-semibold">Type: </span>
            {formData.type}
          </li>
          <li>
            <span className="font-semibold">Duration Type: </span>
            {formData.duration_type}
          </li>
          <li>
            <span className="font-semibold">Duration: </span>
            {formData.duration}
          </li>
          <li>
            <span className="font-semibold">Number of Slots: </span>
            {formData.number_of_slots}
          </li>
          <li>
            <span className="font-semibold">Slot Price: </span>
            {formData.slot_price}
          </li>
          <li>
            <span className="font-semibold">Maximum Slots: </span>
            {formData.max_slot}
          </li>
          <li>
            <span className="font-semibold">Minimum Slots: </span>
            {formData.min_slot}
          </li>

          <li>
            <span className="font-semibold">Discount: </span>
            {formData.discount_percent}%
          </li>
          <li>
            <span className="font-semibold">Slots for Discount: </span>
            {formData.slots_for_discount}
          </li>
          <li>
            <span className="font-semibold">ROI: </span>
            {formData.roi}%
          </li>
          <li>
            <span className="font-semibold">Risk Level: </span>
            {formData.riskLevel}
          </li>
          <li>
            <span className="font-semibold">Referral Bonus: </span>$
            {formData.referral_bonus}
          </li>
          <li>
            <span className="font-semibold">Premium Fees: </span>$
            {formData.premium_fees}
          </li>
        </ul>
      </section>

      {/* Cycles */}
      <section className="text-[#222222] pb-8 border-b border-[#D0D5DD]">
        <div className="flex justify-between items-center mb-5">
          <h4 className="text-xl font-semibold">Cycles</h4>
          <button
            className="font-semibold text-primary-0 flex items-center gap-[3px] cursor-pointer"
            onClick={() => setCurrentStep(3)}
          >
            <FaRegEdit /> <span>Edit</span>
          </button>
        </div>
        <div className="flex flex-col gap-4">
          {formData.cycles?.map((cycle, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
            >
              <p className="font-medium text-lg">
                Cycle {cycle.cycleNumber} — {cycle.cycleRoiPercent}% ROI,{" "}
                {cycle.maturityInMonths} months
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {cycle.returns?.map((ret, rIdx) => (
                  <span
                    key={rIdx}
                    className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                  >
                    {ret.returnDate} — {ret.actualRoiPercent}% (
                    {ret.returnStatus})
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Documents */}
      <section className="text-[#222222] pb-8 border-b border-[#D0D5DD]">
        <div className="flex justify-between items-center mb-5">
          <h4 className="text-xl font-semibold">Documents</h4>
          <button
            className="font-semibold text-primary-0 flex items-center gap-[3px] cursor-pointer"
            onClick={() => setCurrentStep(4)}
          >
            <FaRegEdit /> <span>Edit</span>
          </button>
        </div>
        <div className="flex flex-col gap-4">
          {formData?.propertyDocuments?.map((doc, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between gap-4 bg-white border border-[#EAECF0] rounded-xl p-4"
            >
              <div className="flex items-center gap-4">
                <Image
                  src="/assets/icons/pdf-icon.png"
                  alt="doc"
                  width={40}
                  height={40}
                />
                <div>
                  <p className="text-black">{doc.name}</p>
                  <p className="text-sm text-black">
                    {Math.round(doc.size / 1024)} KB –{" "}
                    {doc.uploaded ? "100% uploaded" : "Pending"}
                  </p>
                </div>
              </div>
              <button
                className="cursor-pointer"
                onClick={() => removeFile(idx)}
              >
                <RxCross2 className="text-2xl text-gray-500" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Property Images */}
      <section className="text-[#222222] pb-8">
        <div className="flex justify-between items-center mb-5">
          <h4 className="text-xl font-semibold">Property Images</h4>
          <button
            className="font-semibold text-primary-0 flex items-center gap-[3px] cursor-pointer"
            onClick={() => setCurrentStep(4)}
          >
            <FaRegEdit /> <span>Edit</span>
          </button>
        </div>
        <div className="flex flex-wrap gap-4">
          {formData.propertyImages?.map((img, idx) => (
            <div
              key={idx}
              className="relative w-32 h-32 border rounded-xl overflow-hidden"
            >
              <Image
                src={img?.preview}
                alt={`property-${idx}`}
                width={128}
                height={128}
                className="object-cover w-full h-full"
              />
              <button
                className="bg-white/70 size-10 rounded-full flex justify-center items-center absolute -translate-1/2 top-1/2 left-1/2 cursor-pointer"
                onClick={() => removeImage(idx)}
              >
                <RxCross2 className="text-2xl" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Modal */}
      {showModal && (
        <div className="absolute inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white w-[90%] max-w-[492px] p-8 rounded-xl text-center">
            <Image
              src="/assets/icons/success.png"
              alt="success"
              width={60}
              height={60}
              className="mx-auto"
            />
            <h2 className="text-3xl font-bold mt-4">Success</h2>
            <p className="text-sm text-[#314158] mb-6">
              Your details have been submitted
            </p>
            <Link href="/admin/investments">
              <Button
                onClick={() => setShowModal(false)}
                variant="solid"
                className="w-full"
              >
                View Listing
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Preview;
