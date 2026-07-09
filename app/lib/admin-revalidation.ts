import { revalidatePath } from "next/cache";

export function revalidateProjectViews() {
  revalidatePath("/");
  revalidatePath("/search");
}

export function revalidateTinyThoughtViews() {
  revalidatePath("/");
  revalidatePath("/tiny-thoughts");
  revalidatePath("/search");
  revalidatePath("/tiny-thoughts/rss.xml");
}
