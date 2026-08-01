"use client";

import Link from "next/link";
import type { MouseEvent, ReactNode } from "react";

import { requestOpeningSequenceSkip } from "@/lib/experience-navigation";

type ReturnToPortfolioLinkProps = {
  ariaLabel?: string;
  children: ReactNode;
  className?: string;
  href: string;
};

export function ReturnToPortfolioLink({
  ariaLabel,
  children,
  className,
  href,
}: ReturnToPortfolioLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      event.button !== 0 ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey
    ) {
      return;
    }

    requestOpeningSequenceSkip();
  };

  return (
    <Link
      aria-label={ariaLabel}
      className={className}
      href={href}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
}
