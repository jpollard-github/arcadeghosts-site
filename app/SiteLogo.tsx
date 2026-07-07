import Image from "next/image";
import Link from "next/link";

export function SiteLogo() {
  return (
    <Link className="site-logo" href="/" aria-label="ArcadeGhosts home">
      <Image
        src="/images/logo.webp"
        alt="ArcadeGhosts"
        width={132}
        height={88}
        sizes="(max-width: 560px) 96px, 132px"
        className="site-logo-image"
      />
    </Link>
  );
}
