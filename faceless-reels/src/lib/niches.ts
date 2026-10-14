export type Niche = {
  slug: string;
  name: string;
  emoji: string;
  description: string;
};

export const NICHES: Niche[] = [
  { slug: "motivation", name: "Motivation", emoji: "🔥", description: "Hard-hitting quotes & discipline edits." },
  { slug: "luxury", name: "Luxury Lifestyle", emoji: "💎", description: "Cars, watches, mindset of the rich." },
  { slug: "stoicism", name: "Stoic Wisdom", emoji: "🏛️", description: "Marcus Aurelius, calm power, reflection." },
  { slug: "scary-stories", name: "Scary Stories", emoji: "👻", description: "Reddit horror & creepy narrations." },
  { slug: "facts", name: "Mind-Blowing Facts", emoji: "🧠", description: "Did-you-know science & history facts." },
  { slug: "fitness", name: "Fitness", emoji: "💪", description: "Gym motivation & workout tips." },
  { slug: "money", name: "Money & Finance", emoji: "💰", description: "Wealth habits, side hustles, investing." },
  { slug: "history", name: "History", emoji: "📜", description: "Untold stories from the past." },
  { slug: "space", name: "Space & Cosmos", emoji: "🌌", description: "Planets, galaxies, the universe." },
  { slug: "relationships", name: "Relationships", emoji: "❤️", description: "Dating advice & deep connection." },
  { slug: "ai-tech", name: "AI & Tech", emoji: "🤖", description: "Future tech, tools, breakthroughs." },
  { slug: "nature", name: "Nature & Calm", emoji: "🌿", description: "Relaxing visuals & mindfulness." },
];

export const getNiche = (slug: string) => NICHES.find((n) => n.slug === slug);
