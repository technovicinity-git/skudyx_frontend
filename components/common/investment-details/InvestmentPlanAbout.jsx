"use client";

import {
  useCreateInvestmentPlanAbout,
  useGetInvestmentPlanAbout,
  useUpdateInvestmentPlanAbout,
} from "@/hook/investmentPlan";
import { useToast } from "@/lib/Provider/toastProvider";
import { useQueryClient } from "@tanstack/react-query";
import { Check, Pencil, Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import Button from "../Button";

const InvestmentPlanAbout = ({ role }) => {
  const { id } = useParams();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  // Hooks
  const { createInvestmentPlanAbout, isLoading: isCreating } =
    useCreateInvestmentPlanAbout();
  const { investmentPlanAbout, isLoading: isFetching } =
    useGetInvestmentPlanAbout(id);
  const { updateInvestmentPlanAbout, isLoading: isUpdating } =
    useUpdateInvestmentPlanAbout();

  // UI states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formActivities, setFormActivities] = useState([]);

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      planId: id,
      activities: formActivities,
    };
    if (investmentPlanAbout?.length > 0) {
      updateInvestmentPlanAbout(
        { id, data },
        {
          onSuccess: () => {
            setIsFormOpen(false);
            showToast("Updated successfully", "success", "Success");
            queryClient.invalidateQueries({
              queryKey: ["investmentPlanAbout", id],
            });
          },
        }
      );
    } else {
      createInvestmentPlanAbout(data, {
        onSuccess: () => {
          setIsFormOpen(false);
          showToast("Created successfully", "success", "Success");
          queryClient.invalidateQueries({
            queryKey: ["investmentPlanAbout", id],
          });
        },
      });
    }
  };

  // Open form with existing data
  const handleEdit = () => {
    setFormActivities(investmentPlanAbout?.[0]?.activities || []);
    setIsFormOpen(true);
  };

  // Add new activity input
  const addActivity = () =>
    setFormActivities([...formActivities, { title: "" }]);

  // Update activity title
  const updateActivity = (index, value) => {
    const updated = [...formActivities];
    updated[index].title = value;
    setFormActivities(updated);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 xl:p-6 border border-[#D0D5DD]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-semibold text-secondary">Why Invest?</h3>
        {role === "admin" && (
          <div>
            {investmentPlanAbout?.length > 0 ? (
              <Button
                onClick={handleEdit}
                className="flex items-center gap-1 text-primary-1 hover:underline"
              >
                <Pencil size={16} /> Edit
              </Button>
            ) : (
              <Button onClick={() => setIsFormOpen(true)} variant="solid">
                <Plus size={16} /> Create Plan About
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Data View */}
      {investmentPlanAbout?.length > 0 ? (
        <div className="space-y-4">
          {investmentPlanAbout?.[0]?.activities?.map((activity, idx) => (
            <div className="flex items-start gap-3" key={idx}>
              <div className="w-5 h-5 bg-primary-1 rounded flex items-center justify-center mt-0.5">
                <Check size={14} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-800">{activity.title}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !isFetching && (
          <p className="text-sm text-gray-500">No plan about created yet.</p>
        )
      )}

      {/* Modal Form */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg max-h-[90vh] p-6 overflow-auto">
            <h3 className="text-lg font-semibold mb-4">
              {investmentPlanAbout ? `Add "Why invest?"` : `Add "Why invest?"`}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {formActivities.map((activity, index) => (
                <input
                  key={index}
                  type="text"
                  value={activity.title}
                  onChange={(e) => updateActivity(index, e.target.value)}
                  placeholder="Enter title"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-1"
                />
              ))}

              <Button type="button" onClick={addActivity} variant="outline">
                + Add Title
              </Button>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  variant="solid"
                >
                  {isCreating || isUpdating ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestmentPlanAbout;
