require('dotenv').config({ silent: true });
const { Pakasir } = require('pakasir');
// Alternatively, you can use: const { Client } = require('pakasir');

const PAKASIR_PROJECT_SLUG = process.env.PAKASIR_PROJECT_SLUG || 'your-project-slug';
const PAKASIR_API_KEY = process.env.PAKASIR_API_KEY || 'your-api-key';

(async () => {
  const pakasir = new Pakasir({
    project: PAKASIR_PROJECT_SLUG,
    api_key: PAKASIR_API_KEY,
  });

  const orderId = 'order-' + Date.now();
  const amount = 50000;

  try {
    // 1. Create a transaction
    console.log('\n=== Creating Transaction ===');
    const transaction = await pakasir.createTransaction(
      orderId,
      'QRIS',
      amount,
      true,
      'https://your-website.com/payment/success'
    );

    console.log('✓ Transaction created successfully');
    console.log('  Order ID:', transaction.order_id);
    console.log('  Amount:', transaction.amount);
    console.log('  Payment Method:', transaction.payment_method);
    console.log('  Payment URL:', transaction.payment.payment_url);
    console.log('  Fee:', transaction.payment.fee);
    console.log('  Total Payment:', transaction.payment.total_payment);
    console.log('  Expires at:', transaction.payment.expired_at);

    // 2. Get transaction details
    console.log('\n=== Getting Transaction Details ===');
    const details = await pakasir.getTransactionDetail(orderId, amount);
    
    console.log('✓ Transaction details retrieved');
    console.log('  Status:', details.transaction.status);
    console.log('  Order ID:', details.transaction.order_id);
    console.log('  Completed at:', details.transaction.completed_at || 'Not completed yet');

    // 3. Simulate payment (for testing)
    console.log('\n=== Simulating Payment ===');
    const simulationResult = await pakasir.paymentSimulation(orderId, amount);
    
    console.log('✓ Payment simulated:', simulationResult.success);

    // 4. Check transaction status after simulation
    console.log('\n=== Checking Status After Simulation ===');
    const updatedDetails = await pakasir.getTransactionDetail(orderId, amount);
    
    console.log('✓ Updated status:', updatedDetails.transaction.status);
    console.log('  Completed at:', updatedDetails.transaction.completed_at);

    // 5. Cancel transaction (if still pending)
    if (updatedDetails.transaction.status === 'pending') {
      console.log('\n=== Canceling Transaction ===');
      const cancelResult = await pakasir.cancelTransaction(orderId, amount);
      
      console.log('✓ Transaction canceled:', cancelResult.success);
    }

    console.log('\n=== All Operations Completed Successfully ===\n');
  } catch (error) {
    console.error('\n✗ Error:', error.message);
    process.exit(1);
  }
})();
