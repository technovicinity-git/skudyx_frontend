import Button from "@/components/common/Button";
import { useSendOtpToPhone } from "@/hook/auth";
import { useToast } from "@/lib/Provider/toastProvider";
import Image from "next/image";

const Success = ({ setCurrentStep, email, phone }) => {
  const { showToast } = useToast();
  const { sendOtpToPhone, isLoading } = useSendOtpToPhone();
  const handleVerifyPhone = () => {
    sendOtpToPhone(
      { email, phone_number: phone },
      {
        onSuccess: () => {
          showToast("OTP sent to your phone", "success", "Success");
          setCurrentStep("verify-phone");
        },
        onError: () => {
          showToast("Error sending OTP in phone", "error", "Error");
        },
      }
    );
  };
  return (
    <>
      {/* Icon */}
      <div className="mb-6">
        <Image
          src="/assets/icons/success.png"
          alt="img"
          width={60}
          height={60}
          className="size-[60px] mx-auto"
        />
      </div>

      {/* Form Heading */}
      <div className="w-full mb-8">
        <h2 className="text-center text-black text-3xl font-bold mb-3">
          Success
        </h2>
        <p className="text-center text-[#314158] text-sm">
          Your email has been verified
        </p>
      </div>

      {/* Submit Button */}
      <Button
        onClick={handleVerifyPhone}
        variant="solid"
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? "Wait..." : "Verify phone number"}
      </Button>
    </>
  );
};

export default Success;
