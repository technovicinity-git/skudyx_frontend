"use client";

import Input from "@/components/common/Input";
import Label from "@/components/common/Label";
import Button from "@/components/common/Button";
import Image from "next/image";
import { useResetPassword } from "@/hook/auth";

const SetPassword = ({ setCurrentStep, userEmail, otp }) => {
  const { resetPassword, isLoading, error } = useResetPassword({
    onSuccess: () => setCurrentStep("success"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newPassword = formData.get("password");
    const confirmPassword = formData.get("confirm-password");

    resetPassword({
      email: userEmail,
      otp,
      password: newPassword,
      confirmPassword,
    });
  };

  return (
    <>
      {/* Icon */}
      <div className="mb-6">
        <Image
          src="/assets/icons/reset-password.png"
          alt="img"
          width={60}
          height={60}
          className="size-[60px] mx-auto"
        />
      </div>

      {/* Form Heading */}
      <div className="w-full mb-8">
        <h2 className="text-center text-black text-2xl sm:text-3xl font-bold mb-2">
          Set new password
        </h2>
        <p className="text-center text-[#314158] text-sm">
          Your new password must be different to previously used passwords.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* password */}
        <div className="flex flex-col">
          <Label htmlFor="password">Enter New Password</Label>
          <Input
            type="password"
            id="password"
            name="password"
            placeholder="Enter New Password"
          />
        </div>

        {/* confirm password */}
        <div className="flex flex-col">
          <Label htmlFor="confirm-password">Confirm New Password</Label>
          <Input
            type="password"
            id="confirm-password"
            name="confirm-password"
            placeholder="Confirm New Password"
          />
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-sm text-center mt-2">
            {error?.response?.data?.message}
          </p>
        )}

        {/* Submit Button */}
        <Button variant="solid" type="submit" className="mt-1">
          {isLoading ? "Setting Password..." : "Reset Password"}
        </Button>
      </form>
    </>
  );
};

export default SetPassword;
