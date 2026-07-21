import Image from "next/image";
import type { ListeningAlbum } from "./site-content/listening";

type AlbumCardProps = {
  album: ListeningAlbum;
  sizes: string;
  priority?: boolean;
};

export function AlbumCard({ album, sizes, priority = false }: AlbumCardProps) {
  const albumLabel = `${album.title} by ${album.artist}`;

  return (
    <article className="album-card">
      <a
        className="album-image-link"
        href={album.detailsUrl}
        target="_blank"
        rel="noreferrer"
        aria-label={`View details for ${albumLabel}`}
      >
        <Image
          src={album.image}
          alt={`${albumLabel} album cover`}
          fill
          priority={priority}
          sizes={sizes}
          className="album-image"
        />
      </a>
      <div className="album-card-copy">
        <div>
          <h3>
            <a href={album.detailsUrl} target="_blank" rel="noreferrer">
              {album.title}
            </a>
          </h3>
          <p className="album-artist">{album.artist}</p>
        </div>
        <a
          href={album.sourceUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`Image source for ${albumLabel}`}
        >
          Image source
        </a>
      </div>
    </article>
  );
}
