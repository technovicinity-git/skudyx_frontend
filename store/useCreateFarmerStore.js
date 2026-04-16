import { create } from "zustand";

const useCreateFarmerStore = create((set) => ({
  formData: {
    // Required fields
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    address: "",

    // Optional fields (empty by default)
    level_of_experience: "",
    age_range: "",
    level_of_education: "",
    birth_date: null,
    gender: "",
    type: "",
    business_name: "",
    business_reg_number: "",
    trade_license: null,
    identity_document: null,
    request_details: "",
  },

  // Update a single field
  updateField: (field, value) =>
    set((state) => ({
      formData: { ...state.formData, [field]: value },
    })),

  // Add a file to files array
  addFile: (file) =>
    set((state) => ({
      formData: {
        ...state.formData,
        files: [...state.formData.files, file],
      },
    })),

  // Remove a file by index
  removeFile: (index) =>
    set((state) => ({
      formData: {
        ...state.formData,
        files: state.formData.files.filter((_, i) => i !== index),
      },
    })),

  // Reset form
  resetForm: () =>
    set({
      formData: {
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        address: "",
        farm_name: "",
        size: "",
        type: "",
        crop_live: "",
        level_of_experience: "",
        age_range: "",
        level_of_education: "",
        gender: "",
        business_name: "",
        business_reg_number: "",
        trade_license: null,
        identity_document: null,
        request_details: "",
        files: [],
      },
    }),
}));

export default useCreateFarmerStore;
