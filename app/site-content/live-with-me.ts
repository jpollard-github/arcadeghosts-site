export type LiveWithMeTextLink = {
  href: string;
  text: string;
};

export type LiveWithMeParagraph =
  | string
  | readonly (string | LiveWithMeTextLink)[];

export type LiveWithMeSection = {
  id: string;
  heading: string;
  paragraphs: readonly LiveWithMeParagraph[];
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
    signal: "Not an application / An honest signal",
    introduction: [
      "I made this page because dating profiles are excellent at turning a human being into six photographs, three recreational verbs, and a demand to love travel.",
      "This is a little more honest.",
      [
        "I’m Jason. I’m 53, single, and live in North Carolina with ",
        {
          href: "/cats/beverly-and-lucinda",
          text: "Beverly and Lucinda",
        },
        ", two orange cats who consider a closed door a design flaw. I build software, personal websites, and odd little systems. I like music that can be enormous or embarrassing, old arcades, strange movies, Twin Peaks, good food, long conversations, and evenings that do not need to become an event.",
      ],
    ] satisfies readonly LiveWithMeParagraph[],
    note:
      "This is not an invitation to move in. It is an invitation to imagine whether ordinary life together might be good.",
  },
  sections: [
    {
      id: "hoping-for",
      heading: "What I’m hoping for.",
      paragraphs: [
        "I’m looking for a woman who is warm, curious, affectionate, direct, funny, and emotionally available. Not perfect. Not optimized. Someone who asks real questions, initiates sometimes, says what she means, and wants to be known as much as she wants to be liked.",
        "I do not need us to share every interest. I do need us to be interested in each other’s worlds.",
        "I’m looking for a real relationship, not a prolonged audition, a pen-pal arrangement, or a puzzle in which basic interest must be inferred from response times.",
      ],
    },
    {
      id: "what-i-bring",
      heading: "What I bring.",
      paragraphs: [
        "I’m observant, loyal, funny, and intense in useful and occasionally ridiculous ways. I notice details. I remember things. I care deeply. I make things for people.",
        "I can talk seriously without requiring the entire evening to become a tribunal. I have a dry sense of humor, a large interior world, and a strong preference for honesty over performance.",
        "I am better at affection than at pretending not to want it.",
      ],
    },
    {
      id: "ordinary-life",
      heading: "The ordinary life I mean.",
      paragraphs: [
        "Dinner out. Music in the car. Movies watched in twenty-minute installments because we keep talking. Small trips. Parallel creative work at the same table. A quiet bar that turns out to be perfect. Cats interrupting every important moment. One of us saying something appalling and the other laughing before pretending not to.",
        "I like going places. I am not trying to build a life around hiking, marathons, dance classes, or proving every Saturday outdoors. Leisure does not always need moisture-wicking fabric.",
        "A good shared life does not have to be constantly exciting. It should feel alive, chosen, affectionate, and safe enough for both people to remain recognizable.",
      ],
    },
    {
      id: "what-i-know",
      heading: "What I know now.",
      paragraphs: [
        "I do poorly with prolonged ambiguity, one-sided pursuit, emotional hide-and-seek, and relationships where one person must perform all the initiation.",
        "I do not expect constant contact, instant certainty, or perfect communication. I do expect reciprocity. Interest should occasionally become visible without forensic analysis.",
        "Silence may mean many things. I no longer want to build a home inside it.",
        "I want two people who can say what is happening, repair what can be repaired, laugh when the machinery gets absurd, and choose one another without making the choice feel like a favor.",
      ],
    },
    {
      id: "practical-truths",
      heading: "A few practical truths.",
      treatment: "practical",
      paragraphs: [
        "I’m not religious, and I’m not looking for a relationship organized around religion.",
        "My cats are family, furniture inspectors, and occasionally management.",
        "I work remotely and spend a lot of time making things. I value closeness, but I also understand parallel time and the pleasure of two people being absorbed in different things in the same room.",
        [
          "I enjoy what is already on ",
          { href: "/", text: "ArcadeGhosts" },
          " and a great deal more. You do not need to arrive with the same soundtrack, reading list, or movie canon.",
        ],
        "Kindness matters. Curiosity matters. Mutual effort matters. Chemistry also matters, despite its complete refusal to provide documentation.",
      ],
    },
    {
      id: "why-a-page",
      heading: "Why make a page for this?",
      paragraphs: [
        "Because the existing interface is inadequate.",
        "Because dating profiles are good at listing preferences and bad at describing the texture of a person.",
        "Because nothing else has worked particularly well, and making an honest page is more interesting than pretending I love hiking.",
        "This is not an application, a compatibility test, or a guarantee. It is an honest signal from one person who would still like to find another.",
      ],
    },
  ] satisfies readonly LiveWithMeSection[],
  closing: {
    heading: "Say hello.",
    paragraphs: [
      "If this feels familiar rather than alarming, say hello.",
      "Tell me what on this site made you stay, what you are trying to build in your own life, or what song you would put on while driving somewhere after dark.",
      "Low pressure. Complete sentences appreciated.",
    ],
    primaryCta: "Send me a note",
    catCta: "Meet Beverly and Lucinda",
    homeCta: "Return to ArcadeGhosts",
  },
} as const;
