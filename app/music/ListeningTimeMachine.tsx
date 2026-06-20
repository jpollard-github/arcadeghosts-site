"use client";

import { useState } from "react";

type ListeningMoment = {
  id: string;
  label: string;
  title: string;
  period: string;
  badge: string;
  topArtist: string;
  topAlbum: string;
  topSong: string;
  dominantGenre: string;
  totalHours: string;
  playCount: string;
  moodWeather: string;
  weirdFixation?: string;
  jumpHref: string;
};

export function ListeningTimeMachine({
  moments,
}: {
  moments: readonly ListeningMoment[];
}) {
  const [activeId, setActiveId] = useState(moments[0]?.id ?? "");

  function takeMeSomewhereWeird() {
    if (!moments.length || typeof window === "undefined") {
      return;
    }

    const weirdStops = [
      ...moments.map((moment) => ({ type: "moment" as const, value: moment.id })),
      { type: "anchor" as const, value: "#music-era-title" },
      { type: "anchor" as const, value: "#music-fixation-title" },
      { type: "anchor" as const, value: "#music-timeline-title" },
    ];

    const choice = weirdStops[Math.floor(Math.random() * weirdStops.length)];

    if (choice.type === "moment") {
      setActiveId(choice.value);
      document.getElementById(choice.value)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      return;
    }

    window.location.hash = choice.value;
  }

  return (
    <div className="time-machine">
      <div className="time-machine-toolbar">
        <p>
          Pick a month or mini-era and let the archive open like a cabinet
          door.
        </p>
        <button type="button" className="time-machine-random" onClick={takeMeSomewhereWeird}>
          Take Me Somewhere Weird
        </button>
      </div>

      <div className="time-machine-card-row">
        {moments.map((moment) => {
          const active = moment.id === activeId;

          return (
            <article
              className={`time-machine-card${active ? " active" : ""}`}
              key={moment.id}
              id={moment.id}
            >
              <button type="button" onClick={() => setActiveId(moment.id)}>
                <span>{moment.label}</span>
                <strong>{moment.title}</strong>
                <small>{moment.badge}</small>
              </button>

              {active ? (
                <div className="time-machine-detail">
                  <div className="time-machine-meta">
                    <span>{moment.period}</span>
                    <a href={moment.jumpHref}>Jump deeper</a>
                  </div>
                  <dl className="time-machine-stats">
                    <div>
                      <dt>Top artist</dt>
                      <dd>{moment.topArtist}</dd>
                    </div>
                    <div>
                      <dt>Top album</dt>
                      <dd>{moment.topAlbum}</dd>
                    </div>
                    <div>
                      <dt>Top song</dt>
                      <dd>{moment.topSong}</dd>
                    </div>
                    <div>
                      <dt>Dominant genre</dt>
                      <dd>{moment.dominantGenre}</dd>
                    </div>
                    <div>
                      <dt>Total hours</dt>
                      <dd>{moment.totalHours}</dd>
                    </div>
                    <div>
                      <dt>Play count</dt>
                      <dd>{moment.playCount}</dd>
                    </div>
                  </dl>
                  <p className="time-machine-weather">{moment.moodWeather}</p>
                  {moment.weirdFixation ? (
                    <p className="time-machine-fixation">
                      <strong>Weird fixation:</strong> {moment.weirdFixation}
                    </p>
                  ) : null}
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}
