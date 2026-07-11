import { AdminBackHomeLink } from "../AdminBackHomeLink";
import "./admin/admin.css";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AdminBackHomeLink />
      {children}
    </>
  );
}
