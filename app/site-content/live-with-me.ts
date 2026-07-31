export type LiveWithMeTextLink = {
  href: string;
  text: string;
};

export type LiveWithMeParagraph =
  | string
  | readonly (string | LiveWithMeTextLink)[];

export type LiveWithMeSectionAlignment =
  | "heading-left"
  | "heading-right"
  | "full";

export type LiveWithMeSection = {
  id: string;
  heading: string;
  paragraphs: readonly LiveWithMeParagraph[];
  alignment: LiveWithMeSectionAlignment;
  treatment?: "plain" | "practical";
};

export const liveWithMeMailto =
  "mailto:jason@arcadeghosts.org?subject=Live%20with%20me";

export const liveWithMeContent = {
  metadata: {
    title: "Live With Me | Jason Pollard",
    description:
      "An honest, slightly overengineered note from Jason Pollard about the kind of relationship and ordinary life he hopes to build.",
  },
  hero: {
    eyebrow: "For one specific person, eventually.",
    heading: "Live with me.",
    deck: "Not immediately. Let’s have dinner first.",
    signal: "Not an application / an honest signal",
    introduction: [
      "I made this page because dating profiles are excellent at turning a human being into six photographs, three recreational verbs, and a demand to love travel.",
      "This is a little more honest.",
      [
        "I’m Jason. I’m 53, single, and live in the Triad area of North Carolina with ",
        {
          href: "/cats/beverly-and-lucinda",
          text: "Beverly and Lucinda",
        },
        ", two orange cats who consider a closed door a design flaw. I build software, personal websites, and odd little systems. I like music that can be enormous or embarrassing, old arcades, strange movies, Twin Peaks, good food, long conversations, and evenings that do not need to become an event.",
      ],
    ] satisfies readonly LiveWithMeParagraph[],
    note:
      "This is not an invitation to move in. It is an invitation to imagine whether ordinary life together might be good.",
    image: {
      src: "/images/live-with-me/jason.webp",
      alt: "Jason smiling at home with an orange cat behind him.",
      width: 800,
      height: 1067,
    },
  },
  sections: [
    {
      id: "hoping-for",
      heading: "What I’m hoping for.",
      alignment: "heading-left",
      paragraphs: [
        "I’m looking for a woman who is warm, intelligent, witty, curious, affectionate, and capable of being both serious and ridiculous. Not perfect. Not optimized. Someone who asks real questions, says what she means, and wants to be known as much as she wants to be liked.",
        "I do not need us to share every interest. I do need us to be interested in each other’s worlds.",
        "I’m looking for a real relationship: mutual interest that becomes visible, affection that grows through ordinary time together, and two people who are genuinely excited to keep learning one another.",
        "I’m looking for someone who wants to make room for shared time, closeness, and an ordinary life together.",
      ],
    },
    {
      id: "ordinary-life",
      heading: "The ordinary life I mean.",
      alignment: "heading-right",
      paragraphs: [
        "Dinner out. Music in the car. Movies watched in twenty-minute installments because we keep talking. Small trips. Parallel creative work at the same table. A quiet bar that turns out to be perfect. Cats interrupting every important moment. One of us saying something appalling and the other laughing before pretending not to.",
        "I like going places. I am not trying to build a life around camping, hiking, marathons, dance classes, fitness culture, or proving every Saturday outdoors. Leisure does not always need moisture-wicking fabric.",
        "A good shared life does not have to be constantly exciting. It should feel warm, alive, affectionate, and safe enough for both people to remain recognizable.",
        "I want a relationship in which two people are visibly glad to have found one another, because ordinary life feels warmer, funnier, more interesting, and more alive together.",
      ],
    },
    {
      id: "what-i-bring",
      heading: "What I bring.",
      alignment: "full",
      paragraphs: [
        "I’m observant, loyal, funny, and intense in useful and occasionally ridiculous ways. I notice details. I remember things. I care deeply. I make things for people.",
        "I can talk seriously without requiring the entire evening to become a tribunal. I have a dry sense of humor, a large interior world, and a strong preference for honesty over performance.",
        "I value closeness, but I also understand parallel time and the pleasure of two people being absorbed in different things in the same room.",
        "I am better at affection than at pretending not to want it.",
      ],
    },
    {
      id: "things-that-matter",
      heading: "A few things that matter.",
      alignment: "heading-right",
      treatment: "practical",
      paragraphs: [
        "I live in the Triad area of North Carolina. I’m looking for someone local or realistically nearby, and I’m not looking for a long-distance relationship.",
        "I’m not religious, and I’m not looking for a relationship organized around religion.",
        "We do not need to agree on everything, but a Trump or MAGA worldview is a fundamental incompatibility.",
        "Ambition is attractive. So is knowing how to stop working and participate in a life.",
        "My cats are family, furniture inspectors, and occasionally management.",
        "You do not need to arrive with the same soundtrack, reading list, movie canon, or collection of overly specific personal websites.",
        "Kindness matters. Curiosity matters. Mutual effort matters. Chemistry also matters, despite its complete refusal to provide documentation.",
      ],
    },
    {
      id: "why-a-page",
      heading: "Why make a page for this?",
      alignment: "heading-left",
      paragraphs: [
        "Because the existing interface is inadequate.",
        "Because dating profiles are good at listing preferences and bad at describing the texture of a person.",
        "Because nothing else has worked particularly well, and making an honest page is more interesting than pretending I love hiking.",
        "This is not an application, a compatibility test, or a guarantee. It is an honest signal from one person who would still like to find another.",
      ],
    },
  ] satisfies readonly LiveWithMeSection[],
  music: {
    label: "Music for driving after dark",
    linkText: "Shadow Radio",
    href: "https://open.spotify.com/playlist/37i9dQZF1E8HCrv0dQ8eW5?si=bc6c1985d0c542f2",
  },
  closing: {
    heading: "Say hello.",
    paragraphs: [
      "If this made you curious, I’d be glad to hear from you.",
      "Tell me what on this site made you stay, what you are trying to build in your own life, or what song you would put on while driving somewhere after dark.",
    ],
    contactText: "Send me a note",
  },
} as const;
