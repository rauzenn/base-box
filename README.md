# 🔥 Based Streaks

**Keep the flame alive! Daily streak tracker for Base builders.**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/rauzenn/based-streaks)

---

## 🎯 What is Based Streaks?

Based Streaks is a gamified mini-app that encourages **daily engagement** in the Base ecosystem. Users complete daily missions, build streaks, earn XP, and unlock exclusive badges - all while contributing meaningful content to the Base community.

### 🌟 Why it matters for Base:

- **Daily Active Users**: Incentivizes consistent on-chain activity
- **Quality Content**: Encourages builders, creators, and community members to share their work
- **Network Effects**: Referral system grows the Base community organically
- **Cultural Fit**: Aligns with Base's builder-first, onchain culture

---

## ✨ Features

### 🎮 **Proof of Based Mission System**

Choose your daily mission difficulty:

- **🌱 Based Vibes** (Easy - 10 XP): Share your daily Based energy
- **🔍 Based Discovery** (Medium - 25 XP): Share Base dApps you discovered
- **🛠️ Based Builder** (Hard - 50 XP): Share what you built or learned
- **🎨 Based Creator** (Legendary - 100 XP): Create original content (memes, videos, tutorials)

### 🔥 **Streak Tracking**

- Daily streak counter with flame visualization
- Max streak achievement
- Progress tracking to 30-day milestones
- Anti-spam: One claim per day per user

### 🏆 **Badge System**

Unlock exclusive badges at milestones:
- **🌱 Seed Badge** - 7 day streak
- **🔥 Flame Badge** - 14 day streak  
- **💎 Diamond Badge** - 21 day streak
- **👑 Crown Badge** - 30 day streak

### 📊 **XP & Leaderboard**

- Mission-based XP rewards
- Real-time leaderboard rankings
- Seasonal competitions
- Top performers earn recognition

### 🤝 **Referral Program**

- Unique referral codes for each user
- +50 XP bonus when friends complete 3-day streaks
- Viral growth mechanics

### ✅ **Farcaster Verification**

- Posts verified via Neynar API
- Checks for required hashtags
- Ensures genuine participation
- Real-time validation

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 19, Tailwind CSS
- **Authentication**: Farcaster Mini App SDK
- **API**: Neynar API for cast verification
- **Deployment**: Vercel
- **Storage**: In-memory (migrating to Vercel KV)
- **Chain**: Base (EIP-1155 badges planned)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Farcaster account
- Neynar API key (for production)

### Installation

```bash
# Clone the repository
git clone https://github.com/rauzenn/based-streaks.git
cd based-streaks

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your keys

# Run development server
npm run dev
```

Visit `http://localhost:3000/main` to test!

### Environment Variables

```env
# Farcaster Manifest
FARCASTER_HEADER=eyJ...
FARCASTER_PAYLOAD=eyJ...
FARCASTER_SIGNATURE=0x...

# Neynar API (for cast verification)
NEYNAR_API_KEY=your_api_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=https://based-streaks.vercel.app
NEXT_PUBLIC_CHAIN_ID=8453
NEXT_PUBLIC_RPC_URL=https://mainnet.base.org
```

---

## 📱 How to Use

### As a User:

1. **Open in Warpcast**: Launch Based Streaks mini-app
2. **Choose Mission**: Select daily difficulty level
3. **Post on Farcaster**: Share content with mission hashtag
4. **Verify & Claim**: Get verified and earn XP
5. **Build Streaks**: Come back daily to keep the flame alive!

### As a Builder:

1. Fork this repo
2. Customize missions for your community
3. Deploy to Vercel
4. Submit to Warpcast Mini App directory

---

## 🎨 Visual Assets

All assets generated with Python + Pillow:

```bash
# Generate flame-powered assets
python generate_assets_v2.py

# Output:
# - dist/splash.png (1200x630)
# - dist/icon.png (1024x1024)
# - dist/screenshot-1.png
# - dist/screenshot-2.png
# - dist/flame_icons/*.png
```

---

## 🗺️ Roadmap

### ✅ Phase 1: MVP (Current)
- [x] Mission system
- [x] Streak tracking
- [x] Badge milestones
- [x] Leaderboard
- [x] Referral system

### 🚧 Phase 2: Q1 2025
- [ ] Vercel KV database migration
- [ ] On-chain badge minting (ERC-1155)
- [ ] Weekly challenge system
- [ ] Multi-season support
- [ ] Advanced analytics dashboard

### 🔮 Phase 3: Q2 2025
- [ ] Cross-chain streaks
- [ ] Token rewards pool
- [ ] Partner integrations
- [ ] Mobile app (PWA)

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

## 🔗 Links

- **Live App**: https://based-streaks.vercel.app
- **GitHub**: https://github.com/rauzenn/based-streaks
- **Warpcast**: [@basedstreaks](https://warpcast.com/basedstreaks) (coming soon)
- **Twitter**: [@BasedStreaks](https://twitter.com/BasedStreaks) (coming soon)

---

## 💬 Support

- Discord: [Join our community](#) (coming soon)
- Issues: [GitHub Issues](https://github.com/rauzenn/based-streaks/issues)
- Email: support@basedstreaks.app (coming soon)

---

## 🙏 Acknowledgments

- Built with ❤️ for the Base ecosystem
- Powered by Farcaster & Neynar
- Inspired by Duolingo streaks & web3 culture

---

**Keep the flame alive! 🔥💙**

*Built on Base. Based for life.*