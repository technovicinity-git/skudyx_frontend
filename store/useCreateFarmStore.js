import { create } from "zustand";

const useCreateFarmStore = create((set) => ({
  formData: {
    // Required fields
    address: "",
    farm_name: "",
    size: "",
    type: "",
    crop_live: "",
    farmer_id: "",
    description: "",
    coordinates: "",

    // Files (array of strings or file URLs after upload)
    images: [],
    files: [],
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

  removeImage: (index) =>
    set((state) => ({
      formData: {
        ...state.formData,
        images: state.formData.images.filter((_, i) => i !== index),
      },
    })),

  // Reset form
  resetForm: () =>
    set({
      formData: {
        // Required fields
        address: "",
        farm_name: "",
        size: "",
        type: "",
        crop_live: "",
        farmer_id: "",
        description: "",
        coordinates: "",

        // Files (array of strings or file URLs after upload)
        images: [],
        files: [],
      },
    }),
}));

export default useCreateFarmStore;
