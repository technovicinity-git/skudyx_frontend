import {
  getCaseActivitiesFn,
  markActivityAsReadFn,
} from "@/service/caseActivity";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetCaseActivities = (query) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["caseActivities", query],
    queryFn: () => getCaseActivitiesFn(query),
  });
  const activities = data?.data?.data || [];
  const meta = data?.data?.meta || {};
  return { activities, isLoading, error, meta };
};

export const useMarkActivityAsRead = () => {
  const {
    mutate: markAsRead,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: (id) => markActivityAsReadFn(id),
  });
  const errorMessage = error?.response?.data?.message || null;
  return { markAsRead, isLoading, error, errorMessage };
};
