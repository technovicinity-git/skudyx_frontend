"use client";

import Button from "@/components/common/Button";
import useInvestmentFormStore from "@/store/useInvestmentFormStore";
import Image from "next/image";
import { RxCross2 } from "react-icons/rx";

const AddDocuments = ({ setCurrentStep }) => {
  const { formData, updateField, removeFile } = useInvestmentFormStore();

  const handleFiles = (selectedFiles, fieldName) => {
    const newFiles = Array.from(selectedFiles).map((file) => ({
      file,
      name: file.name,
      size: file.size,
      preview:
        fieldName === "propertyImages" ? URL.createObjectURL(file) : null,
    }));

    updateField(fieldName, [...formData[fieldName], ...newFiles]);
  };

  const handleDrop = (e, fieldName) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files, fieldName);
  };

  const formatSize = (bytes) => {
    const kb = bytes / 1024;
    return kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${Math.round(kb)} KB`;
  };

  const handleRemove = (fieldName, idx) => {
    const updated = formData[fieldName].filter((_, i) => i !== idx);
    updateField(fieldName, updated);
  };

  const renderUploadZone = (label, fieldName, accept, isImage = false) => (
    <>
      <h3 className="w-full text-[22px] font-semibold mb-6">{label}</h3>
      <div
        className="dashed-border rounded-sm w-full bg-white py-14 px-6 text-center cursor-pointer flex flex-col items-center justify-center"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='4' ry='4' stroke='%23ACB2BCFF' strokeWidth='1' stroke-dasharray='14%2c 9' stroke-dashoffset='8' strokeLinecap='square'/%3e%3c/svg%3e\")",
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleDrop(e, fieldName)}
        onClick={() => document.getElementById(fieldName).click()}
      >
        <input
          id={fieldName}
          type="file"
          accept={accept}
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files, fieldName)}
        />
        <div className="flex flex-col items-center gap-2.5">
          <Image
            src="/assets/icons/image-upload.png"
            alt="upload-image"
            width={32}
            height={32}
          />
          <p className="text-xs text-[#717171] mt-2.5">
            Drag and drop or <span className="underline">browse</span>
          </p>
        </div>
      </div>

      {/* Uploaded Files */}
      <div className="w-full mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
        {formData?.[fieldName]?.map((file, idx) =>
          isImage ? (
            // Images layout
            <div
              key={idx}
              className="relative rounded-lg overflow-hidden aspect-square"
            >
              <Image
                src={file.preview || "/assets/icons/image-placeholder.png"}
                alt="uploaded"
                width={800}
                height={600}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => handleRemove(fieldName, idx)}
                className="absolute top-2 right-2 bg-white/80 rounded-full p-1 hover:bg-white cursor-pointer"
              >
                <RxCross2 className="w-5 h-5 text-black" />
              </button>
            </div>
          ) : (
            // Docs layout
            <div
              key={idx}
              className="relative flex items-center justify-between gap-4 bg-white border border-[#EAECF0] rounded-xl p-4"
            >
              <div className="flex items-center gap-4">
                <Image
                  src="/assets/icons/pdf-icon.png"
                  alt="file"
                  width={40}
                  height={40}
                />
                <div>
                  <p className="text-black text-sm font-medium break-words max-w-[100px]">
                    {file.name}
                  </p>
                  <p className="text-sm text-black">{formatSize(file.size)}</p>
                </div>
              </div>
              <button
                onClick={() => handleRemove(fieldName, idx)}
                className="absolute top-2 right-2 bg-white/80 rounded-full p-1 hover:bg-white cursor-pointer"
              >
                <RxCross2 className="w-5 h-5 text-black" />
              </button>
            </div>
          )
        )}
      </div>
    </>
  );

  return (
    <>
      {renderUploadZone("Add Document", "propertyDocuments", ".pdf,.doc,.docx")}
      <div className="mt-12"></div>
      {renderUploadZone(
        "Add Property Images",
        "propertyImages",
        "image/*",
        true
      )}

      {/* Prev / Next */}
      <div className="w-full mt-8 flex items-center justify-between">
        <Button onClick={() => setCurrentStep(3)} variant="outline">
          Prev
        </Button>
        <Button onClick={() => setCurrentStep(5)} variant="solid">
          Continue
        </Button>
      </div>
    </>
  );
};

export default AddDocuments;
