"use client";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Label from "@/components/common/Label";
import Loader from "@/components/loader/Loader";
import { useGetMyProfile, useUpdateUser } from "@/hook/user";
import { useToast } from "@/lib/Provider/toastProvider";
import { ChatIcon } from "@/public/assets/icons/icons";
import { formatDate } from "@/utils/formatDate";
import { resizeImageToDataUrl } from "@/utils/resizeImageToDataUrl";
import { DeleteForever } from "@mui/icons-material";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Pencil, Camera } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const MAX_AVATAR_SIZE = 2 * 1024 * 1024;

const AccountInformation = () => {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { profile, isLoading: isProfileLoading } = useGetMyProfile();
  const { updateUser, isLoading, errorMessage } = useUpdateUser();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile || {});
  const [password, setPassword] = useState("");
  const [showPassword1, setShowPassword1] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Avatar related
  // const [selectedFile, setSelectedFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarError, setAvatarError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef();

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name,
        last_name: profile.last_name,
        password: profile.password,
        image: profile.image || null,
      });
      // initial avatar preview uses profile.avatar if available
      setAvatarPreview(profile.image || null);
    }
  }, [profile, isEditing]);

  const handleBack = () => {
    router.back();
  };

  const handleHelpSupport = () => {
    router.push("/investor/settings/support");
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validatePassword = (value) => {
    const regex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!regex.test(value)) {
      setPasswordError(
        "Password must be at least 8 characters and include 1 special character."
      );
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleFile = async (file) => {
    setAvatarError("");
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setAvatarError("Please select an image file.");
      return;
    }
    if (file.size > MAX_AVATAR_SIZE) {
      // try to still resize, but warn user
      showToast(
        "Selected image is large — it will be resized.",
        "info",
        "Note"
      );
    }

    try {
      const dataUrl = await resizeImageToDataUrl(file, 250);
      // setSelectedFile(file);
      setAvatarPreview(dataUrl);

      handleChange("image", dataUrl);
    } catch (err) {
      console.error(err);
      setAvatarError("Failed to process image. Try a different file.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    handleFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0] ?? null;
    handleFile(file);
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveAvatar = () => {
    // setSelectedFile(null);
    setAvatarPreview(null);
    handleChange("image", null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Optional: validate password before submit
    if (formData.password && !validatePassword(formData.password)) return;

    // If your backend expects a base64 string this will work. If it expects multipart
    // or a pre-signed upload URL, adapt this block to upload the file separately.
    try {
      updateUser(
        { id: profile?._id, data: formData },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["myProfile"] });
            showToast("Updated successfully", "success", "Success");
            setIsEditing(false);
          },
          onError: () => {
            showToast(errorMessage, "error", "Failed");
          },
        }
      );
    } catch (err) {
      console.error(err);
      showToast("An unexpected error occurred", "error", "Error");
    }
  };

  if (isProfileLoading) {
    return <Loader fullScreen />;
  }

  return (
    <div>
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full mb-6 hover:bg-gray-200 transition-colors"
        aria-label="Go back"
      >
        <ArrowLeft size={20} className="text-gray-600" />
      </button>

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-semibold text-[#222222] mb-2">
            Account Information
          </h1>
          <p className="text-gray-600 text-base">
            Details about your personal information
          </p>
        </div>
        {!isEditing && (
          <Button
            variant="outline"
            className="flex items-center gap-2 text-gray-700 border-gray-300 hover:bg-gray-100"
            onClick={() => setIsEditing(true)}
          >
            <Pencil size={16} /> Edit
          </Button>
        )}
      </div>

      {/* Account Details Card */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm max-w-2xl">
        <form onSubmit={handleSubmit}>
          {/* Avatar + Name Row */}
          <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:gap-6">
            <div className="flex-shrink-0 mb-4 md:mb-0">
              <div
                onDrop={handleDrop}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                className={`relative w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-2 ${
                  isDragging ? "border-blue-400 bg-blue-50" : "border-gray-100"
                } shadow-sm ring-1 ring-gray-100`}
                aria-label="Profile picture area — drag and drop an image or use edit button"
              >
                {/* avatar image or initials placeholder */}
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt={`${profile?.first_name ?? "User"} avatar"`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-500 font-semibold">
                    {profile?.first_name ? (
                      <span className="text-6xl">
                        {(profile.first_name[0] ?? "").toUpperCase()}
                        {(profile.last_name[0] ?? "").toUpperCase()}
                      </span>
                    ) : (
                      <Camera size={28} />
                    )}
                  </div>
                )}

                {/* hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                  aria-hidden={false}
                />
              </div>

              {/* small controls under avatar when editing */}
              {isEditing && (
                <div className="mt-3 flex items-center gap-2 justify-center">
                  <Button
                    type="button"
                    onClick={openFilePicker}
                    variant="outline"
                    className="text-sm"
                  >
                    <Camera size={28} />
                  </Button>
                  <Button
                    type="button"
                    onClick={handleRemoveAvatar}
                    variant="danger"
                    className="text-sm"
                  >
                    <DeleteForever size={28} />
                  </Button>
                </div>
              )}

              {avatarError && (
                <p className="text-sm text-red-500 mt-2">{avatarError}</p>
              )}
            </div>

            {/* Name + meta */}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base text-[#222222] font-semibold">
                    {profile?.first_name} {profile?.last_name}
                  </p>
                  <p className="text-sm text-gray-500">{profile?.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Joined</p>
                  <p className="text-sm font-medium text-[#222222]">
                    {formatDate(profile?.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="space-y-6">
              {/* Name */}
              <div className="flex items-start gap-5 justify-between">
                <Label>{isEditing ? "First Name" : "Name"}</Label>
                {isEditing ? (
                  <Input
                    value={formData.first_name || ""}
                    onChange={(e) => handleChange("first_name", e.target.value)}
                  />
                ) : (
                  <p className="text-base text-[#222222] font-semibold">
                    {profile?.first_name} {profile?.last_name}
                  </p>
                )}
              </div>

              {isEditing ? (
                <div className="flex items-start gap-5 justify-between">
                  <Label>Last Name</Label>

                  <Input
                    value={formData.last_name || ""}
                    onChange={(e) => handleChange("last_name", e.target.value)}
                  />
                </div>
              ) : (
                <></>
              )}

              {/* Email */}
              <div className="flex items-start gap-5 justify-between">
                <Label>Email address</Label>

                <p className="text-base text-[#222222] font-semibold">
                  {profile?.email}
                </p>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-5 justify-between">
                <Label>Phone number</Label>

                <p className="text-base text-[#222222] font-semibold">
                  {profile?.phone_number}
                </p>
              </div>

              {/* Role / Account type (not editable) */}
              <div className="flex items-start gap-5 justify-between">
                <Label>Account type</Label>
                <p className="text-base text-[#222222] font-semibold">
                  {profile?.role}
                </p>
              </div>

              {/* DOB */}
              <div className="flex items-start gap-5 justify-between">
                <Label>Date of Birth</Label>

                <p className="text-base text-[#222222] font-semibold">
                  {formatDate(profile?.birth_date)}
                </p>
              </div>

              {/* password */}
              {isEditing ? (
                <>
                  <div className="flex items-start gap-5 justify-between relative">
                    <Label htmlFor="password">Enter Password</Label>
                    <Input
                      type={showPassword1 ? "text" : "password"}
                      id="password"
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        validatePassword(e.target.value);
                        handleChange("password", e.target.value);
                      }}
                      className={passwordError ? "border-red-500 pr-2" : "pr-2"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword1(!showPassword1)}
                      className="text-lg px-1 py-0.5 absolute right-2 bottom-3.5 cursor-pointer"
                      aria-label={
                        showPassword1 ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword1 ? <FaRegEye /> : <FaRegEyeSlash />}
                    </button>
                  </div>

                  {passwordError && (
                    <p className="text-xs text-red-500 mt-1">{passwordError}</p>
                  )}
                </>
              ) : (
                <></>
              )}
            </div>
          </div>

          {errorMessage && (
            <p className="text-red-500 p-2 bg-red-100 border border-red-400">
              {errorMessage}
            </p>
          )}

          {/* Edit Action Buttons */}
          {isEditing && (
            <div className="p-6 flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                className="border-gray-300 text-gray-700"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="solid" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </form>

        {/* Help and Support Section */}
        {!isEditing && (
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#222222] font-bold">
                  Need help updating information?
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleHelpSupport}
                className="flex items-center gap-2 !font-normal bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200"
              >
                {ChatIcon}
                Help and support
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountInformation;
