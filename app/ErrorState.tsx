import Link from "next/link";

type ErrorStateProps = {
  code: string;
  title: string;
  message: string;
  detail: string;
  showRetry?: boolean;
  onRetry?: () => void;
};

export function ErrorState({
  code,
  title,
  message,
  detail,
  showRetry = false,
  onRetry,
}: ErrorStateProps) {
  return (
    <main className="error-page">
      <section className="error-shell">
        <p className="eyebrow">Somewhere In The Pines</p>
        <div className="error-panel">
          <p className="error-code">{code}</p>
          <h1>{title}</h1>
          <p className="error-line">{message}</p>
          <p className="error-detail">{detail}</p>

          <div className="error-actions">
            <Link href="/">Return To The Lodge</Link>
            <Link href="/music">Tune The Signal</Link>
            {showRetry && onRetry ? (
              <button type="button" onClick={onRetry}>
                Try Again
              </button>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}
