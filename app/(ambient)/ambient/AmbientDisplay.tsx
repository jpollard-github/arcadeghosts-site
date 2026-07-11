"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";
import { getAmbientSignalDwellMs, type AmbientSignal } from "./ambient-signals";
import { getAmbientTimeModeForHour, type AmbientTimeMode } from "./ambient-time";
import styles from "./ambient.module.css";

const signalTransitionMs = 700;

type DiagnosticToggle =
  | "backgroundGrid"
  | "pseudoElements"
  | "header"
  | "backgroundLayers"
  | "gradients"
  | "shadows"
  | "borders"
  | "masks"
  | "filters"
  | "fixedDecorations"
  | "canvasOnly"
  | "documentOnly"
  | "edgeMarkers";

type DiagnosticState = Record<DiagnosticToggle, boolean>;

type DiagnosticBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type DiagnosticFacts = {
  inner: string;
  documentClient: string;
  devicePixelRatio: number;
  visualViewport: string;
  visualOffsetTop: number | null;
  visualPageTop: number | null;
  safeAreaInsetTop: number;
  displayMode: string;
  screen: string;
  orientation: string;
  htmlRect: string;
  bodyRect: string;
  rootRect: string;
  firstChildRect: string;
  headerRect: string;
  rootBox: DiagnosticBox | null;
  firstChildBox: DiagnosticBox | null;
  headerBox: DiagnosticBox | null;
};

const diagnosticOptions: Array<{ key: Exclude<DiagnosticToggle, "edgeMarkers">; label: string }> = [
  { key: "backgroundGrid", label: "1. Background grid" },
  { key: "pseudoElements", label: "2. Ambient pseudo-elements" },
  { key: "header", label: "3. Header" },
  { key: "backgroundLayers", label: "4. Page/root background layers" },
  { key: "gradients", label: "5. Gradients" },
  { key: "shadows", label: "6. Box and text shadows" },
  { key: "borders", label: "7. Borders and outlines" },
  { key: "masks", label: "8. Masks and mask-images" },
  { key: "filters", label: "9. Backdrop-filter and filters" },
  { key: "fixedDecorations", label: "10. Fixed decorative layers" },
  { key: "canvasOnly", label: "11. Solid Ambient canvas only" },
  { key: "documentOnly", label: "12. Solid document only" },
];

const initialDiagnosticState: DiagnosticState = {
  backgroundGrid: false,
  pseudoElements: false,
  header: false,
  backgroundLayers: false,
  gradients: false,
  shadows: false,
  borders: false,
  masks: false,
  filters: false,
  fixedDecorations: false,
  canvasOnly: false,
  documentOnly: false,
  edgeMarkers: false,
};

function formatRect(element: Element | null) {
  if (!element) {
    return "missing";
  }

  const rect = element.getBoundingClientRect();
  return `${rect.x.toFixed(2)},${rect.y.toFixed(2)} ${rect.width.toFixed(2)}×${rect.height.toFixed(2)}`;
}

function readBox(element: Element | null): DiagnosticBox | null {
  if (!element) {
    return null;
  }

  const rect = element.getBoundingClientRect();
  return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
}

