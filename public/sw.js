/*
 * Temporary retirement worker (2026-07-18).
 * It removes app-owned caches and unregisters the former root-scoped worker.
 * Delete this file after old installed clients have had a release cycle to update.
 */
const ownedCachePrefixes = ["arcadeghosts-", "ambient-"];

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((cacheName) =>
              ownedCachePrefixes.some((prefix) => cacheName.startsWith(prefix)),
            )
            .map((cacheName) => caches.delete(cacheName)),
        ),
      )
      .then(() => self.registration.unregister()),
  );
});
