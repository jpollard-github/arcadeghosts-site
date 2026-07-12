import { businessContact } from "../lib/business-config";

export type TerminalCommandDefinition = {
  command: string;
  description: string;
  responseLines: string[];
  href: string;
  linkLabel: string;
};

export const terminalProfileLines = [
  "Jason Pollard",
  "software developer",
  "currently exploring: AI tools, VS Code extensions, weird web toys",
  "status: caffeinated",
] as const;

export const terminalCommands: TerminalCommandDefinition[] = [
  {
    command: "hello",
    description: "Say hello like an old Apple //e program.",
    responseLines: ["hello"],
    href: "/",
    linkLabel: "Open homepage in a new tab",
  },
  {
    command: "about",
    description: "Read the personal field guide behind the site.",
    responseLines: [
      "Background file opened.",
      "Builder of useful tools, reflective systems, writing spaces, games, and quiet signals.",
    ],
    href: "/#about",
    linkLabel: "Open about in a new tab",
  },
  {
    command: "cats",
    description: "Open the cat galleries.",
    responseLines: [
      "Cat gallery unlocked.",
      "Tiny chaos professionals are available for immediate morale support.",
    ],
    href: "/#cats",
    linkLabel: "Open cats in a new tab",
  },
  {
    command: "arcade",
    description: "Browse cabinet favorites.",
    responseLines: [
      "Arcade row is humming.",
      "Quarter-light favorites and old cabinet memories are standing by.",
    ],
    href: "/arcade",
    linkLabel: "Open arcade in a new tab",
  },
  {
    command: "contact",
    description: "Get in touch directly.",
    responseLines: [
      "Best contact route found.",
      "Email works better than smoke, static, or messages hidden in the trees.",
    ],
    href: businessContact.emailHref,
    linkLabel: "Email Jason in a new tab",
  },
] as const;
