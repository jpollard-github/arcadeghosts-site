import { siteConfig } from "../seo";

const contactEmailAddress = "jason@arcadeghosts.org";

export const businessContact = {
  emailAddress: contactEmailAddress,
  emailHref: `mailto:${contactEmailAddress}`,
} as const;

export const businessLinks = {
  contactEmail: businessContact.emailHref,
  github: siteConfig.github,
} as const;
