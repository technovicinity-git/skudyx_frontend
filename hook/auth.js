import {
  createPinFn,
  forgotPasswordFn,
  loginFn,
  logoutFn,
  multiFactorDisableFn,
  multiFactorEnableFn,
  multiFactorSetupFn,
  multiFactorVerifyFn,
  otpVerifyFn,
  pinVerifyFn,
  resendOtpFn,
  resetPasswordFn,
  sendOtpToPhoneFn,
  signupFn,
} from "@/service/auth";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useSignUp = () => {
  const mutation = useMutation({
    mutationFn: (data) => signupFn(data),
    // onSuccess: (data) => {
    //   Cookies.set("accessToken", data.data.data.accessToken, {
    //     path: "/",
    //     maxAge: process.env.NEXT_PUBLIC_COOKIE_MAX_AGE || 86400,
    //   });
    //   Cookies.set("refreshToken", data.data.data.refreshToken, {
    //     path: "/",
    //     maxAge: process.env.NEXT_PUBLIC_COOKIE_MAX_AGE || 86400,
    //   });
    // },
    // onError: (error) => {
    //   console.error("Sign up failed", error);
    // },
  });
  const errorMessage = mutation.error?.response?.data?.message || null;

  return {
    signUp: mutation.mutate,
    data: mutation?.data,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error?.response?.data || null,
    errorMessage,
  };
};

export const useLogin = (options = {}) => {
  const mutation = useMutation({
    mutationFn: (data) => loginFn(data),
    ...options,
  });

  return {
    login: mutation.mutate,
    data: mutation?.data,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation?.error?.response?.data || null,
  };
};

export const useLogout = (options = {}) => {
  const mutation = useMutation({
    mutationFn: () => logoutFn(),
    ...options,
  });

  return {
    logout: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};

export const useForgotPassword = (options = {}) => {
  const mutation = useMutation({
    mutationFn: (data) => forgotPasswordFn(data),
    ...options,
  });

  return {
    forgotPassword: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};

export const useOTPVerification = (options = {}) => {
  const mutation = useMutation({
    mutationFn: (data) => otpVerifyFn(data),
    ...options,
  });

  const errorMessage = mutation.error?.response?.data?.message || null;

  return {
    verifyOTP: mutation.mutate,
    data: mutation?.data,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    errorMessage,
  };
};

export const useResendOTP = (options = {}) => {
  const mutation = useMutation({
    mutationFn: (data) => resendOtpFn(data),
    ...options,
  });

  const errorMessage = mutation.error?.response?.data?.message || null;

  return {
    resendOtp: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    errorMessage,
  };
};

export const useResetPassword = (options = {}) => {
  const mutation = useMutation({
    mutationFn: (data) => resetPasswordFn(data),
    ...options,
  });

  return {
    resetPassword: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};

export const useCreatePin = (options = {}) => {
  const mutation = useMutation({
    mutationFn: (data) => createPinFn(data),
    ...options,
  });

  return {
    createPin: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};

export const usePinVerification = (options = {}) => {
  const mutation = useMutation({
    mutationFn: (data) => pinVerifyFn(data),
    ...options,
  });

  return {
    verifyPin: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};

export const useSendOtpToPhone = (options = {}) => {
  const {
    mutate: sendOtpToPhone,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: (data) => sendOtpToPhoneFn(data),
    ...options,
  });

  const errorMessage = error?.response?.data?.message || null;

  return {
    sendOtpToPhone,
    isLoading,
    isError: !!error,
    error,
    errorMessage,
  };
};

export const useMultiFactorSetup = (options = {}) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["multiFactorSetup"],
    queryFn: () => multiFactorSetupFn(),
    enabled: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
    staleTime: 1000 * 60 * 5,
    ...options,
  });
  const code = data?.data?.data || null;
  return {
    data,
    isLoading,
    isError: !!error,
    error,
    code,
    refetch,
  };
};

export const useMultiFactorEnable = (options = {}) => {
  const mutation = useMutation({
    mutationFn: (data) => multiFactorEnableFn(data),
    ...options,
  });

  return {
    enableMultiFactor: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    errorMessage: mutation.error?.response?.data?.message || null,
  };
};

export const useMultiFactorVerify = (options = {}) => {
  const mutation = useMutation({
    mutationFn: (data) => multiFactorVerifyFn(data),
    ...options,
  });

  return {
    verifyMultiFactor: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    errorMessage: mutation.error?.response?.data?.message || null,
  };
};

export const useMultiFactorDisable = (options = {}) => {
  const mutation = useMutation({
    mutationFn: (data) => multiFactorDisableFn(data),
    ...options,
  });

  return {
    disableMultiFactor: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    errorMessage: mutation.error?.response?.data?.message || null,
  };
};
