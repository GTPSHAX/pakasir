import 'dotenv/config';
import { Pakasir } from 'pakasir';

const PAKASIR_PROJECT_SLUG = process.env.PAKASIR_PROJECT_SLUG || 'your-project-slug';
const PAKASIR_API_KEY = process.env.PAKASIR_API_KEY || 'your-api-key';

/**
 * Example: Error handling and validation
 */
(async () => {
  const pakasir = new Pakasir({
    project: PAKASIR_PROJECT_SLUG,
    api_key: PAKASIR_API_KEY,
  });

  console.log('\n=== Testing Error Handling & Validation ===\n');

  // Test 1: Order ID too short
  console.log('--- Test 1: Order ID too short ---');
  try {
    await pakasir.createTransaction('abc', 'QRIS', 10000);
    console.log('✗ Should have thrown an error');
  } catch (error) {
    console.log('✓ Correctly rejected:', error.message);
  }

  // Test 2: Amount too low
  console.log('\n--- Test 2: Amount too low ---');
  try {
    await pakasir.createTransaction('order-12345', 'QRIS', 400);
    console.log('✗ Should have thrown an error');
  } catch (error) {
    console.log('✓ Correctly rejected:', error.message);
  }

  // Test 3: PayPal with amount < 10000
  console.log('\n--- Test 3: PayPal with amount < 10000 ---');
  try {
    await pakasir.createTransaction('order-12345', 'PAYPAL', 5000);
    console.log('✗ Should have thrown an error');
  } catch (error) {
    console.log('✓ Correctly rejected:', error.message);
  }

  // Test 4: onlyQris=true with non-QRIS method
  console.log('\n--- Test 4: onlyQris with BNI_VA ---');
  try {
    await pakasir.createTransaction('order-12345', 'BNI_VA', 10000, true);
    console.log('✗ Should have thrown an error');
  } catch (error) {
    console.log('✓ Correctly rejected:', error.message);
  }

  // Test 5: Non-existing transaction
  console.log('\n--- Test 5: Get details of non-existing transaction ---');
  try {
    await pakasir.getTransactionDetail('non-existing-order', 10000);
    console.log('✗ Should have thrown an error');
  } catch (error) {
    console.log('✓ Correctly rejected:', error.message);
  }

  // Test 6: Cancel non-existing transaction
  console.log('\n--- Test 6: Cancel non-existing transaction ---');
  try {
    await pakasir.cancelTransaction('non-existing-order', 10000);
    console.log('✗ Should have thrown an error');
  } catch (error) {
    console.log('✓ Correctly rejected:', error.message);
  }

  console.log('\n=== All Error Handling Tests Completed ===\n');
})();
