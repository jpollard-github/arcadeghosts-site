import { revalidateTag } from "next/cache";
import { publicCacheTags } from "./public-cache";

type RevalidatePublicTag = typeof revalidateTag;

export function revalidatePublicProjects(expireTag: RevalidatePublicTag = revalidateTag) {
  expireTag(publicCacheTags.projects, { expire: 0 });
}

export function revalidatePublicTinyThoughts(
  expireTag: RevalidatePublicTag = revalidateTag,
) {
  expireTag(publicCacheTags.tinyThoughts, { expire: 0 });
}
