"use client";
import AddressAutocomplete from "@/components/common/AddressAutoComplete/AddressAutocomplete.";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Label from "@/components/common/Label";
import Select from "@/components/common/Select";
import { useGetActivityNames } from "@/hook/activities";
import { useGetFarms } from "@/hook/farms";
import useInvestmentFormStore from "@/store/useInvestmentFormStore";
import { countries } from "@/utils/country";
import { useState } from "react";
import DatePicker from "react-datepicker";
import { CiCalendar } from "react-icons/ci";

const InvestmentOverview = ({ setCurrentStep }) => {
  const { formData, updateField } = useInvestmentFormStore();
  const [errors, setErrors] = useState({});
  const page = 1;
  const limit = 10000000;
  const { farms, isLoading } = useGetFarms(
    page,
    limit,
    "",
    formData.farmType,
    ""
  );

  const { activityNames } = useGetActivityNames(1, 10000);

  const [selectedActivities, setSelectedActivities] = useState([]);

  const handleSelectActivity = (title) => {
    if (selectedActivities.find((a) => a.title === title)) {
      // unselect if already selected
      setSelectedActivities((prev) => prev.filter((a) => a.title !== title));
    } else {
      // add new activity with null date
      setSelectedActivities((prev) => [...prev, { title, date: null }]);
    }
  };

  const validateOverview = () => {
    const newErrors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Start Date & Maturity Date
    if (formData.investEndDate && formData.investEndDate < today) {
      newErrors.investEndDate = "Investment end date cannot be in the past.";
    }
    if (formData.endDate && formData.endDate < today) {
      newErrors.endDate = "End date cannot be in the past.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateOverview()) {
      updateField(
        "activities",
        selectedActivities.map((a) => ({
          title: a.title,
        }))
      );
      setCurrentStep(2);
    }
  };

  return (
    <>
      <h3 className="w-full text-[22px] font-semibold mb-6">
        Investment Overview
      </h3>
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
        <div className="flex flex-col">
          <Label htmlFor="name">Name Of Investment</Label>
          <Input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => updateField("name", e.target.value)}
            placeholder="Investment plan name"
            required
          />
        </div>
        <div className="flex flex-col">
          <Label htmlFor="manager_name">Name Of Manager</Label>
          <Input
            type="text"
            id="manager_name"
            value={formData.manager_name}
            onChange={(e) => updateField("manager_name", e.target.value)}
            placeholder="Enter manager name"
            required
          />
        </div>

        <div className="flex flex-col">
          <Label htmlFor="farmType">Farm Type</Label>
          <Select
            id="farmType"
            value={formData.farmType}
            onChange={(e) => updateField("farmType", e.target.value)}
            required
          >
            <option value="" disabled>
              Select An Option
            </option>
            <option value="crop">Crop</option>
            <option value="livestock">Livestock</option>
          </Select>
        </div>

        <div className="flex flex-col">
          <Label htmlFor="select-farm">Select Farm</Label>
          <Select
            id="select-farm"
            value={formData.selectedFarm}
            onChange={(e) => {
              updateField("selectedFarm", e.target.value);
            }}
            required
          >
            <option value="" disabled>
              {isLoading ? "Loading farms..." : "Select Farm"}
            </option>
            {farms?.map((farm) => (
              <option key={farm._id} value={farm._id}>
                {farm.farm_name} ({farm.type} – {farm.crop_live})
              </option>
            ))}
          </Select>
        </div>

        <div className="flex flex-col">
          <Label htmlFor="location">Address</Label>
          <AddressAutocomplete
            onChange={(val) => updateField("address", val.label)}
            placeholder="Search for an address"
            value={formData.address}
          />
        </div>
        <div className="flex flex-col">
          <Label htmlFor="country">Country</Label>
          <Select
            id="country"
            name="country"
            defaultValue=""
            value={formData.country}
            onChange={(e) => updateField("country", e.target.value)}
            required
          >
            <option value="" disabled>
              Select Country
            </option>
            {countries.map((country, idx) => (
              <option key={idx} value={country.name.toLowerCase()}>
                {country.name}
              </option>
            ))}
          </Select>
        </div>

        {/* Activity selection */}
        <div className="space-y-2">
          <h2 className="text-lg font-medium">Select Activities</h2>
          <div className="grid grid-cols-2 gap-3">
            {activityNames?.map((item) => (
              <button
                key={item._id}
                type="button"
                onClick={() => handleSelectActivity(item.name)}
                className={`px-4 py-2 rounded-lg border text-sm ${
                  selectedActivities.find((a) => a.title === item.name)
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>

        {/* Date pickers for selected activities */}
        {selectedActivities.length > 0 && (
          <div className="space-y-4">
            {selectedActivities.map((activity, index) => (
              <div key={activity.title} className="flex flex-col relative">
                <Label className="mb-1 font-medium">
                  {index + 1}. {activity.title}
                </Label>
                {/* <DatePicker
                  selected={activity.date}
                  onChange={(date) =>
                    setSelectedActivities((prev) =>
                      prev.map((a) =>
                        a.title === activity.title ? { ...a, date } : a
                      )
                    )
                  }
                  placeholderText="Select date"
                  className="text-base bg-white w-full px-3.5 py-3 border border-[#D0D5DD] rounded-lg"
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={100}
                  showMonthDropdown
                  dropdownMode="select"
                  minDate={new Date()}
                  required
                />
                <CiCalendar className="size-6 absolute right-3.5 bottom-3 pointer-events-none" /> */}
              </div>
            ))}
          </div>
        )}

        {formData?.farmType === "crop" && (
          <div className="flex flex-col">
            <Label htmlFor="expected_yield">Expected Yield (ton)</Label>
            <Input
              type="number"
              id="expected_yield"
              value={formData.expected_yield}
              onChange={(e) => updateField("expected_yield", e.target.value)}
              required
            />
          </div>
        )}

        <div className="flex flex-col">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => updateField("description", e.target.value)}
            className="text-base text-[#222222] bg-white px-3.5 py-3 outline-none border border-[#D0D5DD] rounded-lg h-[220px]"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex flex-col relative">
              <Label htmlFor="start-date">Investment Start Date</Label>
              <DatePicker
                selected={formData.startDate}
                onChange={(date) => updateField("startDate", date)}
                id="start-date"
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
          </div>
          <div>
            <div className="flex flex-col relative">
              <Label htmlFor="investEndDate">Investment End Date</Label>
              <DatePicker
                selected={formData.investEndDate}
                onChange={(date) => updateField("investEndDate", date)}
                id="investEndDate"
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
            {errors.investEndDate && (
              <p className="text-red-500 text-sm mt-1">
                {errors.investEndDate}
              </p>
            )}
          </div>
        </div>

        <div className="w-full mt-8 flex items-center justify-between">
          <Button variant="outline" disabled>
            Prev
          </Button>
          <Button type="submit" variant="solid">
            Continue
          </Button>
        </div>
      </form>
    </>
  );
};

export default InvestmentOverview;
