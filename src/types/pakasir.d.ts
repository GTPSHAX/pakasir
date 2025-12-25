export type PaymentMethod =
  | "QRIS"
  | "CLIMB_NIAGA_VA"
  | "BNI_VA"
  | "SAMPOERNA_VA"
  | "BNC_VA"
  | "MAYBANK_VA"
  | "PERMATA_VA"
  | "ATM_BERSAMA_VA"
  | "ARTHA_GRAHA_VA"
  | "BRI_VA";

export interface APIBaseRequestBody {
  project: string;
  api_key: string;
}

export interface CreateTransactionRequestBody extends APIBaseRequestBody {
  order_id: string;
  amount: number;
}