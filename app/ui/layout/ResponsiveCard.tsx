import type { HTMLAttributes, ReactNode } from "react";

type ResponsiveCardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  variant?: "default" | "accent" | "quiet";
};

export function ResponsiveCard({
  children,
  className,
  variant = "default",
  ...rest
}: ResponsiveCardProps) {
  return (
    <div
      className={["responsive-card", `responsive-card-${variant}`, className].filter(Boolean).join(" ")}
      {...rest}
    >
      {children}
    </div>
  );
}
