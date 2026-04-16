import { create } from "zustand";

const useUpdateActivitiesStore = create((set) => ({
  formData: {
    title: "",
    index: null,
    plan_id: "",
    date: null,

    // Files (array of strings or file URLs after upload)
    images: [],
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

        title: "",
        index: null,
        plan_id: "",
        date: null,

        
        images: [],
      },
    }),
}));

export default useUpdateActivitiesStore;
