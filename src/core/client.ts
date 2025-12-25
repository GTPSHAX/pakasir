import { DEFAULT_BASE_API_URL } from "../consts";
import type { CreateTransactionRequestBody, PaymentMethod } from "../types/pakasir";
import { makeRequest } from "../utils/request";

export default class Pakasir {
  private baseUrl = DEFAULT_BASE_API_URL;

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
  set apiKey(key: string) {
    this._apiKey = key;
  }

  // Public methods
  public CreateTransaction(id: string, method: PaymentMethod, amount: number) {
    // Determine actual payment method string
    const paymentMethod = this.getActualPaymentMethod(method);
    const url = `${this.baseUrl}/api/v1/projects/${this._projectSlug}/transactions`;

    // Prepare request body
    const body: CreateTransactionRequestBody = {
      project: this._projectSlug,
      order_id: id,
      amount,
      api_key: this._apiKey,
    };

    return makeRequest(url, "POST", body);
  }

  // Private methods
  private getActualPaymentMethod(method: PaymentMethod): string {
    switch (method) {
      case "QRIS":
        return "qris";
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
      default:
        throw new Error("Unsupported payment method");
    }
  }
}