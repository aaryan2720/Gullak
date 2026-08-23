const { ethers } = require('ethers');

const GullakLedgerABI = [
  "function logActivity(string userId, string transactionId, string action, uint256 amount) public returns (uint256)",
  "event ActivityLogged(address indexed caller, string userId, string transactionId, string action, uint256 amount, uint256 indexed logId, uint256 timestamp)"
];

/**
 * Logs a transaction to the Polygon/Hardhat GullakLedger smart contract.
 * Falls back to mock receipt if the node is offline.
 */
async function logToPolygonLedger(userId, txId, action, amount) {
  try {
    const providerUrl = process.env.POLYGON_PROVIDER_URL || 'http://localhost:8545';
    const provider = new ethers.JsonRpcProvider(providerUrl);

    // Test connection with short timeout
    const network = await Promise.race([
      provider.getNetwork(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Provider timeout')), 3000))
    ]);

    const wallet = new ethers.Wallet(process.env.POLYGON_PRIVATE_KEY, provider);
    const contractAddress = process.env.GULLAK_LEDGER_ADDRESS;

    if (!contractAddress || contractAddress === '0x0000') {
      throw new Error('Contract address not configured');
    }

    const contract = new ethers.Contract(contractAddress, GullakLedgerABI, wallet);
    const formattedAmount = ethers.parseUnits(amount.toString(), 6);
    const tx = await contract.logActivity(userId, txId, action, formattedAmount);
    const receipt = await tx.wait();

    console.log(`[Blockchain] ✅ Activity logged on chain: ${receipt.hash} (Block #${receipt.blockNumber})`);

    return {
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      blockHash: receipt.blockHash,
      from: wallet.address,
      verified: true,
      network: process.env.POLYGON_NETWORK || 'localhost',
    };
  } catch (err) {
    console.warn(`[Blockchain] ⚠️  Chain write failed (${err.message}). Generating mock receipt.`);
    const crypto = require('crypto');
    const mockHash = '0x' + crypto.randomBytes(32).toString('hex');
    const mockBlock = Math.floor(17290000 + Math.random() * 9000);
    return {
      txHash: mockHash,
      blockNumber: mockBlock,
      blockHash: '0x' + crypto.randomBytes(32).toString('hex'),
      from: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      verified: false, // mark as unverified mock
      network: 'mock',
    };
  }
}

module.exports = { logToPolygonLedger, GullakLedgerABI };
