"use client";

import CaseDetails from "@/components/admin/case-details/CaseDetails";
import React from "react";

const page = () => {
  const caseDetails = {
    user: {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1 234 567 890",
      address: "123 Main St, Anytown, USA",
      image:
        "https://static.vecteezy.com/system/resources/thumbnails/003/715/527/small/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-vector.jpg",
    },
    emergencyContact: {
      name: "Jane Doe",
      relationship: "Sister",
      email: "jane.doe@example.com",
      phone: "+1 987 654 321",
      address: "456 Elm St, Othertown, USA",
    },
    supportAgent: {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      agentId: "AGENT123",
    },
    coords: [[-0.1276, 51.5074]],
    status: "In Progress",
    createdAt: "2024-06-01T12:00:00Z",
    acceptedAt: "2024-06-02T15:30:00Z",
  };

  return <CaseDetails caseDetails={caseDetails} />;
};

export default page;
