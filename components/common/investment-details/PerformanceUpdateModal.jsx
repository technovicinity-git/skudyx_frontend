"use client";

import { RxCross2 } from "react-icons/rx";

import Button from "@/components/common/Button";
import Label from "@/components/common/Label";
import { useUpdateInvestmentPlan } from "@/hook/investmentPlan";
import { useToast } from "@/lib/Provider/toastProvider";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useState } from "react";

const PerformanceUpdateModal = ({ isOpen, onClose }) => {
  const { id } = useParams();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState(null);

  const { updateInvestmentPlan, isLoading, errorMessage } =
    useUpdateInvestmentPlan(id);

  const handleUpdate = () => {
    // append only binary images

    updateInvestmentPlan(
      { actual_yield: formData },
      {
        onSuccess: () => {
          onClose();
          showToast("Actual yield updated successfully", "success", "Success");
          queryClient.invalidateQueries({ queryKey: ["investmentPlan", id] });
        },
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-black cursor-pointer"
        >
          <RxCross2 size={22} />
        </button>

        {/* Title */}
        <div className="mb-5">
          <Label htmlFor="actual_yield">Actual Yield (tons)</Label>
          <input
            id="actual_yield"
            type="number"
            value={formData}
            onChange={(e) => setFormData(e.target.value)}
            placeholder="Enter actual yield"
            className="text-base bg-white w-full px-3.5 py-3 border border-[#D0D5DD] rounded-lg mt-1"
            required
          />
        </div>

        {errorMessage && (
          <p className=" text-red-500 p-2 bg-red-100 border border-red-400 mt-3">
            {errorMessage}
          </p>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button variant="solid" disabled={isLoading} onClick={handleUpdate}>
            {isLoading ? "Updating..." : "Update"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PerformanceUpdateModal;
