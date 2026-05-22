import API from "@/lib/axiosClient";

export const getCaseActivitiesFn = async (query) => {
  const params = {
    ...query,
  };
  Object.keys(params).forEach((k) => {
    if (params[k] == null || params[k] === "") delete params[k];
  });
  return await API.get(`/case-activity`, {
    params,
  });
};

export const markActivityAsReadFn = async (id) =>
  await API.patch(`/case-activity/${id}/read`);
