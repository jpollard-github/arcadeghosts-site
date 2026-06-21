"use client";

import { useEffect } from "react";

export function HomeHashScroller() {
  useEffect(() => {
    if (!window.location.hash) {
      return;
    }

    const targetId = window.location.hash.slice(1);

    if (!targetId) {
      return;
    }

    let cancelled = false;
    let attempts = 0;

    function scrollToTarget() {
      if (cancelled) {
        return;
      }

      const target = document.getElementById(targetId);

      if (target) {
        target.scrollIntoView({ block: "start" });
      }

      attempts += 1;

      if (attempts < 4) {
        window.setTimeout(scrollToTarget, 180);
      }
    }

    window.setTimeout(scrollToTarget, 80);

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
