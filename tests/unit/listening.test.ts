import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { listeningAlbums } from "../../app/site-content/listening";

const repositoryRoot = path.resolve(import.meta.dirname, "../..");

const expectedAlbums = [
  ["Def Leppard", "Hysteria"],
  ["Nine Inch Nails", "Pretty Hate Machine"],
  ["Journey", "Escape"],
  ["Chappell Roan", "The Rise and Fall of a Midwest Princess"],
  ["CHVRCHES", "The Bones of What You Believe"],
  ["Angelo Badalamenti", "Soundtrack from Twin Peaks"],
  ["Talking Heads", "Remain in Light"],
  ["Kitarō", "Oasis"],
  ["Queensrÿche", "Operation: Mindcrime"],
  ["Code Orange", "Underneath"],
  ["Various Artists", "The Secret of My Success Soundtrack"],
  ["Kanye West", "Yeezus"],
  ["Snow Patrol", "A Hundred Million Suns"],
  ["Forgotten Tomb", "Songs to Leave"],
  ["Dissection", "Storm of the Light’s Bane"],
  ["Styx", "Kilroy Was Here"],
  ["Our Lady Peace", "Spiritual Machines"],
  ["Midnight Oil", "Diesel and Dust"],
  ["Mercyful Fate", "Don’t Break the Oath"],
  ["Mercyful Fate", "Melissa"],
  ["Def Leppard", "Pyromania"],
  ["Metal Church", "Metal Church"],
  ["Metal Church", "The Dark"],
  ["Judas Priest", "Painkiller"],
  ["Toto", "Toto IV"],
  ["Pink Floyd", "The Wall"],
  ["At the Gates", "Slaughter of the Soul"],
  ["Sex Pistols", "Never Mind the Bollocks, Here’s the Sex Pistols"],
  ["Guns N’ Roses", "Appetite for Destruction"],
  ["Ice-T", "O.G. Original Gangster"],
  ["Timecop1983", "Night Drive"],
  ["Pearl Jam", "Ten"],
  ["Eyehategod", "Take as Needed for Pain"],
  ["Jimmy Eat World", "Futures"],
  ["Danny Brown", "Atrocity Exhibition"],
  ["Roxette", "Look Sharp!"],
  ["Swallow the Sun", "The Morning Never Came"],
  ["Beck", "Sea Change"],
  ["Garbage", "Version 2.0"],
  ["The Cars", "The Cars"],
  ["Tori Amos", "Little Earthquakes"],
  ["Mr. Bungle", "California"],
  ["Linkin Park", "Meteora"],
  ["Linkin Park", "Hybrid Theory"],
  ["Various Artists", "The Lost Boys: Original Motion Picture Soundtrack"],
  ["Billy Idol", "Rebel Yell"],
  ["The Sisters of Mercy", "Floodland"],
  ["Heart", "Heart"],
  ["blink-182", "Enema of the State"],
] as const;

function assertWebUrl(value: string, label: string) {
  const url = new URL(value);
  assert.ok(
    url.protocol === "http:" || url.protocol === "https:",
    `${label} must use http or https`,
  );
}

test("listening albums preserve the complete curated order", () => {
  assert.equal(listeningAlbums.length, 49);
  assert.deepEqual(
    listeningAlbums.map(({ artist, title }) => [artist, title]),
    expectedAlbums,
  );
  assert.deepEqual(
    listeningAlbums.slice(0, 6).map(({ artist, title }) => [artist, title]),
    expectedAlbums.slice(0, 6),
  );
});

test("listening albums use unique local WebP covers and valid source URLs", () => {
  const pairs = new Set<string>();
  const images = new Set<string>();
  const forbiddenFields = new Set(["genre", "genres", "classification", "rating", "review"]);

  for (const album of listeningAlbums) {
    const pair = `${album.artist}\u0000${album.title}`;
    assert.ok(!pairs.has(pair), `duplicate artist/title pair: ${album.artist} — ${album.title}`);
    assert.ok(!images.has(album.image), `duplicate image: ${album.image}`);
    pairs.add(pair);
    images.add(album.image);

    assert.ok(album.artist.trim(), "artist must not be blank");
    assert.ok(album.title.trim(), "title must not be blank");
    assert.ok(album.image.startsWith("/images/listening/"));
    assert.ok(album.image.endsWith(".webp"));
    assert.ok(
      existsSync(path.join(repositoryRoot, "public", album.image)),
      `${album.title} image does not exist beneath public/`,
    );
    assertWebUrl(album.detailsUrl, `${album.title} detailsUrl`);
    assertWebUrl(album.sourceUrl, `${album.title} sourceUrl`);
    assert.deepEqual(
      Object.keys(album).filter((field) => forbiddenFields.has(field)),
      [],
      `${album.title} must not introduce classification or review fields`,
    );
  }
});
