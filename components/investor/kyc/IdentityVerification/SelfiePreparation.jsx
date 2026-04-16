import Button from "@/components/common/Button";
import Image from "next/image";

const SelfiePreparation = ({ setCurrentStep }) => {
  return (
    <div className="w-full">
      <Image
        src="/assets/icons/selfie-icon.png"
        alt="img"
        width={48}
        height={48}
        className="size-12 rounded-full mb-6"
      />
      <h2 className="text-[#101828] text-2xl font-semibold mb-2">
        Take a Selfie
      </h2>
      <p className="text-[#57585B] mb-8">
        To verify your profile, please take a clear selfie. This helps us
        confirm your identity and keep your account secure.
      </p>

      <p className="font-semibold text-black mb-4">Make sure:</p>
      <ul className="list-disc relative left-7 font-medium text-[#1B1C1E] space-y-1 pb-36">
        <li>Your face is clearly visible</li>
        <li>You&apos;re in good lighting</li>
        <li>No hats, masks, or filters</li>
      </ul>

      {/* Next Button */}
      <Button
        variant="solid"
        onClick={() => setCurrentStep(3)}
        className={`w-full mt-6`}
      >
        Next
      </Button>
    </div>
  );
};

export default SelfiePreparation;
