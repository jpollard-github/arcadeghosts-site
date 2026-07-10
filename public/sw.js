/* Minimal installability worker. Ambient content remains network-first and uncached. */
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

/* Keep a fetch handler for PWA installability without taking over request behavior. */
self.addEventListener("fetch", () => {});
