# 🔒 Base Box

**Lock your memories onchain. Unlock them in the future.**

[![Built on Base](https://img.shields.io/badge/Built%20on-Base-0052FF?style=flat&logo=ethereum&logoColor=white)](https://base.org)
[![Farcaster](https://img.shields.io/badge/Farcaster-Mini%20App-8A63D2?style=flat)](https://www.farcaster.xyz/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js)](https://nextjs.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/rauzenn/base-box)

> *"Time remembers. Base keeps."*

---

## 📦 What is Base Box?

**Base Box** is a blockchain-based time capsule application built on Base. Create time-locked messages, memories, and predictions—then unlock them in the future to receive achievement NFTs.

Perfect for:
- 🔮 **Crypto predictions** - Lock your market forecasts
- 🎯 **Personal goals** - Set and track long-term objectives  
- 💌 **Future messages** - Write letters to your future self
- 🎉 **Special moments** - Preserve memories onchain forever
- 🏆 **Achievements** - Collect NFT badges for milestones

### 🌟 Why Base Box?

- **⛓️ Onchain Permanence**: Your capsules live forever on Base
- **🔐 Time-Locked**: Set unlock dates from 1 hour to 1 year
- **🎖️ Achievement NFTs**: Earn badges for milestones
- **🖼️ Media Support**: Attach images to your capsules
- **⚡ Gas-Free**: No transaction fees for basic operations
- **🎭 Farcaster Native**: Seamlessly integrated with Farcaster ecosystem

---

## ✨ Features

### 🔒 **Time Capsule System**
- **Flexible Durations**: 1h, 7d, 30d, 90d, 180d, 365d
- **Rich Content**: Text messages + image attachments (5MB max)
- **Private by Default**: Your capsules, your data
- **Real-time Countdown**: Live timers until unlock
- **Reveal Animations**: Epic unlock experience with sparkles & confetti

### 🏆 **Achievement System**
Unlock 10+ achievements:
- **🎖️ Time Traveler** - Lock your first capsule
- **⭐ Collector** - Lock 5 capsules
- **👑 Legend** - Lock 25 capsules
- **⏳ Patient One** - Lock for 365 days
- **🔓 The Unsealer** - Reveal your first capsule
- **🚀 Pioneer** - Join the first 100 users

### 📊 **User Dashboard**
- Track total capsules (locked & revealed)
- View achievement progress
- See longest lock duration
- Activity timeline
- Level system (Newcomer → Legend)

### 🎨 **Beautiful UI**
- Base-themed design (#0052FF blue)
- Smooth animations & transitions
- Mobile-responsive
- Dark mode optimized
- Interactive hover effects

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Frontend** | Next.js 14 (App Router), React 19, TypeScript |
| **Styling** | Tailwind CSS, CSS Animations |
| **Backend** | Next.js API Routes (serverless) |
| **Database** | Vercel KV (Redis) |
| **Auth** | Farcaster Mini App SDK |
| **Blockchain** | Base (Mainnet) |
| **Deployment** | Vercel |
| **Analytics** | Vercel Analytics |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Farcaster account
- Vercel account (for deployment)
- Git

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/rauzenn/base-box.git
cd base-box

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local

# 4. Configure Vercel KV
# Go to vercel.com → Storage → Create KV Database
# Copy the environment variables to .env.local

# 5. Run development server
npm run dev

# 6. Open browser
open http://localhost:3000
```

### Environment Variables

Create a `.env.local` file:

```env
# Vercel KV (Redis)
KV_URL=your_kv_url_here
KV_REST_API_URL=your_rest_api_url_here
KV_REST_API_TOKEN=your_rest_api_token_here
KV_REST_API_READ_ONLY_TOKEN=your_read_only_token_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Base Box

# Farcaster (optional for local dev)
FARCASTER_HEADER=your_header
FARCASTER_PAYLOAD=your_payload
FARCASTER_SIGNATURE=your_signature
```

---

## 📱 How to Use

### Creating a Capsule

1. **Navigate to Create** (`/create`)
2. **Write your message** (up to 1000 characters)
3. **Add an image** (optional, 5MB max)
4. **Choose duration** (1h to 1 year)
5. **Lock it!** ✅

### Viewing Capsules

1. **Go to Capsules** (`/capsules`)
2. **Filter by status**: All / Locked / Revealed
3. **See countdown timers** for locked capsules
4. **Click to view details**

### Revealing Capsules

1. **Wait for unlock date** ⏰
2. **Navigate to Reveals** (`/reveals`)
3. **Click reveal button** 🔓
4. **Enjoy epic animation** ✨
5. **Download your memory** (optional)

### Tracking Achievements

1. **Visit Profile** (`/profile`)
2. **View unlocked achievements** 🏆
3. **Check progress bars** for incomplete ones
4. **See your level & stats** 📊

---

## 🗂️ Project Structure

```
base-box/
├── app/                        # Next.js 14 App Router
│   ├── page.tsx               # Home page
│   ├── create/page.tsx        # Create capsule
│   ├── capsules/page.tsx      # View capsules
│   ├── reveals/page.tsx       # Reveal capsules
│   ├── profile/page.tsx       # User profile & achievements
│   ├── api/                   # API routes
│   │   ├── capsules/
│   │   │   ├── create/route.ts
│   │   │   └── list/route.ts
│   │   └── achievements/route.ts
│   └── .well-known/
│       └── farcaster.json/route.ts  # Farcaster manifest
├── components/
│   ├── ui/                    # UI components
│   │   ├── bottom-nav.tsx
│   │   ├── achievement-card.tsx
│   │   └── achievement-toast.tsx
│   └── animations/
│       └── effects.tsx        # Ripple, sparkles, confetti
├── lib/                       # Utilities
├── public/                    # Static assets
│   ├── icon.png              # App icon
│   ├── splash.png            # Splash screen
│   ├── embed-image.png       # Social embed
│   ├── hero-image.png        # Hero image
│   ├── og-image.png          # OpenGraph image
│   └── screenshots/          # App screenshots
├── styles/
│   └── globals.css           # Global styles & animations
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 🌐 API Documentation

### Create Capsule
```http
POST /api/capsules/create
Content-Type: application/json

{
  "fid": 569760,
  "message": "Hello future me!",
  "duration": 7,
  "image": "data:image/png;base64,...",
  "imageType": "image/png"
}

Response:
{
  "success": true,
  "capsuleId": "569760-1698765432000"
}
```

### List Capsules
```http
GET /api/capsules/list?fid=569760

Response:
{
  "success": true,
  "capsules": [
    {
      "id": "569760-1698765432000",
      "fid": 569760,
      "message": "Hello future me!",
      "createdAt": "2024-10-31T10:30:32.000Z",
      "unlockDate": "2024-11-07T10:30:32.000Z",
      "revealed": false,
      "image": "data:image/png;base64,...",
      "imageType": "image/png"
    }
  ]
}
```

### Get Achievements
```http
GET /api/achievements?fid=569760

Response:
{
  "success": true,
  "achievements": [
    {
      "id": "first_capsule",
      "title": "Time Traveler",
      "unlocked": true,
      "progress": 1,
      "max": 1
    }
  ],
  "stats": {
    "total": 5,
    "locked": 3,
    "revealed": 2
  }
}
```

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/rauzenn/base-box)

**Steps:**

1. **Click "Deploy with Vercel"** button above
2. **Connect your GitHub account**
3. **Create Vercel KV database**:
   - Go to Storage → Create Database → KV
   - Copy environment variables
4. **Add environment variables** to Vercel project
5. **Deploy!** 🚀

### Manual Deployment

```bash
# 1. Build the project
npm run build

# 2. Deploy to Vercel
vercel --prod

# 3. Set up environment variables
vercel env add KV_URL
vercel env add KV_REST_API_URL
vercel env add KV_REST_API_TOKEN
vercel env add KV_REST_API_READ_ONLY_TOKEN

# 4. Redeploy
vercel --prod
```

---

## 🗺️ Roadmap

### ✅ Phase 1: MVP (Completed)
- [x] Time capsule creation & locking
- [x] Multiple duration options
- [x] Image attachment support
- [x] Achievement system (10 achievements)
- [x] User profile & stats
- [x] Reveal animations
- [x] Farcaster Mini App integration

### 🚧 Phase 2: Q1 2025
- [ ] NFT minting on reveal (ERC-721 on Base)
- [ ] Wallet integration (OnchainKit)
- [ ] Social features (global feed, likes, comments)
- [ ] Share to Farcaster cast
- [ ] Enhanced analytics dashboard

### 🔮 Phase 3: Q2 2025
- [ ] Collaborative capsules (multi-user)
- [ ] Prediction verification system
- [ ] Goal tracking with milestones
- [ ] Gift capsules (send to others)
- [ ] Media support (video, audio)
- [ ] Marketplace for NFT badges

### 🌟 Phase 4: Q3 2025
- [ ] Mobile app (React Native)
- [ ] Push notifications (webhook)
- [ ] Advanced encryption (time-lock)
- [ ] Cross-chain support
- [ ] Token rewards program
- [ ] Community challenges

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Write meaningful commit messages
- Add comments for complex logic
- Test on both desktop & mobile
- Keep components small & reusable

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🔗 Links

- **Live App**: [basebox.vercel.app](https://basebox.vercel.app)
- **GitHub**: [github.com/rauzenn/base-box](https://github.com/rauzenn/base-box)
- **Farcaster**: [@basebox](https://warpcast.com/basebox)
- **Base Builders**: [Submit your project](https://base.org/builders)
- **Documentation**: [docs.base.org/mini-apps](https://docs.base.org/mini-apps)

---

## 💬 Support & Community

- **GitHub Issues**: [Report bugs or request features](https://github.com/rauzenn/base-box/issues)
- **Discussions**: [Join community discussions](https://github.com/rauzenn/base-box/discussions)
- **Farcaster**: [@basebox](https://warpcast.com/basebox) - Daily updates
- **Email**: support@basebox.app

---

## 🙏 Acknowledgments

Built with ❤️ for the Base & Farcaster communities.

**Special Thanks:**
- [Base](https://base.org) - For the amazing L2 blockchain
- [Farcaster](https://www.farcaster.xyz/) - For the decentralized social protocol
- [Vercel](https://vercel.com) - For hosting & KV storage
- [Coinbase](https://www.coinbase.com) - For OnchainKit
- The Based community - For inspiration & support

---

## 📊 Stats

![GitHub stars](https://img.shields.io/github/stars/rauzenn/base-box?style=social)
![GitHub forks](https://img.shields.io/github/forks/rauzenn/base-box?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/rauzenn/base-box?style=social)

---

<div align="center">

**🔒 Lock it. ⏰ Wait for it. 🔓 Reveal it.**

*Built on Base. Preserved forever.*

[Launch App](https://basebox.vercel.app) • [Read Docs](https://docs.base.org/mini-apps) • [Join Community](https://warpcast.com/~/channel/base)

</div>