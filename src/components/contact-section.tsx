import { siteConfig } from "@/lib/site";
import { ContactInquiryForm } from "@/components/contact-inquiry-form";

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
            <span>Let&apos;s make</span>
            <span>the next</span>
            <span className="contact-title-final">
              idea <strong>move.</strong>
            </span>
          </h2>
          <p className="contact-summary">
            Have a project, collaboration, or interface problem in mind? Send
            the starting point and let&apos;s shape what it could become.
          </p>
        </div>

        <div className="contact-actions">
          <p className="contact-action-label">Start a conversation</p>
          <ContactInquiryForm recipientEmail={siteConfig.email} />
          <a
            className="contact-secondary-action"
            href={siteConfig.githubUrl}
            rel="noreferrer"
            target="_blank"
          >
            View GitHub
            <span aria-hidden="true" className="contact-action-icon">
              ↗
            </span>
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
