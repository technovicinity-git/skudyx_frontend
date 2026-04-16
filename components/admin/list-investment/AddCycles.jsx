"use client";

import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Label from "@/components/common/Label";
import useInvestmentFormStore from "@/store/useInvestmentFormStore";
import { AddCircle } from "@mui/icons-material";
import { useState } from "react";

const AddCycles = ({ setCurrentStep }) => {
  const { formData, updateField } = useInvestmentFormStore();

  const [newCycle, setNewCycle] = useState({
    cycleNumber: "",
    cycleRoiPercent: "",
    maturityInMonths: "",
    returns: [],
  });

  const [newReturn, setNewReturn] = useState({
    returnDate: "",
    actualRoiPercent: "",
    returnStatus: "pending",
  });

  const addReturn = () => {
    if (!newReturn.returnDate || !newReturn.actualRoiPercent) return;
    setNewCycle({
      ...newCycle,
      returns: [...newCycle.returns, newReturn],
    });
    setNewReturn({
      returnDate: "",
      actualRoiPercent: "",
      returnStatus: "pending",
    });
  };

  const removeReturn = (idx) => {
    setNewCycle({
      ...newCycle,
      returns: newCycle.returns.filter((_, i) => i !== idx),
    });
  };

  const addCycle = () => {
    if (
      !newCycle.cycleNumber ||
      !newCycle.cycleRoiPercent ||
      !newCycle.maturityInMonths
    )
      return;
    updateField("cycles", [...formData.cycles, newCycle]);
    setNewCycle({
      cycleNumber: "",
      cycleRoiPercent: "",
      maturityInMonths: "",
      returns: [],
    });
  };

  const removeCycle = (idx) => {
    updateField(
      "cycles",
      formData.cycles.filter((_, i) => i !== idx)
    );
  };

  console.log(newCycle?.returns?.length === 0);

  return (
    <>
      <h3 className="w-full text-[22px] font-semibold mb-6">Add Cycles</h3>

      {/* New Cycle Form */}
      <div className="flex flex-col gap-4 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <Label>Cycle Number</Label>
            <Input
              type="number"
              value={newCycle.cycleNumber}
              onChange={(e) =>
                setNewCycle({
                  ...newCycle,
                  cycleNumber: Number(e.target.value),
                })
              }
              placeholder="e.g., 1"
              required
            />
          </div>
          <div className="flex flex-col">
            <Label>Cycle ROI (%)</Label>
            <Input
              type="number"
              step="0.01"
              value={newCycle.cycleRoiPercent}
              onChange={(e) =>
                setNewCycle({
                  ...newCycle,
                  cycleRoiPercent: Number(e.target.value),
                })
              }
              placeholder="e.g., 9.25"
              required
            />
          </div>
          <div className="flex flex-col">
            <Label>Maturity (Months)</Label>
            <Input
              type="number"
              value={newCycle.maturityInMonths}
              onChange={(e) =>
                setNewCycle({
                  ...newCycle,
                  maturityInMonths: Number(e.target.value),
                })
              }
              placeholder="e.g., 6"
              required
            />
          </div>
        </div>

        {/* Returns Section */}
        <div className="mt-4 border-t border-gray-200 pt-4">
          <h4 className="font-medium mb-3">Returns</h4>
          <div className="flex flex-col gap-2 mb-3">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <div className="flex flex-col relative">
                <Label htmlFor="returnDate">Returns Date</Label>
                <Input
                  type="date"
                  value={newReturn.returnDate}
                  onChange={(e) =>
                    setNewReturn({ ...newReturn, returnDate: e.target.value })
                  }
                  className="flex-1"
                  required
                />
              </div>
              {/* <div className="flex flex-col relative">
                <Label htmlFor="returnDate">Returns Date</Label>
                <DatePicker
                  selected={
                    newReturn.returnDate ? new Date(newReturn.returnDate) : null
                  }
                  onChange={(date) =>
                    setNewReturn({ ...newReturn, returnDate: date })
                  }
                  id="returnDate"
                  placeholderText="Select date"
                  className="text-base bg-white w-full px-3.5 py-3 border border-[#D0D5DD] rounded-lg"
                  required
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={100}
                  showMonthDropdown
                  dropdownMode="select"
                />
                <CiCalendar className="size-6 absolute right-3.5 bottom-3 pointer-events-none" />
              </div> */}
              <div className="flex flex-col relative">
                <Label htmlFor="actualRoiPercent">ROI (%)</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="ROI %"
                  value={newReturn.actualRoiPercent}
                  onChange={(e) =>
                    setNewReturn({
                      ...newReturn,
                      actualRoiPercent: Number(e.target.value),
                    })
                  }
                  className="flex-1"
                  required
                />
              </div>
              {/* <Select
                value={newReturn.returnStatus}
                onChange={(e) =>
                  setNewReturn({ ...newReturn, returnStatus: e.target.value })
                }
                required
              >
                <option value="pending">Pending</option>
              </Select> */}
              <div className="flex flex-col relative">
                <Label htmlFor="returnStatus">Add Return </Label>
                <Button type="button" onClick={addReturn} variant="solid">
                  <AddCircle />
                </Button>
              </div>
            </div>
          </div>

          {/* Returns List */}
          <div className="flex flex-wrap gap-2">
            {newCycle.returns.map((ret, idx) => (
              <span
                key={idx}
                className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                {ret.returnDate} — {ret.actualRoiPercent}% ({ret.returnStatus})
                <button
                  type="button"
                  className="text-red-500 hover:text-red-700 cursor-pointer"
                  onClick={() => removeReturn(idx)}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>

        <Button
          type="button"
          variant="solid"
          onClick={addCycle}
          className="mt-4"
          disabled={newCycle?.returns?.length === 0}
        >
          Add Cycle <AddCircle />
        </Button>
      </div>

      {/* Existing Cycles List */}
      <div className="mt-6 flex flex-col gap-4 w-full ">
        {formData.cycles.map((cycle, idx) => (
          <div
            key={idx}
            className="bg-white justify-between border border-gray-200 rounded-xl p-5 shadow-sm"
          >
            <div className="flex justify-between items-center mb-3">
              <p className="font-medium text-lg">
                Cycle {cycle.cycleNumber} — {cycle.cycleRoiPercent}% ROI,{" "}
                {cycle.maturityInMonths} months
              </p>
              <button
                type="button"
                className="text-red-500 hover:text-red-700 cursor-pointer"
                onClick={() => removeCycle(idx)}
              >
                ✕
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {cycle.returns.map((ret, rIdx) => (
                <span
                  key={rIdx}
                  className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                >
                  {ret.returnDate} — {ret.actualRoiPercent}% ({ret.returnStatus}
                  )
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Prev / Next */}
      <div className="w-full mt-8 flex items-center justify-between">
        <Button onClick={() => setCurrentStep(2)} variant="outline">
          Prev
        </Button>
        <Button
          onClick={() => setCurrentStep(4)}
          variant="solid"
          disabled={formData?.cycles?.length === 0}
        >
          Continue
        </Button>
      </div>
    </>
  );
};

export default AddCycles;
