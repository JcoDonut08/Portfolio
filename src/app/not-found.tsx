import { ReturnToPortfolioLink } from "@/components/return-to-portfolio-link";
import { SystemMessagePage } from "@/components/system-message-page";

export default function NotFound() {
  return (
    <SystemMessagePage
      description="The address may have changed, or this page no longer exists. Return to the portfolio and continue exploring from there."
      signal="404"
      status="Page not found"
      title="This page drifted out of orbit."
    >
      <ReturnToPortfolioLink className="system-message-action is-primary" href="/">
        Return home
      </ReturnToPortfolioLink>
      <ReturnToPortfolioLink
        className="system-message-action is-secondary"
        href="/#projects"
      >
        View projects
      </ReturnToPortfolioLink>
    </SystemMessagePage>
  );
}
