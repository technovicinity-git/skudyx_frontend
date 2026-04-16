"use client";

import useUpdateFarmStore from "@/store/useUpdateFarmStore";
import useUpdateInvestmentPlanStore from "@/store/useUpdateInvestmentPlanStore";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";

const Header = () => {
  const router = useRouter();
  const { resetForm } = useUpdateInvestmentPlanStore();
  const { resetData } = useUpdateFarmStore();

  return (
    <header className="bg-white fixed top-0 w-full border-b border-[#D0D5DD]">
      <nav className="min-h-20 px-8 lg:px-20 py-4 flex items-center">
        <button
          onClick={() => {
            router.back();
            resetForm();
            resetData();
          }}
          className="text-[#002447] hover:bg-gray-200 font-medium px-3 py-1.5 border border-[#002447] rounded-lg flex items-center gap-2 cursor-pointer transition-colors duration-300"
        >
          <FaArrowLeft />
          <span>Back</span>
        </button>
      </nav>
    </header>
  );
};

export default Header;
