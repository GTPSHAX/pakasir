import type { ClientConfig } from "./client";
import type {
  BaseTransaction,
  Payment,
  Transaction,
  TransactionMetadata,
} from "./transaction";

/**
 * Base request body for API calls.
 *
 * @remarks
 * Used for creating, cancelling, simulating, and checking transactions.
 * Combines client authentication with core transaction data.
 *
 * @see {@link ClientConfig} for client authentication fields.
 * @see {@link BaseTransaction} for core transaction fields.
 */
export interface APIBaseRequestBody extends ClientConfig, BaseTransaction {}

/**
 * API response for transaction operations.
 *
 * @remarks
 * Contains complete payment information including transaction details,
 * payment breakdown, and metadata.
 */
export interface APITransactionResponse {
  /**
   * Complete payment information combining transaction, payment, and metadata
   *
   * @see {@link BaseTransaction} for core transaction fields.
   * @see {@link Payment} for payment breakdown fields.
   * @see {@link TransactionMetadata} for additional metadata fields.
   */
  payment: BaseTransaction & Payment & TransactionMetadata;
}

/**
 * API response for transaction detail operations.
 *
 * @remarks
 * Contains detailed transaction state information including status,
 * completion details, and metadata.
 */
export interface APITransactionDetailResponse {
  /**
   * Detailed transaction information combining core transaction data,
   * transaction state, and metadata.
   *
   * @see {@link BaseTransaction} for core transaction fields.
   * @see {@link Transaction} for transaction state fields.
   * @see {@link TransactionMetadata} for additional metadata fields.
   */
  transaction: BaseTransaction & Transaction & TransactionMetadata;
}

/**
 * API response for transaction cancellation operations.
 *
 * @remarks
 * Indicates whether the cancellation request was processed successfully.
 */
export interface APITransactionCancelResponse {
  /**
   * Process status.
   *
   * @remarks
   * `true` if process was successful, `false` otherwise.
   */
  success: boolean;
}

/**
 * API response for transaction simulation operations.
 *
 * @remarks
 * Indicates whether the simulation was processed successfully.
 * Uses the same response structure as transaction cancellation.
 *
 * @see {@link APITransactionCancelResponse} for response fields.
 */
export type APITransactionSimulationResponse = APITransactionCancelResponse;
