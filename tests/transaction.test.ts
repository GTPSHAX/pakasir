import "dotenv/config";
import { Pakasir } from "../src";

describe("Transaction Creation", () => {
  let client: Pakasir;
  let transactionId: string = Date.now().toString();
  let amount: number;

  beforeAll(() => {
    const projectSlug = process.env.PAKASIR_PROJECT_SLUG;
    const apiKey = process.env.PAKASIR_API_KEY;
    if (!projectSlug || !apiKey) {
      throw new Error("PAKASIR_PROJECT_SLUG and PAKASIR_API_KEY must be set in environment variables for tests.");
    }
    
    client = new Pakasir({
      project: projectSlug,
      api_key: apiKey,
    });
    amount = 10000;
  });

  test("Should create a ALL method successfully", async () => {
    const paymentMethod = "ALL";

    const response = await client.createTransaction(transactionId, paymentMethod, amount);

    expect(response).toHaveProperty("payment");
    expect(response.amount).toBe(amount);
    expect(response.order_id).toBe(transactionId);
  });

  test("Should cancel the ALL method successfully", async () => {
    const response = await client.cancelTransaction(transactionId, amount);

    expect(response).toHaveProperty("success");
  });

  test("Should create a QRIS method successfully", async () => {
    transactionId = (Date.now() + 1).toString(); // Ensure unique order_id
    const paymentMethod = "QRIS";

    const response = await client.createTransaction(transactionId, paymentMethod, amount, true, "https://example.com/redirect");

    expect(response).toHaveProperty("payment");
    expect(response.order_id).toBe(transactionId);
    expect(response.amount).toBe(amount);
  });

  test("Should cancel the QRIS method successfully", async () => {
    const response = await client.cancelTransaction(transactionId, amount);

    expect(response).toHaveProperty("success");
  });
});