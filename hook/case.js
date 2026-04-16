import {
  acceptCaseFn,
  assignCaseToAgentFn,
  getAgentActiveCaseFn,
  getAgentCaseHistoryByAdminFn,
  getAgentCaseHistoryFn,
  getCaseFn,
  getCasePieStatsFn,
  getCasesFn,
  getCaseStatsFn,
  getUserCasesFn,
  updateCaseStatusFn,
} from "@/service/case";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetCases = (page, status, limit, search) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["cases", page, status, limit, search],
    queryFn: () => getCasesFn({ page, status, limit, search }),
  });
  useQuery({
    queryKey: ["cases", page + 1, status, limit, search],
    queryFn: () => getCasesFn({ page: page + 1, status, limit, search }),
  });
  const cases = data?.data?.data || [];
  const meta = data?.data?.meta || {};
  return { cases, isLoading, error, meta };
};

export const useGetCase = (id) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["case", id],
    queryFn: () => getCaseFn(id),
    retry: 1,
  });
  const caseData = data?.data?.data || null;
  return { caseData, isLoading, error };
};

export const useUpdateCaseStatus = () => {
  const {
    mutate: updateCaseStatus,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: (data) => updateCaseStatusFn(data),
  });
  const errorMessage = error?.response?.data?.message || null;
  return { updateCaseStatus, isLoading, error, errorMessage };
};

export const useAcceptCase = () => {
  const {
    mutate: acceptCase,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: (data) => acceptCaseFn(data),
  });
  const errorMessage = error?.response?.data?.message || null;
  return { acceptCase, isLoading, error, errorMessage };
};

export const useGetAGentCaseHistory = (page, limit, search) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["agentCases", page, limit, search],
    queryFn: () => getAgentCaseHistoryFn({ page, limit, search }),
  });
  useQuery({
    queryKey: ["agentCases", page + 1, limit, search],
    queryFn: () => getAgentCaseHistoryFn({ page: page + 1, limit, search }),
  });
  const agentCases = data?.data?.data || [];
  const meta = data?.data?.meta || {};
  return { agentCases, isLoading, error, meta };
};
export const useGetAgentCaseHistoryByAdmin = (id, page, limit, search) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["agentCasesByAdmin", page, limit, search, id],
    queryFn: () => getAgentCaseHistoryByAdminFn({ page, limit, search, id }),
  });
  useQuery({
    queryKey: ["agentCasesByAdmin", page + 1, limit, search, id],
    queryFn: () =>
      getAgentCaseHistoryByAdminFn({ page: page + 1, limit, search, id }),
  });
  const agentCases = data?.data?.data || [];
  const meta = data?.data?.meta || {};
  return { agentCases, isLoading, error, meta };
};

export const useGetAgentActiveCase = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["agentActiveCase"],
    queryFn: () => getAgentActiveCaseFn(),
  });
  const activeCase = data?.data?.data || null;
  return { activeCase, isLoading, error };
};

export const useAssignCaseToAgent = () => {
  const {
    mutate: assignCaseToAgent,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: (data) => assignCaseToAgentFn(data),
  });
  const errorMessage = error?.response?.data?.message || null;
  return { assignCaseToAgent, isLoading, error, errorMessage };
};

export const useGetUserCases = (id, page, limit, search) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["userCases", page, limit, search, id],
    queryFn: () => getUserCasesFn({ page, limit, search, id }),
  });
  useQuery({
    queryKey: ["userCases", page + 1, limit, search, id],
    queryFn: () => getUserCasesFn({ page: page + 1, limit, search, id }),
  });
  const userCases = data?.data?.data || [];
  const meta = data?.data?.meta || {};
  return { userCases, isLoading, error, meta };
};

export const useGetCaseStats = (range) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["caseStats", range],
    queryFn: () => getCaseStatsFn({ range }),
  });
  const caseStats = data?.data?.data || {};
  return { caseStats, isLoading, error };
};

export const useGetCasePieStats = (range) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["casePieStats", range],
    queryFn: () => getCasePieStatsFn({ range }),
  });
  const casePieStats = data?.data?.data || [];
  return { casePieStats, isLoading, error };
};
