import API from "@/lib/axiosClient";

export const getCasesFn = async (query) => {
  const params = {
    ...query,
  };
  Object.keys(params).forEach((k) => {
    if (params[k] == null || params[k] === "") delete params[k];
  });
  return await API.get(`/cases/active`, { params });
};
export const getCaseFn = async (id) => await API.get(`/cases/${id}`);
export const createCaseFn = async (data) => await API.post(`/cases`, data);
export const updateCaseFn = async (id, data) =>
  await API.put(`/cases/${id}`, data);
export const deleteCaseFn = async (id) => await API.delete(`/cases/${id}`);

export const assignAgentToCaseFn = async (caseId, agentId) =>
  await API.post(`/cases/${caseId}/assign`, { agentId });

export const updateCaseStatusFn = async (data) =>
  await API.patch(`/cases/update-status`, data);

export const acceptCaseFn = async (data) =>
  await API.patch(`/cases/accept`, data);

export const getAgentCaseHistoryFn = async (query) => {
  const params = {
    ...query,
  };
  Object.keys(params).forEach((k) => {
    if (params[k] == null || params[k] === "") delete params[k];
  });
  return await API.get(`/cases/agent/history`, {
    params,
  });
};
export const getAgentCaseHistoryByAdminFn = async (query) => {
  const params = {
    ...query,
  };
  Object.keys(params).forEach((k) => {
    if (params[k] == null || params[k] === "") delete params[k];
  });
  return await API.get(`/cases/admin/agent-stats/${params.id}`, {
    params,
  });
};

export const getAgentActiveCaseFn = async () =>
  await API.get(`/cases/agent/current-active-case`);

export const assignCaseToAgentFn = async (data) =>
  await API.patch(`/cases/admin-assign`, data);

export const getUserCasesFn = async (query) => {
  const params = {
    ...query,
  };
  Object.keys(params).forEach((k) => {
    if (params[k] == null || params[k] === "") delete params[k];
  });
  return await API.get(`/cases/admin/user-stats/${params.id}`, { params });
};

export const getCaseStatsFn = async (query) => {
  const params = {
    ...query,
  };
  Object.keys(params).forEach((k) => {
    if (params[k] == null || params[k] === "") delete params[k];
  });
  return await API.get(`cases/admin/summary-stats`, { params });
};

export const getCasePieStatsFn = async (query) => {
  const params = {
    ...query,
  };
  Object.keys(params).forEach((k) => {
    if (params[k] == null || params[k] === "") delete params[k];
  });
  return await API.get(`/cases/admin/pie-stats`, { params });
};
