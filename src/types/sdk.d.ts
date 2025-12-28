import type { ClientConfig } from "./client";
import type { BaseTransaction, Transaction, Payment, TransactionMetadata } from "./transaction";

/**
 * SDK custom response for transaction operations.
 * 
 * @remarks
 * Enhanced transaction response that includes payment details, transaction state,
 * and a payment URL for completing the transaction. Combines client configuration,
 * core transaction data, and metadata.
 * 
 * @see {@link ClientConfig} for client authentication fields.
 * @see {@link BaseTransaction} for core transaction fields.
 * @see {@link TransactionMetadata} for additional metadata fields.
 * @see {@link Payment} for payment breakdown fields.
 * @see {@link Transaction} for transaction state fields.
 */
export interface SDKCreateTransactionResponse extends ClientConfig, BaseTransaction, TransactionMetadata {
  /** 
   * Payment information with payment URL.
   * 
   * @see {@link Payment} for payment breakdown fields.
   */
  payment: Payment & {
    /** URL for completing the payment */
    payment_url: string;
  };
  
  /** 
   * Transaction state information.
   * 
   * @see {@link Transaction} for transaction state fields.
   */
  transaction: Transaction;
}