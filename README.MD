# Pakasir

<img src="images/pakasir.png" alt="Logo Pakasir" width="100" alight="left">

Modul klien Node.js yang ringan dan mudah digunakan untuk berkomunikasi dengan payment gateway [Pakasir](https://pakasir.com).

[![NPM Version](https://img.shields.io/npm/v/pakasir.svg)](https://www.npmjs.com/package/pakasir)
[![License](https://img.shields.io/npm/l/pakasir.svg)](LICENSE)
[![Github Stars](https://img.shields.io/github/stars/GTPSHAX/pakasir)](https://github.com/GTPSHAX/pakasir)

## 📖 Deskripsi

Pakasir Client SDK adalah SDK JavaScript/TypeScript yang menyediakan interface yang bersih dan mudah digunakan untuk mengintegrasikan payment gateway Pakasir ke dalam aplikasi Node.js Anda. Library ini mendukung berbagai metode pembayaran termasuk QRIS, Virtual Account dari berbagai bank, dan PayPal.

## ✨ Fitur

- **Autentikasi Aman** - Manajemen API key yang aman
- **Multiple Payment Methods** - Mendukung QRIS, Virtual Account (berbagai bank), dan PayPal
- **TypeScript Support** - Fully typed dengan dokumentasi yang lengkap
- **Simple API** - Interface yang intuitif dan mudah digunakan
- **Dual Package** - Mendukung ESM dan CommonJS
- **Zero Dependencies** - Tidak ada runtime dependencies

## 📦 Instalasi

```bash
npm install pakasir
```

atau dengan yarn:

```bash
yarn add pakasir
```

atau dengan pnpm:

```bash
pnpm add pakasir
```

atau dengan bun:
```bash
bun add pakasir
```

## 🚀 Quick Start

### ESM (ES Modules)

```javascript
import { Pakasir } from 'pakasir';

const pakasir = new Pakasir({
  project: 'your-project-slug',
  api_key: 'your-api-key'
});

// Buat transaksi baru
const transaction = await pakasir.createTransaction(
  'order-123',      // Order ID
  'QRIS',           // Metode pembayaran
  50000,            // Jumlah (dalam rupiah)
  true,             // Tampilkan QRIS langsung (optional)
  'https://...'     // Redirect URL (optional)
);

console.log('Payment URL:', transaction.payment.payment_url);
```

### CommonJS

```javascript
const { Pakasir } = require('pakasir');

const pakasir = new Pakasir({
  project: 'your-project-slug',
  api_key: 'your-api-key'
});

// Gunakan dengan .then() atau async/await
pakasir.createTransaction('order-123', 'QRIS', 50000)
  .then(transaction => {
    console.log('Payment URL:', transaction.payment.payment_url);
  })
  .catch(error => {
    console.error('Error:', error.message);
  });
```

## 📚 Metode Pembayaran yang Didukung

Library ini mendukung metode pembayaran berikut:

- `ALL` - Semua metode pembayaran yang tersedia
- `QRIS` - Quick Response Code Indonesian Standard
- `CLIMB_NIAGA_VA` - CIMB Niaga Virtual Account
- `BNI_VA` - Bank BNI Virtual Account
- `SAMPOERNA_VA` - Bank Sampoerna Virtual Account
- `BNC_VA` - BNC Virtual Account
- `MAYBANK_VA` - Maybank Virtual Account
- `PERMATA_VA` - Bank Permata Virtual Account
- `ATM_BERSAMA_VA` - ATM Bersama Virtual Account
- `ARTHA_GRAHA_VA` - Bank Artha Graha Virtual Account
- `BRI_VA` - Bank BRI Virtual Account
- `PAYPAL` - PayPal

## 🔑 Mendapatkan Kredensial

1. Daftar atau login ke [Pakasir Dashboard](https://app.pakasir.com)
2. Buat project baru atau pilih project yang sudah ada
3. Salin **Project Slug** dan **API Key** dari dashboard
4. Gunakan kredensial tersebut untuk menginisialisasi client

## 💡 Contoh Penggunaan

### Membuat Transaksi

```javascript
const transaction = await pakasir.createTransaction(
  'order-' + Date.now(),
  'QRIS',
  50000,
  true,
  'https://mywebsite.com/payment/callback'
);

console.log('Order ID:', transaction.order_id);
console.log('Amount:', transaction.amount);
console.log('Fee:', transaction.payment.fee);
console.log('Total Payment:', transaction.payment.total_payment);
console.log('Payment URL:', transaction.payment.payment_url);
console.log('Expires at:', transaction.payment.expired_at);
```

### Mengecek Status Transaksi

```javascript
const details = await pakasir.getTransactionDetail('order-123', 50000);

console.log('Status:', details.transaction.status);
console.log('Completed at:', details.transaction.completed_at);
```

### Membatalkan Transaksi

```javascript
const result = await pakasir.cancelTransaction('order-123', 50000);

console.log('Canceled:', result.success);
```

### Simulasi Pembayaran (untuk Testing)

```javascript
// Hanya tersedia di sandbox/test environment
const result = await pakasir.simulatePayment('order-123', 50000);

console.log('Simulation success:', result.success);
```

### Error Handling

```javascript
try {
  const transaction = await pakasir.createTransaction(
    'order-123',
    'QRIS',
    50000
  );
} catch (error) {
  if (error.message.includes('Failed to create transaction')) {
    console.error('Gagal membuat transaksi:', error.message);
  } else {
    console.error('Error:', error.message);
  }
}
```

## 📖 API Reference

Untuk dokumentasi lengkap tentang semua method, parameter, dan return types, silakan lihat [API_REFERENCE.md](API_REFERENCE.md).

## 🤝 Contributing

Kami sangat menghargai kontribusi dari komunitas! Silakan baca [CONTRIBUTING.md](CONTRIBUTING.md) untuk panduan lengkap tentang cara berkontribusi.

## 📝 License

Proyek ini dilisensikan di bawah [MIT License](LICENSE).

## 🙏 Acknowledgments

- Library ini merupakan unofficial SDK untuk [Pakasir](https://pakasir.com)
- Terima kasih kepada semua kontributor yang telah membantu mengembangkan library ini

## 📞 Support

Jika Anda menemukan bug atau memiliki pertanyaan:

- 🐛 [Laporkan bug](https://github.com/gtpshax/pakasir/issues)
- 💬 [Diskusi](https://github.com/gtpshax/pakasir/discussions)
- 📧 Hubungi maintainer melalui GitHub

## ⚠️ Disclaimer

Ini adalah library tidak resmi dan tidak terafiliasi dengan Pakasir. Gunakan dengan risiko Anda sendiri dan pastikan untuk mengikuti terms of service dari Pakasir.

---

Dibuat dengan ❤️ oleh [gtpshax](https://github.com/gtpshax)