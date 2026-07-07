import { AdminContentInbox } from "../../AdminContentInbox";

export const metadata = {
  title: "Content Inbox Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ContentInboxAdminPage() {
  return <AdminContentInbox />;
}
