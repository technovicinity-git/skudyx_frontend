"use client";

import DetailsHeader from "@/components/common/DetailsHeader";
import UpdateOrderStatus from "@/components/modal/OrderStatusUpdate";
import { getOrder } from "@/hook/order";

import { formatDateTime } from "@/utils/formatDateTime";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";

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

const OrderDetailsPage = () => {
  const { id } = useParams();
  const { order, isLoading } = getOrder(id);

  const queryClient = useQueryClient();

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

  return (
    <div className="">
      {/* Header */}
      <DetailsHeader title="Order" id={order.orderId} />

      <div className="max-w-7xl mx-auto space-y-6 flex flex-col items-center justify-center gap-4 py-6 px-4 md:px-8 ">
        <div className="w-full bg-white rounded-md p-6 border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-semibold mb-4">Order Information</h2>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Order ID:</span> {order.orderId}
                </p>
                <p>
                  <span className="font-medium">User ID:</span>{" "}
                  {order.userId?.user_id}
                </p>
                {/* <p>
                    <span className="font-medium">Status:</span>{" "}
                    <OrderStatus status={order.status} />
                  </p> */}
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
            <div className="flex items-center gap-2">
              Status:
              <UpdateOrderStatus
                id={id}
                currentStatus={order.status}
                queryClient={queryClient}
              />
            </div>
          </div>
        </div>

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
    </div>
  );
};

export default OrderDetailsPage;
