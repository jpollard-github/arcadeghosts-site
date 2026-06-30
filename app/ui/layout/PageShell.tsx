import type { HTMLAttributes, ReactNode } from "react";

type PageShellProps = HTMLAttributes<HTMLElement> & {
  as?: "main" | "div";
  children: ReactNode;
  padded?: boolean;
};

export function PageShell({
  as = "main",
  children,
  className,
  padded = true,
  ...rest
}: PageShellProps) {
  const Component = as;

  return (
    <Component
      className={["page-shell", padded ? "page-shell-padded" : "", className].filter(Boolean).join(" ")}
      {...rest}
    >
      {children}
    </Component>
  );
}
