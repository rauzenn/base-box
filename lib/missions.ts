// lib/missions.ts - Proof of Based Mission System

export type MissionDifficulty = "easy" | "medium" | "hard" | "legendary";

export interface Mission {
  id: string;
  difficulty: MissionDifficulty;
  title: string;
  description: string;
  hashtag: string;
  xp: number;
  estimatedTime: string;
  examples: string[];
  icon: string;
}

export const MISSIONS: Record<MissionDifficulty, Mission> = {
  easy: {
    id: "based-vibes",
    difficulty: "easy",
    title: "Based Vibes",
    description: "Share your daily Based energy with the community",
    hashtag: "#BasedVibes",
    xp: 10,
    estimatedTime: "30 seconds",
    examples: [
      "Feeling Based today 💙 #BasedVibes",
      "Another day building on Base 🔵 #BasedVibes",
      "Based community is the best! 🚀 #BasedVibes"
    ],
    icon: "✨"
  },
  
  medium: {
    id: "based-discovery",
    difficulty: "medium",
    title: "Based Discovery",
    description: "Share a Base dApp you used or discovered today",
    hashtag: "#BasedDiscovery",
    xp: 25,
    estimatedTime: "2-3 minutes",
    examples: [
      "Just tried @projectX on Base - clean UI and fast txs! 🔵 #BasedDiscovery",
      "Found this gem on Base: [link] - loving the UX 💎 #BasedDiscovery",
      "Base DEX experience > other chains. Here's why... 🧵 #BasedDiscovery"
    ],
    icon: "🔍"
  },
  
  hard: {
    id: "based-builder",
    difficulty: "hard",
    title: "Based Builder",
    description: "Share what you built, learned, or contributed to Base ecosystem",
    hashtag: "#BasedBuilder",
    xp: 50,
    estimatedTime: "5-10 minutes",
    examples: [
      "Deployed my first smart contract on Base today! 🎉 [link] #BasedBuilder",
      "Learning Solidity Day 5: Built a token swap function 📚 #BasedBuilder",
      "Contributed to @baseproject docs - PR merged! 🙌 #BasedBuilder"
    ],
    icon: "🛠️"
  },
  
  legendary: {
    id: "based-creator",
    difficulty: "legendary",
    title: "Based Creator",
    description: "Create original content: meme, video, tutorial, or thread",
    hashtag: "#BasedCreator",
    xp: 100,
    estimatedTime: "15+ minutes",
    examples: [
      "Made a meme about Base gas fees 😂 [image] #BasedCreator",
      "New video: How to build on Base in 10 minutes 🎥 [link] #BasedCreator",
      "Thread: Why Base is winning the L2 race 🧵👇 #BasedCreator"
    ],
    icon: "🎨"
  }
};

export function getMissionByDifficulty(difficulty: MissionDifficulty): Mission {
  return MISSIONS[difficulty];
}

export function getAllMissions(): Mission[] {
  return Object.values(MISSIONS);
}

// Bonus: Weekly Challenges (future feature)
export const WEEKLY_CHALLENGES = {
  monday: { name: "Meme Monday", bonus: 20, hashtag: "#MemeMonday" },
  tuesday: { name: "Tutorial Tuesday", bonus: 30, hashtag: "#TutorialTuesday" },
  wednesday: { name: "Workshop Wednesday", bonus: 40, hashtag: "#WorkshopWednesday" },
  thursday: { name: "Thankful Thursday", bonus: 25, hashtag: "#ThankfulThursday" },
  friday: { name: "Flex Friday", bonus: 30, hashtag: "#FlexFriday" },
  weekend: { name: "Wild Weekend", bonus: 50, hashtag: "#WildWeekend" }
};