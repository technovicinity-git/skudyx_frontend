import moment from "moment";
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return moment(date).format("DD/MM/YYYY");
};
