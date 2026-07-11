import { AdminContextRefresh } from "../../../AdminContextRefresh";

export const metadata = {
  title: "Context Refresh Export Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ContextRefreshAdminPage() {
  return <AdminContextRefresh />;
}
