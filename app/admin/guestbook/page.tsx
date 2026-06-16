import { AdminGuestbook } from "../../AdminGuestbook";

export const metadata = {
  title: "Guestbook Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function GuestbookAdminPage() {
  return <AdminGuestbook />;
}
