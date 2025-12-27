/**
 * Represents the various payment methods supported by the payment system.
 * 
 * @remarks
 * - `ALL`: All available payment methods
 * - `QRIS`: QRIS payment method, which may include all available methods when `qrisOnly` is false
 * - Other specific payment methods like `CLIMB_NIAGA_VA`, `BNI_VA`, etc.
 */
export type PaymentMethod =
  | "ALL"
  | "QRIS"
  | "CLIMB_NIAGA_VA"
  | "BNI_VA"
  | "SAMPOERNA_VA"
  | "BNC_VA"
  | "MAYBANK_VA"
  | "PERMATA_VA"
  | "ATM_BERSAMA_VA"
  | "ARTHA_GRAHA_VA"
  | "BRI_VA"
  | "PAYPAL";

/**
 * Represents the possible states of a transaction in the payment system.
 * 
 * @remarks
 * - `pending`: Transaction initiated but not yet completed
 * - `canceled`: Transaction was cancelled before completion
 * - `completed`: Transaction successfully processed
 */
export type TransactionStatus = 
  | "pending"
  | "canceled"
  | "completed";

/**
 * Core transaction information present in all transaction responses.
 * 
 * @remarks
 * These fields are guaranteed to exist in every transaction-related API response.
 */
export interface BaseTransaction {
  /** Unique identifier for the order */
  order_id: string;
  
  /** Total transaction amount in the base currency unit */
  amount: number;
}

/**
 * Additional metadata about the transaction.
 * 
 * @remarks
 * Contains supplementary information that's always included in transaction responses.
 */
export interface TransactionMetadata {
  /** 
   * Payment method used for this transaction.
   * 
   * @remarks
   * Returned as a string representing the method with lowercase and underscores.
   * 
   * @see {@link PaymentMethod} for possible values
   */
  payment_method: string;
}

/**
 * Transaction state and lifecycle information.
 * 
 * @remarks
 * Tracks the current status and completion details of a transaction.
 */
export interface Transaction {
  /** Current status of the transaction */
  status: TransactionStatus;
  
  /** 
   * ISO 8601 timestamp when the transaction was completed.
   * 
   * @remarks
   * Will be `null` if the transaction hasn't been completed yet.
   * 
   * @example
   * ```
   * "2025-09-19T01:18:49.678622564Z"
   * ```
   */
  completed_at: string | null;
}

/**
 * Payment-specific details and financial breakdown.
 * 
 * @remarks
 * Contains all monetary values and payment identifiers associated with a transaction.
 */
export interface Payment {
  /** Processing fee charged for this payment */
  fee: number;
  
  /** 
   * QR code or unique payment number associated with this transaction.
   * 
   * @remarks
   * Used for payment verification and tracking.
   */
  payment_number: string;
  
  /** Net amount the merchant will receive after fees */
  received: number;
  
  /** Total amount the customer needs to pay */
  total_payment: number;
  
  /** 
   * ISO 8601 timestamp when the payment expires.
   * 
   * @remarks
   * After this time, the payment can no longer be completed.
   * 
   * @example
   * ```
   * "2025-09-19T01:18:49.678622564Z"
   * ```
   */
  expired_at: string;
}