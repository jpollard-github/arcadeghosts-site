import { ControlRoomLink } from "./ControlRoomLink";
import { PublicFooter } from "./PublicFooter";
import { SiteLogo } from "./SiteLogo";

export function PublicShell({
  children,
  footer = true,
}: Readonly<{
  children: React.ReactNode;
  footer?: boolean;
}>) {
  return (
    <>
      <SiteLogo />
      <ControlRoomLink />
      {children}
      {footer ? <PublicFooter /> : null}
    </>
  );
}