function readDiagnosticFacts(): DiagnosticFacts {
  const safeAreaProbe = document.createElement("div");
  safeAreaProbe.style.cssText =
    "position:fixed;visibility:hidden;pointer-events:none;padding-top:env(safe-area-inset-top);";
  document.body.append(safeAreaProbe);
  const safeAreaInsetTop = Number.parseFloat(getComputedStyle(safeAreaProbe).paddingTop) || 0;
  safeAreaProbe.remove();

  const visualViewport = window.visualViewport;
  const displayModes = ["fullscreen", "standalone", "minimal-ui", "browser"]
    .map((mode) => `${mode}=${window.matchMedia(`(display-mode: ${mode})`).matches}`)
    .join("; ");
  const root = document.querySelector("[data-ambient-root]");
  const firstChild = root?.firstElementChild ?? null;
  const header = root?.querySelector("header") ?? null;

  return {
    inner: `${window.innerWidth}×${window.innerHeight}`,
    documentClient: `${document.documentElement.clientWidth}×${document.documentElement.clientHeight}`,
    devicePixelRatio: window.devicePixelRatio,
    visualViewport: visualViewport ? `${visualViewport.width}×${visualViewport.height}` : "unavailable",
    visualOffsetTop: visualViewport?.offsetTop ?? null,
    visualPageTop: visualViewport?.pageTop ?? null,
    safeAreaInsetTop,
    displayMode: displayModes,
    screen: `${window.screen.width}×${window.screen.height} (available ${window.screen.availWidth}×${window.screen.availHeight})`,
    orientation: `${window.screen.orientation?.type ?? "unknown"} @ ${window.screen.orientation?.angle ?? 0}°`,
    htmlRect: formatRect(document.documentElement),
    bodyRect: formatRect(document.body),
    rootRect: formatRect(root),
    firstChildRect: formatRect(firstChild),
    headerRect: formatRect(header),
    rootBox: readBox(root),
    firstChildBox: readBox(firstChild),
    headerBox: readBox(header),
  };
}

