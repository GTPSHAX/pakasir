# API Reference

Dokumentasi lengkap untuk Pakasir SDK.

## Daftar Isi

- [Client](#client)
  - [Constructor](#constructor)
  - [Properties](#properties)
  - [Methods](#methods)
- [Types](#types)
  - [ClientConfig](#clientconfig)
  - [PaymentMethod](#paymentmethod)
  - [TransactionStatus](#transactionstatus)
  - [Response Types](#response-types)
- [Error Handling](#error-handling)

---

## Client

### Constructor

#### `new Pakasir(config: ClientConfig)`

Membuat instance baru dari Pakasir client.

**Parameters:**

| Parameter | Type | Required | Deskripsi |
|-----------|------|----------|-----------|
| `config` | `ClientConfig` | ✅ | Konfigurasi client yang berisi kredensial |
| `config.project` | `string` | ✅ | Project slug dari dashboard Pakasir |
| `config.api_key` | `string` | ✅ | API key untuk autentikasi |

**Throws:**

- `Error` - Jika project slug atau API key tidak disediakan

**Example:**

```typescript
import { Pakasir } from 'pakasir';

const pakasir = new Pakasir({
  project: 'my-store',
  api_key: 'pk_test_123...'
});
```

---

### Properties

#### `baseURL: string`

Base URL untuk API requests. Default: `https://app.pakasir.com/api`

**Getter:**
```typescript
const url = pakasir.baseURL;
```

**Setter:**
```typescript
pakasir.baseURL = 'https://custom.pakasir.com/api';
```

> ⚠️ **Note:** Umumnya hanya perlu diubah untuk testing atau custom deployments.

#### `projectSlug: string`

Project slug yang sedang digunakan.

**Getter:**
```typescript
const slug = pakasir.projectSlug;
```

**Setter:**
```typescript
pakasir.projectSlug = 'new-project-slug';
```

---

### Methods

#### `createTransaction()`

Membuat transaksi pembayaran baru.

```typescript
async createTransaction(
  orderId: string,
  method: PaymentMethod,
  amount: number,
  onlyQris?: boolean,
  redirectUrl?: string
): Promise<SDKCreateTransactionResponse>
```

**Parameters:**

| Parameter | Type | Required | Default | Deskripsi |
|-----------|------|----------|---------|-----------|
| `orderId` | `string` | ✅ | - | Unique identifier untuk transaksi (min 5 karakter) |
| `method` | `PaymentMethod` | ✅ | - | Metode pembayaran yang akan digunakan |
| `amount` | `number` | ✅ | - | Jumlah pembayaran dalam rupiah (min 500, harus integer) |
| `onlyQris` | `boolean` | ❌ | `false` | Tampilkan kode QRIS langsung (hanya untuk QRIS/ALL) |
| `redirectUrl` | `string` | ❌ | `undefined` | URL redirect setelah pembayaran selesai |

**Returns:**

`Promise<SDKCreateTransactionResponse>` - Object yang berisi detail transaksi dan payment URL.

**Response Structure:**

```typescript
{
  project: string;              // Project slug
  api_key: string;              // API key (untuk referensi)
  order_id: string;             // Order ID transaksi
  amount: number;               // Jumlah pembayaran
  payment_method: string;       // Metode pembayaran yang digunakan
  payment: {
    fee: number;                // Biaya admin
    payment_number: string;     // Nomor pembayaran / kode QR
    received: number;           // Jumlah yang akan diterima merchant
    total_payment: number;      // Total yang harus dibayar customer
    expired_at: string;         // Waktu kadaluarsa (ISO 8601)
    payment_url: string;        // URL untuk melakukan pembayaran
  };
  transaction: {
    status: TransactionStatus;  // Status transaksi
    completed_at: string | null; // Waktu selesai (ISO 8601) atau null
  };
}
```

**Throws:**

- `Error` - Jika `orderId` kurang dari 5 karakter
- `Error` - Jika `amount` kurang dari 500
- `Error` - Jika `amount` kurang dari 10000 untuk PayPal
- `Error` - Jika `onlyQris` true dengan metode pembayaran non-QRIS/ALL
- `Error` - Jika request API gagal
- `Error` - Jika validasi input gagal (lihat [validateInputs](#validateinputs))

**Example:**

```typescript
// Transaksi QRIS sederhana
const transaction = await pakasir.createTransaction(
  'order-123',
  'QRIS',
  50000
);

// Transaksi dengan QRIS langsung dan redirect URL
const qrisTransaction = await pakasir.createTransaction(
  'order-456',
  'QRIS',
  100000,
  true,
  'https://mystore.com/payment/success'
);

// Transaksi dengan Virtual Account BNI
const vaTransaction = await pakasir.createTransaction(
  'order-789',
  'BNI_VA',
  250000
);

console.log('Payment URL:', transaction.payment.payment_url);
console.log('Expires at:', transaction.payment.expired_at);
```

---

#### `cancelTransaction()`

Membatalkan transaksi pembayaran yang ada.

```typescript
async cancelTransaction(
  orderId: string,
  amount: number
): Promise<APITransactionCancelResponse>
```

**Parameters:**

| Parameter | Type | Required | Deskripsi |
|-----------|------|----------|-----------|
| `orderId` | `string` | ✅ | Unique identifier transaksi yang akan dibatalkan |
| `amount` | `number` | ✅ | Jumlah transaksi (harus sama dengan jumlah saat pembuatan) |

**Returns:**

`Promise<APITransactionCancelResponse>` - Response konfirmasi pembatalan.

```typescript
{
  success: boolean;  // Status pembatalan

}
```

**Throws:**

- `Error` - Jika validasi input gagal
- `Error` - Jika request API gagal

**Example:**

```typescript
const result = await pakasir.cancelTransaction('order-123', 50000);

if (result.success) {
  console.log('Transaksi berhasil dibatalkan');
} else {
  console.error('Gagal membatalkan transaksi');
}
```

---

#### `simulatePayment()`

Mensimulasikan pembayaran untuk keperluan testing.

```typescript
async simulatePayment(
  orderId: string,
  amount: number
): Promise<APITransactionSimulationResponse>
```

> ⚠️ **Note:** Method ini hanya tersedia di sandbox/test environment.

**Parameters:**

| Parameter | Type | Required | Deskripsi |
|-----------|------|----------|-----------|
| `orderId` | `string` | ✅ | Order ID yang akan disimulasikan |
| `amount` | `number` | ✅ | Jumlah pembayaran |

**Returns:**

`Promise<APITransactionSimulationResponse>` - Response simulasi.

```typescript
{
  success: boolean;  // Status simulasi
}
```

**Throws:**

- `Error` - Jika validasi input gagal
- `Error` - Jika request API gagal

**Example:**

```typescript
// 1. Buat transaksi terlebih dahulu
const transaction = await pakasir.createTransaction(
  'order-test-123',
  'QRIS',
  50000
);

// 2. Simulasikan pembayaran
const result = await pakasir.simulatePayment('order-test-123', 50000);

if (result.success) {
  console.log('Pembayaran berhasil disimulasikan');
  
  // 3. Cek status transaksi
  const details = await pakasir.getTransactionDetail('order-test-123', 50000);
  console.log('Status:', details.transaction.status); // 'completed'
}
```

---

#### `getTransactionDetail()`

Mengambil detail informasi transaksi termasuk status terkini.

```typescript
async getTransactionDetail(
  orderId: string,
  amount: number
): Promise<APITransactionDetailResponse>
```

**Parameters:**

| Parameter | Type | Required | Deskripsi |
|-----------|------|----------|-----------|
| `orderId` | `string` | ✅ | Order ID yang akan dicek |
| `amount` | `number` | ✅ | Jumlah transaksi |

**Returns:**

`Promise<APITransactionDetailResponse>` - Detail transaksi dengan status.

```typescript
{
  transaction: {
    order_id: string;           // Order ID
    amount: number;             // Jumlah transaksi
    payment_method: string;     // Metode pembayaran yang digunakan
    status: TransactionStatus;  // Status transaksi
    completed_at: string | null; // Waktu selesai atau null
  }
}
```

**Throws:**

- `Error` - Jika validasi input gagal
- `Error` - Jika request API gagal

**Example:**

```typescript
const details = await pakasir.getTransactionDetail('order-123', 50000);

console.log('Status:', details.transaction.status);
console.log('Order ID:', details.transaction.order_id);
console.log('Amount:', details.transaction.amount);

if (details.transaction.completed_at) {
  console.log('Completed at:', details.transaction.completed_at);
} else {
  console.log('Transaksi masih pending');
}

// Cek status secara berkala
const checkStatus = async () => {
  const details = await pakasir.getTransactionDetail('order-123', 50000);
  
  switch (details.transaction.status) {
    case 'completed':
      console.log('✅ Pembayaran berhasil!');
      break;
    case 'canceled':
      console.log('❌ Pembayaran dibatalkan');
      break;
    case 'pending':
      console.log('⏳ Menunggu pembayaran...');
      break;
  }
};
```

---

## Types

### ClientConfig

Konfigurasi untuk membuat instance Pakasir client.

```typescript
interface ClientConfig {
  /** Project slug identifier */
  project: string;
  
  /** API key untuk autentikasi */
  api_key: string;
}
```

**Example:**

```typescript
const config: ClientConfig = {
  project: 'my-online-store',
  api_key: 'pk_live_abc123...'
};
```

---

### PaymentMethod

Metode pembayaran yang didukung oleh sistem.

```typescript
type PaymentMethod =
  | "ALL"              // Semua metode pembayaran
  | "QRIS"             // Quick Response Code Indonesian Standard
  | "CLIMB_NIAGA_VA"   // CIMB Niaga Virtual Account
  | "BNI_VA"           // Bank BNI Virtual Account
  | "SAMPOERNA_VA"     // Bank Sampoerna Virtual Account
  | "BNC_VA"           // BNC Virtual Account
  | "MAYBANK_VA"       // Maybank Virtual Account
  | "PERMATA_VA"       // Bank Permata Virtual Account
  | "ATM_BERSAMA_VA"   // ATM Bersama Virtual Account
  | "ARTHA_GRAHA_VA"   // Bank Artha Graha Virtual Account
  | "BRI_VA"           // Bank BRI Virtual Account
  | "PAYPAL";          // PayPal
```

**Notes:**

- `ALL`: Menampilkan semua metode pembayaran yang tersedia
- `QRIS`: Dapat mencakup semua metode ketika `onlyQris` adalah `false`
- Minimal amount berbeda untuk setiap metode (PayPal minimal 10000)

---

### TransactionStatus

Status yang mungkin dari sebuah transaksi.

```typescript
type TransactionStatus = 
  | "pending"    // Transaksi dibuat tapi belum selesai
  | "canceled"   // Transaksi dibatalkan sebelum selesai
  | "completed"; // Transaksi berhasil diproses
```

**Status Flow:**

```
pending → completed
   ↓
canceled
```

---

### Response Types

#### SDKCreateTransactionResponse

Response yang dikembalikan saat membuat transaksi.

```typescript
interface SDKCreateTransactionResponse {
  // Konfigurasi Client
  project: string;
  api_key: string;
  
  // Informasi Transaksi
  order_id: string;
  amount: number;
  payment_method: string;
  
  // Informasi Pembayaran
  payment: {
    fee: number;
    payment_number: string;
    received: number;
    total_payment: number;
    expired_at: string;
    payment_url: string;
  };
  
  // Status Transaksi
  transaction: {
    status: TransactionStatus;
    completed_at: string | null;
  };
}
```

#### APITransactionDetailResponse

Response yang dikembalikan saat mengecek detail transaksi.

```typescript
interface APITransactionDetailResponse {
  transaction: {
    order_id: string;
    amount: number;
    payment_method: string;
    status: TransactionStatus;
    completed_at: string | null;
  };
}
```

#### APITransactionCancelResponse

Response yang dikembalikan saat membatalkan transaksi.

```typescript
interface APITransactionCancelResponse {
  success: boolean;
}
```

#### APITransactionSimulationResponse

Response yang dikembalikan saat mensimulasikan pembayaran.

```typescript
interface APITransactionSimulationResponse {
  success: boolean;
}
```

---

## Error Handling

### Validation Errors

SDK melakukan validasi input sebelum melakukan API request. Error berikut dapat terjadi:

#### Project & API Key Validation

```typescript
// Error: "Project slug and API key must be set."
const pakasir = new Pakasir({ project: '', api_key: '' });
```

#### Order ID Validation

```typescript
// Error: "Transaction ID must be provided."
await pakasir.createTransaction('', 'QRIS', 50000);

// Error: "Transaction ID must be a string."
await pakasir.createTransaction(123, 'QRIS', 50000);

// Error: "Transaction ID cannot be an empty string."
await pakasir.createTransaction('   ', 'QRIS', 50000);
```

#### Amount Validation

```typescript
// Error: "Amount must be greater than zero."
await pakasir.createTransaction('order-123', 'QRIS', 0);

// Error: "Amount must be an integer."
await pakasir.createTransaction('order-123', 'QRIS', 50000.50);

// Error: "Amount must be a valid number."
await pakasir.createTransaction('order-123', 'QRIS', NaN);

// Error: "Amount must be a finite number."
await pakasir.createTransaction('order-123', 'QRIS', Infinity);

// Error: "Amount must be a number."
await pakasir.createTransaction('order-123', 'QRIS', '50000');

// Error: "Amount must be less than or equal to ..."
await pakasir.createTransaction('order-123', 'QRIS', Number.MAX_SAFE_INTEGER + 1);
```

#### Payment Method Validation

```typescript
// Error: "onlyQris can only be true when payment method is QRIS or ALL"
await pakasir.createTransaction('order-123', 'BNI_VA', 50000, true);
```

### API Errors

Semua method API dapat throw error dengan format:

```typescript
try {
  await pakasir.createTransaction('order-123', 'QRIS', 50000);
} catch (error) {
  console.error(error.message);
  // "Failed to create transaction: [detail error]"
}
```

Error messages untuk setiap method:

- `createTransaction()`: `"Failed to create transaction: ..."`
- `cancelTransaction()`: `"Failed to cancel transaction: ..."`
- `simulatePayment()`: `"Failed to simulate payment: ..."`
- `getTransactionDetail()`: `"Failed to get transaction detail: ..."`

### Best Practices

```typescript
async function createPayment(orderId: string, amount: number) {
  try {
    const transaction = await pakasir.createTransaction(
      orderId,
      'QRIS',
      amount
    );
    
    return {
      success: true,
      data: transaction
    };
  } catch (error) {
    // Log error untuk debugging
    console.error('Payment creation failed:', error);
    
    // Return user-friendly error
    return {
      success: false,
      error: 'Gagal membuat pembayaran. Silakan coba lagi.'
    };
  }
}

// Dengan retry logic
async function createPaymentWithRetry(
  orderId: string,
  amount: number,
  maxRetries = 3
) {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await pakasir.createTransaction(orderId, 'QRIS', amount);
    } catch (error) {
      lastError = error;
      
      // Jangan retry jika error validasi
      if (error.message.includes('must be')) {
        throw error;
      }
      
      // Wait sebelum retry
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  
  throw lastError;
}
```

---

## Additional Notes

### Time Format

Semua timestamp menggunakan format ISO 8601:

```
2025-09-19T01:18:49.678622564Z
```

Convert ke Date object:

```typescript
const expiredAt = new Date(transaction.payment.expired_at);
console.log('Expires at:', expiredAt.toLocaleString('id-ID'));
```

### Amount Format

- Amount harus dalam **rupiah** (IDR)
- Harus berupa **integer** (tidak boleh desimal)
- Minimal **500** untuk kebanyakan metode
- Minimal **10000** untuk PayPal

```typescript
// ✅ Correct
await pakasir.createTransaction('order-1', 'QRIS', 50000);

// ❌ Wrong - desimal
await pakasir.createTransaction('order-1', 'QRIS', 50000.50);

// ❌ Wrong - terlalu kecil
await pakasir.createTransaction('order-1', 'QRIS', 100);
```

### Payment URL

Payment URL yang dikembalikan sudah lengkap dan siap digunakan:

```typescript
const transaction = await pakasir.createTransaction('order-1', 'QRIS', 50000);

// Redirect user ke payment page
window.location.href = transaction.payment.payment_url;

// Atau tampilkan dalam iframe
<iframe src={transaction.payment.payment_url} />
```

---

## Examples

Lihat folder `examples/` untuk contoh lengkap:

- [examples/esm/client.js](examples/esm/client.js) - Contoh menggunakan ES Modules
- [examples/commonjs/client.js](examples/commonjs/client.js) - Contoh menggunakan CommonJS
- [examples/esm/error-handling.js](examples/esm/error-handling.js) - Error handling patterns
- [examples/esm/payment-methods.js](examples/esm/payment-methods.js) - Berbagai metode pembayaran

---

Untuk pertanyaan lebih lanjut, silakan buka issue di [GitHub](https://github.com/gtpshax/pakasir/issues).
