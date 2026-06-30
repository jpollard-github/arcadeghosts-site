import type { HTMLAttributes, ReactNode } from "react";

type HeroBlockProps = HTMLAttributes<HTMLElement> & {
  eyebrow?: ReactNode;
  title: ReactNode;
  copy?: ReactNode;
  actions?: ReactNode;
  media?: ReactNode;
};

export function HeroBlock({
  eyebrow,
  title,
  copy,
  actions,
  media,
  className,
  ...rest
}: HeroBlockProps) {
  return (
    <section className={["hero-block", className].filter(Boolean).join(" ")} {...rest}>
      <div className="hero-block-copy">
        {eyebrow ? <div className="hero-block-eyebrow">{eyebrow}</div> : null}
        <div className="hero-block-title">{title}</div>
        {copy ? <div className="hero-block-body">{copy}</div> : null}
        {actions ? <div className="hero-block-actions">{actions}</div> : null}
      </div>
      {media ? <div className="hero-block-media">{media}</div> : null}
    </section>
  );
}
