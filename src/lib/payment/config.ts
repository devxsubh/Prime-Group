/**
 * Payment method: Razorpay gateway or Dynamic UPI QR.
 * Stored in backend (app_settings.payment_method); admins change it in Admin → Settings.
 * Env fallback only when DB is not yet migrated.
 */

import type { SupabaseClient } from "@supabase/supabase-js";

export type PaymentMethodType = "razorpay" | "upi_qr";

/** Fallback when DB has no row (e.g. before migration) */
const ENV_FALLBACK = (process.env.NEXT_PUBLIC_PAYMENT_METHOD ?? "razorpay").toLowerCase() as PaymentMethodType;

export const paymentConfig = {
  /** Default/fallback method (env or razorpay). Use getPaymentMethodFromDb() in API routes. */
  method: ENV_FALLBACK === "upi_qr" ? "upi_qr" : "razorpay",

  razorpay: {
    keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "",
    keySecret: process.env.RAZORPAY_KEY_SECRET ?? "",
  },

  upi: {
    /** Virtual Payment Address, e.g. merchant@upi */
    vpa: (process.env.UPI_VPA ?? "").trim(),
    /** Payee name shown in UPI app */
    merchantName: (process.env.UPI_MERCHANT_NAME ?? "Prime Group").replace(/[^a-zA-Z0-9\s]/g, " ").trim(),
  },
} as const;

export function isRazorpay(): boolean {
  return paymentConfig.method === "razorpay";
}

export function isUpiQr(): boolean {
  return paymentConfig.method === "upi_qr";
}

/**
 * Read payment method from DB (app_settings). Use this in API routes.
 * Returns env fallback if table/row missing.
 */
export async function getPaymentMethodFromDb(
  supabase: SupabaseClient
): Promise<PaymentMethodType> {
  const { data } = await supabase
    .from("app_settings")
    .select("value")
    .eq("key", "payment_method")
    .single();
  const value = (data as { value?: string } | null)?.value?.toLowerCase();
  return value === "upi_qr" ? "upi_qr" : "razorpay";
}

/**
 * Build UPI deep link for QR: upi://pay?pa=VPA&pn=Name&am=Amount&cu=INR
 * Amount in rupees (integer or decimal string, no thousands separator).
 */
export function buildUpiUrl(params: {
  vpa: string;
  merchantName: string;
  amount: number;
  currency?: string;
  orderId?: string;
  note?: string;
}): string {
  const { vpa, merchantName, amount, currency = "INR", orderId, note } = params;
  const am = amount % 1 === 0 ? String(amount) : amount.toFixed(2);
  const url = new URL("upi://pay");
  url.searchParams.set("pa", vpa);
  url.searchParams.set("pn", merchantName);
  url.searchParams.set("am", am);
  url.searchParams.set("cu", currency);
  if (orderId) url.searchParams.set("tr", orderId);
  if (note) url.searchParams.set("tn", note);
  return url.toString();
}
