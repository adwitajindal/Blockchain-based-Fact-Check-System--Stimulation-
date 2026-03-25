# MetaMask Integration Guide

This guide will help you connect your MetaMask wallet to the Proof of Truth Dapp.

## Prerequisites

1. **Install MetaMask**
   - Download from: https://metamask.io/download/
   - Available for Chrome, Firefox, Brave, Edge, and mobile

2. **Create or Import a Wallet**
   - Follow MetaMask's setup wizard
   - Save your seed phrase securely (NEVER share this!)

## How to Connect

### Step 1: Start the Dapp
```bash
pnpm run dev
```
Open http://localhost:5173 in your browser

### Step 2: Connect MetaMask
1. Click the **"Connect Wallet"** button in the top-right corner
2. MetaMask will pop up asking for permission
3. Select the account(s) you want to connect
4. Click **"Next"** then **"Connect"**

### Step 3: Approve the Connection
- Your wallet address will appear in the header
- You'll see your mock POT token balance (1000 POT)
- Your reputation score will be displayed (100 REP)

## Features

### ✅ What Works with MetaMask

- **Wallet Connection** - Connect/disconnect your MetaMask account
- **Account Display** - See your Ethereum address in the UI
- **Account Switching** - Automatically updates when you switch accounts in MetaMask
- **Network Detection** - Displays which network you're connected to
- **Session Persistence** - Stays connected on page refresh

### ⚠️ Current Implementation Notes

**POT Tokens & Reputation:**
- These are currently **mock values** stored in the app (not on blockchain)
- POT (Proof of Truth tokens) start at 1000 for all users
- Reputation (REP) starts at 100 for all users
- These values update locally as you vote and participate

**Why Mock Tokens?**
This is a demo Dapp. To make it fully functional with real tokens, you would need to:
1. Deploy smart contracts to a blockchain network
2. Create actual ERC-20 tokens for POT
3. Implement on-chain voting and reputation systems
4. Add transaction signing for all actions

## Supported Networks

MetaMask works with multiple networks:
- **Ethereum Mainnet** - Real ETH (expensive for testing)
- **Sepolia Testnet** - Free test ETH (recommended for testing)
- **Polygon** - Lower fees
- **Other EVM chains** - BSC, Arbitrum, Optimism, etc.

### Get Test ETH (for testing)

If you want to experiment on testnet:
1. Switch to Sepolia network in MetaMask
2. Get free test ETH from faucets:
   - https://sepoliafaucet.com/
   - https://www.alchemy.com/faucets/ethereum-sepolia

## Troubleshooting

### "MetaMask is not installed"
- Install MetaMask browser extension
- Refresh the page after installation

### Connection Rejected
- Click "Connect Wallet" again
- Make sure you approve the connection in MetaMask popup

### Wrong Network Warning
- The app works on any network
- For production, you'd want to enforce a specific network

### Account Not Updating
- Try disconnecting and reconnecting
- Refresh the page
- Check MetaMask is unlocked

### Balance Shows 0 ETH
- That's normal! The app uses mock POT tokens
- Your real ETH balance in MetaMask is separate

## Security Tips

🔒 **Important Security Practices:**

- ✅ Only connect to websites you trust
- ✅ Never share your seed phrase or private keys
- ✅ This is a demo app - don't use your main wallet with real funds
- ✅ Create a separate MetaMask account for testing Dapps
- ✅ Always verify the website URL before connecting
- ❌ Never enter your seed phrase on any website
- ❌ Be cautious of transaction approval requests

## Next Steps: Making it Production-Ready

To convert this to a real blockchain Dapp:

### 1. Smart Contract Development
```solidity
// Example: ERC-20 token for POT
// Reputation system contract
// Voting mechanism contract
// Claim resolution logic
```

### 2. Contract Deployment
- Use Hardhat or Foundry
- Deploy to testnet first
- Audit contracts before mainnet

### 3. Update Frontend Integration
```typescript
// Replace mock functions with actual contract calls
const contract = new ethers.Contract(address, abi, signer);
await contract.submitClaim(title, stake);
await contract.vote(claimId, vote, stake);
```

### 4. Add Transaction Management
- Loading states during transactions
- Transaction confirmations
- Error handling for failed transactions
- Gas estimation

### 5. IPFS Storage (Optional)
- Store claim data on IPFS
- Keep only hashes on-chain
- Reduces gas costs

**Happy Testing! 🚀**

Remember: This is currently a frontend demo with MetaMask integration. Real blockchain functionality requires smart contract deployment.
