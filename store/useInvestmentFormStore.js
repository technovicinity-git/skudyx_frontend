import { create } from "zustand";

const useInvestmentFormStore = create((set) => ({
  formData: {
    // Step 1: Investment Overview
    name: "",
    farmType: "",
    selectedFarm: "",
    crop_types: [],
    description: "",
    location: "",
    country: "",
    activities: [],
    expected_yield:"",
    manager_name: "",
    investEndDate: null,
    endDate: null,

    // Step 2: Investment Details
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

    // Step 3: Add Cycles
    cycles: [],

    // Step 4: Add Documents
    propertyImages: [],
    propertyDocuments: [],
  },

  updateField: (field, value) =>
    set((state) => ({
      formData: { ...state.formData, [field]: value },
    })),

  updateFields: (fields) =>
    set((state) => ({
      formData: { ...state.formData, ...fields },
    })),

  // Remove file by index
  removeFile: (index) =>
    set((state) => ({
      formData: {
        ...state.formData,
        propertyDocuments: state.formData.propertyDocuments.filter(
          (_, i) => i !== index
        ),
      },
    })),

  removeImage: (index) =>
    set((state) => ({
      formData: {
        ...state.formData,
        propertyImages: state.formData.propertyImages.filter(
          (_, i) => i !== index
        ),
      },
    })),

  resetForm: () =>
    set({
      formData: {
        name: "",
        farmType: "",
        selectedFarm: "",
        description: "",
        location: "",
        manager_name: "",
        country: "",
        crop_types: [],
        activities: [],
        investEndDate: null,
        endDate: null,

        // Step 2: Investment Details
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
        // paymentFrequency: "",

        // Step 3: Add Cycles
        cycles: [],

        // Step 4: Add Documents
        propertyImages: [],
        propertyDocuments: [],
      },
    }),
}));

export default useInvestmentFormStore;
