import API from "@/lib/axiosClient";

export const getUserFn = async (id) =>
  await API.get(`users/admin/user-details/${id}`);

export const getUsersFn = async (query) => {
  const params = {
    ...query,
  };
  Object.keys(params).forEach((k) => {
    if (params[k] == null || params[k] === "") delete params[k];
  });

  return await API.get(`/users/admin/users`, { params });
};
export const getAgentsFn = async (query) => {
  const params = {
    ...query,
  };
  Object.keys(params).forEach((k) => {
    if (params[k] == null || params[k] === "") delete params[k];
  });

  return await API.get(`/users/admin/agents`, { params });
};

export const getAgentFn = async (id) =>
  await API.get(`/users/admin/agents/${id}`);

export const createAgentFn = async (data) =>
  await API.post(`/auth/admin/create-staff`, data);

export const updateAgentFn = async (id, data) =>
  await API.put(`/users/admin/agents/${id}`, data);

export const userStatsFn = async (query) => {
  const params = {
    ...query,
  };
  Object.keys(params).forEach((k) => {
    if (params[k] == null || params[k] === "") delete params[k];
  });

  return await API.get(`/users/admin/user-analytics`, { params });
};

export const deleteUserFn = async (id) => await API.delete(`/users/${id}`);

export const getMyProfileFn = async () => await API.get(`/users/profile`);

export const updateAgentStatusFn = async (data) =>
  await API.patch(`/users/admin/manage-agent-status`, data);
