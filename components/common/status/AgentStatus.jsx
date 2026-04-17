import React from "react";

const STATUS_STYLES = {
  Available: "bg-green-200 text-green-700",
  Blocked: "bg-red-200 text-red-700",
  Unavailable: "bg-fuchsia-200 text-fuchsia-700",
  Away: "bg-yellow-200 text-yellow-700",
  Occupied: "bg-blue-200 text-blue-700",
};

const AgentStatus = ({ status, className = "" }) => {
  const baseStyles = "px-3 py-1 rounded-full text-sm font-medium";
  const statusStyles = STATUS_STYLES[status] || "bg-gray-200 text-gray-700";

  return (
    <span className={`${baseStyles} ${statusStyles} ${className}`}>
      {status}
    </span>
  );
};

export default AgentStatus;
