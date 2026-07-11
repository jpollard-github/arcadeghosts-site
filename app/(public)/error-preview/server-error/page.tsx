export const metadata = {
  title: "500 Preview",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default function ServerErrorPreviewPage() {
  throw new Error("Intentional server error preview.");
}
