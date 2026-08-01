"use client";

import { ReturnToPortfolioLink } from "@/components/return-to-portfolio-link";
import { SystemMessagePage } from "@/components/system-message-page";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <SystemMessagePage
      announce="assertive"
      description="Something interrupted this page before it could finish loading. Try the request again, or return to the portfolio."
      signal="500"
      status="Signal interrupted"
      title="Something went off course."
    >
      <button
        className="system-message-action is-primary"
        onClick={reset}
        type="button"
      >
        Try again
      </button>
      <ReturnToPortfolioLink className="system-message-action is-secondary" href="/">
        Return home
      </ReturnToPortfolioLink>
    </SystemMessagePage>
  );
}
