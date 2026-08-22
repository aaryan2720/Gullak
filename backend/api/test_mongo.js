require('dotenv').config();
const mongoose = require('mongoose');

async function testMongoConnection() {
  console.log("=========================================");
  console.log("Testing MongoDB Connection...");
  console.log("=========================================");

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("[-] Error: MONGODB_URI is not defined in .env file.");
    process.exit(1);
  }

  console.log(`[*] Connecting to database URI...`);

  try {
    // Attempt Mongoose connection with a 5 second timeout
    await mongoose.connect(uri, {
      connectTimeoutMS: 5000,
      socketTimeoutMS: 5000
    });

    console.log("[+] Success! Connected to MongoDB Atlas successfully.");
    console.log(`[+] Database Name: ${mongoose.connection.name}`);
    console.log(`[+] Connection State: ${mongoose.connection.readyState} (Connected)`);
    
    // Close the connection
    await mongoose.connection.close();
    console.log("[*] Connection closed cleanly.");
    process.exit(0);
  } catch (error) {
    console.error("[-] MongoDB Connection Failed!");
    console.error(`[-] Error Name: ${error.name}`);
    console.error(`[-] Error Message: ${error.message}`);
    process.exit(1);
  }
}

testMongoConnection();
