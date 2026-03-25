# Proof of Truth - Decentralized Fact Verification Platform

[![Status](https://img.shields.io/badge/status-active-success.svg)](https://github.com)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-Web3-purple.svg)](https://ethereum.org)

A decentralized application where users can challenge online claims by staking tokens, with the community deciding truth through reputation-weighted voting.

> **Note:** This is a portfolio/learning project demonstrating blockchain concepts. Currently uses localStorage for data persistence - smart contract integration is planned for future development.

---

## What Is This?

Ever see a claim online and wonder if it's true? This platform lets users stake tokens on whether claims are true or false. The community votes, and after 7 days, the claim resolves. Correct voters earn rewards and reputation points, while incorrect voters lose their stake.

Think of it as a prediction market for truth, where financial incentives encourage accurate information verification.

---

## Quick Demo

```
1. Connect your MetaMask wallet
2. Browse active claims or submit your own
3. Vote TRUE or FALSE with POT tokens (minimum 50)
4. Wait 7 days for resolution
5. Win = Get 1.5× your stake back + 10 reputation
6. Lose = Lose your stake + -5 reputation
```

Your voting power isn't just your stake - it's weighted by your reputation:
```
Voting Power = Stake × (1 + Reputation/100)

Example:
- 100 POT + 100 REP = 200 voting power
- 100 POT + 200 REP = 300 voting power
```

---

## Features

- **MetaMask Integration** - Connect your Ethereum wallet
- **Token Staking** - Stake POT tokens on claims (min. 50)
- **Reputation System** - Build influence through accurate voting
- **Weighted Voting** - Higher reputation = more voting power
- **7-Day Resolution** - Claims auto-resolve after voting period
- **Reward System** - Winners get 1.5× stake + reputation boost
- **Leaderboard** - Track top contributors
- **Data Persistence** - Your data persists using localStorage

---

## Tech Stack

**Frontend:**
- React 18 with TypeScript
- Tailwind CSS for styling
- React Router for navigation

**Web3:**
- ethers.js v6 for Ethereum interaction
- MetaMask for wallet connection

**State Management:**
- React Context API

**Data Storage:**
- localStorage (demo mode)
- Future: Smart contracts on Ethereum/Polygon

**Build Tools:**
- Vite for fast dev experience
- pnpm for package management

---

## Getting Started

### Prerequisites

- Node.js v18 or higher
- pnpm (or npm)
- MetaMask browser extension

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Build for production
pnpm run build
```

The app will run at `http://localhost:5173`

### First Steps

1. Install MetaMask if you haven't already
2. Connect your wallet using the "Connect Wallet" button
3. You'll start with 1000 POT tokens and 100 reputation
4. Browse claims or submit your own!

---

## How It Works

### 1. Submit a Claim
Anyone can submit a claim with a minimum stake of 50 POT tokens. Include a title, description, and optional source link.

### 2. Community Votes
Other users vote TRUE or FALSE by staking tokens. Your voting power is calculated as:
```
Power = Stake × (1 + Reputation/100)
```

### 3. Claim Resolves (After 7 Days)
The system calculates weighted votes for each side. Whichever side has more voting power wins.

### 4. Rewards Distributed
- **Winners:** Get 1.5× their stake back + 10 reputation points
- **Losers:** Lose their stake + -5 reputation points

---

## Project Structure

```
src/
├── app/
│   ├── components/       # Reusable UI components
│   ├── context/         # Global state management
│   │   ├── wallet-context.tsx    # Wallet connection & balance
│   │   └── claims-context.tsx    # Claims & voting logic
│   ├── pages/           # Route pages
│   │   ├── home.tsx              # Browse claims
│   │   ├── claim-detail.tsx      # Vote on specific claim
│   │   ├── submit.tsx            # Submit new claim
│   │   ├── profile.tsx           # Your stats & history
│   │   └── leaderboard.tsx       # Top contributors
│   ├── routes.tsx       # Route configuration
│   └── App.tsx          # Root component
└── styles/              # Global styles
```

---

## Data Persistence

Currently uses **localStorage** for data persistence:
- Each wallet address has separate data (balance, reputation)
- Claims and votes are stored globally
- Data persists across page reloads
- Works offline
- No backend required

**Limitations:**
- Data is browser-specific (no multi-device sync)
- Clearing browser cache will reset data
- Not suitable for production (future: smart contracts)

You can reset your data anytime using the "Reset All Data" button in the app.

---

## Known Limitations & Future Improvements

This is a learning project and portfolio piece. I'm aware of several limitations:

### Current Limitations

**Security & Game Theory:**
- Users could coordinate voting through external channels (collusion risk)
- Single user could create multiple wallets (Sybil attack)
- No smart contracts - uses localStorage instead of blockchain
- POT tokens are simulated (no real economic value)

**Why These Exist:**
These are acknowledged learning opportunities. In production, these would be addressed through:
- Quadratic voting or reputation-based voting weights
- Oracle integration (Chainlink/UMA) for verification
- Smart contract deployment on Ethereum/Polygon
- Economic mechanisms that make attacks unprofitable

### What This Project DOES Demonstrate

✅ Web3 wallet integration (MetaMask + ethers.js)  
✅ Understanding of staking and token economics  
✅ Voting mechanism with weighted power  
✅ State management and data persistence  
✅ Clean React/TypeScript architecture  
✅ Responsive UI/UX design  

---

## Roadmap

**Phase 1: ✅ Current (Frontend Demo)**
- MetaMask integration
- Claim submission and voting
- Reputation system
- localStorage persistence

**Phase 2: 🚧 Smart Contracts (Future)**
- ERC-20 POT token contract
- Claim registry contract
- Automated voting & resolution
- Deploy to testnet (Sepolia/Polygon Mumbai)

**Phase 3: 🔮 Enhanced Features**
- Oracle integration for claim verification
- IPFS for decentralized storage
- Multi-chain support
- Mobile app

---

## Contributing & Feedback

I built this project to learn about Web3, blockchain concepts, and decentralized application architecture. I'm actively looking for feedback to improve!

**Ways to contribute:**
- Report bugs or issues
- Suggest features or improvements
- UI/UX feedback
- Code reviews
- Documentation improvements

**Have suggestions?** I'd love to hear from you!  
📧 Email: **adwita.jindal.42@gmail.com**

Feel free to:
- Point out security issues or vulnerabilities
- Suggest better implementation approaches
- Share ideas for making this more effective
- Ask questions about the architecture
- Provide feedback on code quality

I'm especially interested in feedback on:
- Game theory and economic design
- Smart contract architecture suggestions
- Security best practices
- UI/UX improvements
- Code structure and patterns

---

## What I Learned Building This

- **Web3 Integration:** Connecting to MetaMask, handling wallet events, managing account switches
- **Token Economics:** Designing staking mechanisms, reward distribution, and incentive structures
- **Game Theory:** Understanding vulnerabilities like collusion and Sybil attacks
- **React Architecture:** Context API for state management, React Router for navigation
- **TypeScript:** Type-safe blockchain interactions and complex state management
- **Data Persistence:** localStorage patterns and state synchronization

---

## Why I Built This

I wanted to understand how decentralized applications work beyond just the theory. This project helped me:

1. Learn Web3 wallet integration hands-on
2. Understand the challenges of decentralized systems
3. Explore token economics and voting mechanisms
4. Build a full-stack-style app with persistent state
5. Prepare for future smart contract development

The goal was to create something functional that demonstrates understanding of blockchain concepts, even without actual smart contracts (yet!).

---

## Resources & Inspiration

This project was inspired by:
- **Augur** - Decentralized prediction markets
- **Kleros** - Decentralized dispute resolution
- **Polymarket** - Prediction market platform

Learning resources I used:
- [Ethers.js Documentation](https://docs.ethers.org/)
- [MetaMask Developer Docs](https://docs.metamask.io/)
- [Ethereum.org](https://ethereum.org/en/developers/)

---

## License

MIT License - feel free to use this project for learning or as a starting point for your own dApp!

---

## Contact

**Adwita Jindal**  
📧 adwita.jindal.42@gmail.com

Open to feedback, suggestions, collaboration, or just chatting about Web3 and blockchain!

---

**Built as a learning project to explore Web3 and decentralized systems**
