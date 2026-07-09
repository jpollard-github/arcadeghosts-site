import {
  arcadeGames,
  beverlyAndLucindaPhotos,
  thomasJonesMissyCassPhotos,
  visualMedia,
} from "../site-data";
import { businessLinks } from "../lib/business-config";

type HomeNavItem = {
  label: string;
  mobileLabel: string;
  href: string;
  mobilePriority: "primary" | "secondary" | "supporting";
  ariaLabel?: string;
  title?: string;
};

export const navItems: readonly HomeNavItem[] = [
  { label: "Projects", mobileLabel: "Build", href: "#projects", mobilePriority: "primary" },
  { label: "Writing", mobileLabel: "Essays", href: "#writing", mobilePriority: "primary" },
  { label: "Tiny Thoughts", mobileLabel: "Tiny", href: "#tiny-thoughts", mobilePriority: "primary" },
  { label: "Fun & Games", mobileLabel: "Fun", href: "#fun-and-games", mobilePriority: "primary" },
  {
    label: "Screening",
    mobileLabel: "Screen",
    href: "#screening",
    mobilePriority: "primary",
    ariaLabel: "Jump to the screening section",
    title: "Screening section",
  },
  { label: "Cats", mobileLabel: "Cats", href: "#cats", mobilePriority: "primary" },
  { label: "About", mobileLabel: "About", href: "#about", mobilePriority: "primary" },
] as const;

export const githubRepoUrl = businessLinks.github;

export const surpriseMeLinks = [
  { href: "/writings/it-aint-over-till-its-over" },
  { href: "/writings/my-first-cat" },
  { href: "/games/between-two-lodges" },
  { href: "/twin-peaks-self" },
  { href: "/music" },
  { href: "/screening" },
  { href: "/arcade" },
  { href: "/cats/beverly-and-lucinda" },
  { href: "/cats/thomas-jones-missy-cass" },
  { href: "/terminal" },
];

export const funAndGamesCards = [
  {
    eyebrow: "Arcade Games",
    title: "Arcade games",
    text: "Favorite cabinets, quarter-light nostalgia, and the old machines that still hum behind the rest of the site.",
    href: "/arcade",
    cta: "Open arcade room",
  },
  {
    eyebrow: "Twin Peaks Game",
    title: "Twin Peaks game #1",
    text: "A Twin Peaks-inspired self-guided journey for naming the room you are in and leaving with one usable next step.",
    href: "/twin-peaks-self",
    cta: "Enter the lodges",
  },
  {
    eyebrow: "Twin Peaks Game",
    title: "Twin Peaks game #2",
    text: "A browser text adventure about coffee, woods, clues, dreams, recurring witnesses, and alternate endings.",
    href: "/games/between-two-lodges/",
    cta: "Play the game",
  },
  {
    eyebrow: "Terminal",
    title: "Terminal",
    text: "The green command line has its own room now if you want the old-screen version of the site&apos;s personal signal.",
    href: "/terminal",
    cta: "Open terminal",
  },
];

export const aboutCards = [
  {
    eyebrow: "Field Guide",
    title: "Arcade Room",
    text: `${arcadeGames.length} favorite cabinets and the quarter-light nostalgia that still hums behind the projects.`,
    href: "/arcade",
    cta: "Open",
  },
  {
    eyebrow: "Taste Map",
    title: "Screening",
    text: `${visualMedia.length} screen signals: Twin Peaks, Severance, horror, curious comedies, and other resonant static.`,
    href: "/screening",
    cta: "Browse",
  },
  {
    eyebrow: "Listening Room",
    title: "Music",
    text: "Synths, late-night tenderness, Music League, and songs for fluorescent weather.",
    href: "/music",
    cta: "Listen",
  },
  {
    eyebrow: "Ambient",
    title: "First Glow",
    text: "A quieter personal/tablet feature: drifting signals, neon atmosphere, and a softer mode for the same haunted house.",
    href: "/ambient",
    cta: "Drift",
  },
];

export const catCards = [
  {
    eyebrow: `${beverlyAndLucindaPhotos.length} photos`,
    title: "Beverly and Lucinda",
    text: "Tiny chaos professionals from 2025 to current: ping pong balls, Churu, bed visits, and meaningful eye contact.",
    href: "/cats/beverly-and-lucinda",
  },
  {
    eyebrow: `${thomasJonesMissyCassPhotos.length} photos`,
    title: "Thomas, Jones, Missy, and Cass",
    text: "A larger memory room from 2016 to 2025, with Thomas and the little orbit of cats around him.",
    href: "/cats/thomas-jones-missy-cass",
  },
];

export const resonanceLinks = [
  { href: "https://welcometotwinpeaks.com", label: "Twin Peaks fans" },
  { href: "https://nightride.fm/", label: "Synthwave and retro culture" },
  { href: "https://rateyourmusic.com", label: "Music discovery" },
  { href: "https://www.arcade-museum.com", label: "Arcade history and preservation" },
  { href: "https://longreads.com", label: "Curious minds and long-form ideas" },
  { href: "https://www.are.na", label: "Weird, beautiful internet projects" },
];
