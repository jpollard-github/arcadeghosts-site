import { notFound } from "next/navigation";

export const metadata = {
  title: "404 Preview",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFoundPreviewPage() {
  notFound();
}
