require('dotenv').config();
const Razorpay = require('razorpay');

async function testConnection() {
  console.log("=========================================");
  console.log("Testing Razorpay Connection...");
  console.log("=========================================");

  // Determine key_id and key_secret
  let keyId = process.env.RAZORPAY_KEY_ID;
  let keySecret = process.env.RAZORPAY_KEY_SECRET;

  // Auto-detect if key_secret was loaded with the key_id (common config mistake)
  if (keySecret && keySecret.startsWith('rzp_')) {
    keyId = keySecret;
    console.log(`[!] Auto-detected Key ID in KEY_SECRET slot: ${keyId}`);
    console.log("[!] Please make sure to add your actual Razorpay Key Secret (24-character string) to backend/api/.env");
    keySecret = process.env.RAZORPAY_ACTUAL_SECRET || ''; 
  }

  if (!keyId) {
    console.error("[-] Error: Razorpay Key ID is not configured in .env");
    return;
  }

  console.log(`[*] Using Key ID: ${keyId}`);
  console.log(`[*] Using Key Secret: ${keySecret ? '****** (configured)' : 'None (missing)'}`);

  if (!keySecret) {
    console.log("[-] Connection skipped: Key Secret is missing. Please add RAZORPAY_KEY_SECRET to your .env file.");
    return;
  }

  try {
    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret
    });

    console.log("[*] Contacting Razorpay API to list payments...");
    // Try to fetch a list of payments to test auth
    const payments = await razorpay.payments.all({ count: 1 });
    
    console.log("[+] Success! Connection to Razorpay API established successfully.");
    console.log(`[+] Retrieved payments count: ${payments.items ? payments.items.length : 0}`);
  } catch (error) {
    console.error("[-] Razorpay Connection Failed!");
    console.error(`[-] Error Code: ${error.statusCode || 'N/A'}`);
    console.error(`[-] Error Message: ${error.description || error.message}`);
  }
}

testConnection();
