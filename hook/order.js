import { getOrderFn, getOrdersFn, updateOrderStatusFn } from "@/service/order";
import { useMutation, useQuery } from "@tanstack/react-query";

export const getOrder = (id) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["order", id],
    queryFn: () => getOrderFn(id),
    enabled: !!id,
  });
  const order = data?.data?.data || {};
  return { order, isLoading, error };
};

export const getOrders = (page, limit, search) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["orders", page, limit, search],
    queryFn: () => getOrdersFn({ page, limit, search }),
  });
  const orders = data?.data?.data || [];
  const meta = data?.data?.meta || {};
  return { orders, isLoading, error, meta };
};

export const updateOrderStatus = async () => {
  const {
    mutate: updateStatus,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: (id, status) => updateOrderStatusFn(id, status),
  });
  const errorMessage = error?.response?.data?.message || null;
  return { updateStatus, isLoading, error, errorMessage };
};
