export function SectionHeading({
  id,
  eyebrow,
  title,
  children,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="section-heading" id={id}>
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p>{children}</p>
    </div>
  );
}
