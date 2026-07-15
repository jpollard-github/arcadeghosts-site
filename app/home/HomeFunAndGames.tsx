import { SectionHeading } from "../SectionHeading";
import { funAndGamesCards } from "./data";

export function HomeFunAndGames() {
  return (
    <section className="content-section fun-games-section">
      <SectionHeading id="fun-and-games" eyebrow="Fun and Games" title="Games, rooms, and playable static.">
        The playful side of the site: arcade glow, Twin Peaks-shaped detours,
        and one green terminal room with its own old-screen pulse.
      </SectionHeading>
      <div className="section-link-grid fun-games-grid">
        {funAndGamesCards.map((card) => (
          <a className="section-link-card" href={card.href} key={card.title}>
            <span className="card-eyebrow">{card.eyebrow}</span>
            <h3>{card.title}</h3>
            <p>{card.text}</p>
            <span>{card.cta}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
