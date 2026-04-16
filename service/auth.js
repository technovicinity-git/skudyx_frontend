import API from "@/lib/axiosClient";

export const loginFn = async (data) => await API.post(`auth/login`, data);

export const signupFn = async (data) => await API.post(`auth/register`, data);

export const otpVerifyFn = async (data) =>
  await API.post(`auth/forget-password/verify-otp`, data);

export const sendOtpToPhoneFn = async (data) =>
  await API.post(`auth/phone-otp`, data);

export const resendOtpFn = async (data) =>
  await API.post(`auth/resend-otp`, data);

export const forgotPasswordFn = async (data) =>
  await API.post(`auth/forget-password`, data);

export const resetPasswordFn = async (data) =>
  await API.post(`auth/reset-password`, data);

export const logoutFn = async () => await API.post(`auth/logout`);

export const createPinFn = async (data) =>
  await API.post(`auth/pin-update`, data);

export const pinVerifyFn = async (data) =>
  await API.post(`auth/pin-verify`, data);

export const multiFactorSetupFn = async () => await API.get(`auth/2fa-setup`);

export const multiFactorEnableFn = async (data) =>
  await API.post(`auth/2fa-enable`, data);

export const multiFactorVerifyFn = async (data) =>
  await API.post(`auth/2fa-verify`, data);

export const multiFactorDisableFn = async (data) =>
  await API.post(`auth/2fa-disable`, data);
