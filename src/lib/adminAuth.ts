const rawAdminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "";

export const ADMIN_EMAILS = rawAdminEmails
  .split(",")
  .map((entry) => entry.trim().toLowerCase())
  .filter(Boolean);

export const isAdminEmail = (email?: string | null) => {
  if (!email) return false;
  if (ADMIN_EMAILS.length === 0) return true;
  return ADMIN_EMAILS.includes(email.toLowerCase());
};

export const adminEmailsLabel =
  ADMIN_EMAILS.length > 0 ? ADMIN_EMAILS.join(", ") : "未設定（全許可）";

export const isAdminListConfigured = ADMIN_EMAILS.length > 0;
