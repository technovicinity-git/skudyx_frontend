import Button from "@/components/common/Button";
import Image from "next/image";

const Success = ({ setCurrentStep }) => {
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
          Your password has been reset
        </p>
      </div>

      {/* Submit Button */}
      <Button
        onClick={() => setCurrentStep("welcome-login")}
        variant="solid"
        type="submit"
        className="w-full"
      >
        Login
      </Button>
    </>
  );
};

export default Success;
