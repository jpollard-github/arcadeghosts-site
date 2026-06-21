"use client";

import { ErrorState } from "./ErrorState";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorState
      code="500"
      title="There was a fish in the percolator."
      message="Something slipped sideways behind the curtain."
      detail="The coffee is still warm, but the page needs another try."
      showRetry
      onRetry={reset}
    />
  );
}