function AmbientDiagnosticPanel({
  state,
  setState,
}: {
  state: DiagnosticState;
  setState: Dispatch<SetStateAction<DiagnosticState>>;
}) {
  const [facts, setFacts] = useState<DiagnosticFacts | null>(null);

  useEffect(() => {
    const update = () => setFacts(readDiagnosticFacts());
    const visualViewport = window.visualViewport;

    update();
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    visualViewport?.addEventListener("resize", update);
    visualViewport?.addEventListener("scroll", update);

    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
      visualViewport?.removeEventListener("resize", update);
      visualViewport?.removeEventListener("scroll", update);
    };
  }, [state]);

  function toggle(key: DiagnosticToggle) {
    setState((current) => ({ ...current, [key]: !current[key] }));
  }

  return (
    <>
      {state.edgeMarkers && facts ? (
        <div className={styles.diagnosticEdges} aria-hidden="true">
          <span className={styles.diagnosticViewportLabel}>viewport/html/body/root: {facts.rootRect}</span>
          <span
            className={styles.diagnosticSafeArea}
            style={{ height: `${Math.max(1, facts.safeAreaInsetTop)}px` }}
          >
            safe-area-top: {facts.safeAreaInsetTop}px
          </span>
          {facts.rootBox ? (
            <span
              className={styles.diagnosticRootBox}
              style={{ left: facts.rootBox.x, top: facts.rootBox.y, width: facts.rootBox.width, height: facts.rootBox.height }}
            >
              Ambient root
            </span>
          ) : null}
          {facts.firstChildBox ? (
            <span
              className={styles.diagnosticFirstChildBox}
              style={{
                left: facts.firstChildBox.x,
                top: facts.firstChildBox.y,
                width: facts.firstChildBox.width,
                height: facts.firstChildBox.height,
              }}
            >
              first child
            </span>
          ) : null}
          {facts.headerBox ? (
            <span
              className={styles.diagnosticHeaderBox}
              style={{
                left: facts.headerBox.x,
                top: facts.headerBox.y,
                width: facts.headerBox.width,
                height: facts.headerBox.height,
              }}
            >
              header
            </span>
          ) : null}
        </div>
      ) : null}
      <aside className={styles.diagnosticPanel} aria-label="Temporary Ambient diagnostics">
        <div className={styles.diagnosticPanelHeader}>
          <strong>Temporary Ambient diagnostics</strong>
          <Link href="/ambient/diagnostic-solid">Open solid route</Link>
        </div>
        <label className={styles.diagnosticToggle}>
          <input type="checkbox" checked={state.edgeMarkers} onChange={() => toggle("edgeMarkers")} />
          Edge labels and alternating colors
        </label>
        <div className={styles.diagnosticToggleGrid}>
          {diagnosticOptions.map((option) => (
            <label className={styles.diagnosticToggle} key={option.key}>
              <input type="checkbox" checked={state[option.key]} onChange={() => toggle(option.key)} />
              {option.label}
            </label>
          ))}
        </div>
        {facts ? (
          <dl className={styles.diagnosticFacts}>
            <div><dt>inner</dt><dd>{facts.inner}</dd></div>
            <div><dt>document client</dt><dd>{facts.documentClient}</dd></div>
            <div><dt>DPR</dt><dd>{facts.devicePixelRatio}</dd></div>
            <div><dt>visual viewport</dt><dd>{facts.visualViewport}</dd></div>
            <div><dt>visual offset/page top</dt><dd>{facts.visualOffsetTop} / {facts.visualPageTop}</dd></div>
            <div><dt>safe-area top</dt><dd>{facts.safeAreaInsetTop}px</dd></div>
            <div><dt>display mode</dt><dd>{facts.displayMode}</dd></div>
            <div><dt>screen</dt><dd>{facts.screen}</dd></div>
            <div><dt>orientation</dt><dd>{facts.orientation}</dd></div>
            <div><dt>html</dt><dd>{facts.htmlRect}</dd></div>
            <div><dt>body</dt><dd>{facts.bodyRect}</dd></div>
            <div><dt>root</dt><dd>{facts.rootRect}</dd></div>
            <div><dt>first child</dt><dd>{facts.firstChildRect}</dd></div>
            <div><dt>header</dt><dd>{facts.headerRect}</dd></div>
          </dl>
        ) : null}
      </aside>
    </>
  );
}

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
  diagnosticMode = false,
}: {
  signals: AmbientSignal[];
  forcedTimeMode?: AmbientTimeMode | null;
  diagnosticMode?: boolean;
}) {
  const [displayIndex, setDisplayIndex] = useState(0);
  const [queuedIndex, setQueuedIndex] = useState<number | null>(null);
  const [diagnosticState, setDiagnosticState] = useState<DiagnosticState>(initialDiagnosticState);
  const prefersReducedMotion = usePrefersReducedMotion();
  const timeMode = useAmbientTimeMode(forcedTimeMode);

  useEffect(() => {
    if (diagnosticMode || signals.length <= 1) {
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
  }, [diagnosticMode, displayIndex, prefersReducedMotion, queuedIndex, signals]);

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

  const diagnosticClasses = diagnosticMode
    ? [
        diagnosticState.backgroundGrid ? styles.diagnosticNoGrid : "",
        diagnosticState.pseudoElements ? styles.diagnosticNoPseudoElements : "",
        diagnosticState.header ? styles.diagnosticNoHeader : "",
        diagnosticState.backgroundLayers ? styles.diagnosticNoBackgroundLayers : "",
        diagnosticState.gradients ? styles.diagnosticNoGradients : "",
        diagnosticState.shadows ? styles.diagnosticNoShadows : "",
        diagnosticState.borders ? styles.diagnosticNoBorders : "",
        diagnosticState.masks ? styles.diagnosticNoMasks : "",
        diagnosticState.filters ? styles.diagnosticNoFilters : "",
        diagnosticState.fixedDecorations ? styles.diagnosticNoFixedDecorations : "",
        diagnosticState.canvasOnly ? styles.diagnosticCanvasOnly : "",
        diagnosticState.documentOnly ? styles.diagnosticDocumentOnly : "",
      ].filter(Boolean)
    : [];

  return (
    <>
      <main
        className={[styles.page, ...diagnosticClasses].join(" ")}
        data-time-mode={timeMode}
        data-ambient-root
      >
        <div className={styles.backgroundGlow} data-ambient-first-child aria-hidden="true" />
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
      {diagnosticMode ? <AmbientDiagnosticPanel state={diagnosticState} setState={setDiagnosticState} /> : null}
    </>
  );
}
