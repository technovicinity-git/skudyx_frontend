"use client";
import dynamic from "next/dynamic";
import React from "react";

const ActiveCaseContent = dynamic(
  () => import("../../../components/pages/active-page/ActivePage"),
  {
    ssr: false, // ✅ disables server-side rendering entirely
  },
);

const ActiveCaseIndex = () => {
  return <ActiveCaseContent />;
};

export default ActiveCaseIndex;
