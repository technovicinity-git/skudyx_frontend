import { formatYMDHourAmPm, formatTimestamp } from "@/utils/formatTimestamp";
/** Search only within the currently loaded (present) page data */
const searchInPresentData = (data, query) => {
  const q = String(query || "")
    .toLowerCase()
    .trim();
  if (!q) return data;

  return (data || []).filter((log) => {
    const name = String(log?.name ?? "").toLowerCase();
    const level = String(log?.level ?? "").toLowerCase();
    const activity = String(log?.activity ?? "").toLowerCase();
    const role = String(log?.role ?? "").toLowerCase();

    // make date string searchable (e.g., "2025-08-28 10:42 AM")
    const dateStr = (
      formatYMDHourAmPm(formatTimestamp(log?.timestamp), {
        includeMinutes: true,
      }) || ""
    ).toLowerCase();

    return (
      name.includes(q) ||
      level.includes(q) ||
      activity.includes(q) ||
      role.includes(q) ||
      dateStr.includes(q)
    );
  });
};

export default searchInPresentData;
