import API from "@/lib/axiosClient";

export const createTokenFn = async (data) =>
  await API.post(`/zego/generate-token`, data);

export const getTokenFn = async (id) =>
  await API.get(`/zego/generate-token/${id}`);
