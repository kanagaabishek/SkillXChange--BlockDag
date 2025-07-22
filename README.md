# 🌐 SkillXchange

**Democratizing upskilling through peer-to-peer knowledge bartering, secured by blockchain smart contracts.**

---

## 🚀 Overview

SkillXchange is a decentralized platform where students and early-career developers can trade knowledge without cash. For example:  
🛠️ _"2h Spring Boot mentorship ↔ 2h UI/UX feedback"_

Our platform uses smart contracts on the BlockDAG testnet to ensure fairness via escrow and verifies skill exchange completion using mutual confirmation. AI assists with matching and quality improvement.

---

## 🎯 Problem Statement

Inaccessible skill development is a barrier for many students due to financial or geographical constraints. Current platforms focus on paid gigs or content, not peer-driven barter. SkillXchange enables equitable, real-time skill exchange among learners.

---

## 🧩 Key Features

- 🔗 Smart contract-based barter escrow system
- 🪙 Reputation tokens for completed trades
- 🧠 AI-powered skill matching & feedback
- 👛 Web3 login via MetaMask
- 📞 Live course/call support (Zoom/GMeet integration)
- 📈 Public contribution history (skill streak heatmap)

---

## 🛠️ Tech Stack

| Layer        | Tech                                      |
|--------------|-------------------------------------------|
| Frontend     | Next.js, Tailwind CSS, Wagmi + RainbowKit |
| Backend      | Spring Boot (REST APIs), WebSocket (chat) |
| Blockchain   | Solidity, Thirdweb, BlockDAG testnet      |
| AI Matching  | Gemini API (via Google Vertex AI)         |
| Auth & Wallet| MetaMask + Thirdweb SDK                   |
| Deployment   | Vercel (Frontend), Railway (Backend API)  |

---

## ⚙️ Installation

Clone the repo:

```bash
git clone https://github.com/<your-team>/SkillXchange.git
cd SkillXchange
