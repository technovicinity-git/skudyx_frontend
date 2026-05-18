import { useMutation, useQuery } from "@tanstack/react-query";
import {
  emailSettingsFn,
  getSettingsFn,
  smsSettingsFn,
} from "../service/settings";

export const useGetSettings = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["settings"],
    queryFn: getSettingsFn,
  });
  const settings = data?.data?.data ?? {};
  return { settings, isLoading, isError };
};

export const useEmailSettings = () => {
  const {
    mutate: updateEmailSettings,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: (settings) => emailSettingsFn(settings),
  });

  const errorMessage = error?.response?.data?.message || "";
  return { updateEmailSettings, isLoading, errorMessage };
};

export const useSmsSettings = () => {
  const {
    mutate: updateSmsSettings,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: (settings) => smsSettingsFn(settings),
  });
  const errorMessage = error?.response?.data?.message || "";
  return { updateSmsSettings, isLoading, errorMessage };
};
