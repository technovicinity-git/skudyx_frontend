import { create } from "zustand";

const useUpdateFarmStore = create((set) => ({
  updateData: {
    _id: "",
    address: "",
    farm_name: "",
    farmer_id: "",
    size: "",
    type: "",
    crop_live: "",
    description: "",
    coordinates: "",
    images: [],
    files: [],
    farm_coordinates: "",
  },

  // Set initial data from backend
  setInitialData: (data) =>
    set({
      updateData: {
        _id: data._id || "",
        // Farmer details (flattened from farmer_id)
        address: data.farmer_id?.address || "",
        description: data.description || "",
        coordinates: data.coordinates || "",

        // Farm details
        farm_name: data.farm_name || "",
        size: data.size || "",
        type: data.type || "",
        crop_live: data.crop_live || "",

        // Files and images
        images: data.images || [],
        files: data.documents || [],
        farm_coordinates: data.coordinates || "",
      },
    }),

  // Update a single field
  updateField: (field, value) =>
    set((state) => ({
      updateData: { ...state.updateData, [field]: value },
    })),

  // Add file to array
  addFile: (file) =>
    set((state) => ({
      updateData: {
        ...state.updateData,
        files: [...(state.updateData.files || []), file],
      },
    })),

  // Remove file by index
  removeFile: (index) =>
    set((state) => ({
      updateData: {
        ...state.updateData,
        files: state.updateData.files.filter((_, i) => i !== index),
      },
    })),

  removeImage: (index) =>
    set((state) => ({
      updateData: {
        ...state.updateData,
        images: state.updateData.images.filter((_, i) => i !== index),
      },
    })),

  // Reset the store
  resetData: () =>
    set({
      updateData: {
        _id: "",
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
        request_details: "",
        images: [],
        files: [],
      },
    }),
}));

export default useUpdateFarmStore;
