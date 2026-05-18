import API from "@/lib/axiosClient";

export const getSettingsFn = async () => await API.get(`/app-settings`);

export const emailSettingsFn = async (settings) =>
  await API.post(`/app-settings/email`, settings);

export const smsSettingsFn = async (settings) =>
  await API.post(`/app-settings/sms`, settings);
