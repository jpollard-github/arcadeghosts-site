"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./ambient.module.css";

type AmbientSignal = {
  id: string;
  kind: "now" | "thought" | "cat";
  sourceLabel: string;
  title: string;
  body: string;
  meta: string;
  href: string;
  actionLabel: string;
  aside: string;
  imageSrc?: string;
  imageAlt?: string;
};

const rotationMs = 18000;

export function AmbientDisplay({ signals }: { signals: AmbientSignal[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    document.body.classList.add("ambient-mode");

    return () => {
      document.body.classList.remove("ambient-mode");
    };
  }, []);

  useEffect(() => {
    if (signals.length <= 1) {
      return;
    }

    const interval = window.setInterval(() => {
      setIndex((current) => (current + 1) % signals.length);
    }, rotationMs);

    return () => window.clearInterval(interval);
  }, [signals.length]);

  const current = signals[index];

  function showPrevious() {
    setIndex((currentIndex) => (currentIndex - 1 + signals.length) % signals.length);
  }

  function showNext() {
    setIndex((currentIndex) => (currentIndex + 1) % signals.length);
  }

  return (
    <main className={styles.page}>
      <div className={styles.backgroundGlow} aria-hidden="true" />
      <div className={styles.backgroundGrid} aria-hidden="true" />
      <section className={styles.shell}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>ArcadeGhosts Ambient</p>
            <h1 className={styles.title}>First Glow</h1>
          </div>
          <p className={styles.headerNote}>
            A slow little room for signals already living inside the site.
          </p>
        </header>

        <article
          className={`${styles.stage} ${current.kind === "cat" ? styles.stageCat : styles.stageText}`}
          key={current.id}
        >
          <div className={styles.signalCopy}>
            <p className={styles.signalLabel}>{current.sourceLabel}</p>
            <h2 className={styles.signalTitle}>{current.title}</h2>
            <p className={styles.signalBody}>{current.body}</p>
            <div className={styles.signalFooter}>
              <p className={styles.signalMeta}>{current.meta}</p>
              <Link className={styles.signalLink} href={current.href}>
                {current.actionLabel}
              </Link>
            </div>
          </div>

          <aside className={styles.signalAside}>
            {current.imageSrc ? (
              <div className={styles.imageFrame}>
                <Image
                  src={current.imageSrc}
                  alt={current.imageAlt ?? ""}
                  fill
                  unoptimized
                  sizes="(max-width: 900px) 100vw, 42vw"
                  className={styles.image}
                  priority
                />
              </div>
            ) : (
              <div className={styles.orbField} aria-hidden="true">
                <span className={styles.orb} />
                <span className={styles.orbEcho} />
                <span className={styles.orbLine} />
              </div>
            )}
            <p className={styles.asideText}>{current.aside}</p>
          </aside>
        </article>

        <footer className={styles.controls}>
          <div className={styles.counter} aria-live="polite">
            <span>{String(index + 1).padStart(2, "0")}</span>
            <span className={styles.counterDivider}>/</span>
            <span>{String(signals.length).padStart(2, "0")}</span>
          </div>
          <p className={styles.controlsNote}>
            Rotates every {Math.round(rotationMs / 1000)} seconds. Use the arrows to test the mood.
          </p>
          <div className={styles.buttonRow}>
            <button className={styles.controlButton} type="button" onClick={showPrevious}>
              Previous
            </button>
            <button className={styles.controlButton} type="button" onClick={showNext}>
              Next
            </button>
          </div>
        </footer>
      </section>
    </main>
  );
}
