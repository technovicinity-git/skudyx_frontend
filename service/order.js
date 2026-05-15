import API from "@/lib/axiosClient";

export const getOrderFn = async (id) => await API.get(`/orders/details/${id}`);

export const getOrdersFn = async (query) => {
  const params = {
    ...query,
  };
  Object.keys(params).forEach((k) => {
    if (params[k] == null || params[k] === "") delete params[k];
  });
  return await API.get(`/orders/all`, { params });
};

export const updateOrderStatusFn = async (id, status) =>
  await API.patch(`/orders/status/${id}`, { status });
