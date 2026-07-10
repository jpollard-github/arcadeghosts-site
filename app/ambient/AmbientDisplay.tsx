"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import { getAmbientSignalDwellMs, type AmbientSignal } from "./ambient-signals";
import { getAmbientTimeModeForHour, type AmbientTimeMode } from "./ambient-time";
import styles from "./ambient.module.css";

const signalTransitionMs = 700;

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    update();
    mediaQuery.addEventListener("change", update);

    return () => {
      mediaQuery.removeEventListener("change", update);
    };
  }, []);

  return prefersReducedMotion;
}

function useAmbientTimeMode(forcedTimeMode?: AmbientTimeMode | null) {
  const [detectedTimeMode, setDetectedTimeMode] = useState<AmbientTimeMode>("afternoon");

  useEffect(() => {
    if (forcedTimeMode) {
      return;
    }

    const update = () => {
      setDetectedTimeMode(getAmbientTimeModeForHour(new Date().getHours()));
    };

    update();

    const interval = window.setInterval(update, 60_000);

    return () => window.clearInterval(interval);
  }, [forcedTimeMode]);

  return forcedTimeMode ?? detectedTimeMode;
}

function AmbientStage({
  signal,
  isThought,
  isCat,
  isLibraryCard,
  className,
  inert,
}: {
  signal: AmbientSignal;
  isThought: boolean;
  isCat: boolean;
  isLibraryCard: boolean;
  className?: string;
  inert?: boolean;
}) {
  const hasMedia = Boolean(signal.imageSrc?.trim());

  return (
    <article
      className={`${styles.stage} ${isCat ? styles.stageCat : styles.stageText} ${isThought ? styles.stageThought : ""} ${
        isLibraryCard ? styles.stageLibrary : ""
      } ${hasMedia ? "" : styles.stageTextOnly} ${className ?? ""}`}
      aria-hidden={inert ? "true" : undefined}
      data-ambient-stage
      data-signal-kind={signal.kind}
      data-composition={hasMedia ? "media" : "text-only"}
    >
      <div className={styles.signalCopy}>
        <div className={styles.signalCopyInner}>
          <p className={styles.signalLabel}>{signal.sourceLabel}</p>
          <h2 className={styles.signalTitle}>{signal.title}</h2>
          <p
            className={`${styles.signalBody} ${isThought ? styles.signalBodyThought : ""} ${
              isLibraryCard ? styles.signalBodyLibrary : ""
            }`}
          >
            {signal.body}
          </p>
          <div className={styles.signalFooter}>
            <p className={styles.signalMeta}>{signal.meta}</p>
            {!inert ? (
              <Link className={styles.signalLink} href={signal.href}>
                {signal.actionLabel}
              </Link>
            ) : (
              <span className={styles.signalLinkPlaceholder}>{signal.actionLabel}</span>
            )}
          </div>
        </div>
      </div>

      <aside className={`${styles.signalAside} ${hasMedia ? "" : styles.signalAsideTextOnly}`}>
        {hasMedia ? (
          <div className={styles.signalAsideVisual} data-ambient-media>
            <div className={styles.imageFrame}>
              <Image
                src={signal.imageSrc!}
                alt={signal.imageAlt ?? ""}
                fill
                unoptimized
                sizes="(max-width: 900px) 100vw, 42vw"
                className={styles.image}
                priority
              />
            </div>
          </div>
        ) : null}
        <div className={styles.asideCard}>
          <p className={styles.asideEyebrow}>{isCat ? "Room note" : "Signal note"}</p>
          <p className={styles.asideText}>{signal.aside}</p>
        </div>
      </aside>
    </article>
  );
}

export function AmbientDisplay({
  signals,
  forcedTimeMode,
}: {
  signals: AmbientSignal[];
  forcedTimeMode?: AmbientTimeMode | null;
}) {
  const [displayIndex, setDisplayIndex] = useState(0);
  const [queuedIndex, setQueuedIndex] = useState<number | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const timeMode = useAmbientTimeMode(forcedTimeMode);

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

    if (queuedIndex !== null) {
      return;
    }

    const currentSignal = signals[displayIndex];

    if (!currentSignal) {
      return;
    }

    const dwellMs = getAmbientSignalDwellMs(currentSignal);
    const timeout = window.setTimeout(() => {
      const nextIndex = (displayIndex + 1) % signals.length;

      if (prefersReducedMotion) {
        setDisplayIndex(nextIndex);
        return;
      }

      setQueuedIndex(nextIndex);
    }, dwellMs);

    return () => window.clearTimeout(timeout);
  }, [displayIndex, prefersReducedMotion, queuedIndex, signals]);

  useEffect(() => {
    if (queuedIndex === null) {
      return;
    }

    const commit = window.setTimeout(() => {
      setDisplayIndex(queuedIndex);
      setQueuedIndex(null);
    }, signalTransitionMs);

    return () => window.clearTimeout(commit);
  }, [queuedIndex]);

  const current = signals[displayIndex];
  const upcoming = queuedIndex === null ? null : signals[queuedIndex];

  if (!current) {
    return null;
  }

  const isThought = current.kind === "thought";
  const isCat = current.kind === "cat";
  const isLibraryCard = current.kind === "project" || current.kind === "writing";
  const currentDwellMs = getAmbientSignalDwellMs(current);

  function queueIndex(nextIndex: number) {
    if (signals.length <= 1) {
      return;
    }

    const normalized = (nextIndex + signals.length) % signals.length;

    if (normalized === displayIndex && queuedIndex === null) {
      return;
    }

    if (prefersReducedMotion) {
      setDisplayIndex(normalized);
      setQueuedIndex(null);
      return;
    }

    setQueuedIndex(normalized);
  }

  function showPrevious() {
    queueIndex((queuedIndex ?? displayIndex) - 1);
  }

  function showNext() {
    queueIndex((queuedIndex ?? displayIndex) + 1);
  }

  return (
    <main className={styles.page} data-time-mode={timeMode}>
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

        <div
          className={styles.stageStack}
          style={
            {
              "--ambient-transition-ms": `${signalTransitionMs}ms`,
            } as CSSProperties
          }
          data-ambient-stage-stack
        >
          <AmbientStage
            signal={current}
            isThought={isThought}
            isCat={isCat}
            isLibraryCard={isLibraryCard}
            className={queuedIndex !== null && !prefersReducedMotion ? styles.stageLeaving : styles.stageStatic}
          />
          {upcoming ? (
            <AmbientStage
              signal={upcoming}
              isThought={upcoming.kind === "thought"}
              isCat={upcoming.kind === "cat"}
              isLibraryCard={upcoming.kind === "project" || upcoming.kind === "writing"}
              className={styles.stageIncoming}
              inert
            />
          ) : null}
        </div>

        <footer className={styles.controls}>
          <div className={styles.counter} aria-live="polite">
            <span>{String(displayIndex + 1).padStart(2, "0")}</span>
            <span className={styles.counterDivider}>/</span>
            <span>{String(signals.length).padStart(2, "0")}</span>
          </div>
          <p className={styles.controlsNote}>
            Holds this signal for about {Math.round(currentDwellMs / 1000)} seconds before the next slow fade.{" "}
            {timeMode === "late-night" ? "Late night mode is keeping the room extra quiet." : null}
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
