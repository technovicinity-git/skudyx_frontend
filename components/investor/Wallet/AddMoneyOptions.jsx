import Image from "next/image";
import React, { useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import AddMoneyModal from "./AddMoneyModal";
import BankTransferModal from "./BankTransferModal";

const AddMoneyOptions = () => {
  const [open, setOpen] = useState(false);
  const [bankTransferOpen, setBankTransferOpen] = useState(false);
  return (
    <div>
      <div className="mt-6 z-20">
        <ul className="space-y-5">
          <li
            onClick={() => setBankTransferOpen(true)}
            className="hover:bg-gray-50 p-2 transition-colors duration-300 flex justify-between items-center gap-3 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="bg-[#F0FDF4] p-2 rounded-lg">
                <Image
                  src="/assets/icons/bank.png"
                  alt="i"
                  width={24}
                  height={24}
                  className="size-6 aspect-square object-contain"
                />
              </div>
              <p className="font-medium">Bank Transfer</p>
            </div>

            <IoIosArrowForward className="text-xl" />
          </li>

          <li
            onClick={() => setOpen((prev) => !prev)}
            className="hover:bg-gray-50 p-2 transition-colors duration-300 flex justify-between items-center gap-3 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="bg-[#F0FDF4] p-2 rounded-lg">
                <Image
                  src="/assets/icons/debitCredit-card.png"
                  alt="i"
                  width={24}
                  height={24}
                  className="size-6 aspect-square object-contain"
                />
              </div>
              <p className="font-medium">Debit/credit cards</p>
            </div>

            <IoIosArrowForward className="text-xl" />
          </li>
        </ul>
      </div>
      <AddMoneyModal open={open} onClose={() => setOpen(false)} />

      <BankTransferModal
        open={bankTransferOpen}
        onClose={() => setBankTransferOpen(false)}
      />
    </div>
  );
};

export default AddMoneyOptions;
