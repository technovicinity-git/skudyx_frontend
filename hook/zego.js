import { createTokenFn, getTokenFn } from "@/service/zego";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useCreateToken = () => {
  const {
    mutate: createToken,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: (data) => createTokenFn(data),
  });
  const errorMessage = error?.response?.data?.message || null;
  return { createToken, isLoading, error, errorMessage };
};

export const useGetToken = (id) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["zegoToken"],
    queryFn: () => getTokenFn(id),
    enabled: !!id,
    retry: false,
  });
  const token = data?.data?.token || null;
  return { token, isLoading, error };
};
