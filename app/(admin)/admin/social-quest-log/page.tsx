import { AdminSocialQuestLog } from "../../../AdminSocialQuestLog";

export const metadata = {
  title: "Social Quest Log Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SocialQuestLogAdminPage() {
  return <AdminSocialQuestLog />;
}
