import { siteConfig } from "@/lib/site";

export function ContactSection() {
  return (
    <section
      aria-labelledby="contact-title"
      className="contact-section"
      id="contact"
    >
      <div className="contact-shell" data-reveal="contact">
        <div className="contact-copy">
          <p className="contact-kicker">
            <span aria-hidden="true" />
            Open channel
          </p>
          <h2 id="contact-title">
            Let&apos;s make the next idea
            <span>move.</span>
          </h2>
          <p className="contact-summary">
            Have a project, collaboration, or interface problem in mind? Send
            the starting point and let&apos;s shape what it could become.
          </p>
        </div>

        <div className="contact-actions">
          <p className="contact-action-label">Start a conversation</p>
          <a
            className="contact-primary-action"
            href={`mailto:${siteConfig.email}?subject=Portfolio%20project%20inquiry`}
          >
            Email me
            <span aria-hidden="true">↗</span>
          </a>
          <a
            className="contact-secondary-action"
            href={siteConfig.githubUrl}
            rel="noreferrer"
            target="_blank"
          >
            View GitHub
            <span aria-hidden="true">↗</span>
          </a>

          <dl className="contact-details">
            <div>
              <dt>Based in</dt>
              <dd>Pasig City, Philippines</dd>
            </div>
            <div>
              <dt>Focus</dt>
              <dd>Frontend · UI/UX · Creative development</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
