"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Page = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/agent/pending-cases");
  }, [router]);
  return <div className="p-6 space-y-6"></div>;
};

export default Page;
