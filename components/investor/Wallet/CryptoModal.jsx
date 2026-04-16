import Button from '@/components/common/Button';
import Image from 'next/image';
import { useState } from 'react';
import { FiCopy } from 'react-icons/fi';
import { RxCross2 } from 'react-icons/rx';

const CryptoModal = ({ setShowModal }) => {
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
    <div className="bg-white shadow-md w-[95%] max-w-[640px] p-6 rounded-lg">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h4 className="text-[#101828] text-2xl font-semibold">
          Fund with Cryptocurrency
        </h4>
        <button
          onClick={() => setShowModal(false)}
          className="text-2xl bg-[#0000000D] p-2 rounded-lg cursor-pointer"
        >
          <RxCross2 />
        </button>
      </div>

      {/* Account Info */}
      <div className="px-4 py-5 mt-6 rounded-lg space-y-3">
        <p className="text-[#45556C] text-xs max-w-[330px] text-center mx-auto pb-4">
          Fund wallet using supported cryptocurrencies (e.g., USDT, BTC, ETH).
        </p>

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

      <Button variant="solid" className="mt-7 w-full">
        I have made payment
      </Button>
    </div>
  );
};

export default CryptoModal;
