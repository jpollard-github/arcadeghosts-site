"use client";

import Image from "next/image";
import { useState } from "react";
import { signalBoothOptions } from "./signal-booth-data";

function randomIndex(except: number) {
  if (signalBoothOptions.length < 2) {
    return 0;
  }

  let nextIndex = Math.floor(Math.random() * signalBoothOptions.length);

  while (nextIndex === except) {
    nextIndex = Math.floor(Math.random() * signalBoothOptions.length);
  }

  return nextIndex;
}

export function SignalBooth() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSignal = signalBoothOptions[activeIndex];
  const signalNumber = String(activeIndex + 1).padStart(3, "0");

  return (
    <div className="signal-booth-machine">
      <div className="signal-booth-display">
        <Image
          src={activeSignal.image}
          alt=""
          fill
          sizes="(max-width: 860px) 100vw, 520px"
          className="signal-booth-image"
        />
        <div className="signal-booth-overlay" />
      </div>

      <div className="signal-booth-panel">
        <div className="signal-booth-meta">
          <span>Signal {signalNumber}</span>
          <span>{signalBoothOptions.length} options online</span>
        </div>
        <h3>{activeSignal.title}</h3>
        <p>{activeSignal.prompt}</p>
        <div className="signal-booth-action">{activeSignal.action}</div>
        <div className="signal-booth-tags" aria-label="Signal tags">
          {activeSignal.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <button
          className="signal-booth-button"
          type="button"
          onClick={() => setActiveIndex((current) => randomIndex(current))}
        >
          Tune Another Signal
        </button>
      </div>
    </div>
  );
}
