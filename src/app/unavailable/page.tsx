import type { Metadata } from "next";

import { ReturnToPortfolioLink } from "@/components/return-to-portfolio-link";
import { SystemMessagePage } from "@/components/system-message-page";

export const metadata: Metadata = {
  description: "This portfolio destination is temporarily unavailable.",
  robots: {
    follow: false,
    index: false,
  },
  title: "Link temporarily unavailable | Jericho Salvador",
};

export default function UnavailablePage() {
  return (
    <SystemMessagePage
      description="That destination has not been connected yet. The rest of the portfolio is still available."
      signal="LINK"
      status="Destination offline"
      title="Sorry, this link is temporarily unavailable."
    >
      <ReturnToPortfolioLink className="system-message-action is-primary" href="/">
        Back to portfolio
      </ReturnToPortfolioLink>
      <ReturnToPortfolioLink
        className="system-message-action is-secondary"
        href="/#contact"
      >
        Contact me instead
      </ReturnToPortfolioLink>
    </SystemMessagePage>
  );
}
