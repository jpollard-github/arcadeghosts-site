import type { HTMLAttributes, ReactNode } from "react";

type SectionShellProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  tight?: boolean;
};

export function SectionShell({
  children,
  className,
  tight = false,
  ...rest
}: SectionShellProps) {
  return (
    <section
      className={["section-shell", tight ? "section-shell-tight" : "", className].filter(Boolean).join(" ")}
      {...rest}
    >
      {children}
    </section>
  );
}
