import { AdminErrorPreviews } from "../../AdminErrorPreviews";

export const metadata = {
  title: "Error Previews Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ErrorPreviewsAdminPage() {
  return <AdminErrorPreviews />;
}
