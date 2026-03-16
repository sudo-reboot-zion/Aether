# Aether
### Decentralized Property Rental Reimagined

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Stacks](https://img.shields.io/badge/Stacks-Clarity-5546FF?style=for-the-badge&logo=stacks&logoColor=white)](https://stacks.co/)
[![IPFS](https://img.shields.io/badge/IPFS-Pinata-E74C3C?style=for-the-badge&logo=ipfs&logoColor=white)](https://www.pinata.cloud/)
[![AI](https://img.shields.io/badge/AI-Cohere%20%2B%20Groq-purple?style=for-the-badge)](https://cohere.com/)

### [Live Application](https://aether-iota-one.vercel.app/) | [API Endpoint](https://aether-ogor.onrender.com)

Aether is a decentralized property rental marketplace that leverages blockchain, artificial intelligence, and competitive economics to fix the broken short-term rental market. By removing centralized middlemen and automating support, Aether offers radical price transparency, secure escrow payments, and a conversational discovery experience.

> [!NOTE]
> The backend is hosted on Render's free tier. If the API feels slow or unresponsive at first, please hit the [endpoint](https://aether-ogor.onrender.com) to wake up the service.

---

## The Vision

Standard rental platforms have become heavy with fees—often taking 15-20% from every booking. This hurts both the traveler and the property owner. Aether solves this by moving trust to the blockchain and support to intelligent AI agents.

- **For Guests**: 2% flat fee. No hidden service charges.
- **For Hosts**: 0% commission. You keep 100% of your listing price.
- **For Everyone**: Trust is enforced by smart contracts on the Stacks blockchain, ensuring funds are only released when they should be.

---

## Key Features

### Intelligent & Multimodal Discovery
Beyond simple filters, Aether uses a RAG-powered (Retrieval-Augmented Generation) chat assistant. Guests can describe their ideal stay in natural language—*"I need a quiet workspace near the Swiss Alps for under 50 STX/night"*—and receive curated recommendations instantly, mapped across **8+ international locations** and unique categorical **"Vibes"** (Alpine, Coastal, Urban).

### Real-Time Currency Engine
Aether features a dynamic price conversion system. Users can toggle between **STX and USD** seamlessly, with real-time price feeds ensuring that guests know exactly what they are paying in fiat while settling in blockchain native currency.

### Trustless Escrow & Automated Policies
Payments are held in secure Clarity smart contracts. Funds are only released to the host after a successful check-in, protecting guests from fraud. The protocol features automated, transparent cancellation and refund schedules (e.g., 100% refund >7 days out) built directly into the ledger.

### Host Performance Analytics
Property owners have access to a sophisticated **Analytics Dashboard**. Track real-time STX earnings, occupancy rates, and property performance through visual heatmaps and yield curves, allowing hosts to treat their rentals like a true decentralized business.

### Portable On-Chain Reputation & Favorites
Your profile isn't locked inside a corporate server. Reviews, ratings, and even **favorite properties** are stored on the Stacks blockchain. As a guest or host, you build a verifiable travel identity that follows you across the Web3 ecosystem, complete with a soulbound badge system.

### Protocol-Linked Messaging
Integrated direct messaging allows guests and hosts to coordinate details before and during the stay. These messages are linked to specific on-chain bookings, providing a secure and transparent communication trail for both parties.

### Decentralized Permanency
To ensure true decentralization, all property metadata and images are stored on **IPFS** via **Pinata**. This ensures that the primary data layer is immutable, transparent, and independent of any centralized cloud provider.

---

## Technical Stack

### Frontend
- **Next.js & React**: For a high-performance, responsive user interface.
- **Stacks Connect**: Secure wallet integration and blockchain interaction.
- **Redux Toolkit**: Robust application state management.

### Backend (Compute & Real-time)
Unlike traditional apps, the Aether backend does **not** store primary property data. It is specifically reserved for:
- **AI Inference**: High-performance RAG via FastAPI, Cohere, and Groq.
- **Real-time Messaging**: Multi-user communication via WebSockets.
- **Semantic Search**: Fast vector indexing via PostgreSQL & pgvector.

### Storage & Static Assets
- **IPFS (via Pinata)**: The unified storage layer for all property listings and files.


### Blockchain & Smart Contracts
The engine of Aether is built on the **Stacks** blockchain, ensuring every transaction and reputation score is immutable and transparent.

#### Core Contracts (Stacks Explorer)
- **[`escrow`](https://explorer.hiro.so/address/ST13GQHB68PTPXCMW7ZD27A17DTFCY4EYVCWFBJ9E.escrow?chain=testnet)**: Manages property listing registration, booking logic, and the secure holding of funds.
- **[`dispute`](https://explorer.hiro.so/address/ST13GQHB68PTPXCMW7ZD27A17DTFCY4EYVCWFBJ9E.dispute?chain=testnet)**: Handles conflict resolution and automated refund processing.
- **[`reputation`](https://explorer.hiro.so/address/ST13GQHB68PTPXCMW7ZD27A17DTFCY4EYVCWFBJ9E.reputation?chain=testnet)**: Links every review to a verified booking for immutable, trusted ratings.
- **[`profile`](https://explorer.hiro.so/address/ST13GQHB68PTPXCMW7ZD27A17DTFCY4EYVCWFBJ9E.profile?chain=testnet)**: Stores user identity and travel preferences as a portable on-chain profile.
- **[`badge`](https://explorer.hiro.so/address/ST13GQHB68PTPXCMW7ZD27A17DTFCY4EYVCWFBJ9E.badge?chain=testnet)**: Achievement system rewarding users with soulbound badges for reliability.

---

## Project Structure

```text
Aether/
├── backend/            # FastAPI server & AI logic
│   ├── app/            # Main application code (chat, indexing, api)
│   ├── knowledge_store/# RAG knowledge base resources
│   └── pgvector_schema.sql
├── frontend/           # Next.js web application
│   ├── public/         # Static assets & branding
│   └── src/            # Components, pages, and hooks
└── smartContract/      # Stacks / Clarity contracts
    ├── contracts/      # Escrow, Reputation, Profile logic
    └── tests/          # Contract verification suite
```

---

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- Python (3.9+)
- Docker (for PostgreSQL/pgvector)
- [Clarinet](https://github.com/hirosystems/clarinet) (for smart contract development)

### 1. Smart Contracts
```bash
cd smartContract
clarinet check # Verify contract integrity
clarinet test  # Run the test suite
```

### 2. Backend
1. Create a virtual environment: `python -m venv venv && source venv/bin/activate`
2. Install dependencies: `pip install -r backend/requirements.txt`
3. Set up your `.env`:
   ```env
   GROQ_API_KEY=your_key
   COHERE_API_KEY=your_key
   LLM_MODEL=llama-3.3-70b-versatile
   DATABASE_URL=postgresql://user:pass@localhost:5432/aether
   VECTOR_BACKEND=pgvector
   ```
4. Run the server: `uvicorn backend.app.main:app --reload`

### 3. Frontend
1. Install dependencies: `npm install`
2. Set up your `.env.local`:
   ```env
   NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
   NEXT_PUBLIC_STX_NETWORK=testnet
   NEXT_PUBLIC_STX_CONTRACT_ADDRESS=ST34YG65...
   NEXT_PUBLIC_PINATA_JWT=your_pinata_jwt
   NEXT_PUBLIC_IPFS_GATEWAY=https://cloudflare-ipfs.com/ipfs
   ```
3. Start development server: `npm run dev`

---

## User Workflows

### The Guest Journey
1. **Search**: Chat with the AI assistant to find properties matching your lifestyle.
2. **Book**: Select dates and confirm. Your payment is held in a secure escrow contract.
3. **Stay**: Check in at the property. The smart contract releases payment to the host.
4. **Review**: Leave an on-chain review to build the host's reputation.

### The Host Journey
1. **List**: Post your property with photos and pricing. Details are recorded on-chain.
2. **Manage**: Use the dashboard to track bookings and communicate with guests.
3. **Earn**: Receive 100% of your earnings immediately upon guest check-in.
4. **Grow**: Earn badges and positive reviews to attract more bookings.

---

## Future Roadmap
- **Insurance Integration**: On-chain property damage coverage.
- **Dynamic Pricing**: AI-driven rate suggestions based on local demand.
- **DAO Governance**: Community-led platform adjustments and fee management.

---

*Built with passion for a more open, fair, and efficient rental economy.*
