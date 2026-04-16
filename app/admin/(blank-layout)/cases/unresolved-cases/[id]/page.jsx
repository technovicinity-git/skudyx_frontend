"use client";

import CaseDetails from "@/components/admin/case-details/CaseDetails";
import Button from "@/components/common/Button";
import DetailsHeader from "@/components/common/DetailsHeader";
import { useGetCase } from "@/hook/case";

import { DownloadIcon } from "@/public/assets/icons/icons";

import { useParams } from "next/navigation";

const page = () => {
  const { id } = useParams();

  const { caseData, isLoading } = useGetCase(id, {
    enabled: !!id,
  });

  return (
    <div className="pb-8">
      {" "}
      <DetailsHeader
        title="Case"
        id={caseData?.case_id}
        actions={<Button variant="outline">{DownloadIcon}Download File</Button>}
      />
      <CaseDetails caseDetails={caseData} isLoading={isLoading} />
    </div>
  );
};

export default page;
