import Image from "next/image";
import Link from "next/link";

const Sidebar = ({ currentStep, setCurrentStep }) => {
  return (
    <aside className="bg-[#BECFE733] p-12 hidden lg:block">
      {/* Logo */}
      <Link href="/" className="mb-20 inline-block">
        <Image
          src="/assets/images/logo.webp"
          alt="greenwealth"
          width={193}
          height={32}
          className="w-[193px] aspect-auto object-contain"
        />
      </Link>

      <ul className="flex flex-col gap-1">
        <li
          className="text-[#1B1C1E] flex items-center gap-3 cursor-pointer"
          onClick={() => setCurrentStep(1)}
        >
          <div
            className={`border border-primary-1 p-3 rounded-[10px] flex justify-center items-center ${
              currentStep === 1 ? "bg-white" : "bg-primary-1"
            }`}
          >
            <Image
              src={
                currentStep === 1
                  ? "/assets/icons/user-account-2.png"
                  : "/assets/icons/user-account-3.png"
              }
              alt="user-id"
              width={24}
              height={24}
              className="size-6"
            />
          </div>
          <div>
            <p className="text-2xl font-semibold">Documents</p>
            <p className="text-sm">Upload your Documents</p>
          </div>
        </li>

        <li>
          <div className="h-[26px] w-0.5 bg-[#EAECF0] rounded-xs ms-6"></div>
        </li>

        <li
          className={`${
            currentStep === 2 ? "text-[#45556C]" : "text-[#1B1C1E]"
          }  flex items-center gap-3 cursor-pointer`}
          onClick={() => setCurrentStep(2)}
        >
          <div
            className={`border p-3 rounded-[10px] flex justify-center items-center ${
              currentStep === 1
                ? "border-[#B7B8B9] bg-white"
                : currentStep <= 2
                ? "border-primary-1 bg-white"
                : "border-primary-1 bg-primary-1"
            }`}
          >
            <Image
              src={
                currentStep === 1
                  ? "/assets/icons/user-selfie.png"
                  : currentStep <= 2
                  ? "/assets/icons/user-selfie-2.png"
                  : "/assets/icons/user-selfie-3.png"
              }
              alt="user-id"
              width={24}
              height={24}
              className="size-6"
            />
          </div>
          <div>
            <p className="text-2xl font-semibold">Photo</p>
            <p className="text-sm">Upload your photo</p>
          </div>
        </li>

        <li>
          <div className="h-[26px] w-0.5 bg-[#EAECF0] rounded-xs ms-6"></div>
        </li>

        <li
          className={`${
            currentStep <= 3 ? "text-[#45556C]" : "text-[#1B1C1E]"
          } flex items-center gap-3 cursor-pointer`}
          onClick={() => setCurrentStep(3)}
        >
          <div
            className={`bg-white border p-3 rounded-[10px] flex justify-center items-center ${
              currentStep <= 3 ? "border-[#B7B8B9]" : "border-primary-1"
            }`}
          >
            <Image
              src={
                currentStep <= 3
                  ? "/assets/icons/user-location.png"
                  : "/assets/icons/user-location-2.png"
              }
              alt="user-id"
              width={24}
              height={24}
              className="size-6"
            />
          </div>
          <div>
            <p className="text-2xl font-semibold">Address</p>
            <p className="text-sm">Confirm you address</p>
          </div>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
