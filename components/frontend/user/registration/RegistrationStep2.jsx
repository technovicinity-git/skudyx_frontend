"use client";

import { useState } from "react";
import { Check } from "lucide-react";

import Button from "../../../common/Button";

const RegistrationStep2 = ({ setCurrentStep, setFarmingType }) => {
  const [selected, setSelected] = useState("open");

  const options = [
    { value: "open-field", label: "Open Field Farming" },
    { value: "green-house", label: "Green House Farming" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    setFarmingType(e.target.farmType.value);

    setCurrentStep(3);
  };

  return (
    <div className="w-full">
      <div className="text-[#101828] w-full mb-6 grid grid-cols-[auto_auto] gap-4">
        <h2 className="text-left text-[22px] font-semibold">
          Register As A Farmer
        </h2>
        <p className="text-right font-semibold">2/4</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <label className="text-[#344054] text-sm font-semibold">
            Select Farm Type
          </label>

          {options.map((option) => (
            <label
              key={option.value}
              className={`text-base text-[#222222] placeholder-[#62748E] px-3.5 py-3 outline-none border focus:border-primary-0 rounded-lg shadow-[0_1px_2px_0_#1018280D] transition-colors duration-300 flex items-center cursor-pointer ${
                selected === option.value
                  ? "border-primary-1 bg-green-50"
                  : "border-[#D0D5DD] bg-white"
              }`}
            >
              <input
                type="radio"
                name="farmType"
                value={option.value}
                checked={selected === option.value}
                onChange={() => setSelected(option.value)}
                className="sr-only"
                required
              />

              <div
                className={`w-5 h-5 flex items-center justify-center rounded border mr-3`}
              >
                {selected === option.value && <Check size={16} />}
              </div>

              <span className={`text-sm`}>{option.label}</span>
            </label>
          ))}
        </div>

        {/* Continue Button */}
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

export default RegistrationStep2;
