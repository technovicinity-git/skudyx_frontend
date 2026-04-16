"use client";

import TestAudioPlayer from "@/components/TestAudioPlayer";
import { useParams } from "next/navigation";

const CaseViewer = () => {
  const { caseId } = useParams();

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <TestAudioPlayer caseId={caseId} />

      <div className="mt-8"></div>
    </div>
  );
};

export default CaseViewer;
