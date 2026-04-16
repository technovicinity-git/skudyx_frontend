import { useState } from 'react';
import { FiCopy } from 'react-icons/fi';
import { RxCross2 } from 'react-icons/rx';

const BankModal = ({ setShowModal }) => {
  const [copied, setCopied] = useState(false);

  const textToCopy = '5681882344';

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
        <h4 className="text-[#101828] text-2xl font-semibold">Bank Transfer</h4>
        <button
          onClick={() => setShowModal(false)}
          className="text-2xl bg-[#0000000D] p-2 rounded-lg cursor-pointer"
        >
          <RxCross2 />
        </button>
      </div>

      {/* Account Info */}
      <div className="bg-[#F8FAFC] px-4 py-5 mt-6 rounded-lg space-y-3">
        <div className="pb-2">
          <p className="text-sm font-medium">Account details</p>
          <p className="text-[#45556C] text-xs mt-1">
            Arcu non viverra interdum nulla pulvinar. Pharetra sed nisi egestas
            nibh magna amet.
          </p>
        </div>

        <p className="text-sm flex justify-between items-center gap-2">
          <span className="text-[#364153]">Bank Name</span>
          <span className="text-[#1B1C1E] font-medium">Moniepoint MFB</span>
        </p>
        <p className="text-sm flex justify-between items-center gap-2">
          <span className="text-[#364153]">Account Name</span>
          <span className="text-[#1B1C1E] font-medium">
            Green Wealth /Ahmed Musa
          </span>
        </p>

        <div className="text-sm flex justify-between items-center gap-2">
          <p className="text-[#364153]">Account Number</p>
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
  );
};

export default BankModal;
