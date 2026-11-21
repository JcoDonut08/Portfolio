import { siteConfig } from "@/lib/site";
import { ContactInquiryForm } from "@/components/contact-inquiry-form";

function ContactConstellation() {
  return (
    <svg
      aria-hidden="true"
      className="contact-constellation"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 1320 640"
    >
      <g className="contact-starfield">
        <circle cx="35" cy="48" r="1.2" />
        <circle cx="99" cy="211" r="1.5" />
        <circle cx="176" cy="318" r="1" />
        <circle cx="246" cy="38" r="1.4" />
        <circle cx="344" cy="260" r="1.1" />
        <circle cx="421" cy="52" r="1.8" />
        <circle cx="479" cy="344" r="1.3" />
        <circle cx="547" cy="139" r="1" />
        <circle cx="602" cy="565" r="1.5" />
        <circle cx="676" cy="63" r="1.2" />
        <circle cx="719" cy="295" r="1.7" />
        <circle cx="763" cy="476" r="1" />
        <circle cx="816" cy="162" r="1.3" />
        <circle cx="862" cy="358" r="1.1" />
        <circle cx="911" cy="38" r="1.5" />
        <circle cx="948" cy="237" r="1" />
        <circle cx="1003" cy="535" r="1.4" />
        <circle cx="1048" cy="102" r="1.2" />
        <circle cx="1094" cy="308" r="1.6" />
        <circle cx="1138" cy="451" r="1" />
        <circle cx="1180" cy="46" r="1.1" />
        <circle cx="1217" cy="191" r="1.5" />
        <circle cx="1263" cy="372" r="1.2" />
        <circle cx="1301" cy="574" r="1.4" />
        <circle className="is-glow" cx="512" cy="484" r="2.2" />
        <circle className="is-glow" cx="742" cy="118" r="2" />
        <circle className="is-glow" cx="971" cy="414" r="2.1" />
        <circle className="is-glow" cx="1242" cy="529" r="1.9" />
      </g>
      <path
        className="contact-constellation-orbit"
        d="M-54 532C113 338 356 301 659 448"
      />
      <g className="contact-constellation-lines">
        <path d="M61 126 132 78 211 116 283 67 353 112" />
        <path d="M132 78 163 24" />
        <path d="M211 116 226 180 302 205" />
        <path d="M73 525 151 468 230 506 316 436 397 479" />
        <path d="M230 506 250 572" />
      </g>
      <g className="contact-constellation-stars">
        <circle cx="61" cy="126" r="3" />
        <circle className="is-bright" cx="132" cy="78" r="4.5" />
        <circle cx="163" cy="24" r="2.5" />
        <circle cx="211" cy="116" r="3.5" />
        <circle className="is-cyan" cx="226" cy="180" r="5" />
        <circle cx="283" cy="67" r="2.5" />
        <circle className="is-pink" cx="353" cy="112" r="4" />
        <circle cx="302" cy="205" r="2.5" />
        <circle cx="73" cy="525" r="2.5" />
        <circle className="is-cyan" cx="151" cy="468" r="4.5" />
        <circle cx="230" cy="506" r="3" />
        <circle cx="250" cy="572" r="2.5" />
        <circle className="is-bright" cx="316" cy="436" r="4.5" />
        <circle className="is-pink" cx="397" cy="479" r="3.5" />
        <circle cx="447" cy="176" r="2" />
        <circle cx="499" cy="92" r="2.5" />
        <circle cx="554" cy="254" r="1.75" />
        <circle cx="608" cy="388" r="2" />
        <circle cx="664" cy="166" r="1.75" />
      </g>
    </svg>
  );
}

export function ContactSection() {
  return (
    <section
      aria-labelledby="contact-title"
      className="contact-section"
      id="contact"
    >
      <div className="contact-shell" data-reveal="contact">
        <ContactConstellation />
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
            Hiring an intern or building something useful? I&apos;m open to frontend and full-stack opportunities, team projects, and conversations about the work.
          </p>
        </div>

        <div className="contact-actions">
          <p className="contact-action-label">Start a conversation</p>
          <ContactInquiryForm recipientEmail={siteConfig.email} />
          <div className="contact-secondary-actions">
            <a
              className="contact-secondary-action"
              href={`mailto:${siteConfig.email}`}
            >
              {siteConfig.email}
            </a>
            <a
              className="contact-secondary-action"
              href={siteConfig.githubUrl}
              rel="noreferrer"
              target="_blank"
            >
              View GitHub
            </a>
            <a className="contact-secondary-action" href={siteConfig.linkedinUrl} rel="noreferrer" target="_blank">Connect on LinkedIn</a>
          </div>

          <dl className="contact-details">
            <div>
              <dt>Based in</dt>
              <dd>Pasig City, Philippines</dd>
            </div>
            <div>
              <dt>Focus</dt>
              <dd>Frontend &amp; full-stack web development</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
