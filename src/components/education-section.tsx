import type { CSSProperties } from "react";

const educationMilestones = [
  {
    school: "Pamantasan ng Lungsod ng Pasig",
    program: "Bachelor of Science in Computer Science · Expected April 2027",
    period: "2023–Present",
    distinction: "Dean’s Lister",
  },
  {
    school: "Arellano University – Andres Bonifacio Campus",
    program: "Senior High School",
    period: "2021–2023",
    distinction: "Graduated with High Honors",
  },
] as const;

export function EducationSection() {
  return (
    <section
      aria-labelledby="education-title"
      className="education-section"
      id="education"
    >
      <header className="education-heading" data-reveal="education-heading">
        <p>Education</p>
        <h2 id="education-title">
          <span className="education-title-primary">A foundation</span>
          <span className="education-title-secondary">for the work ahead.</span>
        </h2>
      </header>

      <div className="education-timeline">
        <div aria-hidden="true" className="education-rail">
          <span />
        </div>

        <ol>
          {educationMilestones.map((milestone, index) => {
            const side = index % 2 === 0 ? "right" : "left";

            return (
              <li className={`education-milestone education-milestone--${side}`} key={milestone.school}>
                <article
                  data-reveal="education-item"
                  style={{ "--reveal-index": index } as CSSProperties}
                >
                  <time>{milestone.period}</time>
                  <h3>{milestone.school}</h3>
                  <p>{milestone.program}</p>
                  {"distinction" in milestone ? (
                    <p className="education-distinction">{milestone.distinction}</p>
                  ) : null}
                </article>

                <span aria-hidden="true" className="education-node">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
