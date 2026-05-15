import { getOrderFn, getOrdersFn } from "@/service/order";
import { useQuery } from "@tanstack/react-query";

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
