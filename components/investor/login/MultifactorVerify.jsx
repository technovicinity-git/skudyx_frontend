/* eslint-disable no-undef */
"use client";

import { useRef } from "react";
import Image from "next/image";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { useMultiFactorVerify } from "@/hook/auth";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const MultifactorVerify = ({ userEmail }) => {
  const inputRefs = useRef([]);
  const router = useRouter();

  const { verifyMultiFactor, isLoading, errorMessage } = useMultiFactorVerify();

  // Handle Code Email
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

  // Handle switch input fields
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

  // Handle form Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const code = inputRefs.current.map((input) => input.value).join("");
    verifyMultiFactor(
      { email: userEmail, token: code },
      {
        onSuccess: () => {
          router.push("/investor");
          Cookies.set("multifactorVerification", true, {
            path: "/",
            maxAge: process.env.NEXT_PUBLIC_COOKIE_MAX_AGE || 86400,
          });
        },
        onError: (error) => {
          console.error("Verification failed:", error);
        },
      }
    );
  };

  return (
    <div className="max-w-md mx-auto mt-30">
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
          Check your Google Authenticator App
        </h2>
        <p className="text-center text-[#314158]">
          Multifactor authentication is enabled on your account.
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
            )
          )}
        </div>

        {/* Error Message */}
        {errorMessage && (
          <p className="text-red-500 p-2 bg-red-100 border border-red-400 text-center mt-2">
            {errorMessage}
          </p>
        )}

        {/* Submit Button */}
        <Button
          variant="solid"
          type="submit"
          className="mt-1"
          disabled={isLoading}
        >
          {isLoading ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </div>
  );
};

export default MultifactorVerify;
