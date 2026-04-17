"use client";

import LiveAudioV3 from "@/components/audio/LiveAudioV3";
import { useParams } from "next/navigation";

const CaseViewer = () => {
  const { caseId } = useParams();

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <LiveAudioV3 caseId={caseId} />

      <div className="mt-8"></div>
    </div>
  );
};

export default CaseViewer;
