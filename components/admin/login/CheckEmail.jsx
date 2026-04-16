"use client";

import { useRef } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Image from "next/image";
import { useOTPVerification, useResendOTP } from "@/hook/auth";

const CheckEmail = ({ setCurrentStep, userEmail, setOtp }) => {
  const inputRefs = useRef([]);

  const { verifyOTP, isLoading, error } = useOTPVerification({
    onSuccess: () => setCurrentStep("set-new-password"),
  });

  const { resendOtp, isLoading: isResending } = useResendOTP({
    onSuccess: () => alert("OTP resent successfully!"),
    onError: () => alert("Failed to resend OTP"),
  });

  const handleInput = (e, index) => {
    const { value } = e.target;

    if (value.length > 1) {
      e.target.value = value[0];
    }

    if (value === " ") {
      e.target.value = "";
    }

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (
      (e.key === "Tab" || e.key === " ") &&
      index < inputRefs.current.length - 1
    ) {
      e.preventDefault();
      inputRefs.current[index + 1].focus();
    } else if (e.key === "ArrowRight" && index < inputRefs.current.length - 1) {
      e.preventDefault();
      inputRefs.current[index + 1].focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1].focus();
    } else if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleResend = () => {
    resendOtp({ email: userEmail });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const otp = inputRefs.current.map((input) => input.value).join("");
    if (otp.length < 6) {
      alert("Please enter a complete OTP.");
      return;
    }
    setOtp(otp);
    verifyOTP({ email: userEmail, otp });
  };

  return (
    <>
      {/* Icon */}
      <div className="mb-6">
        <Image
          src="/assets/icons/check-email.png"
          alt="img"
          width={60}
          height={60}
          className="size-[60px] mx-auto"
        />
      </div>

      {/* Form Heading */}
      <div className="w-full mb-8">
        <h2 className="text-center text-black text-2xl sm:text-3xl font-bold mb-2">
          Check your email
        </h2>
        <p className="text-center text-[#314158]">
          We sent a verification code to {userEmail || "your email"}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Enter Code */}
        <div className="flex justify-center items-center gap-2 sm:gap-3 overflow-x-auto scrollbar-hide">
          {Array.from({ length: 7 }).map((_, idx) =>
            idx === 3 ? (
              <span
                key={idx}
                className="text-xl font-medium text-center flex justify-center items-center"
              >
                -
              </span>
            ) : (
              <Input
                key={idx}
                type="text"
                maxLength={1}
                onChange={(e) => handleInput(e, idx < 3 ? idx : idx - 1)}
                onKeyDown={(e) => handleKeyDown(e, idx < 3 ? idx : idx - 1)}
                ref={(el) => (inputRefs.current[idx < 3 ? idx : idx - 1] = el)}
                className="w-8 sm:w-12 sm:!text-xl !font-medium !px-2 !py-2 sm:px-3.5 sm:!py-3 text-center"
              />
            ),
          )}
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-sm text-center mt-2">
            {error?.response?.data?.message}
          </p>
        )}

        {/* Submit Button */}
        <Button
          variant="solid"
          type="submit"
          className="mt-1"
          disabled={isLoading}
        >
          {isLoading ? "Verifying..." : "Verify"}
        </Button>
      </form>

      <p className="text-sm text-[#475467] text-center mt-8">
        Didn&apos;t receive the email?{" "}
        <span
          onClick={() => handleResend()}
          className="font-semibold text-primary-1 hover:underline cursor-pointer"
        >
          {isResending ? "Resending..." : "Resend OTP"}
        </span>
      </p>

      <button
        onClick={() => setCurrentStep("welcome-login")}
        className="text-[#475467] hover:text-primary-1 text-sm font-semibold cursor-pointer w-fit mt-8 mx-auto flex items-center gap-2"
      >
        <FaArrowLeft className="text-base" />
        <span>Back to log in</span>
      </button>
    </>
  );
};

export default CheckEmail;
