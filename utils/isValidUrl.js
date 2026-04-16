export const isValidUrl = (url) => {
  try {
    return !!url && Boolean(new URL(url));
  } catch {
    return false;
  }
};
