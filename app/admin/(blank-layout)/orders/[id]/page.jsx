"use client";

import Button from "@/components/common/Button";
// import VictimInformationCard from "@/components/common/Card/VictimInformationCard";
import DetailsHeader from "@/components/common/DetailsHeader";
import OrderStatus from "@/components/common/status/OrderStatus";
import { getOrder, updateOrderStatus } from "@/hook/order";
import { formatDateTime } from "@/utils/formatDateTime";
import { useParams } from "next/navigation";
import { useState } from "react";

// Loading Skeleton Component
const OrderDetailsSkeleton = () => {
  return (
    <div className="space-y-6 py-6 px-4 md:px-8">
      <div className="items-center mb-6">
        <div className="h-8 w-64 bg-gray-200 rounded-md animate-pulse"></div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6 flex flex-col items-center justify-center gap-4">
        {/* Order Information Card Skeleton */}
        <div className="w-full bg-white rounded-md p-6 border border-gray-200">
          <div className="flex justify-between items-start">
            <div className="space-y-4 flex-1">
              <div className="h-7 w-48 bg-gray-200 rounded-md animate-pulse"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-5 w-40 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
            <div className="w-32 h-10 bg-gray-200 rounded-md animate-pulse"></div>
          </div>
        </div>

        {/* Delivery Address Card Skeleton */}
        <div className="w-full bg-white rounded-md p-6 border border-gray-200">
          <div className="h-6 w-40 bg-gray-200 rounded-md animate-pulse mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-56 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Timeline Skeleton */}
        <div className="w-full bg-white rounded-md p-6 border border-gray-200">
          <div className="h-6 w-32 bg-gray-200 rounded-md animate-pulse mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="w-3 h-3 bg-gray-200 rounded-full animate-pulse mt-1"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 w-48 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Status Update Modal Component
const StatusUpdateModal = ({
  isOpen,
  onClose,
  currentStatus,
  onUpdate,
  isUpdating,
}) => {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);

  const statusOptions = [
    {
      value: "Pending",
      label: "Pending",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      value: "Confirmed",
      label: "Confirmed",
      color: "bg-blue-100 text-blue-800",
    },
    {
      value: "Shipped",
      label: "Shipped",
      color: "bg-purple-100 text-purple-800",
    },
    {
      value: "Delivered",
      label: "Delivered",
      color: "bg-green-100 text-green-800",
    },
    {
      value: "Cancelled",
      label: "Cancelled",
      color: "bg-red-100 text-red-800",
    },
    { value: "Failed", label: "Failed", color: "bg-gray-100 text-gray-800" },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-opacity-50">
      <div className="bg-white rounded-xl border border-gray-200 shadow-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Update Order Status
          </h2>
          <Button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </Button>
        </div>

        <div className="p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select New Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {currentStatus === selectedStatus && (
            <p className="mt-2 text-sm text-yellow-600">
              This is the current status. Select a different status to update.
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 py-3 px-6 rounded-xl">
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button
            onClick={() => onUpdate(selectedStatus)}
            disabled={isUpdating || selectedStatus === currentStatus}
            variant="solid"
          >
            {isUpdating ? "Updating..." : "Update Status"}
          </Button>
        </div>
      </div>
    </div>
  );
};

const OrderDetailsPage = () => {
  const { id } = useParams();
  const { order, isLoading } = getOrder(id);
  const { updateStatus, isLoading: isUpdating } = updateOrderStatus();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStatusUpdate = async (newStatus) => {
    updateStatus(id, newStatus, {
      onSuccess: () => {
        setIsModalOpen(false);
      },
    });
  };

  if (isLoading) {
    return <OrderDetailsSkeleton />;
  }

  if (!order) {
    return (
      <div className="py-6 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="w-full bg-white rounded-md p-8 border border-gray-200 text-center">
            <p className="text-gray-500">Order not found.</p>
          </div>
        </div>
      </div>
    );
  }

  // Prepare user information for VictimInformationCard
  // const userInfo = {
  //   name: `${order.userId?.first_name || ""} ${order.userId?.last_name || ""}`.trim(),
  //   userCode: order.orderId,
  //   email: order.userId?.email,
  //   phone: order.userId?.phone,
  //   address: order.userId?.address,
  //   profile_photo: order.userId?.profile_photo,
  //   status: order.subscriptionPlan,
  // };

  return (
    <div className="">
      {/* Header */}
      <DetailsHeader title="Order" id={order.orderId} />

      <div className="max-w-7xl mx-auto space-y-6 flex flex-col items-center justify-center gap-4 py-6 px-4 md:px-8 ">
        {/* Order Information Card */}
        {
          // userInfo?.email ? (
          //   <VictimInformationCard
          //     title="Order Information"
          //     name={userInfo.name}
          //     status={order.status}
          //     statusColor={
          //       order.status === "Delivered"
          //         ? "green"
          //         : order.status === "Cancelled" || order.status === "Failed"
          //           ? "red"
          //           : order.status === "Shipped"
          //             ? "purple"
          //             : order.status === "Confirmed"
          //               ? "blue"
          //               : "yellow"
          //     }
          //     userCode={userInfo.userCode}
          //     email={userInfo.email}
          //     phone={userInfo.phone}
          //     address={userInfo.address}
          //     image={userInfo.profile_photo}
          //     onEdit={() => setIsModalOpen(true)}
          //   />
          // ) : (
          <div className="w-full bg-white rounded-md p-6 border border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold mb-4">
                  Order Information
                </h2>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Order ID:</span>{" "}
                    {order.orderId}
                  </p>
                  <p>
                    <span className="font-medium">User ID:</span>{" "}
                    {order.userId?._id}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span>{" "}
                    <OrderStatus status={order.status} />
                  </p>
                  <p>
                    <span className="font-medium">Subscription Plan:</span>{" "}
                    {order.subscriptionPlan}
                  </p>
                  <p>
                    <span className="font-medium">Order Date:</span>{" "}
                    {formatDateTime(order.orderCreateDate)}
                  </p>
                  <p>
                    <span className="font-medium">Created By:</span>{" "}
                    {order.createdBy}
                  </p>
                </div>
              </div>
              <Button onClick={() => setIsModalOpen(true)} variant="solid">
                Update Status
              </Button>
            </div>
          </div>
          // )
        }

        {/* Delivery Address Card */}
        {order.deliveryAddress && (
          <div className="w-full bg-white rounded-md p-6 border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Delivery Address</h2>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Recipient:</span>{" "}
                {order.deliveryAddress.fullName}
              </p>
              <p>
                <span className="font-medium">Phone:</span>{" "}
                {order.deliveryAddress.phone}
              </p>
              <p>
                <span className="font-medium">Address:</span>{" "}
                {order.deliveryAddress.addressLine1}
                {order.deliveryAddress.addressLine2 &&
                  `, ${order.deliveryAddress.addressLine2}`}
              </p>
              <p>
                <span className="font-medium">City:</span>{" "}
                {order.deliveryAddress.city}
                {order.deliveryAddress.state &&
                  `, ${order.deliveryAddress.state}`}
              </p>
              <p>
                <span className="font-medium">ZIP Code:</span>{" "}
                {order.deliveryAddress.zipCode}
              </p>
              <p>
                <span className="font-medium">Country:</span>{" "}
                {order.deliveryAddress.country}
              </p>
            </div>
          </div>
        )}

        {/* Order Timeline */}
        <div className="w-full bg-white rounded-md p-6 border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Order Timeline</h2>
          <div className="space-y-4">
            {order.timeline?.map((event, index) => (
              <div key={event._id || index} className="flex gap-4">
                <div className="relative">
                  <div className="w-3 h-3 bg-blue-600 rounded-full mt-1.5"></div>
                  {index !== order.timeline.length - 1 && (
                    <div className="absolute top-4 left-1.5 w-0.5 h-full bg-gray-200"></div>
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">
                      {event.status}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatDateTime(event.timestamp)}
                    </span>
                  </div>
                  {event.message && (
                    <p className="text-sm text-gray-600">{event.message}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Status Update Modal */}
      <StatusUpdateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentStatus={order.status}
        onUpdate={handleStatusUpdate}
        isUpdating={isUpdating}
      />
    </div>
  );
};

export default OrderDetailsPage;
