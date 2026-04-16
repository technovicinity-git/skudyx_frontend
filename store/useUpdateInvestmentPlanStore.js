import { create } from "zustand";

const initialUpdateData = {
  _id: "",
  name: "",
  farmType: "",
  selectedFarm: "",
  description: "",
  country: "",
  location: "",
  manager_name: "",
  investEndDate: null,
  endDate: null,
  startDate: null,
  matureDate: null,
  type: "",
  duration_type: "",
  duration: "",
  number_of_slots: "",
  slot_price: "",
  max_slot: "",
  min_slot: "",
  roi: "",
  discount_percent: "",
  slots_for_discount: "",
  riskLevel: "",
  referral_bonus: "",
  premium_fees: "",
  cycles: [],
  propertyImages: [],
  propertyDocuments: [],
};

const useUpdateInvestmentPlanStore = create((set) => ({
  updateData: { ...initialUpdateData },

  updateField: (field, value) =>
    set((state) => ({
      updateData: { ...state.updateData, [field]: value },
    })),

  updateFields: (fields) =>
    set((state) => ({
      updateData: { ...state.updateData, ...fields },
    })),

  setInitialData: (plan) =>
    set(() => {
      if (!plan || typeof plan !== "object") {
        return { updateData: { ...initialUpdateData } };
      }

      return {
        updateData: {
          ...initialUpdateData,
          ...plan,
          farmType: plan.farmType || "",
          country: plan.country || "",
          startDate: plan.startDate ? new Date(plan.startDate) : null,
          matureDate: plan.matureDate ? new Date(plan.matureDate) : null,
          investEndDate: plan.investEndDate
            ? new Date(plan.investEndDate)
            : null,
          endDate: plan.endDate ? new Date(plan.endDate) : null,
          propertyImages: Array.isArray(plan.propertyImages)
            ? plan.propertyImages
            : [],
          propertyDocuments: Array.isArray(plan.propertyDocuments)
            ? plan.propertyDocuments
            : [],
        },
      };
    }),

  resetForm: () => set({ updateData: { initialUpdateData } }),
}));

export default useUpdateInvestmentPlanStore;
