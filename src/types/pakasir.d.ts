// Base types
/** Pakasir Configuration */
export interface PakasirConfig {
  /** project slug */
  project: string;
  /** API key */
  api_key: string;
}

/** 
 * Available Payment Methods 
 * @note "ALL" means all available methods. "QRIS" methods also show all available methods, enable qrisOnly in transaction to show only QRIS code.
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

/** Payment Information */
export interface PaymentInfo {
  /** fee for the payment */
  fee: number;
  /** unique payment number */
  payment_number: string;
  /** total amount to be received (merchant) */
  received: number;
  /** total amount to be paid by customer */
  total_payment: number;

  /** payment expiration date */
  expired_at: string;
}

/** Transaction Information */
export interface TransactionInfo {
  /** Current status of the transaction */
  status: 'pending' | 'canceled' | 'completed';

  /** 
   * Transaction completion date
   * @note null if not completed yet
   */
  completed_at: string | null;
}

/** 
 * Additional Information
 * @note Just to defined some information that always exist in the response
 */
export interface AdditionalInfo {
  /** payment method used in the transaction */
  payment_method: string;
}
////////////////////////////////

// API
/** Base Transaction Data */
export interface BaseTransactionData {
  /** unique order identifier */
  order_id: string;
  /** total amount (money) for the transaction */
  amount: number;
}
/** Base API Request Body
 * @note extends BaseTransactionData
 * @see {@link BaseTransactionData} for the base transaction fields.
*/
export interface APIBaseRequestBody extends BaseTransactionData {
  /** project slug */
  project: string;
  /** API key */
  api_key: string;
}

/** API Transaction Response */
export interface APITransactionResponse {
  /**
   * Payment Information
   * @note extends BaseTransactionData, PaymentInfo, AdditionalInfo
   * @see {@link BaseTransactionData} for the base transaction fields.
   * @see {@link PaymentInfo} for the payment information fields.
   * @see {@link AdditionalInfo} for the additional information fields.
   */
  payment: BaseTransactionData & PaymentInfo & AdditionalInfo;
}
/** API Transaction Detail Response */
export interface APITransactionDetailResponse {
  /**
   * Transaction Information
   * @note extends BaseTransactionData, TransactionInfo, AdditionalInfo
   * @see {@link BaseTransactionData} for the base transaction fields.
   * @see {@link TransactionInfo} for the transaction information fields.
   * @see {@link AdditionalInfo} for the additional information fields.
   */
  transaction: BaseTransactionData & TransactionInfo & AdditionalInfo;
}
/** API Transaction Cancel Response */
export interface APITransactionCancelResponse {
  /**
   * Cancellion status
   * @note true if cancellation successful, false otherwise
   */
  success: boolean;
}
////////////////////////////////

// Custom API
/** Create Transaction Response (built-in response)
 * @note extends BaseTransactionData, AdditionalInfo, PaymentInfo
 * @see {@link BaseTransactionData} for the base transaction fields.
 * @see {@link AdditionalInfo} for the additional information fields.
 * @see {@link PaymentInfo} for the payment information fields.
 */
export interface CreateTransactionResponse extends BaseTransactionData, AdditionalInfo {
  payment: PaymentInfo & {
    payment_url: string;
  };
}
///////////////////////////////