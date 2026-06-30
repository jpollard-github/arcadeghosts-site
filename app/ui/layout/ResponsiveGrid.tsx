import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

type ResponsiveGridProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4;
  minColumnWidth?: string;
};

export function ResponsiveGrid({
  children,
  className,
  columns = 2,
  minColumnWidth = "16rem",
  style,
  ...rest
}: ResponsiveGridProps) {
  return (
    <div
      className={["responsive-grid", className].filter(Boolean).join(" ")}
      style={
        {
          ...style,
          "--responsive-grid-columns": String(columns),
          "--responsive-grid-min": minColumnWidth,
        } as CSSProperties
      }
      {...rest}
    >
      {children}
    </div>
  );
}
