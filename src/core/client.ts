import { DEFAULT_BASE_URL, DEFAULT_BASE_API_PATH } from "../consts";
import type {
  APITransactionDetailResponse,
  APIBaseRequestBody,
  APITransactionCancelResponse,
  APITransactionResponse,
  APITransactionSimulationResponse,
} from "../types/api";
import type { ClientConfig } from "../types/client";
import type { PaymentMethod } from "../types/transaction";
import { makeRequest } from "../utils/request";
import { createCustomResponse, getActualPaymentMethod } from "../utils/utils";

/**
 * Main client for interacting with the Pakasir Payment Gateway API.
 *
 * @remarks
 * This class provides methods to create, cancel, simulate, and query payment transactions.
 * Use the {@link Pakasir} class as a more descriptive alias.
 *
 * @example
 * ```ts
 * const client = new Client({
 *   project: 'your-project-slug',
 *   api_key: 'your-api-key'
 * });
 * ```
 *
 * @see {@link Pakasir} for the alias class.
 * @see {@link ClientConfig} for configuration options.
 */
export class Client {
  private _baseUrl = `${DEFAULT_BASE_URL}/${DEFAULT_BASE_API_PATH}`;

  private _projectSlug: string;
  private _apiKey: string;

  /**
   * Creates a new Pakasir client instance.
   *
   * @param config - Client configuration containing project credentials
   *
   * @throws {Error} If project slug or API key is missing
   *
   * @example
   * ```ts
   * const client = new Client({
   *   project: 'my-store',
   *   api_key: 'pk_test_123...'
   * });
   * ```
   */
  constructor(config: ClientConfig) {
    this._projectSlug = config.project;
    this._apiKey = config.api_key;
  }

  // Setters and Getters
  /**
   * Gets the base URL for API requests.
   *
   * @returns The current base URL (default: https://app.pakasir.com/api)
   */
  get baseURL() {
    return this._baseUrl;
  }
  /**
   * Sets a custom base URL for API requests.
   *
   * @param url - Custom base URL for the API
   *
   * @remarks
   * This is typically only needed for testing or custom deployments.
   *
   * @example
   * ```ts
   * client.baseURL = 'https://custom.pakasir.com/api';
   * ```
   */
  set baseURL(url: string) {
    this._baseUrl = url;
  }
  /**
   * Gets the current project slug.
   *
   * @returns The project slug used for requests
   */
  get projectSlug() {
    return this._projectSlug;
  }
  /**
   * Sets a new project slug.
   *
   * @param slug - New project slug to use
   *
   * @example
   * ```ts
   * client.projectSlug = 'new-project-slug';
   * ```
   */
  set projectSlug(slug: string) {
    this._projectSlug = slug;
  }

  // Private methods
  /**
   * Validates transaction inputs before making API requests.
   *
   * @param orderId - The order ID to validate
   * @param amount - The transaction amount to validate
   *
   * @returns True if validation passes
   *
   * @throws {Error} If project slug or API key is not set
   * @throws {Error} If order ID is invalid (empty, not a string)
   * @throws {Error} If amount is invalid (negative, NaN, non-integer, exceeds MAX_SAFE_INTEGER)
   *
   * @private
   */
  validateInputs(orderId: string, amount: number) {
    if (!this._projectSlug || !this._apiKey) {
      throw new Error("Project slug and API key must be set.");
    }
    if (!orderId) {
      throw new Error("Transaction ID must be provided.");
    }
    if (amount <= 0) {
      throw new Error("Amount must be greater than zero.");
    }
    if (!Number.isInteger(amount)) {
      throw new Error("Amount must be an integer.");
    }
    if (isNaN(amount)) {
      throw new Error("Amount must be a valid number.");
    }
    if (!isFinite(amount)) {
      throw new Error("Amount must be a finite number.");
    }
    if (typeof orderId !== "string") {
      throw new Error("Transaction ID must be a string.");
    }
    if (typeof amount !== "number") {
      throw new Error("Amount must be a number.");
    }
    if (amount > Number.MAX_SAFE_INTEGER) {
      throw new Error(
        `Amount must be less than or equal to ${Number.MAX_SAFE_INTEGER}.`
      );
    }
    if (orderId.trim().length === 0) {
      throw new Error("Transaction ID cannot be an empty string.");
    }
    orderId = orderId.trim();
    return true;
  }

