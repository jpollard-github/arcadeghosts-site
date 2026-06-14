export type SignalBoothOption = {
  title: string;
  prompt: string;
  action: string;
  image: string;
  tags: string[];
};

const signalImages = [
  "/images/signal-booth/radio-tower.png",
  "/images/signal-booth/theater-lobby.png",
  "/images/signal-booth/baseball-field.png",
  "/images/signal-booth/road-trip.png",
  "/images/signal-booth/jukebox.png",
  "/images/signal-booth/kitten-motel.png",
  "/images/signal-booth/cat-moon.png",
  "/images/signal-booth/trivia-table.png",
  "/images/signal-booth/idea-wall.png",
  "/images/signal-booth/coding-cabin.png",
];

const signalSeeds = [
  "a neon forest diner where the coffee knows which memory you need",
  "an arcade cabinet humming in a pine clearing after midnight",
  "a jukebox that plays the song you were avoiding",
  "Beverly and Lucinda debating the physics of a ping pong ball",
  "Finnegan rubbing his face against gratitude before touching the food",
  "Thomas waiting like a small familiar moon in the hallway",
  "a Little League runner on third holding one more ounce of hope",
  "a dusty backstop where a wild pitch becomes a life philosophy",
  "a road trip cassette labeled only with tomorrow's better joke",
  "a Twin Peaks-style red room translated into a kinder dream",
  "a coding desk where useful tools are allowed to have a pulse",
  "a trivia-night pencil that keeps guessing the emotional answer",
  "an old motel door glowing for a black cat in a cardboard box",
  "a rain-streaked windshield pointed toward the Blue Ridge dark",
  "a field guide to people who skip small talk without being rude",
  "a synthwave weather report for tenderness after midnight",
  "a diner counter where every project gets one strange button",
  "a quiet booth by the window for essays that needed a witness",
  "a game-room staircase leading away from art class and toward wonder",
  "a cabinet marquee that says nothing but still calls you over",
  "a Music League round where the right song changes the room",
  "a horror-movie porch light that looks scary until it waves you in",
  "a newsletter from the part of the internet that still feels handmade",
  "a notebook full of jokes with tiny fangs and good manners",
  "a humane AI terminal making room for the weirdest good idea",
  "a haunted map of North Carolina's Triad with friendly detours",
  "a cat treat negotiation conducted through meaningful eye contact",
  "a karaoke shower song performed for one highly qualified cat",
  "a childhood monkey bar moment before the comeback begins",
  "a quarter balanced on the glass of the next obsession",
  "a late-night conversation that finds your people by accident",
  "a red-shirt all-star team refusing to leave the story early",
  "a stack of longreads, arcade tokens, and half-finished plans",
  "a diner receipt with a project idea hiding between the totals",
  "a cabin laptop reflecting teal code onto a mug of coffee",
  "a strange idea that becomes useful because someone kept listening",
  "a roadside attraction for grief, jokes, cats, and stubborn hope",
  "a social profile that gave up and became a tiny museum instead",
  "a hopeful note found in a jacket pocket at exactly the right time",
  "a signal broadcast for anyone who suspects they are one of your people",
];

const signalLenses = [
  {
    titlePrefix: "Transmit",
    promptPrefix: "Send a dispatch about",
    actionPrefix: "Write three lines from the point of view of",
    tags: ["dispatch", "writing"],
  },
  {
    titlePrefix: "Build",
    promptPrefix: "Invent a tiny interactive project inspired by",
    actionPrefix: "Name the core mechanic and the one detail that gives it a heartbeat:",
    tags: ["project", "software"],
  },
  {
    titlePrefix: "Cue",
    promptPrefix: "Pick the imaginary opening track for",
    actionPrefix: "Describe the sound, the weather, and the first lyric you wish existed:",
    tags: ["music", "mood"],
  },
  {
    titlePrefix: "Decode",
    promptPrefix: "Find the hidden message inside",
    actionPrefix: "Explain what it is trying to tell future-you in one clean sentence:",
    tags: ["reflection", "meaning"],
  },
  {
    titlePrefix: "Invite",
    promptPrefix: "Use this as a beacon for someone who would understand",
    actionPrefix: "Draft the invitation you would leave taped to the diner door:",
    tags: ["connection", "signal"],
  },
];

function toTitle(seed: string) {
  return seed
    .replace(/^a |^an |^the /, "")
    .split(" ")
    .slice(0, 6)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export const signalBoothOptions: SignalBoothOption[] = signalSeeds.flatMap(
  (seed, seedIndex) =>
    signalLenses.map((lens, lensIndex) => ({
      title: `${lens.titlePrefix}: ${toTitle(seed)}`,
      prompt: `${lens.promptPrefix} ${seed}.`,
      action: `${lens.actionPrefix} ${seed}.`,
      image: signalImages[(seedIndex + lensIndex) % signalImages.length],
      tags: [...lens.tags, seedIndex % 2 === 0 ? "arcadeghosts" : "night-kitchen"],
    })),
);
