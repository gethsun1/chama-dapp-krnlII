<p align="center">
  <a href="https://twitter.com/KRNL_xyz"><img src="https://img.shields.io/badge/KRNL%20Protocol-Integrated-blue?style=flat-square" alt="KRNL Protocol"></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License"></a>
</p>

# Chama DApp 🚀

A **decentralized group savings and credit** application (Chama) with built‑in **KRNL protocol** security for transparent, compliant group savings on‑chain.

---

## 📖 Table of Contents

1. [Overview](#overview)
2. [What Is a Chama & How It Works](#what-is-a-chama--how-it-works)
3. [Features](#features)
4. [KRNL Integration](#krnl-integration)
5. [Smart Contracts](#smart-contracts)
6. [Frontend](#frontend)
7. [User Flow](#user-flow)
8. [Architecture](#architecture)
9. [Getting Started](#getting-started)
10. [Project Structure](#project-structure)
11. [Registration & IDs](#registration--ids)
12. [License](#license)

---

## 🔍 Overview

The **Chama DApp** digitizes the East African *Chama* (ROSCA) tradition, enabling groups to pool savings, enforce contributions, and distribute funds—all via smart contracts. By integrating the KRNL protocol, every critical action is validated by trusted kOS kernels, ensuring a secure, transparent, and compliant financial experience.

---

## 📚 What Is a Chama & How It Works

A **Chama** (Swahili for “group”) is a community-based savings circle where members contribute regularly into a collective pot and take turns receiving the lump sum. Traditionally orchestrated over in-person meetings, this DApp automates and secures the entire lifecycle:

1. **Formation**
   - **Creator** defines parameters:
     - **Deposit Amount** (collateral)
     - **Cycle Contribution** (periodic deposit)
     - **Penalty Rate** (for missed contributions)
     - **Maximum Members**
     - **Cycle Duration** (daily, weekly, monthly)

2. **Onboarding**
   - **Members** join by staking the required **deposit**.
   - Smart contract verifies eligibility via **KRNL kernels** (e.g., prohibited‑list, trusted‑list).

3. **Contribution Cycle**
   - On each cycle’s **start**, members must send their **contribution** before the deadline.
   - **Missed contributions** incur a **penalty** (deducted from deposit and added to that cycle’s pot).

4. **Round‑Robin Payout**
   - After the cycle ends, the total pot (contributions + penalties) is **automatically transferred** to the next member in line.
   - The cycle pointer advances, and the next round begins without manual intervention.

5. **Completion**
   - The process repeats until all members have received their payout once (or as configured).
   - Members can form new Chamas or re‑join existing ones.

<p align="center">
  🔄 Round Robin
  💰 Automated Payouts
</p>

---

## ✨ Features

- **🆕 Create & Manage Chamas**
  Flexible parameters for deposit, contribution, penalty, and membership.
- **👥 Secure Onboarding**
  KRNL‑verified join process ensures only approved members participate.
- **⏱️ Automated Contributions**
  Smart contracts enforce schedules and collect funds.
- **🔄 Round‑Robin Payouts**
  Trustless lump‑sum distribution each cycle.
- **🔐 KRNL Protocol**
  Mock Oracle kernel (875) provides ETH/USD pricing data for all transactions.
- **🦊 Web3 Wallets**
  MetaMask, WalletConnect, and more supported.

---

## 🔗 KRNL Integration

### Current Implementation

| Kernel ID | Name            | Purpose                                       |
|:---------:|:----------------|:----------------------------------------------|
| **875**   | Mock Oracle     | Provides ETH/USD price data for Chama creation|

> Every call to `createChama`, `joinChama`, `contribute`, and `payout` requires a validated **KRNL payload** with Oracle data, processed by `TokenAuthority.sol`.

### Planned Integration

| Kernel ID | Name               | Purpose                                          |
|:---------:|:-------------------|:-------------------------------------------------|
| **1443**  | Time Lock Vault    | Manages deposits with time-based access control  |

**Time Lock Vault Kernel Details:**
- **Network**: Sepolia (Chain ID: 11155111)
- **Address**: 0x8B11F19956a1C...e70792004082BBF
- **Function Signature**: `checkAndCalculateYield(uint256,uint256,uint256,uint256)`
- **Return Type**: `(bool,uint256)`

This kernel will enable verifiable delay enforcement in fund withdrawals, providing transparency and protection against impulsive or malicious actions.

---

## 📜 Smart Contracts

### UpdatedChamaFactory.sol
- **Network:** Ethereum Sepolia
- **Address:** `0x4c03E26aBE5E1d14Adf3108b123D06148Ea906fd`

Key signature:
```solidity
function createChama(..., KrnlPayload calldata krnl) external onlyAuthorized(krnl, ...);
```

### TokenAuthority.sol
- **Network:** Oasis Sapphire Testnet
- **Address:** `0x043D8606399A3600Ba8fcA555273892b46680825`

Manages:
- Access token & runtime digest verification
- Kernel result validation & final signing

---

## 🎨 Frontend

- **Framework:** React + Vite + Tailwind CSS
- **Wallets:** ethers.js + Web3Modal
- **KRNL Service:** Payload generation & submission
- **Key Pages:**
  - Create Chama
  - Chama Dashboard
  - Member Contributions
  - Payout History

---

## 🚀 User Flow

1. **Connect Wallet**
2. **Create or Join** a Chama (KRNL‑protected)
3. **Deposit & Contribute** each cycle
4. **Receive Payout** automatically
5. **Track** all actions on-chain

---

## 🏗️ Architecture

### Smart Contract Layer
- Solidity v0.8.24
- KRNL Protocol integration
- OpenZeppelin ReentrancyGuard & Ownable

### Application Layer
- React + Vite
- ethers.js & Web3Modal
- Tailwind CSS

---

## 🛠️ Getting Started

### Prerequisites
- Node.js ≥ 16
- Yarn (this project uses Yarn exclusively)
- MetaMask or similar

### Smart Contract
```bash
git clone https://github.com/your-org/chama-dapp.git
cd chama-dapp
yarn install
# Deploy contracts using our helper script
./deploy.sh
```

### Frontend
```bash
cd frontend
yarn install
yarn dev
```

---

## 📁 Project Structure

```
src/
  ├─ contracts/
  │   ├─ KRNL.sol
  │   ├─ TokenAuthority.sol
  │   └─ ChamaFactory.sol
  ├─ scripts/
  │   ├─ deploy-token-authority.cjs
  │   └─ deploy-chama-factory.cjs
  ├─ services/
  │   └─ krnlService.js (uses Mock Oracle kernel 875)
  ├─ components/
  ├─ pages/
  └─ App.jsx
deploy.sh (deployment helper script)
hardhat.config.cjs
vite.config.js
README.md
```

---

## 🆔 Registration & IDs

- **Contract ID:** 7257
- **DApp ID:** 6927
- **Entry ID:** `0xc2fc44b0a9d5b8a7540b9de8481973708d618951dd9b877486fde9c2e059911b`
- **Access Token:** `0x304402206234ff3a9d7c8e94d6a61ccdac3a5dfb50e84893fd43dfdce7c344dc964f6d6c022000ab4d4684825fda6d75c9b7cba6ad1d2675b23864300c9f10cba80ba517feab`

---

## 📜 License

Distributed under the **MIT License**. See [LICENSE](./LICENSE).
