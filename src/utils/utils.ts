import type { CreateTransactionResponse, PaymentInfo, PaymentMethod, TransactionInfo } from "../types/pakasir";

/**
 * Get the actual payment method string for API requests.
 * @param method The payment method type.
 * @returns {string} The actual payment method string.
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
 * @param id The order ID.
 * @param method The payment method.
 * @param amount The transaction amount.
 * @param projectSlug The project slug.
 * @param apiKey The API key.
 * @param onlyQris Whether to use only QRIS payment method.
 * @param redirectUrl Optional redirect URL after payment.
 * @returns {CreateTransactionResponse} The custom transaction response object.
 * 
 * @throws {Error} If validation fails.
 * 
 * @see {@link PaymentMethod} for available payment methods.
 * @see {@link CreateTransactionResponse} for the response structure.
 */
export function createCustomResponse(
  id: string,
  method: PaymentMethod,
  amount: number,
  projectSlug: string,
  apiKey: string,
  onlyQris: boolean = false,
  redirectUrl?: string
) {
  // Basic validation
  id = id.trim();

  // Validate inputs
  if (!projectSlug || !apiKey) {
    throw new Error("Project slug and API key must be provided");
  }
  if (!method) {
    throw new Error("Payment method must be provided");
  }
  if (id.length < 5) {
    throw new Error("Order ID must be at least 5 characters long");
  }
  if (amount < 500) {
    throw new Error("Amount must be at least 500");
  }
  if (amount < 10000 && method === 'PAYPAL') {
    throw new Error("Amount must be at least 10000 for PayPal payments");
  }

  // Generate url
  let paymentUrl = "";
  let prefix = "pay";

  // Determine payment method prefix
  if (method === "PAYPAL") prefix = "paypal";

  paymentUrl = `${prefix}/${projectSlug}/${amount}?order_id=${id}`;

  // Append redirect URL and onlyQris if provided
  if (redirectUrl) {
    paymentUrl += `&redirect=${encodeURIComponent(redirectUrl)}`;
  }
  if (onlyQris) {
    paymentUrl += `&qris_only=1`;
  }

  return {
    project: projectSlug,
    api_key: apiKey,
    order_id: id,
    amount,
    
    payment_method: getActualPaymentMethod(method),

    payment: { payment_url: paymentUrl } as PaymentInfo & { payment_url: string },
    transaction: {} as TransactionInfo,
  } as CreateTransactionResponse;
}
