import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { useOTPVerification, useSendOtpToPhone } from "@/hook/auth";
import { useToast } from "@/lib/Provider/toastProvider";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

const VerifyPhone = ({ userPhone, userEmail }) => {
  const inputRefs = useRef([]);
  const { showToast } = useToast();
  const router = useRouter();
  const [error, setError] = useState(null);

  const { verifyOTP, isLoading, errorMessage } = useOTPVerification({
    onSuccess: () => {
      showToast("OTP verified successfully", "success", "Success");
      router.push("/investor/login");
    },
    onError: () => {
      showToast(errorMessage || "Failed to verify OTP", "error", "Error");
      setError(errorMessage);
    },
  });
  const {
    sendOtpToPhone,
    isLoading: isLoadingResend,
    errorMessage: errorMessageResend,
  } = useSendOtpToPhone();

  // Handle Code
  const handleInput = (e, index) => {
    const { value } = e.target;

    if (value.length > 1) {
      e.target.value = value[0]; // Only keep the first digit
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
    verifyOTP({ email: userEmail, phone_number: userPhone, otp: code });
  };

  const handleResend = () => {
    sendOtpToPhone(
      { email: userEmail, phone_number: userPhone },
      {
        onSuccess: () => {
          showToast("OTP sent to your phone", "success", "Success");
        },
        onError: () => {
          showToast(
            errorMessageResend || "Error sending OTP to phone",
            "error",
            "Error"
          );
          setError(errorMessageResend);
        },
      }
    );
  };

  return (
    <>
      {/* Icon */}
      <div className="mb-6">
        <Image
          src="/assets/icons/phone-call.png"
          alt="img"
          width={60}
          height={60}
          className="size-[60px] mx-auto"
        />
      </div>

      {/* Form Heading */}
      <h2 className="text-[#101828] text-2xl font-semibold max-w-[248px] mt-6 mb-8 mx-auto">
        Check your phone for a 6-digit code
      </h2>

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

        {error && (
          <p className="text-red-500 p-2 bg-red-100 border border-red-400 text-center mt-2">
            {error}
          </p>
        )}

        {/* Submit Button */}
        <Button
          variant="solid"
          type="submit"
          className="mt-1"
          disabled={isLoading}
        >
          {isLoading ? "Verifying..." : "Verify Phone"}
        </Button>
      </form>

      <p className="text-sm text-[#475467] text-center mt-8">
        Didn&apos;t receive the code?{" "}
        <span
          className="font-semibold text-primary-1 hover:underline cursor-pointer"
          onClick={handleResend}
        >
          {isLoadingResend ? "Resending..." : "Resend Code"}
        </span>
      </p>
    </>
  );
};

export default VerifyPhone;
