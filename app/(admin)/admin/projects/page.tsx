import { AdminProjects } from "../../../AdminProjects";

export const metadata = {
  title: "Edit Projects Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProjectsAdminPage() {
  return <AdminProjects />;
}
