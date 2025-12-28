require('dotenv').config({ silent: true });
const { Pakasir } = require('pakasir');

const PAKASIR_PROJECT_SLUG = process.env.PAKASIR_PROJECT_SLUG || 'your-project-slug';
const PAKASIR_API_KEY = process.env.PAKASIR_API_KEY || 'your-api-key';

/**
 * Example: Creating transactions with different payment methods
 */
(async () => {
  const pakasir = new Pakasir({
    project: PAKASIR_PROJECT_SLUG,
    api_key: PAKASIR_API_KEY,
  });

  const baseOrderId = 'payment-method-test-' + Date.now();
  const amount = 50000;

  console.log('\n=== Testing Different Payment Methods ===\n');

  // Test different payment methods
  const paymentMethods = [
    { name: 'QRIS', method: 'QRIS', onlyQris: true },
    { name: 'All Methods', method: 'ALL', onlyQris: false },
    { name: 'BNI Virtual Account', method: 'BNI_VA', onlyQris: false },
    { name: 'BRI Virtual Account', method: 'BRI_VA', onlyQris: false },
    { name: 'Permata Virtual Account', method: 'PERMATA_VA', onlyQris: false },
  ];

  for (const pm of paymentMethods) {
    try {
      console.log(`\n--- ${pm.name} ---`);
      const orderId = `${baseOrderId}-${pm.method}`;
      
      const transaction = await pakasir.createTransaction(
        orderId,
        pm.method,
        amount,
        pm.onlyQris
      );

      console.log('✓ Transaction created');
      console.log('  Order ID:', transaction.order_id);
      console.log('  Payment Method:', transaction.payment_method);
      console.log('  Payment URL:', transaction.payment.payment_url);
      console.log('  Total Payment:', transaction.payment.total_payment);

      // Clean up: cancel the transaction
      await pakasir.cancelTransaction(orderId, amount);
      console.log('✓ Transaction canceled');
    } catch (error) {
      console.error('✗ Error:', error.message);
    }
  }

  console.log('\n=== All Payment Methods Tested ===\n');
})();
