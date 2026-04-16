'use client';

import Input from '@/components/common/Input';
import Label from '@/components/common/Label';
import Image from 'next/image';
import { useState } from 'react';
import { FiCopy } from 'react-icons/fi';

const Cryptocurrency = () => {
  const [copied, setCopied] = useState(false);

  const textToCopy = '0xAbC123...F78bE1';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  return (
    <>
      {/* Title */}
      <h2 className="text-3xl font-semibold text-[#101828] mb-12">
        Cryptocurrency
      </h2>

      {/* Body */}
      <div className="w-full bg-white border border-[#D0D5DD] px-[26px] py-6 rounded-lg">
        {/* Image Farm Info */}
        <div className="border border-[#F1F5F9] p-2 rounded-xl flex items-center gap-3">
          <Image
            src="/assets/images/vegetables.webp"
            alt="img"
            width={64}
            height={72}
            className="w-16 h-[72px] object-cover rounded-lg"
          />

          <div className="space-y-[7px]">
            <p className="text-sm text-[#1B1C1E] font-medium">
              Nyore Maize Farm
            </p>
            <p className="text-[#45556C] text-xs">Start Date: 7th May 2025</p>
            <div className="text-xs flex items-center gap-2">
              <p className="text-[#45556C]">Returns</p>
              <p className="text-primary-1 bg-[#F3F7F5] font-medium p-1 rounded-full">
                21% p.a
              </p>
            </div>
          </div>
        </div>

        {/* Pay Form */}
        <form
          onSubmit={e => e.preventDefault()}
          className="mt-6 flex flex-col gap-5"
        >
          {/* Slot Number */}
          <div className="flex flex-col">
            <Label htmlFor="slot-number">Number of slot</Label>
            <Input
              type="number"
              id="slot-number"
              name="slot-number"
              placeholder="0"
            />
            <p className="text-[#45556C] text-xs mt-1.5">
              1 slot ={' '}
              <span className="text-[#0F172B] font-medium">$50,000</span>
            </p>
          </div>

          {/* Amount */}
          <div className="flex flex-col">
            <Label htmlFor="amount">Amount</Label>
            <Input type="number" id="amount" name="amount" placeholder="$0" />
            <p className="text-[#45556C] text-xs mt-6">
              Deposit the amount of shares you want to buy
            </p>
          </div>
        </form>

        {/* Account Info */}
        <div className="bg-[#F8FAFC] px-4 py-5 mt-6 rounded-lg space-y-3">
          <Image
            src="/assets/icons/cryptocurrency-qr.png"
            alt="qr-img"
            width={230}
            height={234}
            className="w-[230px] h-[234px] mx-auto mb-7"
          />

          <div className="text-sm flex justify-between items-center gap-2">
            <p className="text-[#364153]">Coin Type</p>
            <div className="bg-[#F5F5F4] px-2.5 py-[5px] rounded-full">
              <p className="text-[#1B1C1E] font-medium">Bitcoin</p>
            </div>
          </div>

          <div className="text-sm flex justify-between items-center gap-2">
            <p className="text-[#364153]">Network</p>
            <div className="bg-[#F5F5F4] px-2.5 py-[5px] rounded-full">
              <p className="text-[#1B1C1E] font-medium">ERC 20</p>
            </div>
          </div>

          <div className="text-sm flex justify-between items-center gap-2">
            <p className="text-[#364153]">Wallet address</p>
            <div className="flex flex-col items-end">
              <p className="text-[#1B1C1E] font-medium">{textToCopy}</p>
              <button
                onClick={handleCopy}
                className="bg-[#121C30] text-white px-3 py-1.5 mt-1 rounded-full flex items-center gap-[7px] cursor-pointer"
              >
                <span>{copied ? 'Copied!' : 'Copy'}</span>
                <FiCopy className="text-base" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cryptocurrency;
