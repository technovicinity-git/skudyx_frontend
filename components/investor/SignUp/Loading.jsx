'use client';

import Image from 'next/image';
import { useEffect } from 'react';

const Loading = ({ setCurrentStep }) => {
  useEffect(() => {
    const goNextStep = setTimeout(() => {
      setCurrentStep('success');
    }, 2000);

    return () => clearTimeout(goNextStep);
  }, []);

  return (
    <div className="min-h-64 flex flex-col items-center justify-center gap-6">
      <Image
        src="/assets/icons/signup-loading-circle.png"
        alt="Loading..."
        width={56}
        height={56}
        className="w-14 h-14 animate-spin border"
      />
      <p className="text-lg font-semibold text-[#222222]">Please wait!</p>
    </div>
  );
};

export default Loading;
