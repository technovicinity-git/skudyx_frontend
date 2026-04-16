const CASE_STATUS_STYLES = {
  pending: "bg-gray-200 text-gray-700",
  in_progress: "bg-yellow-200 text-yellow-700",
  false: "bg-red-200 text-red-700",
  resolved: "bg-green-200 text-green-700",
  unresolved: "bg-pink-200 text-pink-700",
  escalated: "bg-blue-200 text-blue-700",
};

const CaseStatus = ({ status = "" }) => {
  const normalizedKey = status
    .toLowerCase()
    .replace(" case", "")
    .replace(/\s+/g, "_");

  const style =
    CASE_STATUS_STYLES[normalizedKey] || "bg-gray-200 text-gray-700";

  return (
    <span className={`px-3 py-1 text-sm rounded-full font-medium ${style}`}>
      {status}
    </span>
  );
};

export default CaseStatus;
