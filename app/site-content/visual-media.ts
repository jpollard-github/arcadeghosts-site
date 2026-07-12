export type VisualMediaItem = {
  title: string;
  image: string;
  detailsUrl: string;
  sourceUrl: string;
  comment?: string;
  imageFit?: "cover" | "contain";
};

export const visualMedia: readonly VisualMediaItem[] = [
  {
    title: "Twin Peaks Season 1",
    image: "/images/movies-tv/twin-peaks-season-1.webp",
    detailsUrl:
      "https://en.wikipedia.org/wiki/List_of_Twin_Peaks_episodes#Season_1_(1990)",
    sourceUrl: "https://watch.plex.tv/en-GB/show/twin-peaks/season/1",
  },
  {
    title: "Twin Peaks Season 2",
    image: "/images/movies-tv/twin-peaks-season-2.webp",
    detailsUrl:
      "https://en.wikipedia.org/wiki/List_of_Twin_Peaks_episodes#Season_2_(1990%E2%80%9391)",
    sourceUrl: "https://watch.plex.tv/show/twin-peaks/season/2",
  },
  {
    title: "Twin Peaks Season 3",
    image: "/images/movies-tv/twin-peaks-season-3.webp",
    detailsUrl: "https://en.wikipedia.org/wiki/Twin_Peaks_season_3",
    sourceUrl: "https://en.wikipedia.org/wiki/Twin_Peaks_season_3",
  },
  {
    title: "Severance",
    image: "/images/movies-tv/severance.webp",
    detailsUrl: "https://en.wikipedia.org/wiki/Severance_(TV_series)",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Severance_logo.svg",
    imageFit: "contain",
  },
  {
    title: "Widow's Bay",
    image: "/images/movies-tv/widows-bay.webp",
    detailsUrl: "https://en.wikipedia.org/wiki/Widow%27s_Bay",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Widow%27s_Bay_(logo).svg",
    imageFit: "contain",
  },
  {
    title: "A Nightmare on Elm Street",
    image: "/images/movies-tv/nightmare-on-elm-street.webp",
    detailsUrl: "https://en.wikipedia.org/wiki/A_Nightmare_on_Elm_Street",
    sourceUrl: "https://en.wikipedia.org/wiki/A_Nightmare_on_Elm_Street",
  },
  {
    title: "Total Recall (1990)",
    image: "/images/movies-tv/total-recall-1990.webp",
    detailsUrl: "https://en.wikipedia.org/wiki/Total_Recall_(1990_film)",
    sourceUrl: "https://en.wikipedia.org/wiki/Total_Recall_(1990_film)",
  },
  {
    title: "Pump Up the Volume",
    image: "/images/movies-tv/pump-up-the-volume.webp",
    detailsUrl: "https://en.wikipedia.org/wiki/Pump_Up_the_Volume_(film)",
    sourceUrl: "https://en.wikipedia.org/wiki/Pump_Up_the_Volume_(film)",
  },
  {
    title: "Deuce Bigalow",
    image: "/images/movies-tv/deuce-bigalow.webp",
    detailsUrl: "https://en.wikipedia.org/wiki/Deuce_Bigalow:_Male_Gigolo",
    sourceUrl: "https://en.wikipedia.org/wiki/Deuce_Bigalow:_Male_Gigolo",
  },
  {
    title: "Eternal Sunshine of the Spotless Mind",
    image: "/images/movies-tv/eternal-sunshine.webp",
    detailsUrl:
      "https://en.wikipedia.org/wiki/Eternal_Sunshine_of_the_Spotless_Mind",
    sourceUrl: "https://en.wikipedia.org/wiki/Eternal_Sunshine_of_the_Spotless_Mind",
  },
  {
    title: "Donnie Darko",
    image: "/images/movies-tv/donnie-darko.webp",
    detailsUrl: "https://en.wikipedia.org/wiki/Donnie_Darko",
    sourceUrl: "https://en.wikipedia.org/wiki/Donnie_Darko",
  },
  {
    title: "Groundhog Day",
    image: "/images/movies-tv/groundhog-day.webp",
    detailsUrl: "https://en.wikipedia.org/wiki/Groundhog_Day_(film)",
    sourceUrl: "https://en.wikipedia.org/wiki/Groundhog_Day_(film)",
  },
  {
    title: "The Game",
    image: "/images/movies-tv/the-game.webp",
    detailsUrl: "https://en.wikipedia.org/wiki/The_Game_(1997_film)",
    sourceUrl: "https://en.wikipedia.org/wiki/The_Game_(1997_film)",
  },
  {
    title: "MXC: Most Extreme Elimination Challenge",
    image: "/images/movies-tv/mxc.webp",
    detailsUrl:
      "https://en.wikipedia.org/wiki/Most_Extreme_Elimination_Challenge",
    sourceUrl: "https://en.wikipedia.org/wiki/Most_Extreme_Elimination_Challenge",
    imageFit: "contain",
  },
  {
    title: "Just Like Heaven",
    image: "/images/movies-tv/just-like-heaven.webp",
    detailsUrl: "https://en.wikipedia.org/wiki/Just_like_Heaven_(2005_film)",
    sourceUrl: "https://en.wikipedia.org/wiki/Just_like_Heaven_(2005_film)",
  },
  {
    title: "Return to Me",
    image: "/images/movies-tv/return-to-me.webp",
    detailsUrl: "https://en.wikipedia.org/wiki/Return_to_Me",
    sourceUrl: "https://en.wikipedia.org/wiki/Return_to_Me",
  },
  {
    title: "Limitless",
    image: "/images/movies-tv/limitless.webp",
    detailsUrl: "https://en.wikipedia.org/wiki/Limitless_(film)",
    sourceUrl: "https://en.wikipedia.org/wiki/Limitless_(film)",
  },
  {
    title: "The Secret of My Success (1987)",
    image: "/images/movies-tv/the-secret-of-my-success-1987.webp",
    detailsUrl:
      "https://en.wikipedia.org/wiki/The_Secret_of_My_Success_(1987_film)",
    sourceUrl:
      "https://www.impawards.com/1987/secret_of_my_success_xlg.html",
  },
] as const;
