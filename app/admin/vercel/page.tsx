import { AdminVercel } from "../../AdminVercel";

export const metadata = {
  title: "Vercel Control Room Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function VercelAdminPage() {
  return <AdminVercel />;
}
