export type WritingEntry = {
  slug: string;
  title: string;
  description: string;
  icon: string;
};

export const writings: WritingEntry[] = [
  {
    slug: "ai-its-safety-produces-your-insanity-final",
    title: "AI: Its Safety Produces Your Insanity",
    description:
      "How AI turns caution into bureaucracy, weak premises into systems, and direct questions into exquisitely documented insanity.",
    icon: "🤖",
  },
  {
    slug: "it-aint-over-till-its-over",
    title: "Thank You Yogi",
    description:
      "A Little League comeback, an old baseball saying, and a message of hope that stayed.",
    icon: "⚾",
  },
  {
    slug: "my-first-cat",
    title: "My First Cat",
    description:
      "The story of Finnegan: a black shelter kitten, a first true cat friendship, and goodbye.",
    icon: "😹",
  },
];
