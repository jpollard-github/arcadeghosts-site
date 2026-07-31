import { PublicShell } from "../PublicShell";

export default function LiveWithMeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <PublicShell footer={false}>{children}</PublicShell>;
}
