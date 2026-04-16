"use client";

import AddressAutocomplete from "@/components/common/AddressAutoComplete/AddressAutocomplete.";
import Input from "@/components/common/Input";
import useCreateFarmerStore from "@/store/useCreateFarmerStore";
import Image from "next/image";
import { useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CiCalendar } from "react-icons/ci";
import Button from "../../../common/Button";
import Label from "./Label";
import Select from "./Select";

const RegistrationStep3 = ({ setCurrentStep }) => {
  const [error, setError] = useState({});
  const [tradeImage, setTradeImage] = useState("");
  const [identityImage, setIdentityImage] = useState("");
  // const [address, setAddress] = useState("");

  const { formData, updateField } = useCreateFarmerStore();

  const tradeRef = useRef(null);
  const identityRef = useRef(null);

  const validateAge = (date) => {
    if (date) {
      // Age validation (must be at least 18 years old)
      const minAllowedDate = new Date();
      minAllowedDate.setFullYear(minAllowedDate.getFullYear() - 18);

      if (date > minAllowedDate) {
        setError((prev) => ({
          ...prev,
          birth_date: "Age must be more than 18 years.",
        }));
        return false;
      } else {
        setError((prev) => ({ ...prev, birth_date: "" }));
        return true;
      }
    }
    return false;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isAgeValid = validateAge(formData.birth_date);
    if (tradeImage) {
      updateField("trade_license", tradeImage);
    }
    if (identityImage) {
      updateField("identity_document", identityImage);
    }
    if (isAgeValid) {
      setCurrentStep(3);
    }
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      const imageData = { file, preview };
      type === "trade" ? setTradeImage(imageData) : setIdentityImage(imageData);
    }
  };

  return (
    <div className="w-full py-25">
      <div className="text-[#101828] w-full mb-6 grid grid-cols-[auto_auto] gap-4">
        <h2 className="text-left text-[22px] font-semibold">
          Register As A Farmer
        </h2>
        <p className="text-right font-semibold">2/3</p>
      </div>

      {/* <p className="text-[#222222] text-sm font-semibold mb-4">
        {options.find((option) => option.value === farmingType)?.label ||
          "Unknown Farming Type"}
      </p> */}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Crop Type & Experience Level */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <Label htmlFor="address">Address</Label>
            <AddressAutocomplete
              onChange={(val) => updateField("address", val.label)}
              placeholder="Search for an address"
              value={formData.address}
            />
          </div>

          {/* Experience Level */}
          <div className="flex flex-col">
            <Label htmlFor="level_of_experience">
              Level of Experience In Farming
            </Label>
            <Select
              id="level_of_experience"
              name="level_of_experience"
              defaultValue={formData.level_of_experience}
              onChange={(e) =>
                updateField("level_of_experience", e.target.value)
              }
              required
            >
              <option value="" disabled>
                Select an option
              </option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="experienced">Experienced</option>
            </Select>
          </div>
        </div>

        {/* Age Range & Education Level */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Age */}
          <div>
            <div className="flex flex-col relative">
              <Label htmlFor="level_of_experience">Date of Birth</Label>
              <DatePicker
                selected={formData.birth_date}
                onChange={(date) => {
                  updateField("birth_date", date);
                  validateAge(date);
                }}
                placeholderText="Select date"
                className="w-full text-base bg-white px-3.5 py-3 border border-[#D0D5DD] rounded-lg cursor-pointer"
                required
                maxDate={new Date()}
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                dateFormat="dd/MM/yyyy"
              />
              <CiCalendar className="size-6 absolute right-3.5 bottom-3 pointer-events-none" />
            </div>
            {error.birth_date && (
              <p className="text-red-500 text-sm">{error.birth_date}</p>
            )}
          </div>

          {/* Education Level */}
          <div className="flex flex-col">
            <Label htmlFor="level_of_education">Level Of Education</Label>
            <Input
              type="text"
              id="level_of_education"
              name="level_of_education"
              value={formData.level_of_education}
              onChange={(e) =>
                updateField("level_of_education", e.target.value)
              }
              placeholder="Eg. Bachelor's"
              required
            />
          </div>
        </div>

        {/* Gender */}
        <div className="flex flex-col">
          <Label htmlFor="gender">Gender Identity</Label>
          <Select
            id="gender"
            name="gender"
            defaultValue={formData.gender}
            onChange={(e) => updateField("gender", e.target.value)}
            required
          >
            <option value="" disabled>
              Select gender
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </Select>
        </div>
        <div className="flex flex-col">
          <Label htmlFor="type">Farmer Type</Label>
          <Select
            id="type"
            name="type"
            defaultValue=""
            value={formData.type}
            onChange={(e) => updateField("type", e.target.value)}
            required
          >
            <option value="" disabled>
              Select an option
            </option>
            <option value="individual">Individual</option>
            <option value="corporate">Corporate</option>
          </Select>
        </div>

        {formData.type === "corporate" && (
          <div className="flex flex-col">
            <Label htmlFor="business_name">Business Name</Label>
            <Input
              type="text"
              id="business_name"
              name="business_name"
              value={formData.business_name}
              onChange={(e) => updateField("business_name", e.target.value)}
              placeholder="Enter business name"
            />
          </div>
        )}
        {formData.type === "corporate" && (
          <div className="flex flex-col">
            <Label htmlFor="business_reg_number">
              Business Registration Number
            </Label>
            <Input
              type="number"
              id="business_reg_number"
              name="business_reg_number"
              value={formData.business_reg_number}
              onChange={(e) =>
                updateField("business_reg_number", e.target.value)
              }
              placeholder="Enter business Reg. Number"
            />
          </div>
        )}

        {formData.type === "corporate" && (
          <>
            <div className="mt-6">
              <p className="text-black text-lg font-medium mb-1.5">
                Trade Lisence
              </p>
              <label className="hover:bg-gray-50 w-full h-[146px] border border-[#EAECF0] rounded-md flex flex-col items-center justify-center cursor-pointer transition">
                <input
                  ref={tradeRef}
                  id="back-input"
                  type="file"
                  accept="image/png, image/jpeg"
                  className="hidden"
                  onChange={(e) => handleImageChange(e, "trade")}
                />
                {tradeImage.preview ? (
                  <div className="relative w-full overflow-hidden rounded-md flex justify-center">
                    <img
                      src={tradeImage.preview}
                      alt="Back ID Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => tradeRef.current?.click()}
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
          </>
        )}
        {formData.type === "individual" && (
          <>
            <div className="mt-6">
              <p className="text-black text-lg font-medium mb-1.5">
                Identity Document
              </p>
              <label className="hover:bg-gray-50 w-full h-[146px] border border-[#EAECF0] rounded-md flex flex-col items-center justify-center cursor-pointer transition">
                <input
                  ref={identityRef}
                  id="back-input"
                  type="file"
                  accept="image/png, image/jpeg"
                  className="hidden"
                  onChange={(e) => handleImageChange(e, "indentity")}
                />
                {identityImage.preview ? (
                  <div className="relative w-full overflow-hidden rounded-md flex justify-center">
                    <img
                      src={identityImage.preview}
                      alt="Back ID Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => identityRef.current?.click()}
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
          </>
        )}

        <div className="flex flex-col">
          <Label htmlFor="request_details">Request Details</Label>
          <textarea
            id="request_details"
            name="request_details"
            value={formData.request_details}
            onChange={(e) => updateField("request_details", e.target.value)}
            className="text-base text-[#222222] placeholder-[#45556c] bg-white px-3.5 py-3 outline-none border border-[#D0D5DD] focus:border-primary-0 rounded-lg shadow-[0_1px_2px_0_#1018280D] transition-colors duration-300 resize-none h-[220px]"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end items-center gap-2">
          <Button
            variant="outline"
            type="button"
            className="!px-5"
            onClick={() => setCurrentStep(1)}
          >
            Go Back
          </Button>
          <Button variant="solid" type="submit" className="!px-5">
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RegistrationStep3;
