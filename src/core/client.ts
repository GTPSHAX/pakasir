import { DEFAULT_BASE_URL, DEFAULT_BASE_API_PATH } from "../consts";
import type {
  APIBaseRequestBody,
  APITransactionCancelResponse,
  APITransactionResponse,
  PaymentMethod,
  CreateTransactionResponse,
} from "../types/pakasir";
import { makeRequest } from "../utils/request";
import { createCustomResponse, getActualPaymentMethod } from "../utils/utils";

/**
 * @brief Pakasir Client to interact with Pakasir Payment API
 *
 * @param projectSlug project slug
 * @param apiKey API key
 */
export default class Pakasir {
  private baseUrl = `${DEFAULT_BASE_URL}/${DEFAULT_BASE_API_PATH}`;

  private _projectSlug: string;
  private _apiKey: string;

  constructor(projectSlug: string, apiKey: string) {
    this._projectSlug = projectSlug;
    this._apiKey = apiKey;
  }

  // Setters and Getters
  get baseURL() {
    return this.baseUrl;
  }
  set baseURL(url: string) {
    this.baseUrl = url;
  }
  get projectSlug() {
    return this._projectSlug;
  }
  set projectSlug(slug: string) {
    this._projectSlug = slug;
  }
  get apiKey() {
    return this._apiKey;
  }
  set apiKey(key: string) {
    this._apiKey = key;
  }

  // Public methods
  /**
   * Create a new payment transaction.
   *
   * @param {string} id - Unique transaction ID.
   * @param {PaymentMethod} method - Payment method to use.
   * @param {number} amount - Amount to be paid.
   * @param {boolean} [onlyQris] - Show QRIS code directly (QRIS or ALL only).
   * @param {string} [redirectUrl] - Optional redirect URL after payment.
   *
   * @returns {Promise<CreateTransactionResponse>} Created transaction details.
   *
   * @example
   * ```ts
   * const pakasir = new Pakasir("your-project-slug", "your-api-key");
   *
   * const transaction = await pakasir.createTransaction(
   *   "order-123",
   *   "QRIS",
   *   100000,
   *   true,
   *   "https://your-redirect-url.com"
   * );
   *
   * console.log(transaction);
   * ```
   *
   * @throws {Error} If the request fails.
   * @see {@link PaymentMethod} for available payment methods.
   * @see {@link CreateTransactionResponse} for the response structure.
   */
  public async CreateTransaction(
    id: string,
    method: PaymentMethod,
    amount: number,
    onlyQris: boolean = false,
    redirectUrl?: string
  ) {
    if (onlyQris && !["QRIS", "ALL"].includes(method)) {
      throw new Error(
        "onlyQris can only be true when payment method is QRIS or ALL"
      );
    }

    // Determine actual payment method string
    const paymentMethod = getActualPaymentMethod(method);
    const url = `${this.baseUrl}/transactioncreate/${paymentMethod}`;

    // Create payload
    const customResponse = createCustomResponse(
      id,
      method,
      amount,
      this._projectSlug,
      this._apiKey,
      onlyQris,
      redirectUrl
    );

    // Prepare request body
    const body: APIBaseRequestBody = {
      project: this._projectSlug,
      order_id: id,
      amount,
      api_key: this._apiKey,
    };

    try {
      const response = await makeRequest<APITransactionResponse>(
        url,
        "POST",
        body
      );

      // Map API response to custom response
      customResponse.order_id = response.payment.order_id;
      customResponse.amount = response.payment.amount;
      customResponse.payment_method = response.payment.payment_method;

      customResponse.payment.fee = response.payment.fee;
      customResponse.payment.received = response.payment.received;
      customResponse.payment.total_payment = response.payment.total_payment;

      customResponse.payment.payment_number = response.payment.payment_number;
      customResponse.payment.expired_at = response.payment.expired_at;

      customResponse.payment.payment_url = `${DEFAULT_BASE_URL}/${customResponse.payment.payment_url}`;

      return customResponse;
    } catch (e: unknown) {
      if (e instanceof Error) {
        e.message = `Failed to create transaction: ${e.message}`;
      }
      throw e;
    }
  }

  /**
   * Cancel an existing payment transaction.
   *
   * @param {string} id - Unique transaction ID.
   * @param {number} amount - Amount to be canceled.
   *
   * @returns {Promise<APITransactionCancelResponse>} Cancellation response.
   *
   * @example
   * ```ts
   * const pakasir = new Pakasir("your-project-slug", "your-api-key");
   *
   * const cancelResponse = await pakasir.CancelTransaction("order-123", 100000);
   *
   * console.log(cancelResponse);
   * ```
   *
   * @throws {Error} If the request fails.
   * @see {@link APITransactionCancelResponse} for the response structure.
   */
  public async CancelTransaction(id: string, amount: number) {
    const url = `${this.baseUrl}/transactioncancel`;

    // Prepare request body
    const body: APIBaseRequestBody = {
      project: this._projectSlug,
      order_id: id,
      amount,
      api_key: this._apiKey,
    };

    try {
      const response = await makeRequest<APITransactionCancelResponse>(
        url,
        "POST",
        body
      );

      return response;
    } catch (e: unknown) {
      if (e instanceof Error) {
        e.message = `Failed to cancel transaction: ${e.message}`;
      }
      throw e;
    }
  }
}
