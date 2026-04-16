'use client';

import Image from 'next/image';
import { IoIosArrowForward } from 'react-icons/io';
import { RxCross2 } from 'react-icons/rx';

const FundWalletModal = ({ setShowModal, setCurrentModal }) => {
  return (
    <div className="bg-white shadow-md w-[95%] max-w-[640px] p-6 rounded-lg">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h4 className="text-[#101828] text-2xl font-semibold">Fund Wallet</h4>
        <button
          onClick={() => setShowModal(false)}
          className="text-2xl bg-[#0000000D] p-2 rounded-lg cursor-pointer"
        >
          <RxCross2 />
        </button>
      </div>

      <ul className="space-y-3">
        <li
          onClick={() => setCurrentModal('bank')}
          className="hover:bg-gray-50 py-2 transition-colors duration-300 flex justify-between items-center gap-3 cursor-pointer"
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
            <div>
              <p className="font-medium">Bank Transfer</p>
              <p className="text-xs text-[#45556C] mt-1">
                Transfer to your virtual bank account
              </p>
            </div>
          </div>

          <IoIosArrowForward className="text-xl" />
        </li>

        <li className="hover:bg-gray-50 py-2 transition-colors duration-300 flex justify-between items-center gap-3 cursor-pointer">
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
            <div>
              <p className="font-medium">Pay with cards</p>
              <p className="text-xs text-[#45556C] mt-1">
                Fund with cards in your currency
              </p>
            </div>
          </div>

          <IoIosArrowForward className="text-xl" />
        </li>

        <li
          onClick={() => setCurrentModal('crypto')}
          className="hover:bg-gray-50 py-2 transition-colors duration-300 flex justify-between items-center gap-3 cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="bg-[#F0FDF4] p-2 rounded-lg">
              <Image
                src="/assets/icons/currency-bitcoin-circle.png"
                alt="i"
                width={24}
                height={24}
                className="size-6 aspect-square object-contain"
              />
            </div>
            <div>
              <p className="font-medium">Fund with Cryptocurrency</p>
              <p className="text-xs text-[#45556C] mt-1">
                Fund wallet using supported cryptocurrencies (e.g., USDT, BTC,
                ETH).
              </p>
            </div>
          </div>

          <IoIosArrowForward className="text-xl" />
        </li>
      </ul>
    </div>
  );
};

export default FundWalletModal;
