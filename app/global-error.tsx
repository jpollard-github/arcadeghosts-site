"use client";

import { ErrorState } from "./ErrorState";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <ErrorState
          code="500"
          title="There was a fish in the percolator."
          message="The whole room flickered at once."
          detail="Even the house forgot its lines for a second. Try stepping back into the scene."
          showRetry
          onRetry={reset}
        />
      </body>
    </html>
  );
}
