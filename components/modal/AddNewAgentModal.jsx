"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import SettingModalFooter from "./SettingModalFooter";
import Label from "../common/Label";
import Input from "../common/Input";
import {
  AddImageIcon,
  EyeCloseIcon,
  EyeOpenIcon,
} from "@/public/assets/icons/icons";
import { useToast } from "@/lib/Provider/toastProvider";
import { useCreateAgent, useUpdateAgent } from "@/hook/user";
import { useQueryClient } from "@tanstack/react-query";
import ProfileAvatar from "../common/ImageViewer/ProfileAvatar";
import Button from "../common/Button";

const AddNewAgentModal = ({
  isOpen,
  onClose,
  title = "Add New Support Agent",
  agent,
}) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    password: "",
    photo: "",
    role: "agent",
    address: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [preview, setPreview] = useState(null);
  const [changePassword, setChangePassword] = useState(false);

  const { createAgent, isLoading: isCreating, errorMessage } = useCreateAgent();
  const {
    updateAgent,
    isLoading: isUpdating,
    errorMessage: updateError,
  } = useUpdateAgent();
  const queryClient = useQueryClient();
  const initialState = {
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    password: "",
    profile_photo: "",
    role: "agent",
    address: "",
  };

  const resetForm = () => {
    setFormData(initialState);
    setPreview(null);
    setShowPassword(false);
    setChangePassword(false);
  };

  useEffect(() => {
    if (agent) {
      setFormData((prev) => ({
        ...prev,
        first_name: agent?.first_name || "",
        last_name: agent?.last_name || "",
        phone: agent?.phone || "",
        email: agent?.email || "",
        password: "",
        profile_photo: agent?.profile_photo || "",
        address: agent?.address || "",
      }));
      setPreview(agent?.profile_photo || null);
    }
  }, [agent, isOpen]);
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setFormData((prev) => ({
        ...prev,
        profile_photo: file,
      }));

      setPreview(URL.createObjectURL(file));
    }
  };

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault(); // prevent reload

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) {
        data.append(key, value);
      }
    });
    // if (formData?.photo) {
    //   data.append("photo", formData.photo);
    // }

    if (agent?.agent_id) {
      updateAgent(
        { id: agent?.agent_id, data },
        {
          onSuccess: () => {
            showToast("Agent updated successfully", "success", "Success");
            queryClient.invalidateQueries(["agents", agent?.agent_id]);
            onClose();
          },
          onError: () => {
            showToast(updateError || "Error updating agent", "error", "Error");
          },
        },
      );
    } else {
      createAgent(data, {
        onSuccess: () => {
          showToast("Agent created successfully", "success", "Success");
          queryClient.invalidateQueries(["agents"]);
          onClose();
        },
        onError: () => {
          showToast(errorMessage || "Error creating agent", "error", "Error");
        },
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full min-h-[90vh] bg-gray-100 rounded-2xl shadow-xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between bg-white px-6 py-4 border-b border-gray-200 rounded-t-2xl">
          <h2 className="text-lg sm:text-xl font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="bg-white rounded-xl shadow-sm max-w-3xl mx-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold">{title}</h3>
            </div>

            <form
              onSubmit={handleSave}
              autoComplete="off"
              className="flex flex-col gap-5 p-6"
            >
              {(updateError || errorMessage) && (
                <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg border border-red-300">
                  {updateError || errorMessage}
                </div>
              )}
              {/* Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    type="text"
                    id="first_name"
                    name="first_name"
                    placeholder="First Name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    type="text"
                    id="last_name"
                    name="last_name"
                    placeholder="Last Name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="phone-number flex flex-col">
                <Label>Phone Number</Label>
                <Input
                  type="phone"
                  id="phone"
                  name="phone"
                  placeholder="Enter Phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Email */}
              <div className="flex flex-col">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="new-email"
                />
              </div>

              {/* Address */}
              <div className="flex flex-col">
                <Label htmlFor="address">Address</Label>
                <Input
                  type="address"
                  id="address"
                  name="address"
                  placeholder="Enter address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              {agent?.agent_id && !changePassword && (
                <div className="flex flex-col relative">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setChangePassword(true)}
                  >
                    Change Password
                  </Button>
                </div>
              )}

              {/* Password */}
              {(!agent?.agent_id || changePassword) && (
                <>
                  <div className="flex flex-col relative">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      autoComplete="new-password"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="text-lg px-1 py-0.5 absolute right-2 bottom-3.5 cursor-pointer"
                    >
                      {showPassword ? EyeOpenIcon : EyeCloseIcon}
                    </button>
                  </div>
                  {/* Cancel button (right aligned) */}
                  {agent?.agent_id && (
                    <Button
                      type="button"
                      variant="danger"
                      onClick={() => setChangePassword(false)}
                      className="text-lg px-1 cursor-pointer"
                    >
                      Cancel Password Update
                    </Button>
                  )}
                </>
              )}
              <div className="flex flex-col">
                <Label>Profile Photo</Label>

                <div className="flex items-center gap-4">
                  {/* Preview */}
                  <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-300 bg-gray-100 flex items-center justify-center">
                    {preview ? (
                      <div>
                        <ProfileAvatar src={preview} size={80} />
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">No Image</span>
                    )}
                  </div>
                  {/* {preview && (
                    <button
                      type="button"
                      onClick={() => {
                        setPreview(null);
                        setFormData((prev) => ({ ...prev, photo: "" }));
                      }}
                      className="text-xs text-red-500 mt-2 hover:underline"
                    >
                      Remove Photo
                    </button>
                  )} */}

                  {/* Upload Button */}
                  <label className="cursor-pointer px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition text-sm font-medium">
                    {AddImageIcon}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <SettingModalFooter
          onCancel={onClose}
          onSave={handleSave}
          isLoading={isUpdating || isCreating}
        />
      </div>
    </div>
  );
};

export default AddNewAgentModal;
