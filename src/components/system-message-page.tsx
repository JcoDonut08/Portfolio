import type { ReactNode } from "react";

import { ReturnToPortfolioLink } from "@/components/return-to-portfolio-link";
import { ZodiacField } from "@/components/zodiac-field";

type SystemMessagePageProps = {
  announce?: "polite" | "assertive";
  children: ReactNode;
  description: string;
  signal: string;
  status: string;
  title: string;
};

export function SystemMessagePage({
  announce,
  children,
  description,
  signal,
  status,
  title,
}: SystemMessagePageProps) {
  return (
    <main className="system-message-page">
      <ZodiacField isActive variant="hero" />

      <header className="system-message-header">
        <ReturnToPortfolioLink
          ariaLabel="Return to Jericho Salvador's portfolio"
          className="system-message-mark"
          href="/"
        >
          JPS
        </ReturnToPortfolioLink>
        <p className="system-message-status">
          <span aria-hidden="true" />
          {status}
        </p>
      </header>

      <section
        aria-labelledby="system-message-title"
        aria-live={announce}
        className="system-message-layout"
        role={announce ? "alert" : undefined}
      >
        <div aria-hidden="true" className="system-message-signal">
          <span className="system-message-orbit system-message-orbit-outer" />
          <span className="system-message-orbit system-message-orbit-inner" />
          <span className="system-message-signal-line" />
          <span className="system-message-signal-node" />
          <strong>{signal}</strong>
        </div>

        <div className="system-message-copy">
          <h1 id="system-message-title">{title}</h1>
          <p>{description}</p>
          <div className="system-message-actions">{children}</div>
        </div>
      </section>

      <footer className="system-message-footer">
        <span>JPS / Portfolio</span>
        <span>Recovery channel</span>
      </footer>
    </main>
  );
}
