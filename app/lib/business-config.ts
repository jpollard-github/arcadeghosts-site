import { absoluteUrl, siteConfig } from "../seo";

const contactEmailAddress = "jason@arcadeghosts.org";

export const businessMetadata = {
  name: "Jason Pollard Consulting",
  region: "North Carolina Triad",
  primarySite: siteConfig.url,
} as const;

export const businessContact = {
  emailAddress: contactEmailAddress,
  emailHref: `mailto:${contactEmailAddress}`,
} as const;

export const businessPaths = {
  home: "/",
  workWithMe: "/work-with-me",
} as const;

export const businessLinks = {
  home: absoluteUrl(businessPaths.home),
  workWithMe: absoluteUrl(businessPaths.workWithMe),
  projectInquiry:
    "https://docs.google.com/forms/d/e/1FAIpQLSclzQiQF6LWKa2Uu0gGMpLJpULoUenKO3P1oNVVJsgrShgm6A/viewform?usp=header",
  discoverySession: "https://buy.stripe.com/4gM00c6qa9ec7JL0Kk1ck00",
  contactEmail: businessContact.emailHref,
  github: siteConfig.github,
  linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL ?? null,
} as const;

export const businessAnalyticsDefaults = {
  defaultPublicEntry: "work_with_me",
  recommendedEvents: [
    "work_with_me_view",
    "work_with_me_cta_clicked",
    "project_inquiry_started",
    "project_inquiry_submitted",
    "discovery_session_clicked",
    "discovery_session_paid",
  ],
} as const;
