import { SectionHeading } from "../SectionHeading";
import { catCards } from "./data";

export function HomeCats() {
  return (
    <section className="content-section cats-section">
      <SectionHeading id="cats" eyebrow="Cats" title="Cat rooms, no endless hallway.">
        Two cat galleries: one present-tense room for Beverly and Lucinda, and
        one memory room for Thomas, Jones, Missy, and Cass.
      </SectionHeading>
      <div className="section-link-grid">
        {catCards.map((card) => (
          <a className="section-link-card" href={card.href} key={card.title}>
            <span className="card-eyebrow">{card.eyebrow}</span>
            <h3>{card.title}</h3>
            <p>{card.text}</p>
            <span>Visit</span>
          </a>
        ))}
      </div>
    </section>
  );
}
