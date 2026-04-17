import { useMutation, useQuery } from "@tanstack/react-query";

import {
  createAgentFn,
  deleteUserFn,
  getAgentFn,
  getAgentsFn,
  getMyProfileFn,
  getUserFn,
  getUsersFn,
  updateAgentFn,
  updateAgentStatusFn,
  userStatsFn,
} from "@/service/user";

export const useGetUser = (id) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserFn(id),
    enabled: !!id,
  });
  const user = data?.data?.data || {};
  return { user, isLoading, error };
};

export const useGetUsers = (page, limit, search) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["users", page, limit, search],
    queryFn: () => getUsersFn({ page, limit, search }),
  });
  useQuery({
    queryKey: ["users", page + 1, limit, search],
    queryFn: () => getUsersFn({ page: page + 1, limit, search }),
  });
  const users = data?.data?.data || [];
  const meta = data?.data?.meta || {};
  return { users, isLoading, error, meta };
};
export const useGetAgents = (page, limit, search, status) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["agents", page, limit, search, status],
    queryFn: () => getAgentsFn({ page, limit, search, status }),
  });
  useQuery({
    queryKey: ["agents", page + 1, limit, search, status],
    queryFn: () =>
      getAgentsFn({
        page: page + 1,
        limit,
        search,
        status,
      }),
  });
  const agents = data?.data?.data || [];
  const meta = data?.data?.pagination || {};
  return { agents, isLoading, error, meta };
};

export const useGetAgent = (id) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["agent", id],
    queryFn: () => getAgentFn(id),
    enabled: !!id,
  });
  const agent = data?.data?.data || {};
  return { agent, isLoading, error };
};

export const useGetUserStats = (range) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["userStats", range],
    queryFn: () => userStatsFn({ range }),
  });
  const userStats = data?.data?.data || [];
  return { userStats, data, isLoading, error };
};

export const useCreateAgent = () => {
  const {
    mutate: createAgent,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: (data) => createAgentFn(data),
    onSuccess: () => {
      console.log("Agent created successfully");
    },
    onError: (error) => {
      console.error("Error creating Agent:", error);
    },
  });
  const errorMessage = error?.response?.data?.message || "";
  return { createAgent, isLoading, error, errorMessage };
};

export const useUpdateAgent = () => {
  const {
    mutate: updateAgent,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: ({ id, data }) => updateAgentFn(id, data),
  });
  const errorMessage = error?.response?.data?.message || "";
  return { updateAgent, isLoading, error, errorMessage };
};

export const useDeleteUser = (id) => {
  const {
    mutate: deleteUser,
    isLoading,
    error,
  } = useMutation({
    mutationFn: () => deleteUserFn(id),
  });
  return { deleteUser, isLoading, error };
};

export const useGetMyProfile = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["myProfile"],
    queryFn: () => getMyProfileFn(),
  });
  const profile = data?.data?.data;
  return { profile, isLoading, error };
};

export const useUpdateAgentStatus = () => {
  const {
    mutate: updateAgentStatus,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: (data) => updateAgentStatusFn(data),
  });
  const errorMessage = error?.response?.data?.message || "";
  return { updateAgentStatus, isLoading, error, errorMessage };
};
