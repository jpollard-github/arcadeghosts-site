"use client";

import { useEffect } from "react";

export function AmbientBodyClass() {
  useEffect(() => {
    document.body.classList.add("ambient-mode");

    return () => {
      document.body.classList.remove("ambient-mode");
    };
  }, []);

  return null;
}
