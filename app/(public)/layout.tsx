import { ControlRoomLink } from "../ControlRoomLink";
import { PublicFooter } from "../PublicFooter";
import { SiteLogo } from "../SiteLogo";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SiteLogo />
      <ControlRoomLink />
      {children}
      <PublicFooter />
    </>
  );
}
