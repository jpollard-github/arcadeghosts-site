import type { HTMLAttributes, ReactNode } from "react";

type CTAGroupProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  stackOnMobile?: boolean;
};

export function CTAGroup({
  children,
  className,
  stackOnMobile = true,
  ...rest
}: CTAGroupProps) {
  return (
    <div
      className={["cta-group", stackOnMobile ? "cta-group-stack-mobile" : "", className].filter(Boolean).join(" ")}
      {...rest}
    >
      {children}
    </div>
  );
}
