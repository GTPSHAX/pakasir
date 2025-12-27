const { Client } = require('pakasir');

const PAKASIR_PROJECT_SLUG = process.env.PAKASIR_PROJECT_SLUG || 'your-project-slug';
const PAKASIR_API_KEY = process.env.PAKASIR_API_KEY || 'your-api-key';

(async () => {
  const pakasir = new Client({
    project: PAKASIR_PROJECT_SLUG,
    api_key: PAKASIR_API_KEY,
  });

  try {
    const transaction = await pakasir.createTransaction(
      'order-' + Date.now(),
      'QRIS',
      50000,
      true,
      'https://your-website.com/payment/success'
    );

    console.log('Transaction created:', transaction);
  } catch (error) {
    console.error('Error creating transaction:', error.message);
  }
})();
