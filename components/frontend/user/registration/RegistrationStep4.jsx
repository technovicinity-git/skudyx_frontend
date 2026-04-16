"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { HiMiniExclamationCircle } from "react-icons/hi2";
import Image from "next/image";
import Button from "../../../common/Button";
import "@/components/common/phoneInputStyle.css";

import useCreateFarmStore from "@/store/useCreateFarmStore"; // ⬅️ import store

const RegistrationStep4 = ({ setCurrentStep }) => {
  const { formData, updateField } = useCreateFarmStore();

  // Initialize state from store (so values persist if going back)
  const [selectedOption, setSelectedOption] = useState(
    formData.landOption || "upload"
  );
  const [uploadedFile, setUploadedFile] = useState(
    formData.uploadedFile || null
  );

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileData = {
        name: file.name,
        size: (file.size / 1024).toFixed(0), // size in KB
        type: file.name.split(".").pop(),
      };
      setUploadedFile(fileData);
      updateField("uploadedFile", fileData); // ⬅️ save in store
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    updateField("uploadedFile", null); // ⬅️ clear in store
  };

  const handleOptionChange = (option) => {
    setSelectedOption(option);
    updateField("landOption", option); // ⬅️ save in store

    if (option === "map") {
      setUploadedFile(null);
      updateField("uploadedFile", null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save before moving forward
    updateField("landOption", selectedOption);
    updateField("uploadedFile", uploadedFile);
    setCurrentStep(5);
  };

  return (
    <div className="w-full">
      <div className="text-[#101828] w-full mb-6 grid grid-cols-[auto_auto] gap-4">
        <h2 className="text-left text-[22px] font-semibold">Add A Land</h2>
        <p className="text-right font-semibold">4/4</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Option 1: Upload boundaries */}
        <label className="bg-white block border border-[#D0D5DD] rounded-lg px-3.5 py-3 cursor-pointer order-1">
          <div>
            <div className="flex items-start gap-2">
              <input
                type="radio"
                name="landOption"
                className="sr-only"
                checked={selectedOption === "upload"}
                onChange={() => handleOptionChange("upload")}
              />
              <div
                className={`w-5 h-5 flex items-center justify-center rounded-md border ${
                  selectedOption === "upload"
                    ? "border-primary-1 text-primary-1"
                    : "border-[#D0D5DD] text-white"
                }`}
              >
                {selectedOption === "upload" && <Check size={16} />}
              </div>

              <div>
                <p className="font-medium text-black mb-2">
                  I have my land boundaries
                </p>
                <p className="text-sm text-[#45556C]">
                  required format <code>.geoJSON</code>, <code>.xlsx</code>,{" "}
                  <code>.shp</code> (Max size: 2mb)
                </p>
              </div>
            </div>

            {selectedOption === "upload" && (
              <div className="mt-4">
                {uploadedFile ? (
                  <>
                    {/* File Preview */}
                    <div className="flex items-center justify-between border border-[#EAECF0] rounded-lg p-3 bg-white shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">
                          {uploadedFile.type.toUpperCase()}
                        </div>
                        <div>
                          <p className="text-[#222222]">{uploadedFile.name}</p>
                          <p className="text-sm text-[#222222]">
                            {uploadedFile.size} KB – 100% uploaded
                          </p>
                        </div>
                      </div>
                      <button type="button" onClick={removeFile}>
                        <X
                          size={18}
                          className="text-[#667085] hover:text-red-500"
                        />
                      </button>
                    </div>

                    {/* Re-upload */}
                    <div className="mt-4">
                      <label className="text-primary-0 font-medium cursor-pointer hover:underline">
                        Re-upload document
                        <input
                          type="file"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Upload Dropzone */}
                    <label className="dashed-border py-14 px-6 mx-[5px] text-center cursor-pointer flex flex-col items-center justify-center">
                      <Image
                        src="/assets/icons/image-upload.png"
                        alt="upload-image"
                        width={32}
                        height={32}
                        className="size-8"
                      />
                      <p className="text-xs text-[#717171] underline mt-2.5">
                        Click to upload
                      </p>
                      <input
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </>
                )}

                <div className="mt-4">
                  <a
                    href="#"
                    className="text-primary-0 font-medium cursor-pointer hover:underline"
                  >
                    Download template
                  </a>
                </div>
              </div>
            )}
          </div>
        </label>

        {/* Option 2: Map */}
        <label
          className={`bg-white block border border-[#D0D5DD] rounded-lg px-3.5 py-3 cursor-pointer  ${
            selectedOption === "map" ? "order-2" : "order-3"
          }`}
        >
          <div className="flex items-start gap-2">
            <input
              type="radio"
              name="landOption"
              className="sr-only"
              checked={selectedOption === "map"}
              onChange={() => handleOptionChange("map")}
            />
            <div
              className={`w-5 h-5 flex items-center justify-center rounded-md border ${
                selectedOption === "map"
                  ? "border-primary-1 text-primary-1"
                  : "border-[#D0D5DD] text-white"
              }`}
            >
              {selectedOption === "map" && <Check size={16} />}
            </div>

            <div>
              <p className="font-medium text-black mb-2">
                I want to map my land
              </p>
              <p className="text-sm text-[#45556C]">
                If you are physically on the land map them on the go.
              </p>
            </div>
          </div>

          {selectedOption === "map" && (
            <div className="bg-[#DCFCE7] p-4 rounded-lg mt-2 flex gap-2">
              <HiMiniExclamationCircle className="size-6 text-[#00A63E]" />
              <p className="text-sm text-[#45556C]">
                In order to map the land you will be asked to move around
                boundaries of your land.
              </p>
            </div>
          )}
        </label>

        {/* Buttons */}
        <div
          className={`flex justify-end items-center gap-2 ${
            selectedOption === "map" ? "order-3" : "order-2"
          }`}
        >
          <Button
            variant="outline"
            type="button"
            className="!px-5"
            onClick={() => setCurrentStep(2)}
          >
            Go Back
          </Button>
          <Button variant="solid" type="submit" className="!px-5">
            Preview
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RegistrationStep4;
