// datetime.js

// Default formatting options
const DEFAULTS = {
  locale: "en-GB", // use "bn-BD" for Bangla
  timeZone: "Asia/Dhaka",
  dateStyle: "medium", // "short" | "medium" | "long" | "full"
  timeStyle: "short", // "short" | "medium" | "long" | "full"
  hour12: true,
};

// Guard/normalize to Date
function toDate(ts) {
  if (ts instanceof Date) return ts;
  const d = new Date(ts);
  return Number.isNaN(d.getTime()) ? null : d;
}

// Main formatter
function formatTimestamp(ts, opts = {}) {
  const d = toDate(ts);
  if (!d) return "";

  const { locale, timeZone, dateStyle, timeStyle, hour12 } = {
    ...DEFAULTS,
    ...opts,
  };

  // Some older runtimes may not support dateStyle/timeStyle — fallback gracefully.
  try {
    return new Intl.DateTimeFormat(locale, {
      dateStyle,
      timeStyle,
      timeZone,
      hour12,
    }).format(d);
  } catch {
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      timeZone,
      hour12,
    }).format(d);
  }
}

// Optional: quick custom pattern (very light-weight)
function formatCustom(ts, pattern = "dd-MMM-yyyy HH:mm", opts = {}) {
  const d = toDate(ts);
  if (!d) return "";

  const { locale, timeZone, hour12 } = { ...DEFAULTS, ...opts };

  const parts = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone,
    hour12,
  })
    .formatToParts(d)
    .reduce((acc, p) => ((acc[p.type] = p.value), acc), {});

  return pattern
    .replace(/dd/g, parts.day)
    .replace(/MMM/g, parts.month)
    .replace(/yyyy/g, parts.year)
    .replace(/HH/g, parts.hour)
    .replace(/mm/g, parts.minute);
}

// Helper for your filter use-case
function matchesFilterByFormattedDate(log, filter, opts = {}) {
  if (!log?.timestamp || !filter) return false;
  return formatTimestamp(log.timestamp, opts)
    .toLowerCase()
    .includes(String(filter).toLowerCase());
}

// Compact: "YYYY-MM-DD 8pm" (or "YYYY-MM-DD 8:03pm" if includeMinutes: true)
function formatYMDHourAmPm(
  ts,
  { timeZone = "Asia/Dhaka", includeMinutes = false } = {}
) {
  const d = ts instanceof Date ? ts : new Date(ts);
  if (Number.isNaN(d.getTime())) return "";

  const dtf = new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    ...(includeMinutes ? { minute: "2-digit" } : {}),
    hour12: true,
    timeZone,
  });

  const parts = dtf
    .formatToParts(d)
    .reduce((acc, p) => ((acc[p.type] = p.value), acc), {});
  const y = parts.year;
  const m = parts.month; // already 2-digit
  const day = parts.day; // already 2-digit
  const h = parts.hour?.replace(/^0/, ""); // no leading zero
  const min = parts.minute ? `:${parts.minute}` : "";
  const ampm = (parts.dayPeriod || "").toLowerCase();

  return `${y}-${m}-${day} ${h}${min}${ampm}`;
}

export {
  formatTimestamp,
  formatCustom,
  matchesFilterByFormattedDate,
  formatYMDHourAmPm,
};
