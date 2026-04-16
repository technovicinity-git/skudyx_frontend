"use client";

import Input from "@/components/common/Input";
import Label from "@/components/common/Label";
import Button from "@/components/common/Button";
import Image from "next/image";
import { useForgotPassword } from "@/hook/auth";

const ForgotPassword = ({ setCurrentStep, setUserEmail }) => {
  const { forgotPassword, isLoading, error } = useForgotPassword({
    onSuccess: () => {
      setCurrentStep("check-email");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");
    setUserEmail(email);
    forgotPassword({ email });
  };

  return (
    <>
      {/* Icon */}
      <div className="flex items-center justify-center my-4">
        <Image
          src="/assets/images/logo-small.png"
          alt="SkudyX Logo"
          width={250}
          height={50}
          className="mb-4"
        />
      </div>

      {/* Form Heading */}
      <div className="w-full mb-8">
        <h2 className="text-center text-black text-2xl sm:text-3xl font-bold mb-2">
          Forgot password
        </h2>
        <p className="text-center text-[#314158] text-sm">
          Enter your email address to reset password
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Email */}
        <div className="flex flex-col">
          <Label htmlFor="email">Email Address</Label>
          <Input
            type="email"
            id="email"
            name="email"
            placeholder="Enter email address"
          />
        </div>
        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-sm text-center mt-2">
            {error.response?.data?.message ||
              "An error occurred, please try again."}
          </p>
        )}

        {/* Submit Button */}
        <Button
          variant="solid"
          type="submit"
          className="mt-1"
          disabled={isLoading}
        >
          {isLoading ? "Submitting..." : "Reset Password"}
        </Button>
      </form>
    </>
  );
};

export default ForgotPassword;
