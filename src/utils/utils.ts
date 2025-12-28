import type { SDKCreateTransactionResponse } from "../types/sdk";
import type { Payment, PaymentMethod, Transaction } from "../types/transaction";

/**
 * Converts a PaymentMethod enum to the API's expected string format.
 *
 * @param method - The payment method type
 *
 * @returns The lowercase, underscore-separated payment method string
 *
 * @example
 * ```ts
 * getActualPaymentMethod('BNI_VA') // returns 'bni_va'
 * getActualPaymentMethod('QRIS')   // returns 'qris'
 * ```
 */
export function getActualPaymentMethod(method: PaymentMethod): string {
  switch (method) {
    case "CLIMB_NIAGA_VA":
      return "climb_niaga_va";
    case "BNI_VA":
      return "bni_va";
    case "SAMPOERNA_VA":
      return "sampoerna_va";
    case "BNC_VA":
      return "bnc_va";
    case "MAYBANK_VA":
      return "maybank_va";
    case "PERMATA_VA":
      return "permata_va";
    case "ATM_BERSAMA_VA":
      return "atm_bersama_va";
    case "ARTHA_GRAHA_VA":
      return "artha_graha_va";
    case "BRI_VA":
      return "bri_va";
    case "PAYPAL":
      return "paypal";
    default:
      return "qris";
  }
}

/**
 * Create a custom transaction response object.
 *
 * @param orderId The order ID.
 * @param method The payment method.
 * @param amount The transaction amount.
 * @param projectSlug The project slug.
 * @param onlyQris Whether to use only QRIS payment method.
 * @param redirectUrl Optional redirect URL after payment.
 * @returns {SDKCreateTransactionResponse} The custom transaction response object.
 *
 * @throws {Error} If validation fails.
 *
 * @see {@link PaymentMethod} for available payment methods.
 * @see {@link SDKCreateTransactionResponse} for the response structure.
 */
export function createCustomResponse(
  orderId: string,
  method: PaymentMethod,
  amount: number,
  projectSlug: string,
  onlyQris: boolean = false,
  redirectUrl?: string
) {
  // Basic validation
  orderId = orderId.trim();

  // Validate inputs
  if (!method) {
    throw new Error("Payment method must be provided");
  }
  if (orderId.length < 5) {
    throw new Error("Order ID must be at least 5 characters long");
  }
  if (amount < 500) {
    throw new Error("Amount must be at least 500");
  }
  if (amount < 10000 && method === "PAYPAL") {
    throw new Error("Amount must be at least 10000 for PayPal payments");
  }

  // Generate url
  let paymentUrl = "";
  let prefix = "pay";

  // Determine payment method prefix
  if (method === "PAYPAL") prefix = "paypal";

  paymentUrl = `${prefix}/${projectSlug}/${amount}?order_id=${orderId}`;

  // Append redirect URL and onlyQris if provided
  if (redirectUrl) {
    paymentUrl += `&redirect=${encodeURIComponent(redirectUrl)}`;
  }
  if (onlyQris) {
    paymentUrl += `&qris_only=1`;
  }

  return {
    project: projectSlug,
    order_id: orderId,
    amount,

    payment_method: getActualPaymentMethod(method),

    payment: { payment_url: paymentUrl } as Payment & { payment_url: string },
    transaction: {} as Transaction,
  } as SDKCreateTransactionResponse;
}
