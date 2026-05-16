import React from "react";

const ORDER_STATUS_STYLES = {
  Placed: "bg-yellow-200 text-yellow-800",
  Confirmed: "bg-blue-200 text-blue-800",
  Shipped: "bg-indigo-200 text-indigo-800",
  Delivered: "bg-green-200 text-green-800",
  Cancelled: "bg-red-200 text-red-800",
  Failed: "bg-gray-300 text-gray-800",
};

const OrderStatus = ({ status, className = "" }) => {
  const baseStyles =
    "px-3 py-1 rounded-full text-sm font-medium inline-flex items-center";

  const statusStyles =
    ORDER_STATUS_STYLES[status] || "bg-gray-200 text-gray-700";

  return (
    <span className={`${baseStyles} ${statusStyles} ${className}`}>
      {status}
    </span>
  );
};

export default OrderStatus;