  // Public methods
  /**
   * Creates a new payment transaction.
   *
   * @param orderId - Unique transaction identifier (min 5 characters)
   * @param method - Payment method to use
   * @param amount - Amount to be paid (min 500, must be integer)
   * @param [onlyQris=false] - Show QRIS code directly (only for QRIS or ALL methods)
   * @param [redirectUrl] - Optional redirect URL after payment completion
   *
   * @returns Promise resolving to transaction details including payment URL
   *
   * @throws {Error} If orderId is less than 5 characters
   * @throws {Error} If amount is less than 500
   * @throws {Error} If amount is less than 10000 for PayPal
   * @throws {Error} If onlyQris is true with non-QRIS/ALL payment method
   * @throws {Error} If the API request fails
   *
   * @example
   * ```ts
   * const pakasir = new Pakasir({
   *   project: 'your-project-slug',
   *   api_key: 'your-api-key'
   * });
   *
   * const transaction = await pakasir.createTransaction(
   *   'order-123',
   *   'QRIS',
   *   100000,
   *   true,
   *   'https://your-redirect-url.com'
   * );
   *
   * console.log(transaction.payment.payment_url);
   * ```
   *
   * @see {@link PaymentMethod} for available payment methods
   * @see {@link SDKCreateTransactionResponse} for the response structure
   */
  public async createTransaction(
    orderId: string,
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
    const url = `${this._baseUrl}/transactioncreate/${paymentMethod}`;

    // Create payload
    const customResponse = createCustomResponse(
      orderId,
      method,
      amount,
      this._projectSlug,
      onlyQris,
      redirectUrl
    );

    // Prepare request body
    const body: APIBaseRequestBody = {
      project: this._projectSlug,
      order_id: orderId,
      amount,
      api_key: this._apiKey,
    };

    try {
      const response = await makeRequest<APITransactionResponse, APIBaseRequestBody>(
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
   * @param orderId - Unique transaction ID.
   * @param amount - Amount to be canceled.
   *
   * @returns Cancellation response.
   *
   * @example
   * ```ts
   * const pakasir = new Pakasir({
   *  project: 'your-project-slug',
   *  api_key: 'your-api-key'
   * });
   *
   * const cancelResponse = await pakasir.cancelTransaction("order-123", 100000);
   *
   * console.log(cancelResponse);
   * ```
   *
   * @throws {Error} If the request fails.
   * @see {@link APITransactionCancelResponse} for the response structure.
   */
  public async cancelTransaction(orderId: string, amount: number) {
    this.validateInputs(orderId, amount);
    const url = `${this._baseUrl}/transactioncancel`;

    // Prepare request body
    const body: APIBaseRequestBody = {
      project: this._projectSlug,
      order_id: orderId,
      amount,
      api_key: this._apiKey,
    };

    try {
      const response = await makeRequest<APITransactionCancelResponse, APIBaseRequestBody>(
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

  /**
   * Simulates a payment for testing purposes.
   *
   * @remarks
   * This method is only available in sandbox/test environments.
   * Use this to test payment flows without real transactions.
   *
   * @param orderId - The order ID to simulate payment for
   * @param amount - The amount to simulate
   *
   * @returns Promise resolving to simulation response with success status
   *
   * @throws {Error} If validation fails
   * @throws {Error} If the API request fails
   *
   * @example
   * ```ts
   * // First create a transaction
   * const tx = await pakasir.createTransaction('order-123', 'QRIS', 50000);
   *
   * // Then simulate the payment
   * const result = await pakasir.simulatePayment('order-123', 50000);
   * console.log('Simulation success:', result.success);
   * ```
   */
  public async simulatePayment(orderId: string, amount: number) {
    this.validateInputs(orderId, amount);
    const url = `${this._baseUrl}/paymentsimulation`;

    // Prepare request body
    const body: APIBaseRequestBody = {
      project: this._projectSlug,
      order_id: orderId,
      amount,
      api_key: this._apiKey,
    };

    try {
      const response = await makeRequest<APITransactionSimulationResponse, APIBaseRequestBody>(
        url,
        "POST",
        body
      );
      return response;
    } catch (e: unknown) {
      if (e instanceof Error) {
        e.message = `Failed to simulate payment: ${e.message}`;
      }
      throw e;
    }
  }

  /**
   * Retrieves detailed information about a transaction including its current status.
   *
   * @param orderId - The order ID to retrieve details for
   * @param amount - The transaction amount
   *
   * @returns Promise resolving to the transaction detail response with status
   *
   * @throws {Error} If validation fails
   * @throws {Error} If the API request fails
   *
   * @example
   * ```ts
   * const details = await pakasir.getTransactionDetail('order-123', 50000);
   * console.log('Status:', details.transaction.status);
   * console.log('Completed:', details.transaction.completed_at);
   * ```
   *
   * @see {@link APITransactionDetailResponse} for the response structure
   */
  public async getTransactionDetail(orderId: string, amount: number) {
    this.validateInputs(orderId, amount);

    const params = new URLSearchParams({
      project: this._projectSlug,
      amount: amount.toString(),
      order_id: orderId,
      api_key: this._apiKey,
    });
    const url = `${this._baseUrl}/transactiondetail?${params.toString()}`;

    try {
      const response = await makeRequest<APITransactionDetailResponse, APIBaseRequestBody>(
        url,
        "GET"
      );
      return response;
    } catch (e: unknown) {
      if (e instanceof Error) {
        e.message = `Failed to get transaction detail: ${e.message}`;
      }
      throw e;
    }
  }
}

/**
 * Alias for the {@link Client} class.
 *
 * @remarks
 * Provides a more descriptive name for the Pakasir Payment API client.
 *
 * @see {@link Client} for implementation details.
 */
export class Pakasir extends Client {}
