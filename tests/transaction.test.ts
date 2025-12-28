import "dotenv/config";
import { Client } from "../dist/index.cjs";

let client: Client;
let testCounter = 0;
const amount = 10000;

// Generate unique transaction ID for each test
const generateTxId = () => `test-order-${Date.now()}-${++testCounter}`;

beforeAll(() => {
  const projectSlug = process.env.PAKASIR_PROJECT_SLUG;
  const apiKey = process.env.PAKASIR_API_KEY;
  if (!projectSlug || !apiKey) {
    throw new Error(
      "PAKASIR_PROJECT_SLUG and PAKASIR_API_KEY must be set in environment variables for tests."
    );
  }

  client = new Client({
    project: projectSlug,
    api_key: apiKey,
  });
});

describe("Input Validation", () => {
  test("Should reject order ID less than 5 characters", async () => {
    await expect(
      client.createTransaction("123", "QRIS", 1000)
    ).rejects.toThrow("Order ID must be at least 5 characters long");
  });

  test("Should reject amount less than 500", async () => {
    await expect(
      client.createTransaction("order-123", "QRIS", 400)
    ).rejects.toThrow("Amount must be at least 500");
  });

  test("Should reject PAYPAL with amount < 10000", async () => {
    await expect(
      client.createTransaction("order-123", "PAYPAL", 5000)
    ).rejects.toThrow("Amount must be at least 10000 for PayPal payments");
  });

  test("Should reject onlyQris=true with non-QRIS method", async () => {
    await expect(
      client.createTransaction("order-123", "BNI_VA", 1000, true)
    ).rejects.toThrow("onlyQris can only be true when payment method is QRIS or ALL");
  });
});

describe("Transaction (ALL) Method", () => {
  let transactionId: string;

  test("Should create a ALL method successfully", async () => {
    transactionId = generateTxId();
    const paymentMethod = "ALL";

    const response = await client.createTransaction(
      transactionId,
      paymentMethod,
      amount
    );

    expect(response).toHaveProperty("payment");
    expect(response).toHaveProperty("order_id");
    expect(response).toHaveProperty("amount");
    expect(response).toHaveProperty("payment_method");
    expect(response.amount).toBe(amount);
    expect(response.order_id).toBe(transactionId);
    expect(response.payment).toHaveProperty("payment_url");
    expect(response.payment).toHaveProperty("fee");
    expect(response.payment).toHaveProperty("total_payment");
    expect(response.payment.payment_url).toContain(transactionId);
  });

  test("Should get transaction detail successfully", async () => {
    const detail = await client.getTransactionDetail(transactionId, amount);

    expect(detail).toHaveProperty("transaction");
    expect(detail.transaction).toHaveProperty("status");
    expect(detail.transaction).toHaveProperty("order_id");
    expect(detail.transaction.order_id).toBe(transactionId);
    expect(detail.transaction.amount).toBe(amount);
  });

  test("Should cancel the ALL method successfully", async () => {
    const response = await client.cancelTransaction(transactionId, amount);

    expect(response).toHaveProperty("success");
    expect(response.success).toBe(true);
  });
});

describe("Transaction QRIS Method", () => {
  let transactionId: string;

  test("Should create a QRIS method successfully", async () => {
    transactionId = generateTxId();
    const paymentMethod = "QRIS";

    const response = await client.createTransaction(
      transactionId,
      paymentMethod,
      amount,
      true,
      "https://example.com/redirect"
    );

    expect(response).toHaveProperty("payment");
    expect(response.order_id).toBe(transactionId);
    expect(response.amount).toBe(amount);
    expect(response.payment.payment_url).toContain("qris_only=1");
    expect(response.payment.payment_url).toContain("redirect=");
  });

  test("Should cancel the QRIS method successfully", async () => {
    const response = await client.cancelTransaction(transactionId, amount);

    expect(response).toHaveProperty("success");
    expect(response.success).toBe(true);
  });
});

describe("Transaction 'BANK' Method", () => {
  let transactionId: string;

  test("Should create a bank transfer method successfully", async () => {
    transactionId = generateTxId();
    const paymentMethod = "BNI_VA";

    const response = await client.createTransaction(
      transactionId,
      paymentMethod,
      amount
    );

    expect(response).toHaveProperty("payment");
    expect(response.order_id).toBe(transactionId);
    expect(response.amount).toBe(amount);
    expect(response.payment_method).toBe("bni_va");
  });

  test("Should cancel the bank transfer method successfully", async () => {
    const response = await client.cancelTransaction(transactionId, amount);

    expect(response).toHaveProperty("success");
    expect(response.success).toBe(true);
  });
});

describe("Transaction PAYPAL Method", () => {
  let transactionId: string;

  test("Should create a paypal method successfully", async () => {
    transactionId = generateTxId();
    const paymentMethod = "PAYPAL";

    const response = await client.createTransaction(
      transactionId,
      paymentMethod,
      amount
    );

    expect(response).toHaveProperty("payment");
    expect(response.order_id).toBe(transactionId);
    expect(response.amount).toBe(amount);
    expect(response.payment_method).toBe("paypal");
    expect(response.payment.payment_url).toContain("paypal");
  });

  test("Should cancel the paypal method successfully", async () => {
    const response = await client.cancelTransaction(transactionId, amount);

    expect(response).toHaveProperty("success");
    expect(response.success).toBe(true);
  });
});

describe("Transaction payment simulation", () => {
  test("Should simulate payment successfully", async () => {
    const transactionId = generateTxId();
    const paymentMethod = "QRIS";

    // First, create a transaction
    await client.createTransaction(
      transactionId,
      paymentMethod,
      amount
    );

    // Then, simulate the payment
    const response = await client.simulatePayment(
      transactionId,
      amount
    );

    expect(response).toHaveProperty("success");
    expect(response.success).toBe(true);
  });
});

describe("Canceling or get detail of non-existing transaction", () => {
  test("Should fail to cancel non-existing transaction", async () => {
    const nonExistingTransactionId = "non-existing-id";

    await expect(
      client.cancelTransaction(nonExistingTransactionId, amount)
    ).rejects.toThrow("Failed to cancel transaction");
  });

  test("Should fail to get detail of non-existing transaction", async () => {
    const nonExistingTransactionId = "non-existing-id";

    await expect(
      client.getTransactionDetail(nonExistingTransactionId, amount)
    ).rejects.toThrow("Failed to get transaction detail");
  });
});