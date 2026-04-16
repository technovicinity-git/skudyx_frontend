"use client";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CiCalendar } from "react-icons/ci";

import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Label from "@/components/common/Label";
import Select from "@/components/common/Select";
import useInvestmentFormStore from "@/store/useInvestmentFormStore";
import { useState } from "react";

const InvestDetails = ({ setCurrentStep }) => {
  const { formData, updateField } = useInvestmentFormStore();
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Start Date & Maturity Date
    // if (formData.startDate && formData.startDate < today) {
    //   newErrors.startDate = "Start date cannot be in the past.";
    // }
    if (formData.matureDate && formData.matureDate < today) {
      newErrors.matureDate = "Maturity date cannot be in the past.";
    }

    // Maximum slots
    if (formData.max_slot < 1) {
      newErrors.max_slot = "Maximum slots must be at least 1.";
    }

    // Minimum slots
    if (formData.min_slot > formData.max_slot) {
      newErrors.min_slot =
        "Minimum slots cannot be greater than maximum slots.";
    }

    // Discount
    if (
      formData.discount_percent !== "" &&
      (formData.discount_percent < 0 || formData.discount_percent > 100)
    ) {
      newErrors.discount_percent = "Discount must be between 0 and 100.";
    }

    // ROI
    if (formData.roi < 0 || formData.roi > 100) {
      newErrors.roi = "ROI must be between 0 and 100.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      setCurrentStep(3);
    }
  };

  return (
    <>
      <h3 className="w-full text-[22px] font-semibold mb-6">
        Investment Details
      </h3>
      <form onSubmit={handleNext} className="w-full flex flex-col gap-5">
        <div className="w-full flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex flex-col relative">
                <Label htmlFor="matureDate">Maturity Date</Label>
                <DatePicker
                  selected={formData.matureDate}
                  onChange={(date) => updateField("matureDate", date)}
                  id="matureDate"
                  placeholderText="Select date"
                  className="text-base bg-white w-full px-3.5 py-3 border border-[#D0D5DD] rounded-lg"
                  required
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={100}
                  showMonthDropdown
                  dropdownMode="select"
                  minDate={new Date()}
                  dateFormat="dd/MM/yyyy"
                />
                <CiCalendar className="size-6 absolute right-3.5 bottom-3 pointer-events-none" />
              </div>
              {errors.matureDate && (
                <p className="text-red-500 text-sm mt-1">{errors.matureDate}</p>
              )}
            </div>
            <div>
              <div className="flex flex-col relative">
                <Label htmlFor="endDate">Plan End Date</Label>
                <DatePicker
                  selected={formData.endDate}
                  onChange={(date) => updateField("endDate", date)}
                  id="endDate"
                  placeholderText="Select date"
                  className="text-base bg-white w-full px-3.5 py-3 border border-[#D0D5DD] rounded-lg"
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={100}
                  showMonthDropdown
                  dropdownMode="select"
                  minDate={new Date()}
                  required
                  dateFormat="dd/MM/yyyy"
                />
                <CiCalendar className="size-6 absolute right-3.5 bottom-3 pointer-events-none" />
              </div>
              {errors.endDate && (
                <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <Label htmlFor="type">Type</Label>
            <Select
              id="type"
              value={formData.type}
              onChange={(e) => updateField("type", e.target.value)}
              required
            >
              <option value="" disabled>
                Select An Option
              </option>
              <option value="short term">Short Term</option>
              <option value="medium term">Medium Term</option>
              <option value="long term">Long Term</option>
            </Select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <Label htmlFor="duration_type">Duration Type</Label>
              <Select
                id="duration_type"
                value={formData.duration_type}
                onChange={(e) => updateField("duration_type", e.target.value)}
                required
              >
                <option value="" disabled>
                  Select An Option
                </option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </Select>
            </div>

            <div className="flex flex-col">
              <Label htmlFor="duration">Duration</Label>
              <Input
                type="number"
                id="duration"
                value={formData.duration}
                onChange={(e) => updateField("duration", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <Label htmlFor="number_of_slots">Number Of Slots</Label>
              <Input
                type="number"
                id="number_of_slots"
                value={formData.number_of_slots}
                onChange={(e) => updateField("number_of_slots", e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col">
              <Label htmlFor="slot_price">Slot Price($)</Label>
              <Input
                type="number"
                id="slot_price"
                value={formData.slot_price}
                onChange={(e) => updateField("slot_price", e.target.value)}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex flex-col">
                <Label htmlFor="max_slot">Maximum Slots</Label>
                <Input
                  type="number"
                  id="max_slot"
                  value={formData.max_slot}
                  onChange={(e) =>
                    updateField("max_slot", Number(e.target.value))
                  }
                  required
                />
              </div>
              {errors.max_slot && (
                <p className="text-red-500 text-sm mt-1">{errors.max_slot}</p>
              )}
            </div>
            <div>
              <div className="flex flex-col">
                <Label htmlFor="min_slot">Minimum Slots</Label>
                <Input
                  type="number"
                  id="min_slot"
                  value={formData.min_slot}
                  onChange={(e) =>
                    updateField("min_slot", Number(e.target.value))
                  }
                  required
                />
              </div>
              {errors.min_slot && (
                <p className="text-red-500 text-sm mt-1">{errors.min_slot}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex flex-col relative">
                <Label htmlFor="discount_percent">Discount</Label>
                <Input
                  type="number"
                  id="discount_percent"
                  value={formData.discount_percent}
                  onChange={(e) =>
                    updateField("discount_percent", e.target.value)
                  }
                  className="ps-14"
                />
                <div className="bg-[#F1F5F9] size-12 rounded-r-lg absolute right-[1px] bottom-[1px] flex justify-center items-center">
                  %
                </div>
              </div>
              {errors.discount_percent && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.discount_percent}
                </p>
              )}
            </div>
            <div className="flex flex-col">
              <Label htmlFor="slots_for_discount"> Slots for Discount</Label>
              <Input
                type="number"
                id="slots_for_discount"
                value={formData.slots_for_discount}
                onChange={(e) =>
                  updateField("slots_for_discount", e.target.value)
                }
                // required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex flex-col relative">
                <Label htmlFor="roi">Return On Investment</Label>
                <Input
                  type="number"
                  id="roi"
                  value={formData.roi}
                  onChange={(e) => updateField("roi", Number(e.target.value))}
                  className="ps-14"
                  required
                />
                <div className="bg-[#F1F5F9] size-12 rounded-r-lg absolute right-[1px] bottom-[1px] flex justify-center items-center">
                  %
                </div>
              </div>
              {errors.roi && (
                <p className="text-red-500 text-sm mt-1">{errors.roi}</p>
              )}
            </div>
            <div className="flex flex-col">
              <Label htmlFor="riskLevel">Risk Level</Label>
              <Select
                id="riskLevel"
                value={formData.riskLevel}
                onChange={(e) => updateField("riskLevel", e.target.value)}
                required
              >
                <option value="" disabled>
                  Select An Option
                </option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <Label htmlFor="referral_bonus">Referral Bonus ($)</Label>
              <Input
                type="number"
                id="referral_bonus"
                value={formData.referral_bonus}
                onChange={(e) => updateField("referral_bonus", e.target.value)}
                placeholder="Enter referral bonus"
                required
              />
            </div>
            <div className="flex flex-col">
              <Label htmlFor="premium_fees">Premium Fees ($)</Label>
              <Input
                type="number"
                id="premium_fees"
                value={formData.premium_fees}
                onChange={(e) => updateField("premium_fees", e.target.value)}
                placeholder="Enter premium fees"
                required
              />
            </div>
          </div>
        </div>

        <div className="w-full mt-8 flex items-center justify-between">
          <Button onClick={() => setCurrentStep(1)} variant="outline">
            Prev
          </Button>
          <Button variant="solid" type="submit">
            Continue
          </Button>
        </div>
      </form>
    </>
  );
};

export default InvestDetails;
