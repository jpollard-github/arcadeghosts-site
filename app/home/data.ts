import {
  arcadeGames,
  beverlyAndLucindaPhotos,
  thomasJonesMissyCassPhotos,
  visualMedia,
} from "../site-data";
import { businessContact, businessLinks } from "../lib/business-config";

type HomeNavItem = {
  label: string;
  mobileLabel: string;
  href: string;
  mobilePriority: "primary" | "secondary" | "supporting";
  ariaLabel?: string;
  title?: string;
};

export const navItems: readonly HomeNavItem[] = [
  { label: "Start Here", mobileLabel: "Start", href: "#start-here", mobilePriority: "primary" },
  { label: "Projects", mobileLabel: "Build", href: "#projects", mobilePriority: "primary" },
  { label: "Writing", mobileLabel: "Essays", href: "#writing", mobilePriority: "primary" },
  { label: "Fun & Games", mobileLabel: "Fun", href: "#fun-and-games", mobilePriority: "primary" },
  {
    label: "Screening",
    mobileLabel: "Screen",
    href: "/movies-tv",
    mobilePriority: "primary",
    ariaLabel: "Open the favorite movies and TV page",
    title: "Favorite movies and TV",
  },
  { label: "Music", mobileLabel: "Music", href: "/music", mobilePriority: "primary" },
  { label: "Cats", mobileLabel: "Cats", href: "#cats", mobilePriority: "primary" },
  { label: "About", mobileLabel: "About", href: "#about", mobilePriority: "primary" },
  {
    label: "Contact",
    mobileLabel: "Contact",
    href: businessContact.emailHref,
    mobilePriority: "primary",
    ariaLabel: "Email Jason",
    title: "Email Jason",
  },
] as const;

export const githubRepoUrl = businessLinks.github;

export const surpriseMeLinks = [
  { href: "/writings/it-aint-over-till-its-over" },
  { href: "/writings/my-first-cat" },
  { href: "/games/between-two-lodges" },
  { href: "/twin-peaks-self" },
  { href: "/music" },
  { href: "/movies-tv" },
  { href: "/arcade" },
  { href: "/cats/beverly-and-lucinda" },
  { href: "/cats/thomas-jones-missy-cass" },
  { href: "/terminal" },
];

export const startHereCards = [
  {
    variant: "voice",
    glyph: "::",
    eyebrow: "Personal",
    title: "I want to know Jason",
    text: "Start with the human context: who I am, how I think, and why software, music, cats, stories, and curious little experiments all belong on the same site.",
    audience: "You want the person before the projects.",
    href: "/about",
    cta: "Meet Jason First",
  },
  {
    variant: "workbench",
    glyph: "[_]",
    eyebrow: "Projects",
    title: "I’m here for projects",
    text: "Go straight to the workbench if you want the active, shipped, paused, and becoming view first, then wander outward into the rest of the site from there.",
    audience: "You want current work and practical signal first.",
    href: "/#projects",
    cta: "Open The Workbench",
  },
  {
    variant: "static",
    glyph: "~*",
    eyebrow: "Creative",
    title: "I want writing, music, cats, or weird rooms",
    text: "Take the warmer route through essays, songs, cat rooms, Twin Peaks atmosphere, arcade glow, and the parts of the site that make ArcadeGhosts feel haunted in a friendly way.",
    audience: "You want the site's odd little heartbeat.",
    href: "#writing",
    cta: "Follow The Curious Signal",
  },
  {
    variant: "workbench",
    glyph: ">>",
    eyebrow: "Contact",
    title: "I want a direct line to Jason",
    text: "If the site already feels like your kind of signal, skip the hallway and send a note directly instead of wandering through a business pitch room.",
    audience: "You want the simplest way to reach out.",
    href: businessContact.emailHref,
    cta: "Email Jason",
  },
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
    title: "Movies & TV",
    text: `${visualMedia.length} screen signals: Twin Peaks, Severance, horror, curious comedies, and other resonant static.`,
    href: "/movies-tv",
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
