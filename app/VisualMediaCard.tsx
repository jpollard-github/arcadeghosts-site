import Image from "next/image";
import type { VisualMediaItem } from "./site-content/visual-media";

type VisualMediaCardProps = {
  item: VisualMediaItem;
  sizes: string;
  priority?: boolean;
  showComment?: boolean;
};

export function VisualMediaCard({
  item,
  sizes,
  priority = false,
  showComment = false,
}: VisualMediaCardProps) {
  return (
    <article className="media-card">
      <a
        className="media-image-link"
        href={item.detailsUrl}
        target="_blank"
        rel="noreferrer"
        aria-label={`View details for ${item.title}`}
      >
        <Image
          src={item.image}
          alt={`${item.title} poster or key art`}
          fill
          priority={priority}
          sizes={sizes}
          className={`media-image${item.imageFit === "contain" ? " contain" : ""}`}
        />
      </a>
      <div className="media-card-copy">
        <h3>
          <a href={item.detailsUrl} target="_blank" rel="noreferrer">
            {item.title}
          </a>
        </h3>
        {showComment && item.comment?.trim() ? (
          <p className="media-card-comment">{item.comment}</p>
        ) : null}
        <a
          href={item.sourceUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`Image source for ${item.title}`}
        >
          Image source
        </a>
      </div>
    </article>
  );
}
