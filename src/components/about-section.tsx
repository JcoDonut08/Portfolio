import type { CSSProperties } from "react";
import { PortfolioCard } from "@/components/portfolio-card";

const aboutDetails = [
  {
    label: "Education",
    value: "BS Computer Science",
  },
  {
    label: "Year Level",
    value: "Fourth Year",
  },
  {
    label: "Location",
    value: "Pasig City, Philippines",
  },
  {
    label: "Focus",
    value: "Frontend Development & UI/UX",
  },
] as const;

export function AboutSection() {
  return (
    <section aria-labelledby="about-title" className="about-section" id="about">
      <div aria-hidden="true" className="about-orbit about-orbit-primary" />
      <div aria-hidden="true" className="about-orbit about-orbit-secondary" />

      <div className="about-shell">
        <div className="about-card-stage" data-reveal="portrait">
          <div aria-hidden="true" className="about-card-glow" />
          <PortfolioCard
            imageSrc="/assets/profile/jericho-paul-salvador-celestial.png"
            priority={false}
          />
        </div>

        <div className="about-content">
          <p className="about-eyebrow" data-reveal="signal">
            <span aria-hidden="true" />
            A little about me
          </p>

          <h2 data-reveal="title" id="about-title">
            I create
            <span>with purpose.</span>
          </h2>

          <div className="about-copy" data-reveal="copy">
            <p>
              I&apos;m Jericho Salvador, a fourth-year Computer Science student from Pasig
              City with an interest in frontend development and UI/UX design. I enjoy
              transforming ideas into digital experiences that are functional, visually
              engaging, and easy to use.
            </p>
            <p>
              I&apos;m continuously developing my skills through academic projects and
              personal experimentation. Whether I&apos;m designing an interface or building a
              working system, I approach every project as an opportunity to learn, solve
              problems, and create something meaningful.
            </p>
          </div>

          <dl className="about-details">
            {aboutDetails.map((detail, index) => (
              <div
                className="about-detail-card"
                data-reveal="detail"
                key={detail.label}
                style={{ "--reveal-index": index } as CSSProperties}
              >
                <span aria-hidden="true" className="about-detail-index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <dt>{detail.label}</dt>
                <dd>{detail.value}</dd>
              </div>
            ))}
          </dl>

          <a
            className="about-resume-link"
            download
            href="/assets/resume/Jericho-Salvador-Resume.pdf"
          >
            Download résumé
            <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}
