"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function GlobalBackHomeLink() {
  const pathname = usePathname();

  if (!pathname || pathname === "/" || pathname.startsWith("/ambient")) {
    return null;
  }

  if (!pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <Link className="page-home-link" href="/">
      Back Home
    </Link>
  );
}
