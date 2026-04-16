// utils/mask.js

/**
 * Masks any input string after the first 5 characters.
 * Example: "123456789" => "12345***"
 */
export function maskAfterFive(input) {
  const s = String(input ?? "");
  return s.length > 5 ? s.slice(0, 5) + "***" : s;
}

/**
 * Masks only the username part of an email, keeping the domain intact.
 * Example: "johnsmith@example.com" => "johns***@example.com"
 */
export function maskEmail(email) {
  const s = String(email ?? "");
  const [user, domain] = s.split("@");
  if (!domain) return maskAfterFive(s); // fallback for invalid email
  return `${maskAfterFive(user)}@${domain}`;
}

/**
 * Masks phone numbers after the first 5 characters.
 * Example: "+8801712345678" => "+8801***"
 */
export function maskPhone(phone) {
  return maskAfterFive(String(phone ?? ""));
}
