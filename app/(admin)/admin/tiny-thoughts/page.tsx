import { AdminTinyThoughts } from "../../../AdminTinyThoughts";

export const metadata = {
  title: "Tiny Thoughts Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function TinyThoughtsAdminPage() {
  return <AdminTinyThoughts />;
}
