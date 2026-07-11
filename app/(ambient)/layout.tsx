import { AmbientBodyClass } from "./AmbientBodyClass";

export default function AmbientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AmbientBodyClass />
      {children}
    </>
  );
}
